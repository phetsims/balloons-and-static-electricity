// Copyright 2017-2019, University of Colorado Boulder

/**
 * A single point change, which has a position.  These charges are meant to move dynamically, and
 * include an observable position.  If the charge does not need to move, use PointChargeModel.
 *
 * @author Vasily Shakhov (Mlearner)
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import inherit from '../../../../phet-core/js/inherit.js';
import balloonsAndStaticElectricity from '../../balloonsAndStaticElectricity.js';
import PointChargeModel from './PointChargeModel.js';

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

export default MovablePointChargeModel;