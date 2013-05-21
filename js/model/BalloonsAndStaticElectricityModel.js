// Copyright 2002-2013, University of Colorado

/**
 * main Model container.
 * Model contains wall, balloons, sweater
 * @author Vasily Shakhov (Mlearner.com)
 */
define( function( require ) {
  'use strict';
  var BalloonModel = require( 'model/BalloonModel' );
  var WallModel = require( 'model/WallModel' );
  var SweaterModel = require( 'model/SweaterModel' );
  var Fort = require( 'FORT/Fort' );

  var BalloonsAndStaticElectricityModel = Fort.Model.extend(
      {
        //Properties of the model.  All user settings belong in the model, whether or not they are part of the physical model
        defaults: {
          wallWidth: 70,
          showCharges: "all"
        },

        //Main constructor
        init: function( width, height ) {
          this.width = width;
          this.height = height;

          this.balloons = [
            new BalloonModel( 460, 10, true ),
            new BalloonModel( 400, 200, false )
          ];
          this.balloons[0].other = this.balloons[1];
          this.balloons[1].other = this.balloons[0];

          this.wall = new WallModel( width - this.wallWidth, 600, height );
          this.sweater = new SweaterModel( 0, -50 );

          this.bounds = [this.sweater.center.x, 0, width - this.wallWidth, height];

          this.reset();
        },

        // Called by the animation loop
        step: function() {
          var self = this;
          // Make model changes here.
          var curTime = Date.now();
          var dt = curTime - this.oldTime;

          this.wall.step( self );
          this.balloons.forEach( function( entry ) {
            if ( entry.isVisible ) {
              entry.step( self, dt );
            }
          } );

          this.oldTime = curTime;
        },

        // Reset the entire model
        reset: function() {

          //Reset the properties in this model
          Fort.Model.prototype.reset.call( this );
          this.resetChildren();

          //Reset balloons, resetChildren don't get them
          this.balloons.forEach( function( entry ) {
            entry.reset();
          } );

          this.sweater.reset();
          this.oldTime = Date.now();
        },
        getBalloonRestrictions: function( position, objWidth, objHeight ) {
          var rightBound = this.width;
          if ( this.wall.isVisible ) {
            rightBound -= this.wallWidth;
          }

          if ( position.x + objWidth > rightBound ) {
            position.x = rightBound - objWidth;
          }

          if ( position.y < 0 ) {
            position.y = 0;
          }

          if ( position.x < 0 ) {
            position.x = 0;
          }
          else if ( position.y + objHeight > this.height ) {
            position.y = this.height - objHeight;
          }

          return position;
        }
      } );

  return BalloonsAndStaticElectricityModel;
} );
