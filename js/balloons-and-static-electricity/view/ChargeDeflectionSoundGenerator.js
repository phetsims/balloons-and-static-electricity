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
import merge from '../../../../phet-core/js/merge.js';
import AmplitudeModulator from '../../../../tambo/js/AmplitudeModulator.js';
import phetAudioContext from '../../../../tambo/js/phetAudioContext.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import SoundGenerator from '../../../../tambo/js/sound-generators/SoundGenerator.js';
import balloonsAndStaticElectricity from '../../balloonsAndStaticElectricity.js';
import smallDeflectionSound from '../../../sounds/charges-wall-electronic-hum-loop_wav.js';
import largeDeflectionSound from '../../../sounds/charges-wall-saturated-electronic-hum-loop_wav.js';
// import smallDeflectionSound from '../../../sounds/charges-wall-sine-wave-loop_wav.js';
// import largeDeflectionSound from '../../../sounds/charges-wall-saturated-sine-wave-loop_wav.js';

// const
const CHARGES_STILL_TIME = 0.5; // number of seconds where, if no charge motion is detected, charges are considered still

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

    options = merge( {
      initialOutputLevel: 0.2,
      enableControlProperties: [ isWallVisibleProperty ],

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
    // list of charges.
    const maxDeflectionProperty = new NumberProperty( 0 );

    // A Property that is only true when a charged balloon is past the minimum X value, used as a gating function to
    // prevent sound generation when the balloons are far from the wall.
    const chargedBalloonCloseEnoughProperty = new DerivedProperty(
      balloons.map( balloon => balloon.positionProperty ),
      ( pos0, pos1 ) => ( pos0.x > options.minBalloonXValue && balloons[ 0 ].chargeProperty.value < 0 ) ||
                        ( pos1.x > options.minBalloonXValue && balloons[ 1 ].chargeProperty.value < 0 )
    );

    // Create an internal gain stage that will be used to control the output level.
    const outputLevelGainNode = phetAudioContext.createGain();
    outputLevelGainNode.connect( this.masterGainNode );

    // Create an amplitude modulator and put it in the signal path.  This is used to modulate the output sound when a
    // charged balloon is being dragged along the wall.
    const amplitudeModulator = new AmplitudeModulator();
    amplitudeModulator.connect( outputLevelGainNode );

    // Create and hook up the two sound clips that will be cross faded based on the amount of deflection.
    const smallDeflectionSoundClip = new SoundClip( smallDeflectionSound, { loop: true } );
    smallDeflectionSoundClip.connect( amplitudeModulator.getConnectionPoint() );
    const largeDeflectionSoundClip = new SoundClip( largeDeflectionSound, { loop: true } );
    largeDeflectionSoundClip.connect( amplitudeModulator.getConnectionPoint() );

    // Start and stop the loops based on whether charges are moving and the balloon positions are valid.
    Property.multilink(
      [ chargesMovingProperty, chargedBalloonCloseEnoughProperty ],
      ( chargesMoving, chargedBalloonCloseEnough ) => {
        if ( chargedBalloonCloseEnough && chargesMoving && !smallDeflectionSoundClip.isPlaying ) {
          smallDeflectionSoundClip.play();
          largeDeflectionSoundClip.play();
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
      let modulationDepth = 0;
      if ( chargesMovingProperty.value &&
           ( ( balloons[ 0 ].touchingWallProperty.value && balloons[ 0 ].dragVelocityProperty.value.magnitude > 0 ) ||
             ( balloons[ 1 ].touchingWallProperty.value && balloons[ 1 ].dragVelocityProperty.value.magnitude > 0 ) ) ) {
        modulationDepth = 0.9;
      }
      amplitudeModulator.depthProperty.set( modulationDepth );
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

balloonsAndStaticElectricity.register( 'ChargeDeflectionSoundGenerator', ChargeDeflectionSoundGenerator );
export default ChargeDeflectionSoundGenerator;