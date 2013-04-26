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
  var Balloon = Fort.Model.extend(
      {
        defaults: {
          charge: 40,
          velocity: 0,
          isVisible: true,
          width: 161,
          height: 266,
          location: new Vector2( 0, 0 ),
        },
        init: function ( x, y ) {
          this.location = new Vector2( x, y );
        },
        getCenter: function () {
          return new Vector2( this.location.x + this.width / 2, this.location.y + this.height / 2 );
        }
      }, {
        getForce: function ( p1, p2, kqq, power ) {
          var diff = p1.minus( p2 );
          var r = diff.magnitude();
          if ( r === 0 ) {
            return new Vector2( 0, 0 );
          }
          var fa = diff.timesScalar( kqq / ( Math.pow( r, power + 1 ) ) );
          return fa;
        }
      } );

  return Balloon;
} );
