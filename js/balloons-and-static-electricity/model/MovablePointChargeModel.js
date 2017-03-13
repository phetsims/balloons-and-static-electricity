// Copyright 2013-2015, University of Colorado Boulder

/**
 * A single point change, which has a location.  These charges are meant to move dynamically, and
 * include an observable location.  If the charge does not need to move, use PointChargeModel.
 *
 * @author Vasily Shakhov (Mlearner)
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Property = require( 'AXON/Property' );
  var Vector2 = require( 'DOT/Vector2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PointChargeModel = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/PointChargeModel' );
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );
  var TVector2 = require( 'DOT/TVector2' );

  /**
   * @constructor
   * @param {number} x
   * @param {number} y
   * @param {Tandem} tandem
   */
  function MovablePointChargeModel( x, y, tandem, phetioStateElement ) {

    PointChargeModel.call( this, x, y, tandem, phetioStateElement );

    // @public {Vector2} - location of the point charge
    this.locationProperty = new Property( this.location, {
      tandem: tandem.createTandem( 'locationProperty' ),
      phetioValueType: TVector2,
      phetioStateElement: phetioStateElement
    } );
    this.locationProperty.areValuesEqual = function( a, b ) { return a.equals( b ); };
  }

  balloonsAndStaticElectricity.register( 'MovablePointChargeModel', MovablePointChargeModel );

  inherit( PointChargeModel, MovablePointChargeModel, {

    /**
     * Reset the point charge.
     *
     * @override
     */
    reset: function() {
      PointChargeModel.prototype.reset.call( this );
      this.locationProperty.reset();
    },

    /**
     * Get the center of the charge.
     *
     * @return {Vector2}
     * @override
     */
    getCenter: function() {
      return new Vector2( this.locationProperty.get().x + this.radius, this.locationProperty.get().y + this.radius );
    }
  } );

  return MovablePointChargeModel;
} );
