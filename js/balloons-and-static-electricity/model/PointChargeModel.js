// Copyright 2013-2017, University of Colorado Boulder

/**
 * A single point change, which has a location.  The location is intended to never change.  Most charges in this
 * sim do not require observable Properties, so using this type for most of these can improve performance.
 * If the charge needs an observable dynamic location, please use MovablePointChargeModel.
 *
 * @author Vasily Shakhov (Mlearner)
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Vector2 = require( 'DOT/Vector2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );

  // phet-io modules
  var TBoolean = require( 'ifphetio!PHET_IO/types/TBoolean' );

  // constants
  var RADIUS = 8;

  //1,754 = 100/57 - to get relevant to original java model, where we have 100 sweater's charges (in this model only 57 )
  var CHARGE = -1.754;

  /**
   * @constructor
   * @param {number} x
   * @param {number} y
   * @param {Tandem|null} tandem, null if the item should not be instrumented
   */
  function PointChargeModel( x, y, tandem, phetioStateElement ) {

    // @public (read-only) - location of this charge
    this.location = new Vector2( x, y );

    // @public {boolean} - whether or not the charge has been moved from sweater to balloon
    this.movedProperty = new Property( false, {
      tandem: tandem.createTandem( 'movedProperty' ),
      phetioValueType: TBoolean,
      phetioStateElement: phetioStateElement
    } );
  }

  balloonsAndStaticElectricity.register( 'PointChargeModel', PointChargeModel );

  inherit( Object, PointChargeModel, {

    /**
     * @public
     */
    reset: function() {
      this.movedProperty.reset();
    },

    /**
     * Get center of charge.
     *
     * @public
     * @return {Vector2}
     */
    getCenter: function() {
      return new Vector2( this.location.x + this.radius, this.location.y + this.radius );
    }
  }, {

    // @public static properties
    RADIUS: RADIUS,
    CHARGE: CHARGE
  } );

  return PointChargeModel;
} );
