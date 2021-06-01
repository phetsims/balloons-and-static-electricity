// Copyright 2021, University of Colorado Boulder

/**
 * ChargeDeflectionSoundGenerator produces sounds based on how much deflection a set of charges are experiencing and how
 * often they are changing.  This is quite specific to the wall charges in the Balloons and Static Electricity sim.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import phetAudioContext from '../../../../tambo/js/phetAudioContext.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import SoundGenerator from '../../../../tambo/js/sound-generators/SoundGenerator.js';
import chargesInWallBlip002Muffled from '../../../sounds/charges-in-wall-blip-002-muffled_mp3.js';
import balloonsAndStaticElectricity from '../../balloonsAndStaticElectricity.js';

// constants
const NUMBER_OF_DISCRETE_BINS = 8;
const NUMBER_OF_SOUND_GENERATORS = 3;
const CHARGES_STILL_TIME = 0.5; // number of seconds where, if no charge motion is detected, charges are considered still
const BIN_ZERO_PROPORTIONATE_SIZE = 0.6; // Bin zero can be made smaller than the others so that sounds occur earlier.
const OCTAVES_OFFSET = 0.2; // an offset that can be used to raise or lower all pitches, value empirically determined

// constants used for musical pitch mapping
const TWELFTH_ROOT_OF_TWO = Math.pow( 2, 1 / 12 );
const PENTATONIC_SCALE_MULTIPLIERS = [
  1,
  Math.pow( TWELFTH_ROOT_OF_TWO, 2 ),
  Math.pow( TWELFTH_ROOT_OF_TWO, 4 ),
  Math.pow( TWELFTH_ROOT_OF_TWO, 7 ),
  Math.pow( TWELFTH_ROOT_OF_TWO, 9 )
];

// function for mapping a bin to a playback rate
const PITCH_MAPPING_ALGORITHM = bin => {
  const octave = Math.floor( bin / PENTATONIC_SCALE_MULTIPLIERS.length ) + OCTAVES_OFFSET;
  const index = bin % PENTATONIC_SCALE_MULTIPLIERS.length;
  return PENTATONIC_SCALE_MULTIPLIERS[ index ] * Math.pow( 2, octave );
};

class ChargeDeflectionSoundGenerator extends SoundGenerator {

  /**
   * @param {MovablePointChargeModel[]} wallCharges
   * @param {number} maxChargeDeflection - the max amount that the charges are expected to move
   * @param {BalloonModel[]} balloons - the balloons modeled in the sim
   * @param {Object} [options]
   */
  constructor( wallCharges, maxChargeDeflection, balloons, options ) {

    assert && assert( balloons.length === 2, `this assumes 2 balloons, found ${balloons.length}` );

    super( options );

    // {Vector2[]} - list of original, non-deflected charge positions, used to determine the amount of deflection
    const originalChargePositions = wallCharges.map( wallCharge => wallCharge.positionProperty.value.copy() );

    // {Vector2[]} - list of previous charge positions, used to detect whether motion has occurred
    const previousChargePositions = wallCharges.map( wallCharge => wallCharge.positionProperty.value.copy() );

    // {number[]} - Bin number, based on normalized deflection, where each charge was mapped at the end of the previous
    // step.
    const chargeDeflectionBins = [];

    // Property that tracks whether the charges have moved recently, updated by step function
    const chargesMovingProperty = new BooleanProperty( false );

    // Normalized numeric value (range 0 to 1 ) representing the maximum amount of deflection detected in the provided
    // list of charges.  This is only used for some of the sound generation modes.
    const maxDeflectionProperty = new NumberProperty( 0 );

    // Create an internal gain stage that will be used to control the output level.
    const outputLevelGainNode = phetAudioContext.createGain();
    outputLevelGainNode.connect( this.masterGainNode );

    // A Property that is true when one or both of the balloons are considered to be statically inducing charges in the
    // wall.
    const chargeInducedByBalloonsProperty = new DerivedProperty(
      balloons.map( balloon => balloon.inducingChargeProperty ),
      ( inducingCharge0, inducingCharge1 ) => inducingCharge0 || inducingCharge1
    );

    // {SoundClip[]} - sound generators used in INDIVIDUAL_DISCRETE mode, only populated in that mode
    const discreteSoundGenerators = [];

    // Closure for mapping a sound generator index to a charge, necessary because there may be fewer sound generators
    // than charges.
    const getChargeForSoundGenerator = soundGeneratorIndex => {
      const spacing = wallCharges.length / ( NUMBER_OF_SOUND_GENERATORS + 1 );
      return Math.floor( ( soundGeneratorIndex + 1 ) * spacing );
    };

    // closure for calculating normalized charge deflection for a specified charge index
    const getNormalizedChargeDeflection = chargeIndex =>
      Math.min(
        originalChargePositions[ chargeIndex ].distance( wallCharges[ chargeIndex ].positionProperty.value ) / maxChargeDeflection,
        1
      );

    // Set the initial bins for each charge.
    wallCharges.forEach( ( wallCharge, index ) => {
      chargeDeflectionBins[ index ] = mapNormalizedDeflectionToBin( getNormalizedChargeDeflection( index ) );
    } );

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
      discreteSoundGenerators.push( soundClip );
    } );

    // countdown time for determining when the charges have stopped moving
    let chargesStillCountdown = 0;

    // @private - internal step function so that we don't have to have a bunch of publicly visible data
    this.stepInternal = dt => {

      let maxDeflectionNormalized = 0;
      let chargesMovedThisStep = false;

      // Analyze the changes in charge positions that have occurred since the last step, if any.
      wallCharges.forEach( ( wallCharge, index ) => {

        // convenience variable
        const wallChargePosition = wallCharge.positionProperty.value;

        // Calculate normalized deflection and update the max.
        const normalizedDeflection = wallChargePosition.distance( originalChargePositions[ index ] ) / maxChargeDeflection;
        maxDeflectionNormalized = Math.max( normalizedDeflection, maxDeflectionNormalized );
      } );

      // Update the current maximum deflection.
      maxDeflectionProperty.set( maxDeflectionNormalized );

      // Update the Property the tracks whether charges are moving.
      if ( chargesMovedThisStep ) {
        chargesMovingProperty.set( true );
        chargesStillCountdown = CHARGES_STILL_TIME;
      }
      else if ( chargesMovingProperty.value ) {
        chargesStillCountdown = Math.max( chargesStillCountdown - dt, 0 );
        if ( chargesStillCountdown === 0 ) {
          chargesMovingProperty.set( false );
        }
      }

      // For each active sound generator, first determine the charge to which it maps, then figure out if that charge
      // has changed bins since the last time we checked.
      _.times( NUMBER_OF_SOUND_GENERATORS, index => {

        const discreteSoundGenerator = discreteSoundGenerators[ index ];

        // Figure out the charge to which this sound generator corresponds.
        const chargeIndex = getChargeForSoundGenerator( index );

        const binForThisCharge = mapNormalizedDeflectionToBin( getNormalizedChargeDeflection( chargeIndex ) );
        if ( binForThisCharge !== chargeDeflectionBins[ chargeIndex ] ) {

          // The bin changed for the charge associated with this sound generator.  Map the bin to a playback rate and
          // play the sound.
          discreteSoundGenerator.setPlaybackRate( PITCH_MAPPING_ALGORITHM( binForThisCharge ), 0 );
          discreteSoundGenerator.play();
        }
      } );

      // Update the bins for all wall charges.
      wallCharges.forEach( ( wallCharge, index ) => {
        chargeDeflectionBins[ index ] = mapNormalizedDeflectionToBin( getNormalizedChargeDeflection( index ) );
      } );

      // Update the wall charge positions.
      wallCharges.forEach( ( wallCharge, index ) => {

        const wallChargePosition = wallCharge.positionProperty.value;

        // Check for changes versus the previous charge positions.
        if ( !wallChargePosition.equals( previousChargePositions[ index ] ) ) {
          chargesMovedThisStep = true;
          previousChargePositions[ index ].set( wallChargePosition );
        }
      } );
    };

    // @private {function}
    this.disposeChargeDeflectionSoundGenerator = () => {
      // TODO: fill this in
    };
  }

  /**
   * step the time-dependent behavior
   * @param {number} dt - time change in seconds
   * @public
   */
  step( dt ) {
    this.stepInternal( dt );
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
 * @param normalizedDeflection
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

balloonsAndStaticElectricity.register( 'ChargeDeflectionSoundGenerator', ChargeDeflectionSoundGenerator );
export default ChargeDeflectionSoundGenerator;