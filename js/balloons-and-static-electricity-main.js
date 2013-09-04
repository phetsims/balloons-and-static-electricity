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
  'BALLOONS_AND_STATIC_ELECTRICITY/Strings',
  'JOIST/Sim',
  'BALLOONS_AND_STATIC_ELECTRICITY/model/BalloonsAndStaticElectricityModel',
  'BALLOONS_AND_STATIC_ELECTRICITY/view/BalloonsAndStaticElectricityView',
  'JOIST/SimLauncher',
  'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity-images'
], function( Text, Rectangle, Strings, Sim, BalloonsAndStaticElectricityModel, BalloonsAndStaticElectricityView, SimLauncher, balloonsAndStaticElectricityImages ) {
  'use strict';

  SimLauncher.launch( [
    {name: 'balloons-and-static-electricity', imageLoader: balloonsAndStaticElectricityImages}
  ], function() {

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
    new Sim( Strings['balloons.name'], [
      {
        name: Strings['balloons.name'],
        icon: new Rectangle( 0, 0, 50, 50, {fill: 'blue'} ),
        createModel: function() {return new BalloonsAndStaticElectricityModel( 768, 504 );},
        createView: function( model ) {return new BalloonsAndStaticElectricityView( model );},
        backgroundColor: "#9ddcf8"
      }
    ], simOptions ).start();
  } );
} );