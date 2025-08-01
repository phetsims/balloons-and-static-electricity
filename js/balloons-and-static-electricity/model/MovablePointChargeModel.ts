// Copyright 2017-2025, University of Colorado Boulder

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
import Tandem from '../../../../tandem/js/Tandem.js';
import balloonsAndStaticElectricity from '../../balloonsAndStaticElectricity.js';
import PointChargeModel from './PointChargeModel.js';

class MovablePointChargeModel extends PointChargeModel {

  // position of the point charge
  public readonly positionProperty: Vector2Property;

  public constructor( x: number, y: number, tandem: Tandem, phetioState: boolean ) {

    super( x, y, tandem, phetioState );

    this.positionProperty = new Vector2Property( this.position, {
      tandem: tandem.createTandem( 'positionProperty' ),
      phetioState: phetioState,
      valueComparisonStrategy: 'equalsFunction'
    } );
  }

  /**
   * Reset the point charge.
   */
  public override reset(): void {
    super.reset();
    this.positionProperty.reset();
  }

  /**
   * Get the displacement of the charge from its initial position. Useful as a measure of the induced charge.
   */
  public getDisplacement(): number {
    const initialPosition = this.positionProperty.initialValue;
    const displacement = this.positionProperty.get().distance( initialPosition );

    return displacement;
  }

  /**
   * Get the center of the charge.
   */
  public override getCenter(): Vector2 {
    return new Vector2( this.positionProperty.get().x + PointChargeModel.RADIUS, this.positionProperty.get().y + PointChargeModel.RADIUS );
  }
}

balloonsAndStaticElectricity.register( 'MovablePointChargeModel', MovablePointChargeModel );

export default MovablePointChargeModel;