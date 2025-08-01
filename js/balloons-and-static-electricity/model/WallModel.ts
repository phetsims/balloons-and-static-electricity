// Copyright 2013-2025, University of Colorado Boulder

/**
 * Model of a wall. Wall have electrons which can change position under force from balloons.
 *
 * @author Vasily Shakhov (Mlearner)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import balloonsAndStaticElectricity from '../../balloonsAndStaticElectricity.js';
import BalloonModel from './BalloonModel.js';
import MovablePointChargeModel from './MovablePointChargeModel.js';
import PointChargeModel from './PointChargeModel.js';

// constants
// when charge displacement is larger than this, there is an appreciable induced charge
const FORCE_MAGNITUDE_THRESHOLD = 2;

export default class WallModel {

  // Properties of the model.  All user settings belong in the model, whether they are part of the physical model
  public readonly isVisibleProperty: BooleanProperty;

  // the top position of the wall
  public readonly y = 0;

  // the left position of the wall
  public readonly x: number;

  // number of columns with charges
  public readonly numX = 3;

  // number of rows with charges
  public readonly numY = 18;

  public readonly width: number;
  public readonly height: number;

  // bounds containing the wall
  public readonly bounds: Bounds2;

  // scaling factors for calculating positions for induced charge
  private readonly dx: number;
  private readonly dy: number;

  public readonly plusCharges: PointChargeModel[] = [];
  public readonly minusCharges: MovablePointChargeModel[] = [];

  public constructor( x: number, width: number, height: number, yellowBalloon: BalloonModel, greenBalloon: BalloonModel, tandem: Tandem ) {

    this.isVisibleProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'isVisibleProperty' )
    } );

    this.x = x;
    this.width = width;
    this.height = height;

    this.bounds = new Bounds2( this.x, this.y, this.x + width, this.y + height );

    this.dx = Utils.roundSymmetric( width / this.numX + 2 );
    this.dy = height / this.numY;

    const minusCharges = tandem.createTandem( 'minusCharges' );

    let index = 0;
    for ( let i = 0; i < this.numX; i++ ) {
      for ( let k = 0; k < this.numY; k++ ) {

        // plus
        const position = this.calculatePosition( i, k );
        const plusCharge = new PointChargeModel( x + position[ 0 ], position[ 1 ], Tandem.OPT_OUT, false );
        this.plusCharges.push( plusCharge );

        // minus
        const minusCharge = new MovablePointChargeModel(
          x + position[ 0 ] - PointChargeModel.RADIUS,
          position[ 1 ] - PointChargeModel.RADIUS,
          minusCharges.createTandem( `minusCharge${index}` ),
          false
        );
        this.minusCharges.push( minusCharge );
        index++;
      }
    }

    const updateChargePositions = () => {

      // value for k for calculating forces, chosen so that motion of the balloon looks like Java version
      const k = 10000;

      // calculate force from Balloon to each charge in the wall, we subtract by the PointChargeModel radius
      // to make the force look correct because each charge is minus charge is shifted down by that much initially
      this.minusCharges.forEach( entry => {
        const ch = entry;
        let dv1 = new Vector2( 0, 0 );
        let dv2 = new Vector2( 0, 0 );

        const defaultPosition = ch.positionProperty.initialValue;
        if ( yellowBalloon.isVisibleProperty.get() ) {
          dv1 = BalloonModel.getForce(
            defaultPosition,
            yellowBalloon.getChargeCenter().minusXY( 0, 2 * PointChargeModel.RADIUS ),
            k * PointChargeModel.CHARGE * yellowBalloon.chargeProperty.get(),
            2.35
          );
        }
        if ( greenBalloon.isVisibleProperty.get() ) {
          dv2 = BalloonModel.getForce(
            defaultPosition,
            greenBalloon.getChargeCenter().minusXY( 0, 2 * PointChargeModel.RADIUS ),
            k * PointChargeModel.CHARGE * greenBalloon.chargeProperty.get(),
            2.35
          );
        }
        entry.positionProperty.set(
          new Vector2( defaultPosition.x + dv1.x + dv2.x, defaultPosition.y + dv1.y + dv2.y )
        );
      } );
    };
    yellowBalloon.positionProperty.link( updateChargePositions );
    greenBalloon.positionProperty.link( updateChargePositions );
    yellowBalloon.isVisibleProperty.link( updateChargePositions );
    greenBalloon.isVisibleProperty.link( updateChargePositions );
    yellowBalloon.chargeProperty.link( updateChargePositions );
    greenBalloon.chargeProperty.link( updateChargePositions );

    // if a balloon was stuck to the wall and visible when the wall becomes invisible, we need to
    // notify that the balloon was released by resetting the timer
    const balloons = [ yellowBalloon, greenBalloon ];
    this.isVisibleProperty.link( isVisible => {
      if ( !isVisible ) {
        for ( let i = 0; i < balloons.length; i++ ) {
          const balloon = balloons[ i ];
          if ( balloon.isVisibleProperty.get() && balloon.rightAtWallPosition() && balloon.isCharged() ) {
            balloon.timeSinceRelease = 0;
          }
        }
      }
    } );
  }

  /**
   * Reset the entire model
   */
  public reset(): void {

    // Reset the properties in this model
    this.isVisibleProperty.reset();
    this.minusCharges.forEach( entry => {
      entry.reset();
    } );
  }

  /**
   * Function that will place charges on wall's grid.
   */
  private calculatePosition( i: number, k: number ): [ number, number ] {
    const y0 = i % 2 === 0 ? this.dy / 2 : 1;
    return [ i * this.dx + PointChargeModel.RADIUS + 1, k * this.dy + y0 ];
  }

  /**
   * Get the minus charge that is the closest in the wall to the balloon, relative to the charge's initial
   * position.
   */
  public getClosestChargeToBalloon( balloon: BalloonModel ): MovablePointChargeModel {
    const minusCharges = this.minusCharges;

    // get the minus charge that is closest to the balloon
    let closestCharge: MovablePointChargeModel | null = null;
    let chargeDistance = Number.POSITIVE_INFINITY;
    const balloonChargeCenter = balloon.getChargeCenter();

    for ( let i = 0; i < minusCharges.length; i++ ) {
      const charge = minusCharges[ i ];
      const newChargeDistance = charge.positionProperty.initialValue.distance( balloonChargeCenter );

      if ( newChargeDistance < chargeDistance ) {
        chargeDistance = newChargeDistance;
        closestCharge = charge;
      }
    }
    assert && assert( closestCharge, 'Unable to find charge closest to balloon' );

    return closestCharge!;
  }

  /**
   * Return whether the force applied to this charge indicates that charge is being induced. Determined by
   * inspection.
   */
  public forceIndicatesInducedCharge( force: Vector2 ): boolean {
    return force.magnitude > FORCE_MAGNITUDE_THRESHOLD;
  }
}

balloonsAndStaticElectricity.register( 'WallModel', WallModel );