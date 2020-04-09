// Copyright 2019-2020, University of Colorado Boulder

/**
 * Controls vibration in balloons-and-static-electricity through use of tappi's vibrationManager.
 *
 * @author Jen Tennison
 * @author Jesse Greenberg
 */

import Property from '../../../../axon/js/Property.js';
import VibrationManageriOS from '../../../../tappi/js/VibrationManageriOS.js';
import VibrationPatterns from '../../../../tappi/js/VibrationPatterns.js';
import balloonsAndStaticElectricity from '../../balloonsAndStaticElectricity.js';
import PlayAreaMap from '../model/PlayAreaMap.js';
import timer from '../../../../axon/js/timer.js';

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

    // Works OK, but with poor performance and charges can be picked up far more frequently
    // than the duration of the vibration. For next time, try polling and pass a vibration
    // pattern that indicates the number of charges that have been picked up per time unit.
    if ( paradigmChoice === 'interaction-changes' ) {
      const chargePickupInterval = ( 1 / 60 ) * 2; // assuming 60 fps
      let elapsedTime = 0;
      let currentCharge = 0;
      let previousCharge = 0;

      model.stepEmitter.addListener( dt => {
        elapsedTime += dt;

        if ( elapsedTime > chargePickupInterval ) {
          currentCharge = model.yellowBalloon.chargeProperty.get();

          // see how many charges we picked up since last time
          const chargesPickedUp = Math.abs( currentCharge - previousCharge );

          const vibrationPattern = [];
          for ( let i = 0; i < chargesPickedUp; i++ ) {
            vibrationPattern.push( 0.1 );
            vibrationPattern.push( 0.1 );
          }
          console.log( vibrationPattern );

          const duration = _.reduce( vibrationPattern, ( sum, value ) => sum + value, 0 );
          vibrationManager.vibrateWithCustomPatternDuration( vibrationPattern, duration );

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

    // A vibration paradigm that reports feedback resulting from user interaction. This design provides feedback
    // based on the position of the balloon in relation to other objects.
    // TODO: For some reason, this paradigm has poor performance and takes ~10 seconds for vibration to begin
    if ( paradigmChoice === 'result' ) {
      const yellowBalloon = model.yellowBalloon;

      // the vibration needs to update with the state of these Properties
      const resultProperties = [
        yellowBalloon.playAreaColumnProperty,
        yellowBalloon.onSweaterProperty,
        yellowBalloon.isDraggedProperty
      ];
      Property.multilink( resultProperties, ( column, onSweater, isDragged ) => {
        if ( isDragged ) {
          if ( onSweater ) {

            // if dragging on the sweater, begin a persistent vibration
            vibrationManager.vibrateAtFrequencyForever( 5 );
          }
          else if ( yellowBalloon.isCharged() ) {

            // otherwise, pattern dependent on how close balloon is to the sweater and wall
            const columnRange = PlayAreaMap.COLUMN_RANGES[ column ];

            if ( columnRange === PlayAreaMap.COLUMN_RANGES.LEFT_PLAY_AREA ) {

              // TODO: Is this 10 hz?
              vibrationManager.vibrateAtFrequencyForever( 50 );
            }
            else if ( columnRange === PlayAreaMap.COLUMN_RANGES.RIGHT_PLAY_AREA ) {

              // TODO: is this 25 hz?
              vibrationManager.vibrateAtFrequencyForever( 25 );
            }
            else if ( columnRange === PlayAreaMap.COLUMN_RANGES.CENTER_PLAY_AREA ) {
              vibrationManager.vibrateWithCustomPatternForever( VibrationPatterns.HEARTBEAT );
            }
          }
          else {
            vibrationManager.stop();
          }
        }
        else {

          // stop all vibration upon release
          vibrationManager.stop();
        }
      } );
    }


    // TODO: Interaction changes. If we want to buzz per electron pickup, we need to resolve
    // the isue where VirationManager.swift doesn't support exact durations
  }
}

// create and register the singleton instance
const vibrationController = new VibrationController();
balloonsAndStaticElectricity.register( 'vibrationController', vibrationController );
export default vibrationController;