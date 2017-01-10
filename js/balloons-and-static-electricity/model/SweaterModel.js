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

  // phet-io modules
  var TNumber = require( 'ifphetio!PHET_IO/types/TNumber' );

  /**
   * @constructor
   * @param {number} x      
   * @param {number} y      
   * @param {Tandem} tandem
   */
  function SweaterModel( x, y, tandem ) {

    // public (read-only) - dimensions of the sweater
    this.width = 330;
    this.height = 420;

    this.positions = [
      [ 104, 114 ],
      [ 94, 140 ],
      [ 85, 171 ],
      [ 80, 197 ],
      [ 76, 228 ],
      [ 74, 259 ],
      [ 71, 292 ],
      [ 67, 323 ],
      [ 67, 354 ],
      [ 61, 380 ],
      [ 140, 135 ],
      [ 142, 166 ],
      [ 145, 195 ],
      [ 145, 224 ],
      [ 143, 255 ],
      [ 140, 287 ],
      [ 138, 317 ],
      [ 132, 346 ],
      [ 128, 377 ],
      [ 170, 148 ],
      [ 171, 179 ],
      [ 171, 210 ],
      [ 172, 241 ],
      [ 171, 273 ],
      [ 169, 304 ],
      [ 167, 337 ],
      [ 163, 368 ],
      [ 163, 400 ],
      [ 208, 138 ],
      [ 208, 167 ],
      [ 206, 198 ],
      [ 205, 229 ],
      [ 203, 260 ],
      [ 202, 291 ],
      [ 200, 322 ],
      [ 197, 352 ],
      [ 196, 383 ],
      [ 239, 125 ],
      [ 236, 155 ],
      [ 234, 185 ],
      [ 233, 216 ],
      [ 232, 247 ],
      [ 231, 279 ],
      [ 230, 310 ],
      [ 227, 341 ],
      [ 226, 371 ],
      [ 224, 400 ],
      [ 266, 109 ],
      [ 283, 140 ],
      [ 292, 171 ],
      [ 292, 202 ],
      [ 292, 237 ],
      [ 290, 267 ],
      [ 295, 297 ],
      [ 296, 328 ],
      [ 295, 358 ],
      [ 290, 387 ]
    ];

    // @public {number} - charge on the sweater
    this.chargeProperty = new Property( 0, {
      tandem: tandem.createTandem( 'chargeProperty' ),
      phetioValueType: TNumber( { type: 'Integer', range: new Range( -this.positions.length, 0 ) } ),
      phetioInstanceDocumentation: 'this value is set internally by the simulation and should not be overridden'
    } );

    var self = this;

    this.x = x;
    this.y = y;

    //location of center of the sweater
    this.center = new Vector2( self.x + self.width / 2, self.y + self.height / 2 );

    // bounds containing the sweater
    this.bounds = new Bounds2( this.x, this.y, this.width, this.height );

    //arrays of plus and minus charges on the sweater, created from positions array above
    this.plusCharges = [];
    this.minusCharges = [];

    var plusChargesGroupTandem = tandem.createGroupTandem( 'plusCharges' );
    var minusChargesGroupTandem = tandem.createGroupTandem( 'minusCharges' );
    this.positions.forEach( function( entry ) {
      var plusCharge = new PointChargeModel( entry[ 0 ], entry[ 1 ] + y, plusChargesGroupTandem.createNextTandem() );
      self.plusCharges.push( plusCharge );

      //minus
      var minusCharge = new PointChargeModel( entry[ 0 ] + PointChargeModel.RADIUS, entry[ 1 ] + y + PointChargeModel.RADIUS, minusChargesGroupTandem.createNextTandem() );
      self.minusCharges.push( minusCharge );
    } );
    this.reset();
  }

  balloonsAndStaticElectricity.register( 'SweaterModel', SweaterModel );

  inherit( Object, SweaterModel, {

    //is balloon over minus charge on sweater?

    /**
     * Check if the balloon is over a minus charge on the sweater.  If it is, move the charge
     * from the sweater to the balloon.  Returns boolean indicating whether or not a charge was moved
     *
     * @param  {type} balloon
     * @return {boolean} chargeMoved - was a charge moved to the balloon?
     */
    findIntersection: function( balloon ) {
      var self = this;
      //active area of balloon rectangle at the left of image
      var balloonLocation = balloon.locationProperty.get();
      var x1 = balloonLocation.x - 5;
      var x2 = balloonLocation.x + 50;
      var y1 = balloonLocation.y - 10;
      var y2 = balloonLocation.y + balloon.height + 10;

      // track whether or not we found a charge
      var chargeMoved = false;

      this.minusCharges.forEach( function( entry ) {
        if ( !entry.movedProperty.get() ) {
          if ( x1 < entry.location.x && entry.location.x < x2 ) {
            if ( y1 < entry.location.y && entry.location.y < y2 ) {
              //if in active area of balloon (x1,y1,x2,y2) then move charge from balloon to sweater
              self.moveChargeTo( entry, balloon );
              chargeMoved = true;
            }
          }
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
     * @return {string}
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
