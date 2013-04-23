// Copyright 2002-2013, University of Colorado

/**
 * Model of a balloon.
 * Balloon can have charge, position and velocity.
 * @author Vasily Shakhov (Mlearner)
 */
define( function ( require ) {
  'use strict';
  var Fort = require( 'FORT/Fort' );

  // Constructor for BarMagnet.
  var Balloon = Fort.Model.extend(
      {
        defaults: {
          charge: 0,
          velocity : 0,
          location: {x: 0, y: 0} }
      } );

  return Balloon;
} );
