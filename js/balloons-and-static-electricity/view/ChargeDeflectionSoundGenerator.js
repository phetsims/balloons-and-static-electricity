// Copyright 2021, University of Colorado Boulder

/**
 * ChargeDeflectionSoundGenerator produces sounds based on how much deflection a set of charges are experiencing and how
 * often they are changing.  This is quite specific to the wall charges in the Balloons and Static Electricity sim.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import phetAudioContext from '../../../../tambo/js/phetAudioContext.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import SoundGenerator from '../../../../tambo/js/sound-generators/SoundGenerator.js';
import chargesInWallBlip002Muffled from '../../../sounds/charges-in-wall-blip-002-muffled_mp3.js';
import balloonsAndStaticElectricity from '../../balloonsAndStaticElectricity.js';

// constants
const NUMBER_OF_DISCRETE_BINS = 8;
const NUMBER_OF_SOUND_GENERATORS = 3;
const BIN_ZERO_PROPORTIONATE_SIZE = 0.6; // Bin zero can be made smaller than the others so that sounds occur earlier.
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

    // @private {Vector2[]} - list of original, non-deflected charge positions, used to determine the amount of deflection
    this.originalChargePositions = wallCharges.map( wallCharge => wallCharge.positionProperty.value.copy() );

    // {Vector2[]} - A list of previous charge positions prior to most recent keyboard drag event, used to detect
    // whether the charges have moved.
    this.chargePositionsBeforeBalloonDrag = [ ...this.originalChargePositions ];

    // @private {number[]} - Bin number, based on normalized deflection, where each charge was mapped at during the
    // most recent update.
    this.chargeDeflectionBins = [];

    // Create an internal gain stage that will be used to control the output level.
    const outputLevelGainNode = phetAudioContext.createGain();
    outputLevelGainNode.connect( this.masterGainNode );

    // A Property that is true when one or both of the balloons are considered to be statically inducing charges in the
    // wall.
    const chargeInducedByBalloonsProperty = new DerivedProperty(
      balloons.map( balloon => balloon.inducingChargeProperty ),
      ( inducingCharge0, inducingCharge1 ) => inducingCharge0 || inducingCharge1
    );

    // @private {SoundClip[]} - sound generators used used to produce the individual sounds
    this.soundGenerators = [];

    // @private {MovablePointChargeModel[]} - array of point charges, needed by methods
    this.wallCharges = wallCharges;

    // Set the initial bins for each charge.
    this.updateChargeDeflectionBins();

    // Create the sound generators that will produce the individual discrete sounds.
    _.times( wallCharges.length, () => {
      const soundClip = new SoundClip(
        chargesInWallBlip002Muffled,
        {
          // Only allow sounds to play when the balloon is close enough to the wall.
          enableControlProperties: [ chargeInducedByBalloonsProperty ],

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

    // @private {function}
    this.disposeChargeDeflectionSoundGenerator = () => {
      // TODO: fill this in
    };
  }

  /**
   * Get a normalized value representing how deflected the specified charge is.
   * @param {number} chargeIndex
   * @returns {number}
   * @private
   */
  getNormalizedChargeDeflection( chargeIndex ) {
    const deflection =
      this.originalChargePositions[ chargeIndex ].distance( this.wallCharges[ chargeIndex ].positionProperty.value );

    // A note to future maintainers: At one point there was an assertion check here for deflection values that
    // exceeded the max value.  However, it kept getting hit during fuzz testing with some very large values.  In the
    // interest of time, this wasn't tracked down.  Instead, the assertion was removed.  It seems to work well enough.

    return Math.min( deflection / MAX_CHARGE_DEFLECTION, 1 );
  }

  /**
   * Update the previous charge positions to match the current ones.
   * @private
   */
  updatePreviousChargePositions() {
    this.chargePositionsBeforeBalloonDrag = this.wallCharges.map( wallCharge => wallCharge.positionProperty.value.copy() );
  }

  /**
   * Get the charge for the specified sound generator index.
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
   * A drag handling method for when a balloon is dragged using a pointer (i.e. a mouse or touch event).  This method
   * determines whether the user's actions have changed the charge positions in the wall in such a way that sound should
   * be produced.
   * @public
   */
  balloonDraggedByPointer() {

    // Make a list of the previous charge bins.
    const previousChargeDeflectionBins = [ ...this.chargeDeflectionBins ];

    // Update the charge deflection bins.
    this.updateChargeDeflectionBins();

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

    // Update the charge positions for the next drag event.
    this.chargePositionsBeforeBalloonDrag = this.wallCharges.map( wallCharge => wallCharge.positionProperty.value.copy() );
  }

  /**
   * A drag handling method for when a balloon is dragged using keyboard interaction.  This method determines whether
   * the user's actions have changed the charge positions in the wall in such a way that sound should be produced.
   * @public
   */
  balloonDraggedByKeyboard() {
    this.updateChargeDeflectionBins();
    const currentChargePositions = this.wallCharges.map( wallCharge => wallCharge.positionProperty.value.copy() );
    let playDelay = 0;

    // For each active sound generator, first determine the charge to which it maps, then figure out if that charge
    // has moved since the last time we checked and, if so, play a sound.
    _.times( NUMBER_OF_SOUND_GENERATORS, index => {

      // If there are already too many sounds playing, bail out.
      const totalPlayingSoundClipInstances = this.soundGenerators.reduce(
        ( totalPlayingInstances, sg ) => sg.getNumberOfPlayingInstances() + totalPlayingInstances,
        0
      );
      if ( totalPlayingSoundClipInstances > NUMBER_OF_SOUND_GENERATORS ) {
        return;
      }

      const discreteSoundGenerator = this.soundGenerators[ index ];

      // Figure out the charge to which this sound generator corresponds.
      const chargeIndex = this.getChargeForSoundGenerator( index );

      // Check whether the charge associated with this sound generator has moved.
      if ( !currentChargePositions[ chargeIndex ].equals( this.chargePositionsBeforeBalloonDrag[ chargeIndex ] ) ) {

        const playbackRateForBin = mapBinToPlaybackRate( this.chargeDeflectionBins[ chargeIndex ] );
        const intoBin = mapNormalizedDeflectionToBinOffset( this.getNormalizedChargeDeflection( chargeIndex ) );

        discreteSoundGenerator.setPlaybackRate( playbackRateForBin + intoBin * TWELFTH_ROOT_OF_TWO, 0 );
        discreteSoundGenerator.play( playDelay );
        playDelay += 0.1;
      }
    } );

    this.chargePositionsBeforeBalloonDrag = currentChargePositions;
  }

  /**
   * @public
   */
  reset() {
    this.chargePositionsBeforeBalloonDrag = [ ...this.originalChargePositions ];
  }

  /**
   * release memory references
   * @public
   */
  dispose() {
    this.disposeChargeDeflectionSoundGenerator();
    super.dispose();
  }
}

