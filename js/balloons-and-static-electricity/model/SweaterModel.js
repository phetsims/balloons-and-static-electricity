// Copyright 2013-2018, University of Colorado Boulder

/**
 * Model of a Sweater.
 * Sweater can loose minus charges
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var PointChargeModel = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/PointChargeModel' );
  var Range = require( 'DOT/Range' );
  var Shape = require( 'KITE/Shape' );
  var Vector2 = require( 'DOT/Vector2' );

  // positions of the charge pairs, in absolute model coordinates (i.e. not relative to the sweater position)
  var CHARGE_PAIR_POSITIONS = [
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

  /**
   * @constructor
   * @param {number} x
   * @param {number} y
   * @param {Tandem} tandem
   */
  function SweaterModel( x, y, tandem ) {

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

    var self = this;

    // @public
    this.x = x;
    this.y = y;

    // @public {Vector2} - location of center of the sweater
    this.center = new Vector2( self.x + self.width / 2, self.y + self.height / 2 );

    // @public (read-only) {Vector2} - location of the left edge of the sweater
    this.left = new Vector2( self.x, self.y + self.height / 2 );

    // @public {Bounds2} bounds containing the sweater
    this.bounds = new Bounds2( this.x, this.y, this.width, this.height );

    // @private {Shape} create an approximate shape of the charged area of the sweater based on the position of the
    // charges. This is used for accurate detection of when the balloons are over the charged area, see
    // https://github.com/phetsims/balloons-and-static-electricity/issues/240.  This algorithm works by dividing the
    // unit circle into a set of slices and finding the charge location that is furthest from the center in that
    // slice, then building a shape from that set of points.
    var numSlices = 9; // this number can be adjusted to get a more refined shape to enclose the charges
    var shapeDefiningPoints = [];
    var sliceWidth = ( 2 * Math.PI ) / numSlices; // in radians
    _.times( numSlices ).forEach( function( sliceNumber ) {
      shapeDefiningPoints.push( self.center.copy() );
      var slice = new Range( sliceNumber * sliceWidth, ( sliceNumber + 1 ) * sliceWidth );
      CHARGE_PAIR_POSITIONS.forEach( function( chargePairPosition ) {
        var angle = chargePairPosition.minus( self.center ).angle();

        // convert negative angles
        if ( angle < 0 ) {
          angle += 2 * Math.PI;
        }
        if ( slice.contains( angle ) ) {
          if ( !shapeDefiningPoints[ sliceNumber ] ||
               ( chargePairPosition.distance( self.center ) >
                 shapeDefiningPoints[ sliceNumber ].distance( self.center ) ) ) {

            // this point is either the first one in this slice or further out than the previous one, so use it
            shapeDefiningPoints[ sliceNumber ] = chargePairPosition;
          }
        }
      } );
    } );

    // @public {Shape} - area on the sweater where charges exist
    this.chargedArea = new Shape().moveToPoint( shapeDefiningPoints[ 0 ] );
    for ( var i = 1; i < shapeDefiningPoints.length; i++ ) {
      this.chargedArea.lineToPoint( shapeDefiningPoints[ i ] );
    }
    this.chargedArea.close();

    // arrays of plus and minus charges on the sweater, created from positions array above
    this.plusCharges = [];
    this.minusCharges = [];

    var plusChargesGroupTandem = tandem.createGroupTandem( 'plusCharges' );
    var minusChargesGroupTandem = tandem.createGroupTandem( 'minusCharges' );
    CHARGE_PAIR_POSITIONS.forEach( function( chargePairPosition ) {
      var plusCharge = new PointChargeModel(
        chargePairPosition.x,
        chargePairPosition.y,
        plusChargesGroupTandem.createNextTandem(),
        false
      );
      self.plusCharges.push( plusCharge );

      //minus
      var minusCharge = new PointChargeModel(
        chargePairPosition.x + PointChargeModel.RADIUS,
        chargePairPosition.y + PointChargeModel.RADIUS,
        minusChargesGroupTandem.createNextTandem(),
        true
      );
      self.minusCharges.push( minusCharge );
    } );

    this.reset();
  }

  balloonsAndStaticElectricity.register( 'SweaterModel', SweaterModel );

  return inherit( Object, SweaterModel, {

    /**
     * Check if the balloon is over a minus charge on the sweater.  If it is, and it is moving quickly enough, move the
     * charges from the sweater to the balloon.  Returns boolean indicating whether or not a charge was moved.
     *
     * @public
     * @param  {BalloonModel} balloon
     * @returns {boolean} chargeMoved - was a charge moved to the balloon?
     */
    checkAndTransferCharges: function( balloon ) {
      var self = this;

      // track whether or not at least once charge was moved
      var chargeMoved = false;

      // check each minus charge to see whether it should be moved to the balloon
      this.minusCharges.forEach( function( minusCharge ) {

        // used too check if an eliptical shape contains the charge, but reverted to checking the balloon's
        // rectangular bounds, which is faster and sufficient for this simulation, see #409
        if ( !minusCharge.movedProperty.get() && balloon.bounds.containsPoint( minusCharge.location ) ) {
          self.moveChargeTo( minusCharge, balloon );
          chargeMoved = true;
        }
      } );

      return chargeMoved;
    },

    /**
     * Move a charge from sweater to balloon. Done by updating charge Properties, this sim doesn't actually
     * transfer charges from one object to another.
     *
     * @public
     * @param {PointChargeModel} charge
     * @param {BalloonModel}
     */
    moveChargeTo: function( charge, balloon ) {
      charge.movedProperty.set( true );
      balloon.chargeProperty.set( balloon.chargeProperty.get() - 1 );
      this.chargeProperty.set( this.chargeProperty.get() + 1 );
    },

    /**
     * Reset the SweaterModel.
     *
     * @public
     */
    reset: function() {
      this.minusCharges.forEach( function( entry ) {
        entry.movedProperty.set( false );
      } );
      this.chargeProperty.set( 0 );
    }
  } );
} );
