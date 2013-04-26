// Copyright 2002-2013, University of Colorado

/**
 * Model of a balloon.
 * Balloon can have charge, position and velocity.
 * @author Vasily Shakhov (Mlearner)
 */
define( function ( require ) {
  'use strict';
  var Fort = require( 'FORT/Fort' );
  var Vector2 = require( 'DOT/Vector2' );

  // Constructor for BarMagnet.
  var Charge = Fort.Model.extend(
      {
        defaults: {
          location: new Vector2( 0, 0 )
        },
        init: function ( x, y ) {
          this.defaultLocation = new Vector2( x, y );
          this.reset();
        },
        reset: function () {
          this.location = this.defaultLocation.copy();
        },
        getCenter: function () {
          return new Vector2( this.location.x + this.radius, this.location.y + this.radius );
        }

      }, {
        radius: 6,
        //1,754 = 100/57 - to get relevant to original java model, where we have 100 sweater's charges (here only 57 )
        charge: -1.754
      } );

  return Charge;
} );
