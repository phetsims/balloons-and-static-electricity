// Copyright 2013-2015, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Sim = require( 'JOIST/Sim' );
  var Screen = require( 'JOIST/Screen' );
  var BalloonsAndStaticElectricityModel = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/BalloonsAndStaticElectricityModel' );
  var BalloonsAndStaticElectricityView = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/BalloonsAndStaticElectricityView' );
  var BASEConstants = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/BASEConstants' );
  var SimLauncher = require( 'JOIST/SimLauncher' );
  var BASEKeyboardHelpContent = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/BASEKeyboardHelpContent' );
  var Tandem = require( 'TANDEM/Tandem' );

  // strings
  var balloonsAndStaticElectricityTitleString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity.title' );

  SimLauncher.launch( function() {

    var tandem = Tandem.createRootTandem();

    var simOptions = {
      credits: {
        leadDesign: 'Noah Podolefsky & Sam Reid',
        softwareDevelopment: 'Sam Reid, John Blanco',
        team: 'Wendy Adams, Ariel Paul, Kathy Perkins, Trish Loeblein',
        graphicArts: 'Sharon Siman-Tov',
        thanks: 'Thanks to Mobile Learner Labs for working with the PhET development team to convert this simulation to HTML5.'
      },
      accessibility: true,
      keyboardHelpNode: new BASEKeyboardHelpContent( {
        maxWidth: 720,
        tandem: tandem.createTandem( 'sim.keyboardHelpNode' )
      } )
    };

    var balloonsAndStaticElectricityScreenTandem = tandem.createTandem( 'balloonsAndStaticElectricityScreen' );

    //Create and start the sim
    new Sim( balloonsAndStaticElectricityTitleString, [
      new Screen(
        function() {
          return new BalloonsAndStaticElectricityModel(
            768,
            504,
            balloonsAndStaticElectricityScreenTandem.createTandem( 'balloonsAndStaticElectricityModel' ) );
        },
        function( model ) {
          return new BalloonsAndStaticElectricityView(
            model,
            balloonsAndStaticElectricityScreenTandem.createTandem( 'balloonsAndStaticElectricityView' )
          );
        },
        {
          backgroundColorProperty: BASEConstants.backgroundColorProperty,
          tandem: balloonsAndStaticElectricityScreenTandem
        }
      )
    ], simOptions ).start();
  } );
} );
