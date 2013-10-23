// Copyright 2002-2013, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Sam Reid (PhET Interactive Simulations)
 */
require( [
  'SCENERY/nodes/Text',
  'SCENERY/nodes/Rectangle',
  'JOIST/Sim',
  'JOIST/Screen',
  'BALLOONS_AND_STATIC_ELECTRICITY/model/BalloonsAndStaticElectricityModel',
  'BALLOONS_AND_STATIC_ELECTRICITY/view/BalloonsAndStaticElectricityView',
  'JOIST/SimLauncher',
  'string!BALLOONS_AND_STATIC_ELECTRICITY/balloons.name'
], function( Text, Rectangle, Sim, Screen, BalloonsAndStaticElectricityModel, BalloonsAndStaticElectricityView, SimLauncher, title ) {
  'use strict';

  SimLauncher.launch( function() {

    var simOptions = {
      credits: 'PhET Development Team -\n' +
               'Lead Design: Noah Podolefsky & Sam Reid\n' +
               'Software Development: Sam Reid\n' +
               'Design: Ariel Paul, Kathy Perkins, Trish Loeblein, Sharon Simon-Tov\n' +
               'Interviews: Ariel Paul, Wendy Adams\n',
      thanks: 'Thanks -\n' +
              'Thanks to Mobile Learner Labs for working with the PhET development team to convert this simulation to HTML5.'
    };

    //Create and start the sim
    new Sim( title, [
      new Screen( title, null /* no icon, single-screen sim */,
        function() {return new BalloonsAndStaticElectricityModel( 768, 504 );},
        function( model ) {return new BalloonsAndStaticElectricityView( model );},
        { backgroundColor: "#9ddcf8" }
      )
    ], simOptions ).start();
  } );
} );