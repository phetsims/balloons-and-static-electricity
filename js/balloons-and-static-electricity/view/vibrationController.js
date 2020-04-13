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
import PlayAreaMap from '../model/PlayAreaMap.js';

class VibrationController {
  constructor() {}

  /**
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

      // model.yellowBalloon.chargeProperty.link( ( charge, oldCharge ) => {
      //   if ( charge < oldCharge ) {
      //     vibrationManager.vibrate( 0.1 );
      //   }
      // } );
    }

    // A vibration paradigm that reports feedback 1lting from user interaction. This design provides feedback
    // based on the position of the balloon in relation to other objects.
    // TODO: For some reason, this paradigm has poor performance and takes ~10 seconds for vibration to begin
    if ( paradigmChoice === 'result' ) {
      const activeFrequency = 50;

      model.yellowBalloon.positionProperty.link( position => {

        if ( model.yellowBalloon.isDraggedProperty.get() ) {

          if ( model.yellowBalloon.isCharged() ) {

            if ( activeFrequency ) {
              const sweaterToPlayAreaCenter = PlayAreaMap.X_POSITIONS.AT_CENTER_PLAY_AREA - model.yellowBalloon.width / 2 - model.sweater.bounds.right;
              const sweaterDistanceFunction = new LinearFunction( sweaterToPlayAreaCenter, 0, 0, 1 );
              const horizontalDistanceToSweater = model.getHorizontalDistanceFromBalloonToSweater( model.yellowBalloon );
              let intensity = sweaterDistanceFunction( horizontalDistanceToSweater );

              intensity = Utils.clamp( intensity, 0, 1 );
              console.log( activeFrequency, intensity );
              vibrationManager.vibrateAtFrequencyForever( activeFrequency, intensity );
            }
          }
        }
      } );

      // // the vibration needs to update with the state of these Properties
      // const resultProperties = [
      //   yellowBalloon.playAreaColumnProperty,
      //   yellowBalloon.onSweaterProperty,
      //   yellowBalloon.isDraggedProperty
      // ];
      // Property.multilink( resultProperties, ( column, onSweater, isDragged ) => {
      //   if ( isDragged ) {
      //     if ( onSweater ) {
      //
      //       // if dragging on the sweater, begin a persistent vibration
      //       vibrationManager.vibrateAtFrequencyForever( 5 );
      //     }
      //     else if ( yellowBalloon.isCharged() ) {
      //
      //       // otherwise, pattern dependent on how close balloon is to the sweater and wall
      //       const columnRange = PlayAreaMap.COLUMN_RANGES[ column ];
      //
      //       if ( columnRange === PlayAreaMap.COLUMN_RANGES.LEFT_PLAY_AREA ) {
      //
      //         // TODO: Is this 10 hz?
      //         // vibrationManager.vibrateAtFrequencyForever( 50 );
      //         activeFrequency = 50;
      //       }
      //       else if ( columnRange === PlayAreaMap.COLUMN_RANGES.RIGHT_PLAY_AREA ) {
      //
      //         // TODO: is this 25 hz?
      //         // vibrationManager.vibrateAtFrequencyForever( 25 );
      //         activeFrequency = 25;
      //       }
      //       else if ( columnRange === PlayAreaMap.COLUMN_RANGES.CENTER_PLAY_AREA ) {
      //         activeFrequency = 100;
      //         // vibrationManager.vibrateWithCustomPatternForever( 100 );
      //       }
      //     }
      //     else {
      //       activeFrequency = null;
      //       // vibrationManager.stop();
      //     }
      //   }
      //   else {
      //
      //     // stop all vibration upon release
      //     vibrationManager.stop();
      //   }
      // } );
    }
  }
}

// create and register the singleton instance
const vibrationController = new VibrationController();
balloonsAndStaticElectricity.register( 'vibrationController', vibrationController );
export default vibrationController;
