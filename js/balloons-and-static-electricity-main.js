// Copyright 2002-2013, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  var Sim = require( 'JOIST/Sim' );
  var Screen = require( 'JOIST/Screen' );
  var BalloonsAndStaticElectricityModel = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/BalloonsAndStaticElectricityModel' );
  var BalloonsAndStaticElectricityView = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/BalloonsAndStaticElectricityView' );
  var SimLauncher = require( 'JOIST/SimLauncher' );
  var title = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity.title' );

  SimLauncher.launch( function() {

    var simOptions = {
      credits: {
        leadDesign: 'Noah Podolefsky & Sam Reid',
        softwareDevelopment: 'Sam Reid',
        team: 'Wendy Adams, Ariel Paul, Kathy Perkins, Trish Loeblein',
        graphicArts: 'Sharon Simon-Tov',
        thanks: 'Thanks to Mobile Learner Labs for working with the PhET development team to convert this simulation to HTML5.'
      }
    };

    //Create and start the sim
    new Sim( title, [
      new Screen( title, null /* no icon, single-screen sim */,
        function() {return new BalloonsAndStaticElectricityModel( 768, 504 );},
        function( model ) {return new BalloonsAndStaticElectricityView( model );},
        { backgroundColor: '#9ddcf8' }
      )
    ], simOptions ).start();
  } );
} );