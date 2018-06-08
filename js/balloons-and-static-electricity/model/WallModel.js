// Copyright 2013-2017, University of Colorado Boulder

/**
 * Model of a wall.
 * Wall have electrons which can change position under force from balloons
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var BalloonModel = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/BalloonModel' );
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MovablePointChargeModel = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/MovablePointChargeModel' );
  var PointChargeModel = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/PointChargeModel' );
  var Property = require( 'AXON/Property' );
  var PropertyIO = require( 'AXON/PropertyIO' );
  var Vector2 = require( 'DOT/Vector2' );

  // ifphetio
  var BooleanIO = require( 'ifphetio!PHET_IO/types/BooleanIO' );

  /**
   * @constructor
   * @param {number} x
   * @param {number} width
   * @param {number} height
   * @param {Balloon} yellowBalloon
   * @param {Balloon} greenBalloon
   * @param {Tandem} tandem
   */
  function WallModel( x, width, height, yellowBalloon, greenBalloon, tandem ) {

    //------------------------------------------------
    // Properties of the model.  All user settings belong in the model, whether or not they are part of the physical model
    this.isVisibleProperty = new Property( true, {
      tandem: tandem.createTandem( 'isVisibleProperty' ),
      phetioType: PropertyIO( BooleanIO )
    } );

    // @public (read-only)
    this.x = x; // the left location of the wall
    this.numX = 3; // number of columns with charges
    this.numY = 18; // number of rows with charges
    this.width = width;
    this.height = height;

    // @private {number} - scaling factors for calculating positions for induced charge
    this.dx = Math.round( width / this.numX + 2 );
    this.dy = height / this.numY;

    // @private {array.<PointChargeModel>}
    this.plusCharges = [];
    var plusChargesTandemGroup = tandem.createGroupTandem( 'plusCharges' );

    // @private {array.<MovablePointChargeModel>}
    this.minusCharges = [];
    var minusChargesTandemGroup = tandem.createGroupTandem( 'minusCharges' );

    for ( var i = 0; i < this.numX; i++ ) {
      for ( var k = 0; k < this.numY; k++ ) {

        //plus
        var position = this.calculatePosition( i, k );
        var plusCharge = new PointChargeModel( x + position[ 0 ], position[ 1 ], plusChargesTandemGroup.createNextTandem(), false );
        this.plusCharges.push( plusCharge );

        //minus
        var minusCharge = new MovablePointChargeModel(
          x + position[ 0 ] - PointChargeModel.RADIUS,
          position[ 1 ] - PointChargeModel.RADIUS,
          minusChargesTandemGroup.createNextTandem(),
          false
        );
        this.minusCharges.push( minusCharge );
      }
    }

    var self = this;
    var updateChargePositions = function() {

      // value for k for calculating forces, chosen so that motion of the balloon looks like Java version
      var k = 10000;
      
      // calculate force from Balloon to each charge in the wall, we subtract by the PointChargeModel radius
      // to make the force look correct because each charge is minus charge is shifted down by that much initially
      self.minusCharges.forEach( function( entry ) {
        var ch = entry;
        var dv1 = new Vector2( 0, 0 );
        var dv2 = new Vector2( 0, 0 );

        var defaultLocation = ch.locationProperty.initialValue;
        if ( yellowBalloon.isVisibleProperty.get() ) {
          dv1 = BalloonModel.getForce(
            defaultLocation,
            yellowBalloon.getChargeCenter().minusXY( 0, 2 * PointChargeModel.RADIUS ),
            k * PointChargeModel.CHARGE * yellowBalloon.chargeProperty.get(),
            2.35
          );
        }
        if ( greenBalloon.isVisibleProperty.get() ) {
          dv2 = BalloonModel.getForce(
            defaultLocation,
            greenBalloon.getChargeCenter().minusXY( 0, 2 * PointChargeModel.RADIUS ),
            k * PointChargeModel.CHARGE * greenBalloon.chargeProperty.get(),
            2.35
          );
        }
        entry.locationProperty.set(
          new Vector2( defaultLocation.x + dv1.x + dv2.x, defaultLocation.y + dv1.y + dv2.y )
        );
      } );
    };
    yellowBalloon.locationProperty.link( updateChargePositions );
    greenBalloon.locationProperty.link( updateChargePositions );
    yellowBalloon.isVisibleProperty.link( updateChargePositions );
    greenBalloon.isVisibleProperty.link( updateChargePositions );
    yellowBalloon.chargeProperty.link( updateChargePositions );
    greenBalloon.chargeProperty.link( updateChargePositions );

    // if a balloon was stuck to the wall and visible when the wall becomes invisible, we need to
    // notify that the balloon was released by reseting the timer
    var balloons = [ yellowBalloon, greenBalloon ];
    this.isVisibleProperty.link( function( isVisible ) {
      if ( !isVisible ) {
        for ( var i = 0; i < balloons.length; i++ ) {
          var balloon = balloons[ i ];
          if ( balloon.isVisibleProperty.get() && balloon.rightAtWallLocation() && balloon.isCharged() ) {
            balloon.timeSinceRelease = 0;
          }
        }
      }
    } );
  }

  balloonsAndStaticElectricity.register( 'WallModel', WallModel );

  return inherit( Object, WallModel, {

    // Reset the entire model
    reset: function() {

      //Reset the properties in this model
      this.isVisibleProperty.reset();
      this.minusCharges.forEach( function( entry ) {
        entry.reset();
      } );
    },

    //function to place charges on wall's grid
    calculatePosition: function( i, k ) {
      var y0 = i % 2 === 0 ? this.dy / 2 : 1;
      return [ i * this.dx + PointChargeModel.RADIUS + 1, k * this.dy + y0 ];
    },

    /**
     * Get the minus charge that is the closest in the wall to the balloon, relative to the charge's initial
     * position.
     * 
     * @return {MovablePointChargeModel}
     */
    getClosestChargeToBalloon: function( balloon ) {
      var minusCharges = this.minusCharges;

      // get the minus charge that is closest to the balloon
      var closestCharge = null;
      var chargeDistance = Number.POSITIVE_INFINITY;
      var balloonChargeCenter = balloon.getChargeCenter();

      for ( var i = 0; i < minusCharges.length; i++ ) {
        var charge = minusCharges[ i ];
        var newChargeDistance = charge.locationProperty.initialValue.distance( balloonChargeCenter );

        if ( newChargeDistance < chargeDistance ) {
          chargeDistance = newChargeDistance;
          closestCharge = charge;
        }
      }
      assert && assert( charge, 'Unable to find charge closest to balloon' );

      return closestCharge;
    }
  } );
} );