// Copyright 2002-2013, University of Colorado

/**
 * Model of a wall.
 * Wall have electrons which can change position under force from balloons
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';
  var Fort = require( 'FORT/Fort' );
  var BalloonModel = require( "model/BalloonModel" );
  var Vector2 = require( 'DOT/Vector2' );
  var PointChargeModel = require( 'model/PointChargeModel' );

  var WallModel = Fort.Model.extend(
      {
        //Properties of the model.  All user settings belong in the model, whether or not they are part of the physical model
        defaults: {
          numX: 3, //number of columns with charges
          numY: 18, //number of rows with charges
          isVisible: true,
          x: 0
        },
        init: function( x, width, height ) {
          this.dx = Math.round( 80 / this.numX + 2 );
          this.dy = height / this.numY;
          this.x = x;
          this.width = width;
          this.height = height;

          this.plusCharges = [];
          this.minusCharges = [];

          for ( var i = 0; i < this.numX; i++ ) {
            for ( var k = 0; k < this.numY; k++ ) {
              //plus
              var position = this.calculatePosition( i, k );
              var plusCharge = new PointChargeModel( x + position[0], position[1] );

              this.plusCharges.push( plusCharge );

              //minus
              position = this.calculatePosition( i, k );
              var minusCharge = new PointChargeModel( x + position[0], position[1] );
              this.minusCharges.push( minusCharge );
            }
          }
        },

        step: function( model ) {

          var k = 10000;
          //calculate force from Balloon to each charge in the wall
          this.minusCharges.forEach( function( entry ) {
            var ch = entry;
            var dv1 = new Vector2( 0, 0 );
            var dv2 = new Vector2( 0, 0 );
            if ( model.balloons[0].isVisible ) {
              dv1 = BalloonModel.getForce( ch.defaultLocation, model.balloons[0].getCenter(), k * PointChargeModel.charge * model.balloons[0].charge, 2.35 );
            }
            if ( model.balloons[1].isVisible ) {
              dv2 = BalloonModel.getForce( ch.defaultLocation, model.balloons[1].getCenter(), k * PointChargeModel.charge * model.balloons[1].charge, 2.35 );
            }
            entry.location = new Vector2( entry.defaultLocation.x + dv1.x + dv2.x, entry.defaultLocation.y + dv1.y + dv2.y );
          } );
          // Make model changes here.
        },

        // Reset the entire model
        reset: function() {

          //Reset the properties in this model
          Fort.Model.prototype.reset.call( this );
          this.minusCharges.forEach( function( entry ) {
            entry.reset();
          } );
        },

        //function to place charges on wall's grid
        calculatePosition: function( i, k ) {
          var y0 = i % 2 === 0 ? this.dy / 2 : 1;
          return [i * this.dx + PointChargeModel.radius + 1, k * this.dy + y0];
        }
      } );

  return WallModel;
} );