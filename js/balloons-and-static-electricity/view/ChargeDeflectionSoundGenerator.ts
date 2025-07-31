// Copyright 2021-2023, University of Colorado Boulder

/**
 * ChargeDeflectionSoundGenerator produces sounds based on how much deflection (i.e. movement relative to the nominal
 * position) occurs in a set of simulated electrical charges.  This is quite specific to the wall charges in the
 * Balloons and Static Electricity sim, though the concepts may be extensible to other sims.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import phetAudioContext from '../../../../tambo/js/phetAudioContext.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import SoundGenerator, { SoundGeneratorOptions } from '../../../../tambo/js/sound-generators/SoundGenerator.js';
import chargeDeflection_mp3 from '../../../sounds/chargeDeflection_mp3.js';
import balloonsAndStaticElectricity from '../../balloonsAndStaticElectricity.js';
import BalloonModel from '../model/BalloonModel.js';
import MovablePointChargeModel from '../model/MovablePointChargeModel.js';
import WallModel from '../model/WallModel.js';

// constants
const NUMBER_OF_DISCRETE_BINS = 8;
const NUMBER_OF_SOUND_GENERATORS = 3;
const BIN_ZERO_PROPORTIONATE_SIZE = 0.6; // The size of the first bin can be made tweaked to get initial sounds earlier.
const OCTAVES_OFFSET = 0.2; // an offset that can be used to raise or lower all pitches, value empirically determined
const MAX_CHARGE_DEFLECTION = 50; // max expected charge deflection in model coordinates, experimentally determined

// constants used for musical pitch mapping
const TWELFTH_ROOT_OF_TWO = Math.pow( 2, 1 / 12 );
const PENTATONIC_SCALE_MULTIPLIERS = [
  1,
  Math.pow( TWELFTH_ROOT_OF_TWO, 2 ),
  Math.pow( TWELFTH_ROOT_OF_TWO, 4 ),
  Math.pow( TWELFTH_ROOT_OF_TWO, 7 ),
  Math.pow( TWELFTH_ROOT_OF_TWO, 9 )
];

class ChargeDeflectionSoundGenerator extends SoundGenerator {

  // list of original, non-deflected charge positions, used to determine the amount of deflection
  private readonly originalChargePositions: Vector2[];

  // A list of previous charge positions prior to most recent update.  If using these, be careful to
  // manage the update process carefully.
  private previousChargePositions: Vector2[];

  // Bin number, based on normalized deflection, where each charge was mapped at during the
  // most recent update.
  private readonly chargeDeflectionBins: number[];

  // sound generators used to produce the individual sounds
  private readonly soundGenerators: SoundClip[];

  private readonly chargeToSoundGeneratorMap: Map<MovablePointChargeModel, SoundClip>;

  // array of point charges, needed by methods
  private readonly wallCharges: MovablePointChargeModel[];

  /**
   * @param wall
   * @param balloons - the balloons modeled in the sim
   * @param options
   */
  public constructor( wall: WallModel, balloons: BalloonModel[], options?: SoundGeneratorOptions ) {

    assert && assert( balloons.length === 2, `this assumes 2 balloons, found ${balloons.length}` );

    super( options );

    // Extract the charges that will be monitored from the wall.  We use just the leftmost minus charges.
    const wallCharges = wall.minusCharges.slice( 0, wall.numY );

    // Make sure there aren't more sound generators than charges.
    assert && assert( wallCharges.length >= NUMBER_OF_SOUND_GENERATORS );

    this.originalChargePositions = wallCharges.map( wallCharge => wallCharge.positionProperty.value.copy() );

    this.previousChargePositions = [ ...this.originalChargePositions ];

    this.chargeDeflectionBins = [];

    // Create an internal gain stage that will be used to adjust the gain level since multiple inputs are being combined
    // to produce the overall output signal.
    const outputLevelGainNode = phetAudioContext.createGain();
    outputLevelGainNode.connect( this.mainGainNode );

    this.soundGenerators = [];

    this.chargeToSoundGeneratorMap = new Map();

    this.wallCharges = wallCharges;

    // Set the initial bins for each charge.
    this.updateChargeDeflectionBins();

    // Create the sound generators that will produce the individual discrete sounds.
    _.times( NUMBER_OF_SOUND_GENERATORS, index => {
      const soundClip = new SoundClip(
        chargeDeflection_mp3,
        {
          // We're going to be changing the playback rate as charges get more deflected, but those changes shouldn't
          // affect sounds that are already playing.
          rateChangesAffectPlayingSounds: false,

          // Set the output level such that it won't exceed 0 dBFS even if all sound generators play at the same time.
          initialOutputLevel: 1 / NUMBER_OF_SOUND_GENERATORS
        }
      );
      soundClip.connect( this.mainGainNode );
      this.soundGenerators.push( soundClip );
      this.chargeToSoundGeneratorMap.set( this.getChargeForSoundGeneratorIndex( index ), soundClip );
    } );

    // Monitor the balloons for drift motion (i.e. motion not caused by the user dragging them) and produce sound if
    // this motion causes changes in the positions of the wall charges.
    balloons.forEach( ( balloon: BalloonModel ) => {
      balloon.positionProperty.link( () => {
        if ( !balloon.isDraggedProperty.value && balloon.inducingChargeProperty.value ) {
          this.produceSoundForBinChanges( balloon );
        }
      } );
    } );
  }

  /**
   * Get a normalized value representing how deflected the specified charge is.
   * @param chargeIndex - index of the charge withing the internal array
   */
  private getNormalizedChargeDeflection( chargeIndex: number ): number {
    const deflection =
      this.originalChargePositions[ chargeIndex ].distance( this.wallCharges[ chargeIndex ].positionProperty.value );

    // A note to future maintainers: At one point there was an assertion here to check for deflection values that
    // exceeded the max value.  However, it kept getting hit during fuzz testing with some very large values.  It wasn't
    // obvious why this was happening and, In the interest of time, it wasn't tracked down.  Instead, the assertion was
    // removed.  It seems to work well enough.

    return Math.min( deflection / MAX_CHARGE_DEFLECTION, 1 );
  }

  /**
   * Update the previous charge positions to match the current ones.
   */
  private updatePreviousChargePositions(): void {
    this.previousChargePositions = this.wallCharges.map( wallCharge => wallCharge.positionProperty.value.copy() );
  }

  /**
   * Get the charge that corresponds to the specified sound generator index.
   * @param soundGeneratorIndex
   */
  private getChargeForSoundGeneratorIndex( soundGeneratorIndex: number ): MovablePointChargeModel {
    assert && assert( soundGeneratorIndex < NUMBER_OF_SOUND_GENERATORS, 'soundGeneratorIndex out of range' );
    const spacing = this.wallCharges.length / ( NUMBER_OF_SOUND_GENERATORS + 1 );
    return this.wallCharges[ Math.floor( ( soundGeneratorIndex + 1 ) * spacing ) ];
  }

  /**
   * Update the list of bins into which each of the charges falls according to its normalized position.
   */
  private updateChargeDeflectionBins(): void {
    this.wallCharges.forEach( ( wallCharge: MovablePointChargeModel, index: number ) => {
      this.chargeDeflectionBins[ index ] = mapNormalizedDeflectionToBin( this.getNormalizedChargeDeflection( index ) );
    } );
  }

  /**
   * A drag handler method for when a balloon is dragged using a pointer (i.e. a mouse or touch event).  This method
   * determines whether the user's actions have changed the charge positions in the wall in such a way that sound should
   * be produced and, if so, it produces the sound.
   * @param balloon
   */
  public balloonDraggedByPointer( balloon: BalloonModel ): void {
    this.produceSoundForBinChanges( balloon );
  }

  /**
   * Check all of the charges that have sound generators associated with them and, if the charge has moved to a new
   * bin, produce the corresponding sound.  This also updates the bin positions.
   * @param balloon
   */
  private produceSoundForBinChanges( balloon: BalloonModel ): void {

    // Make a list of the previous charge bins.
    const previousChargeDeflectionBins = [ ...this.chargeDeflectionBins ];

    // Update the charge deflection bins.
    this.updateChargeDeflectionBins();

    // Only play sounds if the changes are associated with the balloon that is being dragged.
    if ( balloon.inducingChargeProperty.value ) {

      const sonifiedCharges = Array.from( this.chargeToSoundGeneratorMap.keys() );

      sonifiedCharges.forEach( ( charge: MovablePointChargeModel ) => {

        // Get the index for this charge.
        const chargeIndex = this.wallCharges.indexOf( charge );

        if ( previousChargeDeflectionBins[ chargeIndex ] !== this.chargeDeflectionBins[ chargeIndex ] ) {

          const soundGenerator = this.chargeToSoundGeneratorMap.get( charge )!;

          // The bin changed for the charge associated with this sound generator.  Map the bin to a playback rate and
          // play the sound.
          soundGenerator.setPlaybackRate( mapBinToPlaybackRate( this.chargeDeflectionBins[ chargeIndex ] ), 0 );
          soundGenerator.play();
        }
      } );
    }

    // Update the charge positions for the next drag event.
    this.previousChargePositions = this.wallCharges.map( wallCharge => wallCharge.positionProperty.value.copy() );
  }

  /**
   * A drag handler method for when a balloon is dragged using the keyboard or some other non-pointer interaction.  This
   * method determines whether the user's actions have changed the charge positions in the wall in such a way that sound
   * should be produced.
   * @param balloon
   */
  public balloonDraggedByKeyboard( balloon: BalloonModel ): void {
    this.produceSoundForChargeMotion( balloon );
  }

  /**
   * Check whether any of the charges in the wall have moved since the last update and, if so, produce a sound that
   * indicates this.  The balloon is checked to make sure that it is actually inducing charge in the wall.
   * @param balloon
   */
  private produceSoundForChargeMotion( balloon: BalloonModel ): void {
    this.updateChargeDeflectionBins();
    const currentChargePositions = this.wallCharges.map( wallCharge => wallCharge.positionProperty.value.copy() );
    let playDelay = 0;

    // Only play sounds if the changes are associated with the balloon that is being dragged.
    if ( balloon.inducingChargeProperty.value ) {

      // array to keep track of used playback rates to avoid duplication
      const usedPlaybackRates: number[] = [];

      // Count how many sound instances are currently being played.
      let totalPlayingSoundClipInstances = this.soundGenerators.reduce(
        ( totalPlayingInstances: number, sg: SoundClip ) => sg.getNumberOfPlayingInstances() + totalPlayingInstances,
        0
      );

      // Create an ordered list of the charges that have sound generators associated with them.  The list is sorted
      // based on how close each charge is to the center of the balloon.  This is needed to avoid situations where some
      // of the sound generators don't get played when lots of movement is occurring, which leads to inconsistent
      // behavior based on where the balloon is.  See
      // https://github.com/phetsims/balloons-and-static-electricity/issues/533.
      const sortedSonifiedCharges = Array.from( this.chargeToSoundGeneratorMap.keys() ).sort( ( charge1: MovablePointChargeModel, charge2: MovablePointChargeModel ) => {
        const balloonCenter = balloon.getCenter();
        return charge1.position.distance( balloonCenter ) - charge2.position.distance( balloonCenter );
      } );

      // For each charge that has an associated sound generator, figure out if that charge has moved since the last drag
      // event and, if so, play a sound.
      sortedSonifiedCharges.forEach( ( charge: MovablePointChargeModel ) => {

        // Don't even consider playing a sound if there are already too many playing.  This helps to keep things from
        // sounding too chaotic.
        if ( totalPlayingSoundClipInstances < NUMBER_OF_SOUND_GENERATORS ) {

          const chargeIndex = this.wallCharges.indexOf( charge );

          // Check whether the charge has moved since the last drag.
          if ( !charge.positionProperty.value.equals( this.previousChargePositions[ chargeIndex ] ) ) {

            const playbackRateForBin = mapBinToPlaybackRate( this.chargeDeflectionBins[ chargeIndex ] );

            // Only play the sound if the same playback rate hasn't already been kicked off on another charge.
            if ( !usedPlaybackRates.includes( playbackRateForBin ) ) {
              const soundGenerator = this.chargeToSoundGeneratorMap.get( charge )!;
              soundGenerator.setPlaybackRate( playbackRateForBin, 0 );
              soundGenerator.play( playDelay );
              totalPlayingSoundClipInstances += 1;
              playDelay += 0.1;
              usedPlaybackRates.push( playbackRateForBin );
            }
          }
        }
      } );
    }

    this.previousChargePositions = currentChargePositions;
  }

  /**
   */
  public reset(): void {
    this.previousChargePositions = [ ...this.originalChargePositions ];
  }
}

