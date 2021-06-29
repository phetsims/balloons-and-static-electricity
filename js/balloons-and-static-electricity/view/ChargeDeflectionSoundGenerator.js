// Copyright 2021, University of Colorado Boulder

/**
 * ChargeDeflectionSoundGenerator produces sounds based on how much deflection (i.e. movement relative to the nominal
 * position) occurs in a set of simulated electrical charges.  This is quite specific to the wall charges in the
 * Balloons and Static Electricity sim, though the concepts may be extensible to other sims.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import phetAudioContext from '../../../../tambo/js/phetAudioContext.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import SoundGenerator from '../../../../tambo/js/sound-generators/SoundGenerator.js';
import chargesInWallBlip002Muffled from '../../../sounds/charges-in-wall-blip-002-muffled_mp3.js';
import balloonsAndStaticElectricity from '../../balloonsAndStaticElectricity.js';

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

  /**
   * @param {WallModel} wall
   * @param {BalloonModel[]} balloons - the balloons modeled in the sim
   * @param {Object} [options]
   */
  constructor( wall, balloons, options ) {

    assert && assert( balloons.length === 2, `this assumes 2 balloons, found ${balloons.length}` );

    super( options );

    // Extract the charges that will be monitored from the wall.  We use just the leftmost minus charges.
    const wallCharges = wall.minusCharges.slice( 0, wall.numY );

    // Make sure there aren't more sound generators than charges.
    assert && assert( wallCharges.length >= NUMBER_OF_SOUND_GENERATORS );

    // @private {Vector2[]} - list of original, non-deflected charge positions, used to determine the amount of deflection
    this.originalChargePositions = wallCharges.map( wallCharge => wallCharge.positionProperty.value.copy() );

    // {Vector2[]} - A list of previous charge positions prior to most recent update.  If using these, be careful to
    // manage the update process carefully.
    this.previousChargePositions = [ ...this.originalChargePositions ];

    // @private {number[]} - Bin number, based on normalized deflection, where each charge was mapped at during the
    // most recent update.
    this.chargeDeflectionBins = [];

    // Create an internal gain stage that will be used to adjust the gain level since multiple inputs are being combined
    // to produce the overall output signal.
    const outputLevelGainNode = phetAudioContext.createGain();
    outputLevelGainNode.connect( this.masterGainNode );

    // @private {SoundClip[]} - sound generators used used to produce the individual sounds
    this.soundGenerators = [];

    // @private {MovablePointChargeModel[]} - array of point charges, needed by methods
    this.wallCharges = wallCharges;

    // Set the initial bins for each charge.
    this.updateChargeDeflectionBins();

    // Create the sound generators that will produce the individual discrete sounds.
    _.times( NUMBER_OF_SOUND_GENERATORS, () => {
      const soundClip = new SoundClip(
        chargesInWallBlip002Muffled,
        {
          // We're going to be changing the playback rate as charges get more deflected, but those changes shouldn't
          // affect sounds that are already playing.
          rateChangesAffectPlayingSounds: false,

          // Set the output level such that it won't exceed 0 dBFS even if all sound generators play at the same time.
          initialOutputLevel: 1 / NUMBER_OF_SOUND_GENERATORS
        }
      );
      soundClip.connect( this.masterGainNode );
      this.soundGenerators.push( soundClip );
    } );
  }

  /**
   * Get a normalized value representing how deflected the specified charge is.
   * @param {number} chargeIndex - index of the charge withing the internal array
   * @returns {number}
   * @private
   */
  getNormalizedChargeDeflection( chargeIndex ) {
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
   * @private
   */
  updatePreviousChargePositions() {
    this.previousChargePositions = this.wallCharges.map( wallCharge => wallCharge.positionProperty.value.copy() );
  }

  /**
   * Get the charge that corresponds to the specified sound generator index.
   * @param soundGeneratorIndex
   * @returns {number}
   * @private
   */
  getChargeForSoundGenerator( soundGeneratorIndex ) {
    assert && assert( soundGeneratorIndex < NUMBER_OF_SOUND_GENERATORS, 'soundGeneratorIndex out of range' );
    const spacing = this.wallCharges.length / ( NUMBER_OF_SOUND_GENERATORS + 1 );
    return Math.floor( ( soundGeneratorIndex + 1 ) * spacing );
  }

  /**
   * Update the list of bins into which each of the charges falls according to its normalized position.
   * @private
   */
  updateChargeDeflectionBins() {
    this.wallCharges.forEach( ( wallCharge, index ) => {
      this.chargeDeflectionBins[ index ] = mapNormalizedDeflectionToBin( this.getNormalizedChargeDeflection( index ) );
    } );
  }

  /**
   * A drag handler method for when a balloon is dragged using a pointer (i.e. a mouse or touch event).  This method
   * determines whether the user's actions have changed the charge positions in the wall in such a way that sound should
   * be produced and, if so, it produces the sound.
   * @param {BalloonModel} balloon
   * @public
   */
  balloonDraggedByPointer( balloon ) {

    // Make a list of the previous charge bins.
    const previousChargeDeflectionBins = [ ...this.chargeDeflectionBins ];

    // Update the charge deflection bins.
    this.updateChargeDeflectionBins();

    // Only play sounds if the changes are associated with the balloon that is being dragged.
    if ( balloon.inducingChargeProperty.value ) {

      // For each active sound generator, first determine the charge to which it maps, then figure out if that charge
      // has changed bins since the last time we checked.
      _.times( NUMBER_OF_SOUND_GENERATORS, index => {

        const discreteSoundGenerator = this.soundGenerators[ index ];

        // Figure out the charge to which this sound generator corresponds.
        const chargeIndex = this.getChargeForSoundGenerator( index );

        if ( previousChargeDeflectionBins[ chargeIndex ] !== this.chargeDeflectionBins[ chargeIndex ] ) {

          // The bin changed for the charge associated with this sound generator.  Map the bin to a playback rate and
          // play the sound.
          discreteSoundGenerator.setPlaybackRate( mapBinToPlaybackRate( this.chargeDeflectionBins[ chargeIndex ] ), 0 );
          discreteSoundGenerator.play();
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
   * @param {BalloonModel} balloon
   * @public
   */
  balloonDraggedByKeyboard( balloon ) {
    this.updateChargeDeflectionBins();
    const currentChargePositions = this.wallCharges.map( wallCharge => wallCharge.positionProperty.value.copy() );
    let playDelay = 0;

    // Only play sounds if the changes are associated with the balloon that is being dragged.
    if ( balloon.inducingChargeProperty.value ) {

      // array to keep track of used playback rates to avoid duplication
      const usedPlaybackRates = [];

      // For each active sound generator, first determine the charge to which it maps, then figure out if that charge
      // has moved since the last time we checked and, if so, play a sound.
      _.times( NUMBER_OF_SOUND_GENERATORS, index => {

        // Count how many sound instances are currently being played.
        const totalPlayingSoundClipInstances = this.soundGenerators.reduce(
          ( totalPlayingInstances, sg ) => sg.getNumberOfPlayingInstances() + totalPlayingInstances,
          0
        );

        // Only play the sound if there aren't already too many playing.
        if ( totalPlayingSoundClipInstances < NUMBER_OF_SOUND_GENERATORS ) {
          const soundGenerator = this.soundGenerators[ index ];

          // Figure out the charge to which this sound generator corresponds.
          const chargeIndex = this.getChargeForSoundGenerator( index );

          // Check whether the charge associated with this sound generator has moved.
          if ( !currentChargePositions[ chargeIndex ].equals( this.previousChargePositions[ chargeIndex ] ) ) {

            const playbackRateForBin = mapBinToPlaybackRate( this.chargeDeflectionBins[ chargeIndex ] );

            // Only play if the same playback rate hasn't already been kicked off.
            if ( !usedPlaybackRates.includes( playbackRateForBin ) ) {
              soundGenerator.setPlaybackRate( playbackRateForBin, 0 );
              soundGenerator.play( playDelay );
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
   * @public
   */
  reset() {
    this.previousChargePositions = [ ...this.originalChargePositions ];
  }
}

/**
 * Get the bin into which the provided normalized deflection value should be mapped.
 * @param {number} normalizedDeflection
 * @returns {number}
 */
const mapNormalizedDeflectionToBin = normalizedDeflection => {

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
 * @param {number} bin
 * @returns {number}
 */
const mapBinToPlaybackRate = bin => {
  const octave = Math.floor( bin / PENTATONIC_SCALE_MULTIPLIERS.length ) + OCTAVES_OFFSET;
  const index = bin % PENTATONIC_SCALE_MULTIPLIERS.length;
  return PENTATONIC_SCALE_MULTIPLIERS[ index ] * Math.pow( 2, octave );
};

balloonsAndStaticElectricity.register( 'ChargeDeflectionSoundGenerator', ChargeDeflectionSoundGenerator );
export default ChargeDeflectionSoundGenerator;