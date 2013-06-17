// Copyright 2002-2013, University of Colorado

/**
 * Main entry point for the sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Sam Reid (PhET Interactive Simulations)
 */
require( [
  'PHETCOMMON/util/ImagesLoader',
  'SCENERY/nodes/Text',
  'SCENERY/nodes/Rectangle',
  'Strings',
  'JOIST/Sim',
  'model/BalloonsAndStaticElectricityModel',
  'view/BalloonsAndStaticElectricityTabView',
  'JOIST/SimLauncher',
  'balloons-and-static-electricity-images'
], function( ImagesLoader, Text, Rectangle, Strings, Sim, BalloonsAndStaticElectricityModel, BalloonsAndStaticElectricityTabView, SimLauncher, balloonsAndStaticElectricityImages ) {
  'use strict';

  SimLauncher.launch( balloonsAndStaticElectricityImages, function() {

    //Create and start the sim
    new Sim( Strings['balloons.name'], [
      {
        name: Strings['balloons.name'],
        icon: new Rectangle( 0, 0, 50, 50, {fill: 'blue'} ),
        createModel: function() {return new BalloonsAndStaticElectricityModel( 768, 504 );},
        createView: function( model ) {return new BalloonsAndStaticElectricityTabView( model );},
        backgroundColor: "#9ddcf8"
      }
    ] ).start();
  } );
} );