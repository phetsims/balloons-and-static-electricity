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
           'SCENERY/nodes/Text'
         ], function( FastClick, ImagesLoader, Fort, Text ) {
  'use strict';

  //On iPad, prevent buttons from flickering 300ms after press.  See https://github.com/twitter/bootstrap/issues/3772
  new FastClick( document.body );

  //Make sure Fort loaded
  console.log( "started" );
  var Model = Fort.Model.extend( {paused: true} );
  var model = new Model();
  console.log( model );

  //make sure scenery loaded
  var text = new Text( "hello" );
  console.log( text );
} );
