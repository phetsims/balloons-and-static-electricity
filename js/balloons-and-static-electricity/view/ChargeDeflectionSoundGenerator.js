// Copyright 2020, University of Colorado Boulder

/**
 * ChargeDeflectionSoundGenerator produces sounds based on how much deflection a set of charges are experiencing and how
 * often they are changing.  This is quite specific to the wall charges in the Balloons and Static Electricity sim.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import merge from '../../../../phet-core/js/merge.js';
import AmplitudeModulator from '../../../../tambo/js/AmplitudeModulator.js';
import phetAudioContext from '../../../../tambo/js/phetAudioContext.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import SoundGenerator from '../../../../tambo/js/sound-generators/SoundGenerator.js';
import brightMarimbaSound from '../../../../tambo/sounds/bright-marimba-short_mp3.js';
import chargeDeflectionSound from '../../../../tambo/sounds/release_mp3.js';
import balloonRelease from '../../../sounds/balloon-release-006_mp3.js';
import chargesInWallBlip001 from '../../../sounds/charges-in-wall-blip-001_mp3.js';
import chargesInWallBlip001Muffled from '../../../sounds/charges-in-wall-blip-001-muffled_mp3.js';
import chargesInWallBlip002 from '../../../sounds/charges-in-wall-blip-002_mp3.js';
import chargesInWallBlip002Muffled from '../../../sounds/charges-in-wall-blip-002-muffled_mp3.js';
import chargesInWallBlip from '../../../sounds/charges-in-wall-blip_mp3.js';
import chargesInWallBlipMuffled from '../../../sounds/charges-in-wall-blip-muffled_mp3.js';
import chargesInWallReverseBlip from '../../../sounds/charges-in-wall-reverse-blip_mp3.js';
import chargesOrganLoopOctaveUp from '../../../sounds/charges-organ-loop-one-octave-up_wav.js';
import chargesOrganLoop from '../../../sounds/charges-organ-loop_wav.js';
import chargesSynthLoopOctaveUp from '../../../sounds/charges-synthy-loop-one-octave-up_wav.js';
import chargesSynthLoop from '../../../sounds/charges-synthy-loop_wav.js';
import electronicHumUnsaturated from '../../../sounds/charges-wall-electronic-hum-loop_wav.js';
import electronicHumSaturated from '../../../sounds/charges-wall-saturated-electronic-hum-loop_wav.js';
import sineWaveSaturated from '../../../sounds/charges-wall-saturated-sine-wave-loop_wav.js';
import sineWaveUnsaturated from '../../../sounds/charges-wall-sine-wave-loop_wav.js';
import balloonsAndStaticElectricity from '../../balloonsAndStaticElectricity.js';

// const
const CHARGES_STILL_TIME = 0.5; // number of seconds where, if no charge motion is detected, charges are considered still
const SoundGenerationMode = Enumeration.byKeys( [
  'COLLECTIVE_CROSS_FADE',
  'INDIVIDUAL_PITCH',
  'INDIVIDUAL_CROSS_FADE',
  'INDIVIDUAL_DISCRETE'
] );

const CONTINUOUS_SOURCE_SOUNDS = [
  electronicHumUnsaturated,
  electronicHumSaturated,
  sineWaveUnsaturated,
  sineWaveSaturated,
  chargesOrganLoop,
  chargesOrganLoopOctaveUp,
  chargesSynthLoop,
  chargesSynthLoopOctaveUp
];

const TWELFTH_ROOT_OF_TWO = Math.pow( 2, 1 / 12 );
const MAJOR_SCALE_MULTIPLIERS = [
  1,
  Math.pow( TWELFTH_ROOT_OF_TWO, 2 ),
  Math.pow( TWELFTH_ROOT_OF_TWO, 4 ),
  Math.pow( TWELFTH_ROOT_OF_TWO, 5 ),
  Math.pow( TWELFTH_ROOT_OF_TWO, 7 ),
  Math.pow( TWELFTH_ROOT_OF_TWO, 9 ),
  Math.pow( TWELFTH_ROOT_OF_TWO, 11 )
];
const MAJOR_CHORD_MULTIPLIERS = [
  1,
  Math.pow( TWELFTH_ROOT_OF_TWO, 4 ),
  Math.pow( TWELFTH_ROOT_OF_TWO, 7 )
];
const MAJOR_7TH_CHORD_MULTIPLIERS = [
  1,
  Math.pow( TWELFTH_ROOT_OF_TWO, 4 ),
  Math.pow( TWELFTH_ROOT_OF_TWO, 7 ),
  Math.pow( TWELFTH_ROOT_OF_TWO, 11 )
];
const PENTATONIC_SCALE_MULTIPLIERS = [
  1,
  Math.pow( TWELFTH_ROOT_OF_TWO, 2 ),
  Math.pow( TWELFTH_ROOT_OF_TWO, 4 ),
  Math.pow( TWELFTH_ROOT_OF_TWO, 7 ),
  Math.pow( TWELFTH_ROOT_OF_TWO, 9 )
];

const NUMBER_OF_SOUND_GENERATORS_IN_INDIVIDUAL_MODES = 4;

//=====================================================================================================================
// Global configuration, used in Options dialog for sound design testing.
// https://github.com/phetsims/balloons-and-static-electricity/issues/486
//=====================================================================================================================

if ( !phet.ballonsAndStaticElectricity ) {
  phet.ballonsAndStaticElectricity = {};
}
phet.ballonsAndStaticElectricity.chargeDeflectionSoundGeneratorInfo = {};

// Map of names to wrapped audio buffers that can be used as sound sources for the discrete sound generators.  This is
// organized in this way so that it can be fed into a combo box in SoundOptionsDialogContent.
phet.ballonsAndStaticElectricity.chargeDeflectionSoundGeneratorInfo.discreteSoundSources = new Map( [
  [ 'chargesInWallBlip', chargesInWallBlip ],
  [ 'chargesInWallBlipMuffled', chargesInWallBlipMuffled ],
  [ 'chargesInWallBlip001', chargesInWallBlip001 ],
  [ 'chargesInWallBlip001Muffled', chargesInWallBlip001Muffled ],
  [ 'chargesInWallBlip002', chargesInWallBlip002 ],
  [ 'chargesInWallBlip002Muffled', chargesInWallBlip002Muffled ],
  [ 'chargesInWallReverseBlip', chargesInWallReverseBlip ],
  [ 'chargeDeflectionSound', chargeDeflectionSound ],
  [ 'brightMarimbaSound', brightMarimbaSound ],
  [ 'balloonRelease', balloonRelease ]
] );

// The number of bins used in the discrete mode.
const numBinsProperty = new Property( 10 );

// An offset for the octave used for the more musical pitch mapping algorithms.
const octaveOffsetProperty = new Property( 0 );

const outputLevelProperty = new Property( 0.5 );

// Map of strings to algorithms that will map a numerical bin number to a playback rate for a sound generator.  This is
// organized in this way so that it can be fed into a combo box in SoundOptionsDialogContent.
phet.ballonsAndStaticElectricity.chargeDeflectionSoundGeneratorInfo.discretePitchMappingAlgorithms = new Map( [
  [ 'No pitch change', () => 1 ],
  [ 'Linear one octave', bin => 1 + bin / numBinsProperty.value ],
  [ 'Linear half octave', bin => 1 + ( bin / numBinsProperty.value ) / 2 ],
  [ 'Major scale', bin => {
    const octave = Math.floor( bin / MAJOR_SCALE_MULTIPLIERS.length ) + octaveOffsetProperty.value;
    const index = bin % MAJOR_SCALE_MULTIPLIERS.length;
    return MAJOR_SCALE_MULTIPLIERS[ index ] * Math.pow( 2, octave );
  } ],
  [ 'Major chord', bin => {
    const octave = Math.floor( bin / MAJOR_CHORD_MULTIPLIERS.length ) + octaveOffsetProperty.value;
    const index = bin % MAJOR_CHORD_MULTIPLIERS.length;
    return MAJOR_CHORD_MULTIPLIERS[ index ] * Math.pow( 2, octave );
  } ],
  [ 'Major 7th chord', bin => {
    const octave = Math.floor( bin / MAJOR_7TH_CHORD_MULTIPLIERS.length ) + octaveOffsetProperty.value;
    const index = bin % MAJOR_7TH_CHORD_MULTIPLIERS.length;
    return MAJOR_7TH_CHORD_MULTIPLIERS[ index ] * Math.pow( 2, octave );
  } ],
  [ 'Pentatonic scale', bin => {
    const octave = Math.floor( bin / PENTATONIC_SCALE_MULTIPLIERS.length ) + octaveOffsetProperty.value;
    const index = bin % PENTATONIC_SCALE_MULTIPLIERS.length;
    return PENTATONIC_SCALE_MULTIPLIERS[ index ] * Math.pow( 2, octave );
  } ]
] );

phet.ballonsAndStaticElectricity.chargeDeflectionSoundGeneratorInfo.configurationProperties = {

  // {Property.<WrappedAudioBuffer>}
  discreteSoundSourceProperty: new Property( chargesInWallBlip ),

  // {Property.<Function(bin)>}
  discreteSoundPitchAlgorithmProperty: new Property(
    phet.ballonsAndStaticElectricity.chargeDeflectionSoundGeneratorInfo.discretePitchMappingAlgorithms.get( 'Major scale' )
  ),

  // number of sound generators, can't be more than the number of charges
  numberOfDiscreteSoundGeneratorsProperty: new Property( 3 ),

  // number of discrete bins that the charge positions are placed into
  discreteSoundNumberOfBinsProperty: numBinsProperty,

  // proportionate size of the first bin, often smaller than the others so that initial translation occur more quickly
  discreteSoundBinZeroProportionProperty: new Property( 1 ),

  // Octave offset used for the more musical pitch-mapping algorithms.  1 means an octave up, -1 an octave down.
  discreteSoundsOctaveOffsetProperty: octaveOffsetProperty,

  // Overall output level for this sound generator.
  overallOutputLevelProperty: outputLevelProperty
};

//=====================================================================================================================
// End of global configuration.
//=====================================================================================================================

class ChargeDeflectionSoundGenerator extends SoundGenerator {

  /**
   * @param {MovablePointChargeModel[]} wallCharges
   * @param {number} maxChargeDeflection - the max amount that the charges are expected to move
   * @param {BalloonModel[]} balloons - the balloons modeled in the sim
   * @param {Property.<boolean>} isWallVisibleProperty
   * @param {Object} [options]
   */
  constructor( wallCharges, maxChargeDeflection, balloons, isWallVisibleProperty, options ) {

    assert && assert( balloons.length === 2, `this assumes 2 balloons, found ${balloons.length}` );

    // TODO: Much of the code below is in a prototype state while the sound design team works through a set of options
    //       that have been brainstormed.  Once a general approach has been decided upon, there will just be a single
    //       mode of sound generation, and all others should be eliminated.  See
    //       https://github.com/phetsims/balloons-and-static-electricity/issues/486.

    options = merge( {
      soundGenerationMode: SoundGenerationMode.COLLECTIVE_CROSS_FADE,
      initialOutputLevel: outputLevelProperty.value,
      enableControlProperties: [ isWallVisibleProperty ],

      // {number} - Index of the sound, or first sound of a cross-fade pair, to be used in continuous sound generators,
      // i.e. sound generators that use loops.
      continuousSoundIndex: 0,

      // {number} - Index of the sound used for discrete sound generators.
      discreteSoundIndex: 0,

      // {number} - a multiplier for how much the pitch should change when using pitch changes to indicate deflection
      pitchMultiplier: 2,

      // {number} - a minimum value for the X position of charged balloon, below which no sound is produced
      minBalloonXValue: 0,

      // {number} - identifies the algorithm used to map bins to a playback rate (i.e. pitch)
      binToPlaybackRateAlgorithmIndex: 0,

      // {number} - index into array of algorithms used to map a bin to a playback rate
      binToPlaybackRateAlgorithm: 0

    }, options );

    super( options );

    // Change the output level when the configuration parameter changes.
    outputLevelProperty.lazyLink( outputLevel => {
      this.setOutputLevel( outputLevel );
    } );

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

    // Create an amplitude modulator and put it in the signal path.  This is used in some of the sound generation modes
    // to modulate the output sound when a charged balloon is being dragged along the wall.
    const amplitudeModulator = new AmplitudeModulator();
    amplitudeModulator.frequencyProperty.set( 4 );
    amplitudeModulator.depthProperty.set( 0 );
    amplitudeModulator.connect( outputLevelGainNode );

    // A Property that is only true when a charged balloon is past the minimum X value, used as a gating function to
    // prevent sound generation when the balloons are far from the wall.
    const chargedBalloonCloseEnoughProperty = new DerivedProperty(
      balloons.map( balloon => balloon.positionProperty ),
      ( pos0, pos1 ) => ( pos0.x > options.minBalloonXValue && balloons[ 0 ].chargeProperty.value < 0 ) ||
                        ( pos1.x > options.minBalloonXValue && balloons[ 1 ].chargeProperty.value < 0 )
    );

    // {SoundClip[]} - sound generators used in INDIVIDUAL_PITCH_CHANGE mode, only populated in that mode
    const pitchChangingSoundGenerators = [];

    // {Array<{smallDeflectionSoundClip, largeDeflectionSoundClip}} - sound generators used in INDIVIDUAL_CROSS_FADE
    // mode, only populated in that mode
    const individualCrossFadeSoundGeneratorPairs = [];

    // {SoundClip[]} - sound generators used in INDIVIDUAL_DISCRETE mode, only populated in that mode
    let discreteSoundGenerators = [];

    // convenience variable
    const globalConfigProps = phet.ballonsAndStaticElectricity.chargeDeflectionSoundGeneratorInfo.configurationProperties;

    // Closure for mapping a sound generator index to a charge, necessary because there may be fewer sound generators
    // than charges.
    const getChargeForSoundGenerator = soundGeneratorIndex => {
      const spacing = wallCharges.length / ( globalConfigProps.numberOfDiscreteSoundGeneratorsProperty.value + 1 );
      return Math.floor( ( soundGeneratorIndex + 1 ) * spacing );
    };

    // closure for calculating normalized charge deflection for a specified charge index
    const getNormalizedChargeDeflection = chargeIndex =>
      Math.min(
        originalChargePositions[ chargeIndex ].distance( wallCharges[ chargeIndex ].positionProperty.value ) / maxChargeDeflection,
        1
      );

    // sound generation mode where the produced sound cross fades between two sounds based on the most deflected charge
    if ( options.soundGenerationMode === SoundGenerationMode.COLLECTIVE_CROSS_FADE ) {

      // Create and hook up the two sound clips that will be cross faded based on the amount of deflection.
      const smallDeflectionSoundClip = new SoundClip( CONTINUOUS_SOURCE_SOUNDS[ options.continuousSoundIndex ], { loop: true } );
      smallDeflectionSoundClip.connect( amplitudeModulator.getConnectionPoint() );
      const largeDeflectionSoundClip = new SoundClip( CONTINUOUS_SOURCE_SOUNDS[ options.continuousSoundIndex + 1 ], { loop: true } );
      largeDeflectionSoundClip.connect( amplitudeModulator.getConnectionPoint() );

      // Start and stop the loops based on whether charges are moving and the balloon positions are valid.
      Property.multilink(
        [ chargesMovingProperty, chargedBalloonCloseEnoughProperty ],
        ( chargesMoving, chargedBalloonCloseEnough ) => {
          if ( chargedBalloonCloseEnough && chargesMoving && !smallDeflectionSoundClip.isPlaying ) {
            smallDeflectionSoundClip.play( dotRandom.nextDouble() * 0.1 );
            largeDeflectionSoundClip.play( dotRandom.nextDouble() * 0.1 );
          }
          else if ( smallDeflectionSoundClip.isPlaying ) {
            smallDeflectionSoundClip.stop();
            largeDeflectionSoundClip.stop();
          }
        }
      );

      // Cross fade between the two loops based on the amount of deflection.
      maxDeflectionProperty.link( max => {

        // Limit the max to 1, just to be safe.
        const limitedMax = Math.min( max, 1 );
        smallDeflectionSoundClip.setOutputLevel( 1 - limitedMax );
        largeDeflectionSoundClip.setOutputLevel( limitedMax );
      } );
    }

    // sound generation mode where sounds are hooked to individual charges and the pitch is varied based on deflection
    else if ( options.soundGenerationMode === SoundGenerationMode.INDIVIDUAL_PITCH ) {

      // Create the sound generators.
      _.times( NUMBER_OF_SOUND_GENERATORS_IN_INDIVIDUAL_MODES, () => {
        const soundClip = new SoundClip(
          CONTINUOUS_SOURCE_SOUNDS[ options.soundIndex ],
          {
            loop: true,

            // Each sound generator will contribute a fraction of the overall sound.
            initialOutputLevel: 1 / NUMBER_OF_SOUND_GENERATORS_IN_INDIVIDUAL_MODES
          }
        );
        soundClip.connect( amplitudeModulator.getConnectionPoint() );
        pitchChangingSoundGenerators.push( soundClip );
      } );

      // Start and stop the loops based on whether charges are moving and the balloon positions are valid.
      Property.multilink(
        [ chargesMovingProperty, chargedBalloonCloseEnoughProperty ],
        ( chargesMoving, chargedBalloonCloseEnough ) => {
          const shouldBePlaying = chargesMoving && chargedBalloonCloseEnough;
          pitchChangingSoundGenerators.forEach( soundGenerator => {
            if ( shouldBePlaying && !soundGenerator.isPlaying ) {
              soundGenerator.play( dotRandom.nextDouble() * 0.1 );
            }
            else if ( !shouldBePlaying && soundGenerator.isPlaying ) {
              soundGenerator.stop();
            }
          } );
        }
      );
    }

    // sound generation mode where sounds are hooked to individual charges and cross faded based on deflection
    else if ( options.soundGenerationMode === SoundGenerationMode.INDIVIDUAL_CROSS_FADE ) {

      // Output level for the individual sound generators, lower for larger number of sound generators.
      const initialOutputLevel = 1 / ( NUMBER_OF_SOUND_GENERATORS_IN_INDIVIDUAL_MODES * 2 );

      // Create the sound generator cross-fade pairs.
      _.times( NUMBER_OF_SOUND_GENERATORS_IN_INDIVIDUAL_MODES, () => {

        // The larger the number of sound generators is, the small contribution each one makes to the overall sound.
        const smallDeflectionSoundClip = new SoundClip(
          CONTINUOUS_SOURCE_SOUNDS[ options.soundIndex ],
          {
            loop: true,
            initialOutputLevel: initialOutputLevel
          }
        );
        smallDeflectionSoundClip.connect( amplitudeModulator.getConnectionPoint() );
        const largeDeflectionSoundClip = new SoundClip(
          CONTINUOUS_SOURCE_SOUNDS[ options.soundIndex + 1 ],
          {
            loop: true,
            initialOutputLevel: initialOutputLevel
          }
        );
        largeDeflectionSoundClip.connect( amplitudeModulator.getConnectionPoint() );
        individualCrossFadeSoundGeneratorPairs.push( {
          smallDeflectionSoundClip: smallDeflectionSoundClip,
          largeDeflectionSoundClip: largeDeflectionSoundClip
        } );
      } );

      // Start and stop the loops based on whether charges are moving and the balloon positions are valid.
      Property.multilink(
        [ chargesMovingProperty, chargedBalloonCloseEnoughProperty ],
        ( chargesMoving, chargedBalloonCloseEnough ) => {
          const shouldBePlaying = chargesMoving && chargedBalloonCloseEnough;
          individualCrossFadeSoundGeneratorPairs.forEach( soundGeneratorPair => {
            if ( shouldBePlaying ) {
              soundGeneratorPair.smallDeflectionSoundClip.play( dotRandom.nextDouble() * 0.1 );
              soundGeneratorPair.largeDeflectionSoundClip.play( dotRandom.nextDouble() * 0.1 );
            }
            else {
              soundGeneratorPair.smallDeflectionSoundClip.stop();
              soundGeneratorPair.largeDeflectionSoundClip.stop();
            }
          } );
        }
      );
    }

      // Sound generation mode where individual charge positions are monitored and sounds are played when certain
    // threshold values are crossed.
    else if ( options.soundGenerationMode === SoundGenerationMode.INDIVIDUAL_DISCRETE ) {

      // Set the initial bins for each charge.
      wallCharges.forEach( ( wallCharge, index ) => {
        chargeDeflectionBins[ index ] = mapNormalizedDeflectionToBin( getNormalizedChargeDeflection( index ) );
      } );

      // Create the discrete sound generators.  We create enough for all of the charges to be sonified, but only use as
      // many as is currently configured.
      phet.ballonsAndStaticElectricity.chargeDeflectionSoundGeneratorInfo.configurationProperties
        .discreteSoundSourceProperty.link( soundSource => {

        // Get rid of any previously created sound generators.
        discreteSoundGenerators.forEach( soundGenerator => {
          soundGenerator.disconnect( this.masterGainNode );
          soundGenerator.dispose();
        } );
        discreteSoundGenerators = [];

        // Create the sound generators that will produce the individual discrete sounds.
        _.times( wallCharges.length, () => {
          const soundClip = new SoundClip(
            soundSource,
            {
              // Only allow sounds to play when the balloon is close enough to the wall.
              enableControlProperties: [ chargedBalloonCloseEnoughProperty ],

              // We're going to be changing the playback rate as charges get more deflected, but those changes shouldn't
              // affect sounds that are already playing.
              rateChangesAffectPlayingSounds: false
            }
          );
          soundClip.connect( this.masterGainNode );
          discreteSoundGenerators.push( soundClip );
        } );
      } );

      // Adjust the volume of the individual discrete sound generators based on how many of them are being used.
      globalConfigProps.numberOfDiscreteSoundGeneratorsProperty.link( numberInUse => {
        const outputLevel = 1 / Math.pow( numberInUse, 0.5 );
        discreteSoundGenerators.forEach( dsg => {
          dsg.setOutputLevel( outputLevel );
        } );
      } );
    }

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

      // Update the amplitude modulator depth.  This effect is used when a balloon is being dragged along the edge of
      // the wall, thus changing the charges, but not doing much to the max deflection.
      if ( options.soundGenerationMode === SoundGenerationMode.COLLECTIVE_CROSS_FADE ||
           options.soundGenerationMode === SoundGenerationMode.INDIVIDUAL_CROSS_FADE ) {
        let modulationDepth = 0;
        if ( chargesMovingProperty.value &&
             ( ( balloons[ 0 ].touchingWallProperty.value && balloons[ 0 ].dragVelocityProperty.value.magnitude > 0 ) ||
               ( balloons[ 1 ].touchingWallProperty.value && balloons[ 1 ].dragVelocityProperty.value.magnitude > 0 ) ) ) {
          modulationDepth = 0.8;
        }
        amplitudeModulator.depthProperty.set( modulationDepth );
      }

      // Update the pitches of each of the pitch-based sound generators, if any.
      if ( options.soundGenerationMode === SoundGenerationMode.INDIVIDUAL_PITCH ) {

        assert && assert( pitchChangingSoundGenerators.length > 0 );

        pitchChangingSoundGenerators.forEach( ( soundGenerator, index ) => {

          // Figure out the charge to which this sound generator corresponds.
          const chargeIndex = getChargeForSoundGenerator( index );

          // How deflected is this charge?
          const normalizedDeflection = getNormalizedChargeDeflection( chargeIndex );

          // Set the pitch for this sound generator based on the deflection.
          soundGenerator.setPlaybackRate( 1 + ( normalizedDeflection * ( options.pitchMultiplier - 1 ) ) );
        } );
      }

      // Update the cross-fade of each of the cross-fade-based sound generator pairs, if any.
      if ( options.soundGenerationMode === SoundGenerationMode.INDIVIDUAL_CROSS_FADE ) {

        assert && assert( individualCrossFadeSoundGeneratorPairs.length > 0 );

        individualCrossFadeSoundGeneratorPairs.forEach( ( soundGeneratorPair, index ) => {

          // Figure out the charge to which this sound generator pair corresponds.
          const chargeIndex = getChargeForSoundGenerator( index );

          // How deflected is this charge?
          const normalizedDeflection = getNormalizedChargeDeflection( chargeIndex );

          // Set the cross fade for this pair.
          soundGeneratorPair.smallDeflectionSoundClip.setOutputLevel( 1 - normalizedDeflection );
          soundGeneratorPair.largeDeflectionSoundClip.setOutputLevel( normalizedDeflection );
        } );
      }

      // If in discrete mode, check for any crossings of the thresholds that would cause sounds to be played.
      if ( options.soundGenerationMode === SoundGenerationMode.INDIVIDUAL_DISCRETE ) {

        // For each active sound generator, first determine the charge to which it maps, then figure out if that charge
        // has changed bins since the last time we checked.
        _.times( globalConfigProps.numberOfDiscreteSoundGeneratorsProperty.value, index => {

          const discreteSoundGenerator = discreteSoundGenerators[ index ];

          // Figure out the charge to which this sound generator corresponds.
          const chargeIndex = getChargeForSoundGenerator( index );

          const binForThisCharge = mapNormalizedDeflectionToBin( getNormalizedChargeDeflection( chargeIndex ) );
          if ( binForThisCharge !== chargeDeflectionBins[ chargeIndex ] ) {

            // The bin changed for the charge associated with this sound generator.  Map the bin to a playback rate and
            // play the sound.
            const mappingFunction = phet.ballonsAndStaticElectricity.chargeDeflectionSoundGeneratorInfo.configurationProperties.discreteSoundPitchAlgorithmProperty.value;
            const playbackRate = mappingFunction( binForThisCharge );
            discreteSoundGenerator.setPlaybackRate( playbackRate, 0 );
            discreteSoundGenerator.play();
          }
        } );

        // Update the bins for all wall charges.
        wallCharges.forEach( ( wallCharge, index ) => {
          chargeDeflectionBins[ index ] = mapNormalizedDeflectionToBin( getNormalizedChargeDeflection( index ) );
        } );
      }

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

  const unadjustedBinSize = 1 / numBinsProperty.value;

  // The size of the first bin can be adjusted to make initial movements happen earlier (or later, I suppose).
  const firstBinSize =
    unadjustedBinSize *
    phet.ballonsAndStaticElectricity.chargeDeflectionSoundGeneratorInfo.configurationProperties
      .discreteSoundBinZeroProportionProperty.value;

  const adjustedBinSize = ( 1 - firstBinSize ) / ( numBinsProperty.value - 1 );

  let bin = 0;
  if ( normalizedDeflection > firstBinSize ) {

    // This charge is not in the first bin.  Which is it in?
    bin = Math.min(
      Math.floor( ( normalizedDeflection - firstBinSize ) / adjustedBinSize ) + 1,
      numBinsProperty.value - 1
    );
  }

  return bin;
};

// statics
ChargeDeflectionSoundGenerator.SoundGenerationMode = SoundGenerationMode;

balloonsAndStaticElectricity.register( 'ChargeDeflectionSoundGenerator', ChargeDeflectionSoundGenerator );
export default ChargeDeflectionSoundGenerator;