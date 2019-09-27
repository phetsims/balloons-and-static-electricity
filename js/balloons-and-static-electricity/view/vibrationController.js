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
      //const paradigmChoice = phet.chipper.queryParameters.vibration;

      model.yellowBalloon.chargeProperty.link( chargeValue => {
        if( chargeValue < 0 ) {
          vibrationManager.startTimedVibrate( 250, VibrationPatterns.HZ_10 );
        }
      } );

    }
  }

  // create and register the singleton instance
  const vibrationController = new VibrationController();
  return balloonsAndStaticElectricity.register( 'vibrationController', vibrationController );
} );
