// Copyright 2002-2013, University of Colorado

/**
 * Main entry point for the sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Sam Reid (PhET Interactive Simulations)
 */
require( [
           'fastclick',
           'PHETCOMMON/util/ImagesLoader'
         ], function( FastClick, ImagesLoader ) {
  'use strict';

  //On iPad, prevent buttons from flickering 300ms after press.  See https://github.com/twitter/bootstrap/issues/3772
  new FastClick( document.body );

  console.log( "started" );
} );
