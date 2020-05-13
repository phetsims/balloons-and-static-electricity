// Copyright 2019-2020, University of Colorado Boulder

/**
 * Controls vibration in balloons-and-static-electricity through use of tappi's vibrationManager.
 *
 * @author Jen Tennison
 * @author Jesse Greenberg
 */

import timer from '../../../../axon/js/timer.js';
import LinearFunction from '../../../../dot/js/LinearFunction.js';
import Utils from '../../../../dot/js/Utils.js';
import VibrationManageriOS from '../../../../tappi/js/VibrationManageriOS.js';
import balloonsAndStaticElectricity from '../../balloonsAndStaticElectricity.js';

class VibrationController {
  constructor() {}

  /**
   * @public
   * @param {BASEModel} model
   */
  initialize( model ) {
    const paradigmChoice = phet.chipper.queryParameters.vibration;
    const vibrationManager = new VibrationManageriOS();

    if ( paradigmChoice === 'objects' ) {
      model.scanningPropertySet.sweaterDetectedProperty.lazyLink( detected => {
        if ( detected ) {
          vibrationManager.vibrateForever();
        }
        else {
          vibrationManager.stop();
        }
      } );

      model.scanningPropertySet.wallDetectedProperty.lazyLink( detected => {
        if ( detected ) {
          vibrationManager.vibrateAtFrequencyForever( 25 );
        }
        else {
          vibrationManager.stop();
        }
      } );

      model.scanningPropertySet.yellowBalloonDetectedProperty.lazyLink( detected => {
        if ( detected ) {
          vibrationManager.vibrateAtFrequencyForever( 50 );
        }
        else {
          vibrationManager.stop();
        }
      } );
    }

    if ( paradigmChoice === 'interaction' ) {
      model.yellowBalloon.chargeProperty.link( chargeValue => {
        if ( chargeValue < 0 ) {
          vibrationManager.vibrateAtFrequency( .250, 50 );
        }
      } );
    }

    if ( paradigmChoice === 'manipulation' ) {

      // continuous vibration for as long as the balloon is grabbed
      model.yellowBalloon.isDraggedProperty.link( isDragged => {
        if ( isDragged ) {

          vibrationManager.vibrate( 0.25 );

          timer.setTimeout( () => {
            vibrationManager.vibrateAtFrequencyForever( 50 );
          }, 250 );
        }
        else {
          vibrationManager.stop();
        }
      } );
    }

    // Indicate every time that a charge has been picked up
    if ( paradigmChoice === 'interaction-changes' ) {

      // interval for vibration requests, smaller values are more accurate but worse for performace.
      // Every vibration request produces a small graphical stutter.
      const chargePickupInterval = 0.5;
      let elapsedTime = 0;
      let currentCharge = 0;
      let previousCharge = 0;

      // It is bad for performance to requently request vibration, so we determine how many
      // charges have been picked up per time interval and request a vibration pattern
      // once based on this information
      model.stepEmitter.addListener( dt => {
        elapsedTime += dt;

        if ( elapsedTime > chargePickupInterval ) {
          currentCharge = model.yellowBalloon.chargeProperty.get();

          // see how many charges we picked up since last time
          const chargeDelta = currentCharge - previousCharge;

          // only vibrate if we have gained electrons (negative charge), not on reset
          if ( chargeDelta < 0 ) {
            const vibrationPattern = [];
            for ( let i = 0; i < Math.abs( chargeDelta ); i++ ) {
              vibrationPattern.push( 0.01 );
              vibrationPattern.push( 0.01 );
            }
            console.log( vibrationPattern );

            const duration = _.reduce( vibrationPattern, ( sum, value ) => sum + value, 0 );
            vibrationManager.vibrateWithCustomPatternDuration( vibrationPattern, duration );
          }

          previousCharge = currentCharge;
          elapsedTime = 0;
        }
      } );
    }

    // paradigm provides feedback about the state of the balloon based on the results of user interaction
    // vibration is driven by the potential energy of the balloon, indicating the force on the balloon and motion,
    // should the user decide to drop it
    if ( paradigmChoice === 'result' ) {

      let currentTime = 0;

      // NOTE: Ever since we switch to controlling intensity rather than frequency, performance is way
      // faster, so it is possible this could be linked to position Property rather than polling
      // with the stepEmitter below
      const refreshRate = 0.01; // in seconds

      // to create a function that maps applied force on the balloon to vibration intensity
      const maxForce = 0.00855; // by inspection - TODO: Calculate this

      // There is no way to determine yet whether or not the vibration manager, so tracking in this case
      // specifically
      let vibrating = false;

      model.stepEmitter.addListener( dt => {
        currentTime += dt;

        if ( currentTime >= refreshRate ) {
          const totalForce = model.yellowBalloon.getTotalForce();
          const totalForceMagnitude = totalForce.magnitude;
          if ( totalForceMagnitude !== 0 && model.yellowBalloon.isDraggedProperty.get() ) {

            // intensities less than 0.4 cannot be felt
            const relativeForceFunction = new LinearFunction( 0, maxForce, 0.4, 1 );

            const intensity = Utils.clamp( relativeForceFunction( totalForceMagnitude ), 0, 1 );

            if ( !vibrating ) {
              vibrationManager.vibrateAtFrequencyForever( 25 );
              vibrating = true;
            }

            vibrationManager.setVibrationIntensity( intensity );
          }
          else if ( vibrating ) {
            vibrationManager.stop();
            vibrating = false;
          }

          currentTime = 0;
        }
      } );
    }
  }
}

// create and register the singleton instance
const vibrationController = new VibrationController();
balloonsAndStaticElectricity.register( 'vibrationController', vibrationController );
export default vibrationController;
