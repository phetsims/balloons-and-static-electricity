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
  //const Property = require( 'AXON/Property' );

  class VibrationController {
    constructor() {}

    /**
     * @param {BASEModel} model
     */
    initialize( model ) {
      const paradigmChoice = phet.chipper.queryParameters.vibration;

      if ( paradigmChoice === 'objects' ) {
        // short buzz notification when grabbing the balloon
        model.yellowBalloon.isDraggedProperty.link( isDragged => {
          if ( isDragged ) {
            vibrationManager.startTimedVibrate( 250, VibrationPatterns.HZ_25 );
          }
        } );

          // how to check if inside sweater area?
          model.yellowBalloon.onSweaterProperty.link( isInsideSweater => {
            if( isInsideSweater ) {
              vibrationManager.startVibrate( VibrationPatterns.HZ_10 );
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
    }
  }

  // create and register the singleton instance
  const vibrationController = new VibrationController();
  return balloonsAndStaticElectricity.register( 'vibrationController', vibrationController );
} );
