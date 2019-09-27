// Copyright 2019, University of Colorado Boulder

/**
 * Controls vibration in balloons-and-static-electricity through use of tappi's vibrationManager. There are three paradigms
 * for design that are being explored, all are implemented in this file.
 *
 * Singleton class as one instance controls all vibration in the simulation.
 *
 * 1) Objects - Haptic feedback is used to indicate to a user where objects are in the scene.
 * 2) Interaction - Haptic feedback is used to indicate successful user interaction.
 * 3) State - Haptic feedback is used to indicate current state of sim objects.
 *
 * Each implemented below, selected by query parameter.
 *
 * @author Jesse Greenberg
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
          vibrationManager.startTimedVibrate(250, HZ_10);
        }
      })

    }
  }

  // create and register the singleton instance
  const vibrationController = new VibrationController();
  return balloonsAndStaticElectricity.register( 'vibrationController', vibrationController );
} );
