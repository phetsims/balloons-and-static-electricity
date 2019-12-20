// Copyright 2017-2019, University of Colorado Boulder

/**
 * A single point change, which has a position.  These charges are meant to move dynamically, and
 * include an observable position.  If the charge does not need to move, use PointChargeModel.
 *
 * @author Vasily Shakhov (Mlearner)
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );
  const inherit = require( 'PHET_CORE/inherit' );
  const PointChargeModel = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/PointChargeModel' );
  const Vector2 = require( 'DOT/Vector2' );
  const Vector2Property = require( 'DOT/Vector2Property' );

  /**
   * @constructor
   * @param {number} x
   * @param {number} y
   * @param {Tandem} tandem
   * @param {boolean} phetioState
   */
  function MovablePointChargeModel( x, y, tandem, phetioState ) {

    PointChargeModel.call( this, x, y, tandem, phetioState );

    // @public {Vector2} - position of the point charge
    this.positionProperty = new Vector2Property( this.position, {
      tandem: tandem.createTandem( 'positionProperty' ),
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
      this.positionProperty.reset();
    },

    /**
     * Get the displacement of the charge from its initial position. Useful as a measure of the induced charge.
     *
     * @returns {Vector2}
     */
    getDisplacement: function() {
      const initialPosition = this.positionProperty.initialValue;
      const displacement = this.positionProperty.get().distance( initialPosition );

      return displacement;
    },

    /**
     * Get the center of the charge.
     *
     * @returns {Vector2}
     * @override
     */
    getCenter: function() {
      return new Vector2( this.positionProperty.get().x + this.radius, this.positionProperty.get().y + this.radius );
    }
  } );

  return MovablePointChargeModel;
} );
