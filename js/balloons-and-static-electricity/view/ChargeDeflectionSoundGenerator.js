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
import Utils from '../../../../dot/js/Utils.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import merge from '../../../../phet-core/js/merge.js';
import AmplitudeModulator from '../../../../tambo/js/AmplitudeModulator.js';
import phetAudioContext from '../../../../tambo/js/phetAudioContext.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import SoundGenerator from '../../../../tambo/js/sound-generators/SoundGenerator.js';
import chargesOrganLoop from '../../../sounds/charges-organ-loop_wav.js';
import chargesOrganLoopOctaveUp from '../../../sounds/charges-organ-loop-one-octave-up_wav.js';
import chargesSynthLoop from '../../../sounds/charges-synthy-loop_wav.js';
import chargesSynthLoopOctaveUp from '../../../sounds/charges-synthy-loop-one-octave-up_wav.js';
import electronicHumUnsaturated from '../../../sounds/charges-wall-electronic-hum-loop_wav.js';
import electronicHumSaturated from '../../../sounds/charges-wall-saturated-electronic-hum-loop_wav.js';
import sineWaveSaturated from '../../../sounds/charges-wall-saturated-sine-wave-loop_wav.js';
import sineWaveUnsaturated from '../../../sounds/charges-wall-sine-wave-loop_wav.js';
import balloonsAndStaticElectricity from '../../balloonsAndStaticElectricity.js';

// const
const CHARGES_STILL_TIME = 0.5; // number of seconds where, if no charge motion is detected, charges are considered still
const SoundGenerationMode = Enumeration.byKeys( [ 'COLLECTIVE_CROSS_FADE', 'INDIVIDUAL_PITCH', 'INDIVIDUAL_CROSS_FADE' ] );

const SOURCE_SOUNDS = [
  electronicHumUnsaturated,
  electronicHumSaturated,
  sineWaveUnsaturated,
  sineWaveSaturated,
  chargesOrganLoop,
  chargesOrganLoopOctaveUp,
  chargesSynthLoop,
  chargesSynthLoopOctaveUp
];

const NUMBER_OF_SOUND_GENERATORS_IN_INDIVIDUAL_MODES = 1;

class ChargeDeflectionSoundGenerator extends SoundGenerator {

  /**
   * @param {MovablePointChargeModel[]} wallCharges
   * @param {number} maxChargeDeflection - the max amount that the charges are expected to move
   * @param {BalloonModel[]} balloons - the balloons modeled in the sim
   * @param {Property.<boolean>} isWallVisibleProperty
   * @param {Object} [options]
   */
  constructor( wallCharges, maxChargeDeflection, balloons, isWallVisibleProperty, options ) {

    assert && assert( balloons.length === 2, 'this assumes 2 balloons, found ' + balloons.length );

    // TODO: Much of the code below is in a prototype state while the sound design team works through a set of options
    //       that have been brainstormed.  Once a general approach has been decided upon, there will just be a single
    //       mode of sound generation, and all others should be eliminated.  See
    //       https://github.com/phetsims/balloons-and-static-electricity/issues/486.

    assert && assert( wallCharges.length >= NUMBER_OF_SOUND_GENERATORS_IN_INDIVIDUAL_MODES );

    options = merge( {
      soundGenerationMode: SoundGenerationMode.COLLECTIVE_CROSS_FADE,
      initialOutputLevel: 0.2,
      enableControlProperties: [ isWallVisibleProperty ],

      // {number} - index of the sound, or first sound of a cross-fade pair, to be used for sound generation
      soundIndex: 0,

      // {number} - a multiplier for how much the pitch should change when using pitch changes to indicate deflection
      pitchMultiplier: 2,

      // {number} - a minimum value for the X position of charged balloon, below which no sound is produced
      minBalloonXValue: 0

    }, options );

    super( options );

    // {Vector2[]} - list of original, non-deflected charge positions, used to determine the amount of deflection
    const originalChargePositions = wallCharges.map( wallCharge => wallCharge.positionProperty.value.copy() );

    // {Vector2[]} - list of previous charge positions, used to detect whether motion has occurred
    const previousChargePositions = wallCharges.map( wallCharge => wallCharge.positionProperty.value.copy() );

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

    // sound generation mode where the produced sound cross fades between two sounds based on the most deflected charge
    if ( options.soundGenerationMode === SoundGenerationMode.COLLECTIVE_CROSS_FADE ) {

      // Create and hook up the two sound clips that will be cross faded based on the amount of deflection.
      const smallDeflectionSoundClip = new SoundClip( SOURCE_SOUNDS[ options.soundIndex ], { loop: true } );
      smallDeflectionSoundClip.connect( amplitudeModulator.getConnectionPoint() );
      const largeDeflectionSoundClip = new SoundClip( SOURCE_SOUNDS[ options.soundIndex + 1 ], { loop: true } );
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
          SOURCE_SOUNDS[ options.soundIndex ],
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
          SOURCE_SOUNDS[ options.soundIndex ],
          {
            loop: true,
            initialOutputLevel: initialOutputLevel
          }
        );
        smallDeflectionSoundClip.connect( amplitudeModulator.getConnectionPoint() );
        const largeDeflectionSoundClip = new SoundClip(
          SOURCE_SOUNDS[ options.soundIndex + 1 ],
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

        // Check for changes versus the previous charge positions.
        if ( !wallChargePosition.equals( previousChargePositions[ index ] ) ) {
          chargesMovedThisStep = true;
          previousChargePositions[ index ].set( wallChargePosition );
        }
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
          const spacing = wallCharges.length / NUMBER_OF_SOUND_GENERATORS_IN_INDIVIDUAL_MODES;
          const chargeIndex = Utils.roundSymmetric( ( index + 0.499 ) * spacing );

          // How deflected is this charge?
          const normalizedDeflection =
            originalChargePositions[ chargeIndex ].distance( wallCharges[ chargeIndex ].positionProperty.value ) /
            maxChargeDeflection;

          // Set the pitch for this sound generator based on the deflection.
          soundGenerator.setPlaybackRate( 1 + ( normalizedDeflection * ( options.pitchMultiplier - 1 ) ) );
        } );
      }

      // Update the cross-fade of each of the cross-fade-based sound generator pairs, if any.
      if ( options.soundGenerationMode === SoundGenerationMode.INDIVIDUAL_CROSS_FADE ) {

        assert && assert( individualCrossFadeSoundGeneratorPairs.length > 0 );

        individualCrossFadeSoundGeneratorPairs.forEach( ( soundGeneratorPair, index ) => {

          // Figure out the charge to which this sound generator pair corresponds.
          const spacing = wallCharges.length / NUMBER_OF_SOUND_GENERATORS_IN_INDIVIDUAL_MODES;
          const chargeIndex = Utils.roundSymmetric( ( index + 0.499 ) * spacing );

          // How deflected is this charge?
          const normalizedDeflection =
            originalChargePositions[ chargeIndex ].distance( wallCharges[ chargeIndex ].positionProperty.value ) /
            maxChargeDeflection;

          // Set the cross fade for this pair.
          soundGeneratorPair.smallDeflectionSoundClip.setOutputLevel( 1 - normalizedDeflection );
          soundGeneratorPair.largeDeflectionSoundClip.setOutputLevel( normalizedDeflection );
        } );
      }
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

// statics
ChargeDeflectionSoundGenerator.SoundGenerationMode = SoundGenerationMode;

balloonsAndStaticElectricity.register( 'ChargeDeflectionSoundGenerator', ChargeDeflectionSoundGenerator );
export default ChargeDeflectionSoundGenerator;