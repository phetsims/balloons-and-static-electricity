// Copyright 2002-2013, University of Colorado

/**
 * Model container.
 *
 * @author Vasily Shakhov (Mlearner.com)
 */
define( function ( require ) {
  'use strict';
  var Balloon = require( 'model/BalloonModel' );
  var Wall = require( 'model/WallModel' );
  var Sweater = require( 'model/SweaterModel' );
  var Fort = require( 'FORT/Fort' );

  var BalloonsAndStaticElectricityModel = Fort.Model.extend(
      {
        //Properties of the model.  All user settings belong in the model, whether or not they are part of the physical model
        defaults: {
          isWallVisible: true,
          wallWidth: 70
        },

        //Main constructor
        init: function ( width, height ) {
          this.width = width;
          this.height = height;

          this.balloons = [
            new Balloon( 500, 10 ),
            new Balloon( 400, 100 )
          ];
          this.balloons[0].other = this.balloons[1];
          this.balloons[1].other = this.balloons[0];

          this.wall = new Wall( width-this.wallWidth,300, height );
          //if we write 0 instead of "0", then parameter becomes object, not number
          this.sweater = new Sweater( 0, "0" );

          this.bounds = [this.sweater.center.x, 0, width - this.wallWidth, height];

          this.reset();
        },

        // Called by the animation loop
        step: function () {
          var self = this;
          // Make model changes here.
          var curTime = new Date().getTime();
          var dt = curTime - this.oldTime;

          this.wall.step( self );
          this.balloons.forEach( function ( entry ) {
            if ( entry.isVisible ) {
              entry.step( self, dt );
            }
          } );

          this.oldTime = curTime;
        },

        // Reset the entire model
        reset: function () {

          //Reset the properties in this model
          Fort.Model.prototype.reset.call( this );

          //Reset child models
          this.balloons.forEach( function ( entry ) {
            entry.reset();
          } );

          this.oldTime = new Date().getTime();
        },
        getBalloonRestrictions: function ( position, objWidth, objHeight ) {
          var rightBound = this.width;
          if ( this.isWallVisible ) {
            rightBound -= this.wallWidth;
          }

          if ( position.x + objWidth > rightBound ) {
            position.x = rightBound - objWidth;
          }

          if ( position.y < 0 ) {
            position.y = 0;
          }
          else if ( position.y + objHeight > this.height ) {
            position.y = this.height - objHeight;
          }

          return position;
        }
      } );

  return BalloonsAndStaticElectricityModel;
} );
