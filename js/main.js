// Copyright 2002-2013, University of Colorado

/**
 * Main entry point for the sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Sam Reid (PhET Interactive Simulations)
 */
require( [
           'fastclick',
           'PHETCOMMON/util/ImagesLoader',
           'FORT/Fort',
           'SCENERY/nodes/Text',
           'SCENERY/nodes/Rectangle',
           'Strings',
           'JOIST/Sim',
           'model/BalloonsAndStaticElectricityModel',
           'view/BalloonsAndStaticElectricityPlayArea'
         ], function ( FastClick, ImagesLoader, Fort, Text, Rectangle, Strings, Sim, BalloonsAndStaticElectricityModel, BalloonsAndStaticElectricityPlayArea ) {
  'use strict';

  //On iPad, prevent buttons from flickering 300ms after press.  See https://github.com/twitter/bootstrap/issues/3772
  var f = new FastClick( document.body );

  var i = new ImagesLoader( function ( loader ) {

    //Create and start the sim
    new Sim( Strings['balloons.name'], [
      {
        name: Strings['balloons.name'],
        icon: new Rectangle( 0, 0, 50, 50, {fill: 'blue'} ),
        createModel: function () {return new BalloonsAndStaticElectricityModel();},
        createView: function ( model ) {return new BalloonsAndStaticElectricityPlayArea( model );}
      }
    ] ).start();
  } );
} );
