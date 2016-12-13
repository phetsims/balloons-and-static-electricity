// Copyright 2013-2015, University of Colorado Boulder

/**
 * Model of a wall.
 * Wall have electrons which can change position under force from balloons
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var Property = require( 'AXON/Property' );
  var BalloonModel = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/BalloonModel' );
  var Vector2 = require( 'DOT/Vector2' );
  var PointChargeModel = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/PointChargeModel' );
  var inherit = require( 'PHET_CORE/inherit' );
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );

  // phet-io modules
  var TBoolean = require( 'ifphetio!PHET_IO/types/TBoolean' );

  /**
   * @constructor
   * @param {number} x     
   * @param {number} width  
   * @param {number} height 
   * @param {Tandem} tandem
   */
  function WallModel( x, width, height, tandem ) {

    //------------------------------------------------
    // Properties of the model.  All user settings belong in the model, whether or not they are part of the physical model
    this.isVisibleProperty = new Property( true, {
      tandem: tandem.createTandem( 'isVisibleProperty' ),
      phetioValueType: TBoolean
    } );

    // @public (read-only)
    this.x = x;
    this.numX = 3; // number of columns with charges
    this.numY = 18; // number of rows with charges

    this.dx = Math.round( 80 / this.numX + 2 );
    this.dy = height / this.numY;
    this.width = width;
    this.height = height;

    this.plusCharges = [];
    this.minusCharges = [];

    var plusChargesTandemGroup = tandem.createGroupTandem( 'plusCharges' );
    var minusChargesTandemGroup = tandem.createGroupTandem( 'minusCharges' );

    for ( var i = 0; i < this.numX; i++ ) {
      for ( var k = 0; k < this.numY; k++ ) {
        //plus
        var position = this.calculatePosition( i, k );
        var plusCharge = new PointChargeModel( x + position[ 0 ], position[ 1 ], plusChargesTandemGroup.createNextTandem() );

        this.plusCharges.push( plusCharge );

        //minus
        var minusCharge = new PointChargeModel(
          x + position[ 0 ] - PointChargeModel.radius,
          position[ 1 ] - PointChargeModel.radius,
          minusChargesTandemGroup.createNextTandem()
        );
        this.minusCharges.push( minusCharge );
      }
    }

  }

  balloonsAndStaticElectricity.register( 'WallModel', WallModel );

  inherit( Object, WallModel, {

    step: function( model ) {

      var k = 10000;
      //calculate force from Balloon to each charge in the wall
      this.minusCharges.forEach( function( entry ) {
        var ch = entry;
        var dv1 = new Vector2( 0, 0 );
        var dv2 = new Vector2( 0, 0 );
        if ( model.yellowBalloon.isVisibleProperty.get() ) {
          dv1 = BalloonModel.getForce( ch.defaultLocation, model.yellowBalloon.getCenter(), k * PointChargeModel.charge * model.yellowBalloon.chargeProperty.get(), 2.35 );
        }
        if ( model.greenBalloon.isVisibleProperty.get() ) {
          dv2 = BalloonModel.getForce( ch.defaultLocation, model.greenBalloon.getCenter(), k * PointChargeModel.charge * model.greenBalloon.chargeProperty.get(), 2.35 );
        }
        entry.locationProperty.set(
          new Vector2( entry.defaultLocation.x + dv1.x + dv2.x, entry.defaultLocation.y + dv1.y + dv2.y )
        );
      } );
      // Make model changes here.
    },

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
      return [ i * this.dx + PointChargeModel.radius + 1, k * this.dy + y0 ];
    }
  } );
  return WallModel;
} );