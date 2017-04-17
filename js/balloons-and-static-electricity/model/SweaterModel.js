// Copyright 2013-2015, University of Colorado Boulder

/**
 * Model of a Sweater.
 * Sweater can loose minus charges
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var Property = require( 'AXON/Property' );
  var Vector2 = require( 'DOT/Vector2' );
  var PointChargeModel = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/PointChargeModel' );
  var inherit = require( 'PHET_CORE/inherit' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var BASEA11yStrings = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/BASEA11yStrings' );
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );
  var Range = require( 'DOT/Range' );
  var Shape = require( 'KITE/Shape' );

  // phet-io modules
  var TNumber = require( 'ifphetio!PHET_IO/types/TNumber' );

  // positions of the charge pairs, in absoluate model coordinates (i.e. not relative to the sweater position)
  var CHARGE_PAIR_POSITIONS = [
    [ 104, 64 ],
    [ 94, 90 ],
    [ 85, 121 ],
    [ 80, 147 ],
    [ 76, 178 ],
    [ 74, 209 ],
    [ 71, 242 ],
    [ 67, 273 ],
    [ 67, 304 ],
    [ 61, 330 ],
    [ 140, 85 ],
    [ 142, 116 ],
    [ 145, 145 ],
    [ 145, 174 ],
    [ 143, 205 ],
    [ 140, 237 ],
    [ 138, 267 ],
    [ 132, 296 ],
    [ 128, 327 ],
    [ 170, 98 ],
    [ 171, 129 ],
    [ 171, 160 ],
    [ 172, 191 ],
    [ 171, 223 ],
    [ 169, 254 ],
    [ 167, 287 ],
    [ 163, 318 ],
    [ 163, 350 ],
    [ 208, 88 ],
    [ 208, 117 ],
    [ 206, 148 ],
    [ 205, 179 ],
    [ 203, 210 ],
    [ 202, 241 ],
    [ 200, 272 ],
    [ 197, 302 ],
    [ 196, 333 ],
    [ 239, 75 ],
    [ 236, 105 ],
    [ 234, 135 ],
    [ 233, 166 ],
    [ 232, 197 ],
    [ 231, 229 ],
    [ 230, 260 ],
    [ 227, 291 ],
    [ 226, 321 ],
    [ 224, 350 ],
    [ 266, 59 ],
    [ 283, 90 ],
    [ 292, 121 ],
    [ 292, 152 ],
    [ 292, 187 ],
    [ 290, 217 ],
    [ 295, 247 ],
    [ 296, 278 ],
    [ 295, 308 ],
    [ 290, 337 ]
  ];

  /**
   * @constructor
   * @param {number} x
   * @param {number} y
   * @param {Tandem} tandem
   */
  function SweaterModel( x, y, tandem ) {

    // public (read-only) - dimensions of the sweater, empirically determined to match design
    this.width = 305;
    this.height = 385;

    // @public {number} - charge on the sweater
    this.chargeProperty = new Property( 0, {
      tandem: tandem.createTandem( 'chargeProperty' ),
      phetioValueType: TNumber( { type: 'Integer', range: new Range( -CHARGE_PAIR_POSITIONS.length, 0 ) } ),
      phetioInstanceDocumentation: 'this value is set internally by the simulation and should not be overridden'
    } );

    var self = this;

    this.x = x;
    this.y = y;

    //location of center of the sweater
    this.center = new Vector2( self.x + self.width / 2, self.y + self.height / 2 );

    // bounds containing the sweater
    this.bounds = new Bounds2( this.x, this.y, this.width, this.height );

    // arrays of plus and minus charges on the sweater, created from positions array above
    this.plusCharges = [];
    this.minusCharges = [];

    var plusChargesGroupTandem = tandem.createGroupTandem( 'plusCharges' );
    var minusChargesGroupTandem = tandem.createGroupTandem( 'minusCharges' );
    CHARGE_PAIR_POSITIONS.forEach( function( entry ) {
      var plusCharge = new PointChargeModel( entry[ 0 ], entry[ 1 ], plusChargesGroupTandem.createNextTandem(), false );
      self.plusCharges.push( plusCharge );

      //minus
      var minusCharge = new PointChargeModel(
        entry[ 0 ] + PointChargeModel.RADIUS,
        entry[ 1 ] + PointChargeModel.RADIUS,
        minusChargesGroupTandem.createNextTandem(),
        true
      );
      self.minusCharges.push( minusCharge );
    } );
    this.reset();
  }

  balloonsAndStaticElectricity.register( 'SweaterModel', SweaterModel );

  inherit( Object, SweaterModel, {

    //is balloon over minus charge on sweater?

    /**
     * Check if the balloon is over a minus charge on the sweater.  If it is, and it is moving quickly enough, move the
     * charges from the sweater to the balloon.  Returns boolean indicating whether or not a charge was moved.
     *
     * @param  {BalloonModel} balloon
     * @returns {boolean} chargeMoved - was a charge moved to the balloon?
     */
    checkAndTransferCharges: function( balloon ) {
      var self = this;

      // determine the bounds of the balloon for overlap testing - this is adjusted a
      var balloonLocation = balloon.locationProperty.get();
      var balloonShape = Shape.ellipse(
        balloonLocation.x + balloon.width / 2,
        balloonLocation.y + balloon.height / 2,
        balloon.width / 2,
        balloon.height / 2
      );

      // track whether or not at least once charge was moved
      var chargeMoved = false;

      // check each minus charge to see whether it should be moved to the balloon
      this.minusCharges.forEach( function( minusCharge ) {
        if ( !minusCharge.movedProperty.get() && balloonShape.containsPoint( minusCharge.location ) ) {
          self.moveChargeTo( minusCharge, balloon );
          chargeMoved = true;
        }
      } );

      return chargeMoved;
    },

    //charge from sweater to balloon
    moveChargeTo: function( charge, balloon ) {
      charge.movedProperty.set( true );
      balloon.chargeProperty.set( balloon.chargeProperty.get() - 1 );
      this.chargeProperty.set( this.chargeProperty.get() + 1 );
    },

    /**
     * Get a description of the sweater's charge for accessibility
     *
     * @accessibility
     * @returns {string}
     */
    getChargeDescription: function() {
      if ( this.chargeProperty.get() > 0 ) {
        return StringUtils.format( BASEA11yStrings.sweaterNetChargePatternString, BASEA11yStrings.netPositiveString );
      }
      else {
        return StringUtils.format( BASEA11yStrings.sweaterNetChargePatternString, BASEA11yStrings.netNeutralString );
      }
    },

    // Reset the entire model
    reset: function() {
      this.minusCharges.forEach( function( entry ) {
        entry.movedProperty.set( false );
      } );
      this.chargeProperty.set( 0 );
    }
  } );
  return SweaterModel;
} );
