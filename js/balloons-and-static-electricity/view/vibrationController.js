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
  const vibrationManager = require( 'TAPPI/vibrationManager' );
  const VibrationPatterns = require( 'TAPPI/VibrationPatterns' );

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
    }
  }

  // create and register the singleton instance
  const vibrationController = new VibrationController();
  return balloonsAndStaticElectricity.register( 'vibrationController', vibrationController );
} );
