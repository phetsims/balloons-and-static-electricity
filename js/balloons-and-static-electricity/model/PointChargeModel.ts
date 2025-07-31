// Copyright 2013-2021, University of Colorado Boulder

/**
 * A single point change, which has a position.  The position is intended to never change.  Most charges in this
 * sim do not require observable Properties, so using this type for most of these can improve performance.
 * If the charge needs an observable dynamic position, please use MovablePointChargeModel.
 *
 * @author Vasily Shakhov (Mlearner)
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import balloonsAndStaticElectricity from '../../balloonsAndStaticElectricity.js';

// constants
const RADIUS = 8;

// 1,754 = 100/57 - to get relevant to original java model, where we have 100 sweater's charges (in this model only 57 )
const CHARGE = -1.754;

class PointChargeModel {

  // position of this charge
  public readonly position: Vector2;

  // whether the charge has been moved from sweater to balloon
  public readonly movedProperty: BooleanProperty;

  // static properties
  public static readonly RADIUS = RADIUS;
  public static readonly CHARGE = CHARGE;

  public constructor( x: number, y: number, tandem: Tandem, phetioState: boolean ) {

    this.position = new Vector2( x, y );

    this.movedProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'movedProperty' ),
      phetioState: phetioState
    } );
  }

  public reset(): void {
    this.movedProperty.reset();
  }

  /**
   * Get center of charge.
   */
  public getCenter(): Vector2 {
    return new Vector2( this.position.x + PointChargeModel.RADIUS, this.position.y + PointChargeModel.RADIUS );
  }
}

balloonsAndStaticElectricity.register( 'PointChargeModel', PointChargeModel );

export default PointChargeModel;