/**
 * Get the bin into which the provided normalized deflection value should be mapped.
 * @param normalizedDeflection
 */
const mapNormalizedDeflectionToBin = ( normalizedDeflection: number ): number => {

  // input parameter checking
  assert && assert( normalizedDeflection >= 0 );
  assert && assert( normalizedDeflection <= 1 );

  const unadjustedBinSize = 1 / NUMBER_OF_DISCRETE_BINS;

  // The size of the first bin can be adjusted to make initial movements happen earlier (or later, I suppose).
  const firstBinSize = unadjustedBinSize * BIN_ZERO_PROPORTIONATE_SIZE;

  const adjustedBinSize = ( 1 - firstBinSize ) / ( NUMBER_OF_DISCRETE_BINS - 1 );

  let bin = 0;
  if ( normalizedDeflection > firstBinSize ) {

    // This charge is not in the first bin.  Which is it in?
    bin = Math.min(
      Math.floor( ( normalizedDeflection - firstBinSize ) / adjustedBinSize ) + 1,
      NUMBER_OF_DISCRETE_BINS - 1
    );
  }

  return bin;
};

/**
 * map bin number to a playback rate for a sound clip
 * @param bin
 */
const mapBinToPlaybackRate = ( bin: number ): number => {
  const octave = Math.floor( bin / PENTATONIC_SCALE_MULTIPLIERS.length ) + OCTAVES_OFFSET;
  const index = bin % PENTATONIC_SCALE_MULTIPLIERS.length;
  return PENTATONIC_SCALE_MULTIPLIERS[ index ] * Math.pow( 2, octave );
};

balloonsAndStaticElectricity.register( 'ChargeDeflectionSoundGenerator', ChargeDeflectionSoundGenerator );
export default ChargeDeflectionSoundGenerator;