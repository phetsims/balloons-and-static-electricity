// Copyright 2013-2022, University of Colorado Boulder

/**
 * Model of a Sweater.
 * Sweater can loose minus charges
 * @author Vasily Shakhov (Mlearner)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Shape } from '../../../../kite/js/imports.js';
import balloonsAndStaticElectricity from '../../balloonsAndStaticElectricity.js';
import PointChargeModel from './PointChargeModel.js';

// positions of the charge pairs, in absolute model coordinates (i.e. not relative to the sweater position)
const CHARGE_PAIR_POSITIONS = [
  new Vector2( 104, 64 ),
  new Vector2( 94, 90 ),
  new Vector2( 85, 121 ),
  new Vector2( 80, 147 ),
  new Vector2( 76, 178 ),
  new Vector2( 74, 209 ),
  new Vector2( 71, 242 ),
  new Vector2( 67, 273 ),
  new Vector2( 67, 304 ),
  new Vector2( 61, 330 ),
  new Vector2( 140, 85 ),
  new Vector2( 142, 116 ),
  new Vector2( 145, 145 ),
  new Vector2( 145, 174 ),
  new Vector2( 143, 205 ),
  new Vector2( 140, 237 ),
  new Vector2( 138, 267 ),
  new Vector2( 132, 296 ),
  new Vector2( 128, 327 ),
  new Vector2( 170, 98 ),
  new Vector2( 171, 129 ),
  new Vector2( 171, 160 ),
  new Vector2( 172, 191 ),
  new Vector2( 171, 223 ),
  new Vector2( 169, 254 ),
  new Vector2( 167, 287 ),
  new Vector2( 163, 318 ),
  new Vector2( 163, 350 ),
  new Vector2( 208, 88 ),
  new Vector2( 208, 117 ),
  new Vector2( 206, 148 ),
  new Vector2( 205, 179 ),
  new Vector2( 203, 210 ),
  new Vector2( 202, 241 ),
  new Vector2( 200, 272 ),
  new Vector2( 197, 302 ),
  new Vector2( 196, 333 ),
  new Vector2( 239, 75 ),
  new Vector2( 236, 105 ),
  new Vector2( 234, 135 ),
  new Vector2( 233, 166 ),
  new Vector2( 232, 197 ),
  new Vector2( 231, 229 ),
  new Vector2( 230, 260 ),
  new Vector2( 227, 291 ),
  new Vector2( 226, 321 ),
  new Vector2( 224, 350 ),
  new Vector2( 266, 59 ),
  new Vector2( 283, 90 ),
  new Vector2( 292, 121 ),
  new Vector2( 292, 152 ),
  new Vector2( 292, 187 ),
  new Vector2( 290, 217 ),
  new Vector2( 295, 247 ),
  new Vector2( 296, 278 ),
  new Vector2( 295, 308 ),
  new Vector2( 290, 337 )
];

class SweaterModel {
  /**
   * @param {number} x
   * @param {number} y
   * @param {Tandem} tandem
   */
  constructor( x, y, tandem ) {

    // public (read-only) - dimensions of the sweater, empirically determined to match design spec
    this.width = 305;
    this.height = 385;

    // @public {number} - charge on the sweater
    this.chargeProperty = new NumberProperty( 0, {
      tandem: tandem.createTandem( 'chargeProperty' ),
      numberType: 'Integer',
      range: new Range( 0, CHARGE_PAIR_POSITIONS.length ),
      phetioReadOnly: true
    } );


    // @public
    this.x = x;
    this.y = y;

    // @public {Vector2} - position of center of the sweater
    this.center = new Vector2( this.x + this.width / 2, this.y + this.height / 2 );

    // @public (read-only) {Vector2} - position of the left edge of the sweater
    this.left = new Vector2( this.x, this.y + this.height / 2 );

    // @public {Bounds2} bounds containing the sweater
    this.bounds = new Bounds2( this.x, this.y, this.width, this.height );

    // @private {Shape} create an approximate shape of the charged area of the sweater based on the position of the
    // charges. This is used for accurate detection of when the balloons are over the charged area, see
    // https://github.com/phetsims/balloons-and-static-electricity/issues/240.  This algorithm works by dividing the
    // unit circle into a set of slices and finding the charge position that is furthest from the center in that
    // slice, then building a shape from that set of points.
    const numSlices = 9; // this number can be adjusted to get a more refined shape to enclose the charges
    const shapeDefiningPoints = [];
    const sliceWidth = ( 2 * Math.PI ) / numSlices; // in radians
    _.times( numSlices ).forEach( sliceNumber => {
      shapeDefiningPoints.push( this.center.copy() );
      const slice = new Range( sliceNumber * sliceWidth, ( sliceNumber + 1 ) * sliceWidth );
      CHARGE_PAIR_POSITIONS.forEach( chargePairPosition => {
        let angle = chargePairPosition.minus( this.center ).angle;

        // convert negative angles
        if ( angle < 0 ) {
          angle += 2 * Math.PI;
        }
        if ( slice.contains( angle ) ) {
          if ( !shapeDefiningPoints[ sliceNumber ] ||
               ( chargePairPosition.distance( this.center ) >
                 shapeDefiningPoints[ sliceNumber ].distance( this.center ) ) ) {

            // this point is either the first one in this slice or further out than the previous one, so use it
            shapeDefiningPoints[ sliceNumber ] = chargePairPosition;
          }
        }
      } );
    } );

    // @public {Shape} - area on the sweater where charges exist
    this.chargedArea = new Shape().moveToPoint( shapeDefiningPoints[ 0 ] );
    for ( let i = 1; i < shapeDefiningPoints.length; i++ ) {
      this.chargedArea.lineToPoint( shapeDefiningPoints[ i ] );
    }
    this.chargedArea.close();

    // arrays of plus and minus charges on the sweater, created from positions array above
    this.plusCharges = [];
    this.minusCharges = [];

    const plusChargesGroupTandem = tandem.createTandem( 'plusCharges' ).createGroupTandem( 'plusCharge' );
    const minusChargesGroupTandem = tandem.createTandem( 'minusCharges' ).createGroupTandem( 'minusCharge' );
    CHARGE_PAIR_POSITIONS.forEach( chargePairPosition => {
      const plusCharge = new PointChargeModel(
        chargePairPosition.x,
        chargePairPosition.y,
        plusChargesGroupTandem.createNextTandem(),
        false
      );
      this.plusCharges.push( plusCharge );

      //minus
      const minusCharge = new PointChargeModel(
        chargePairPosition.x + PointChargeModel.RADIUS,
        chargePairPosition.y + PointChargeModel.RADIUS,
        minusChargesGroupTandem.createNextTandem(),
        true
      );
      this.minusCharges.push( minusCharge );
    } );

    this.reset();
  }

  /**
   * Check if the balloon is over a minus charge on the sweater.  If it is, and it is moving quickly enough, move the
   * charges from the sweater to the balloon.  Returns boolean indicating whether or not a charge was moved.
   *
   * @public
   * @param  {BalloonModel} balloon
   * @returns {boolean} chargeMoved - was a charge moved to the balloon?
   */
  checkAndTransferCharges( balloon ) {
    // track whether or not at least once charge was moved
    let chargeMoved = false;

    // check each minus charge to see whether it should be moved to the balloon
    this.minusCharges.forEach( minusCharge => {

      // This used to check if an elliptical shape contains the charge, but was reverted to checking the balloon's
      // rectangular bounds, which is faster and sufficient for this simulation, see #409.
      if ( !minusCharge.movedProperty.get() && balloon.bounds.containsPoint( minusCharge.position ) ) {
        this.moveChargeTo( minusCharge, balloon );
        chargeMoved = true;
      }
    } );

    return chargeMoved;
  }

  /**
   * Move a charge from sweater to balloon. Done by updating charge Properties, this sim doesn't actually
   * transfer charges from one object to another.
   *
   * @public
   * @param {PointChargeModel} charge
   * @param {BalloonModel} balloon
   */
  moveChargeTo( charge, balloon ) {
    charge.movedProperty.set( true );
    balloon.chargeProperty.set( balloon.chargeProperty.get() - 1 );
    this.chargeProperty.set( this.chargeProperty.get() + 1 );
  }

  /**
   * Reset the SweaterModel.
   *
   * @public
   */
  reset() {
    this.minusCharges.forEach( entry => {
      entry.movedProperty.set( false );
    } );
    this.chargeProperty.set( 0 );
  }
}

balloonsAndStaticElectricity.register( 'SweaterModel', SweaterModel );

export default SweaterModel;