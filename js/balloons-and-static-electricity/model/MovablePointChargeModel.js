// Copyright 2017-2019, University of Colorado Boulder

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
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PointChargeModel = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/PointChargeModel' );
  var Property = require( 'AXON/Property' );
  var PropertyIO = require( 'AXON/PropertyIO' );
  var Vector2 = require( 'DOT/Vector2' );
  var Vector2IO = require( 'DOT/Vector2IO' );

  /**
   * @constructor
   * @param {number} x
   * @param {number} y
   * @param {Tandem} tandem
   * @param {boolean} phetioState
   */
  function MovablePointChargeModel( x, y, tandem, phetioState ) {

    PointChargeModel.call( this, x, y, tandem, phetioState );

    // @public {Vector2} - location of the point charge
    this.locationProperty = new Property( this.location, {
      tandem: tandem.createTandem( 'locationProperty' ),
      phetioType: PropertyIO( Vector2IO ),
      phetioState: phetioState,
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
     * @returns {Vector2}
     */
    getDisplacement: function() {
      var initialPosition = this.locationProperty.initialValue;
      var displacement = this.locationProperty.get().distance( initialPosition );

      return displacement;
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
