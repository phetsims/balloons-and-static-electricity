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
            new Balloon( 10, 10 ),
            new Balloon( 100, 100 )
          ];
          this.wall = new Wall( width - this.wallWidth, 300, height );
        },

        // Called by the animation loop
        step: function () {
          // Make model changes here.
          this.wall.step( this.balloons );
        },

        // Reset the entire model
        reset: function () {

          //Reset the properties in this model
          Fort.Model.prototype.reset.call( this );

          //Reset child models
          this.balloons.forEach( function ( entry ) {
            entry.reset();
          } );
        },
        getBalloonRestrictions: function ( position, objWidth, objHeight ) {
          var rightBound = this.width;
          if ( this.isWallVisible ) {
            rightBound -= this.wallWidth;
          }

          if ( position.x + objWidth > rightBound ) {
            position.x = rightBound - objWidth;
          }

          if ( position.y < 0) {
            position.y = 0;
          } else if (position.y+objHeight > this.height) {
            position.y = this.height - objHeight;
          }

          return position;
        }
      } );

  return BalloonsAndStaticElectricityModel;
} );
