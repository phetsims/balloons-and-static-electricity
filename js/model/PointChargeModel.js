// Copyright 2002-2013, University of Colorado

/**
 * Model of a balloon.
 * Point charge model. Each charge have location.
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';
  var Fort = require( 'FORT/Fort' );
  var Vector2 = require( 'DOT/Vector2' );

  var PointChargeModel = Fort.Model.extend(
      {
        defaults: {
          location: new Vector2( 0, 0 )
        },
        init: function( x, y ) {
          this.defaultLocation = new Vector2( x, y );
          this.reset();
        },
        reset: function() {
          this.location = this.defaultLocation.copy();
        },
        getCenter: function() {
          return new Vector2( this.location.x + this.radius, this.location.y + this.radius );
        }

      }, {
        radius: 9,
        //1,754 = 100/57 - to get relevant to original java model, where we have 100 sweater's charges (in this model only 57 )
        charge: -1.754
      } );

  return PointChargeModel;
} );
