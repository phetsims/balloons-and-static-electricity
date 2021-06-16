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
import balloonsAndStaticElectricity from '../../balloonsAndStaticElectricity.js';

// constants
const RADIUS = 8;

//1,754 = 100/57 - to get relevant to original java model, where we have 100 sweater's charges (in this model only 57 )
const CHARGE = -1.754;

class PointChargeModel {
  /**
   * @param {number} x
   * @param {number} y
   * @param {Tandem} tandem
   * @param phetioState
   */
  constructor( x, y, tandem, phetioState ) {

    // @public (read-only) - position of this charge
    this.position = new Vector2( x, y );

    // @public {boolean} - whether or not the charge has been moved from sweater to balloon
    this.movedProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'movedProperty' ),
      phetioState: phetioState
    } );
  }

  /**
   * @public
   */
  reset() {
    this.movedProperty.reset();
  }

  /**
   * Get center of charge.
   *
   * @public
   * @returns {Vector2}
   */
  getCenter() {
    return new Vector2( this.position.x + this.radius, this.position.y + this.radius );
  }

}


// @public static properties
PointChargeModel.RADIUS = RADIUS;
PointChargeModel.CHARGE = CHARGE;

balloonsAndStaticElectricity.register( 'PointChargeModel', PointChargeModel );

export default PointChargeModel;