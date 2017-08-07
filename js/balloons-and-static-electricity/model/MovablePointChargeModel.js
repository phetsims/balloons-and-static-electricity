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

  // constants
  // when charge displacement is larger than this, there is an appreciable induced charge
  var INDUCED_CHARGE_DISPLACEMENT_THRESHOLD = 3;

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
      phetioStateElement: phetioStateElement,
      useDeepEquality: true
    } );
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
     * Get the displacement of the charge from its initial position. Useful as a measure of the induced charge.
     *
     * @return {Vector2}
     */
    getDisplacement: function() {
      var initialPosition = this.locationProperty.initialValue;
      var displacement = this.locationProperty.get().distance( initialPosition );

      return displacement;
    },

    /**
     * If the displacement is large enough, it indicates that the containing object has an induced charge. Check agains
     * some threshold to return a boolean representing this.
     *
     * @public
     * @return {boolean}
     */
    displacementIndicatesInducedCharge: function() {
      var displacement = this.getDisplacement();
      return displacement > INDUCED_CHARGE_DISPLACEMENT_THRESHOLD;
    },

    /**
     * Get the center of the charge.
     *
     * @returns {Vector2}
     * @override
     */
    getCenter: function() {
      return new Vector2( this.locationProperty.get().x + this.radius, this.locationProperty.get().y + this.radius );
    }
  } );

  return MovablePointChargeModel;
} );