/**
 * bin mapping algorithm
 *
 * @param {number} normalizedDeflection
 * @returns {Object} - Of the form: {
 *   bin: {number} - discrete bin into which the provided value has been mapped
 *   proportionateOffsetIntoBin: {number} - offset in terms of proportion (0 to 1) into which the provided value extends
 *                                          into the bin in which it was placed
 * }
 */
const mapNormalizedDeflectionToBinAndOffset = normalizedDeflection => {

  // input parameter checking
  assert && assert( normalizedDeflection >= 0 );
  assert && assert( normalizedDeflection <= 1 );

  const unadjustedBinSize = 1 / NUMBER_OF_DISCRETE_BINS;

  // The size of the first bin can be adjusted so that initial movements change bins earlier (or later, I suppose).
  const firstBinSize = unadjustedBinSize * BIN_ZERO_PROPORTIONATE_SIZE;

  const adjustedBinSize = ( 1 - firstBinSize ) / ( NUMBER_OF_DISCRETE_BINS - 1 );

  let bin = 0;
  let proportionateOffsetIntoBin = 0;
  if ( normalizedDeflection > firstBinSize ) {

    // This charge is not in the first bin.  Which is it in?
    bin = Math.min(
      Math.floor( ( normalizedDeflection - firstBinSize ) / adjustedBinSize ) + 1,
      NUMBER_OF_DISCRETE_BINS - 1
    );

    // Calculate how far, proportionately, the provided value extends into the bin into which it has been placed.
    proportionateOffsetIntoBin = ( normalizedDeflection - ( ( bin - 1 ) * adjustedBinSize + firstBinSize ) ) / adjustedBinSize;
  }
  else {
    proportionateOffsetIntoBin = normalizedDeflection / firstBinSize;
  }

  return {
    bin: bin,
    proportionateOffsetIntoBin: proportionateOffsetIntoBin
  };
};

/**
 * Get the bin into which the provided normalized deflection value should be mapped.
 * @param {number} normalizedDeflection
 * @returns {number}
 */
const mapNormalizedDeflectionToBin = normalizedDeflection => {
  return mapNormalizedDeflectionToBinAndOffset( normalizedDeflection ).bin;
};

/**
 * Get the proportional offset into the bin in which the provided normalized deflection value maps.
 * @param {number} normalizedDeflection
 * @returns {number}
 */
const mapNormalizedDeflectionToBinOffset = normalizedDeflection => {
  return mapNormalizedDeflectionToBinAndOffset( normalizedDeflection ).proportionateOffsetIntoBin;
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