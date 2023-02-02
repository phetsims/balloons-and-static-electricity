// Copyright 2017-2023, University of Colorado Boulder

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
import balloonsAndStaticElectricity from '../../balloonsAndStaticElectricity.js';
import PointChargeModel from './PointChargeModel.js';

class MovablePointChargeModel extends PointChargeModel {

  /**
   * @param {number} x
   * @param {number} y
   * @param {Tandem} tandem
   * @param {boolean} phetioState
   */
  constructor( x, y, tandem, phetioState ) {

    super( x, y, tandem, phetioState );

    // @public {Vector2} - position of the point charge
    this.positionProperty = new Vector2Property( this.position, {
      tandem: tandem.createTandem( 'positionProperty' ),
      phetioState: phetioState,
      valueComparisonStrategy: 'equalsFunction'
    } );
  }


  /**
   * Reset the point charge.
   * @public
   *
   * @override
   */
  reset() {
    super.reset();
    this.positionProperty.reset();
  }

  /**
   * Get the displacement of the charge from its initial position. Useful as a measure of the induced charge.
   * @public
   *
   *
   * @returns {Vector2}
   */
  getDisplacement() {
    const initialPosition = this.positionProperty.initialValue;
    const displacement = this.positionProperty.get().distance( initialPosition );

    return displacement;
  }

  /**
   * Get the center of the charge.
   * @public
   *
   * @returns {Vector2}
   * @override
   */
  getCenter() {
    return new Vector2( this.positionProperty.get().x + this.radius, this.positionProperty.get().y + this.radius );
  }
}

balloonsAndStaticElectricity.register( 'MovablePointChargeModel', MovablePointChargeModel );

export default MovablePointChargeModel;