// Copyright 2019, University of Colorado Boulder

/**
 * Controls vibration in balloons-and-static-electricity through use of tappi's vibrationManager.
 *
 * @author Jen Tennison
 */
define( require => {
  'use strict';

  // modules
  const balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );
  const PlayAreaMap = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/PlayAreaMap' );
  const vibrationManager = require( 'TAPPI/vibrationManager' );
  const VibrationPatterns = require( 'TAPPI/VibrationPatterns' );
  const Property = require( 'AXON/Property' );

  class VibrationController {
    constructor() {}

    /**
     * @param {BASEModel} model
     */
    initialize( model ) {
      const paradigmChoice = phet.chipper.queryParameters.vibration;

      if ( paradigmChoice === 'objects' ) {
        model.scanningPropertySet.sweaterDetectedProperty.link( detected => {
          if ( detected ) {
            vibrationManager.startVibrate();
          } else {
            vibrationManager.stopVibrate();
          }
        } );

        model.scanningPropertySet.wallDetectedProperty.link( detected => {
          if ( detected ) {
            vibrationManager.startVibrate( VibrationPatterns.HZ_25 );
          } else {
            vibrationManager.stopVibrate();
          }
        } );

        model.scanningPropertySet.yellowBalloonDetectedProperty.link( detected => {
          if ( detected ) {
            vibrationManager.startVibrate( VibrationPatterns.HZ_50 );
          } else {
            vibrationManager.stopVibrate();
          }
        } );

      }

      if ( paradigmChoice === 'interaction' ) {
        model.yellowBalloon.chargeProperty.link( chargeValue => {
          if( chargeValue < 0 ) {
            vibrationManager.startTimedVibrate( 250, VibrationPatterns.HZ_10 );
          }
        } );
      }

      if ( paradigmChoice === 'state' ) {
        // constant buzz depending on charges present on balloon
        model.yellowBalloon.chargeProperty.link( chargeValue => {
          if( chargeValue < 0 && chargeValue >= -10) {
            vibrationManager.startVibrate( VibrationPatterns.HZ_10 );
          } else if ( chargeValue < -10) {
            vibrationManager.startVibrate( VibrationPatterns.HZ_25 );
          }
        } );
      }

      if ( paradigmChoice === 'manipulation' ) {

        // 250 ms pulse when finger goes over the balloon
        model.scanningPropertySet.yellowBalloonDetectedProperty.link( detected => {
          if ( detected ) {
            vibrationManager.startTimedVibrate( 250 );
          }
        } );

        // continuous vibration for as long as the balloon is grabbed
        model.yellowBalloon.isDraggedProperty.link( isDragged => {
          if ( isDragged ) {

            // TODO: We need to support faster vibrations, changes in tappi coming to allow this, when that is done
            // this should change to a 50 hz vibration.
            vibrationManager.startVibrate( VibrationPatterns.HZ_10 );
          }
          else {
            vibrationManager.stopVibrate();
          }
        } );
      }

      // A vibration paradigm that reports feedback resulting from user interaction. This design provides feedback
      // based on the position of the balloon in relation to other objects.
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
              vibrationManager.startVibrate();
            }
            else if ( yellowBalloon.isCharged() ) {

              // otherwise, pattern dependent on how close balloon is to the sweater and wall
              const columnRange = PlayAreaMap.COLUMN_RANGES[ column ];

              if ( columnRange === PlayAreaMap.COLUMN_RANGES.LEFT_PLAY_AREA ) {
                vibrationManager.startVibrate( VibrationPatterns.HZ_10 );
              }
              else if ( columnRange === PlayAreaMap.COLUMN_RANGES.RIGHT_PLAY_AREA ) {
                vibrationManager.startVibrate( VibrationPatterns.HZ_25 );
              }
              else if ( columnRange === PlayAreaMap.COLUMN_RANGES.CENTER_PLAY_AREA ) {
                vibrationManager.startVibrate( VibrationPatterns.HZ_5 );
              }
            }
            else {
              vibrationManager.stopVibrate();
            }
          }
          else {

            // stop all vibration upon release
            vibrationManager.stopVibrate();
          }
        } );
      }
    }
  }

  // create and register the singleton instance
  const vibrationController = new VibrationController();
  return balloonsAndStaticElectricity.register( 'vibrationController', vibrationController );
} );
