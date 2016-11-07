// Copyright 2013-2015, University of Colorado Boulder

/**
 * main Model container.
 * Model contains wall, balloons, sweater
 * @author Vasily Shakhov (Mlearner.com)
 */
define( function( require ) {
  'use strict';

  // modules
  var BalloonModel = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/BalloonModel' );
  var WallModel = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/WallModel' );
  var SweaterModel = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/SweaterModel' );
  var PlayArea = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/PlayArea' );
  var PropertySet = require( 'AXON/PropertySet' );
  var BalloonColorsEnum = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/BalloonColorsEnum' );
  var inherit = require( 'PHET_CORE/inherit' );
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );

  function BalloonsAndStaticElectricityModel( width, height ) {

    //Properties of the model.  All user settings belong in the model, whether or not they are part of the physical model
    PropertySet.call( this, { wallWidth: 80, showCharges: 'all' } );

    this.width = width;
    this.height = height;

    this.playArea = new PlayArea( width, height );

    this.wall = new WallModel( width - this.wallWidth, 600, height );
    this.sweater = new SweaterModel( 0, -50 );

    this.bounds = {
      minX: 0,
      minY: 0,
      maxX: width - this.wallWidth,
      maxY: height
    };

    this.balloons = [
      new BalloonModel( 440, 100, this, true, BalloonColorsEnum.YELLOW ),
      new BalloonModel( 380, 130, this, false, BalloonColorsEnum.GREEN )
    ];
    this.balloons[ 0 ].other = this.balloons[ 1 ];
    this.balloons[ 1 ].other = this.balloons[ 0 ];

    // when the wall changes visibility, the balloons could start moving if they have charge and are
    // near the wall
    var self = this;
    this.wall.isVisibleProperty.link( function( isVisible ) {
      self.balloons.forEach( function( balloon ) {
        if ( balloon.getCenter().x === self.playArea.atWall && balloon.charge !== 0 ) {
          balloon.isStoppedProperty.set( false );
        }
      } );
    } );

    this.reset();
  }

  balloonsAndStaticElectricity.register( 'BalloonsAndStaticElectricityModel', BalloonsAndStaticElectricityModel );

  inherit( PropertySet, BalloonsAndStaticElectricityModel, {
    // Called by the animation loop
    step: function() {
      var self = this;
      // Make model changes here.
      var curTime = Date.now();
      var dt = curTime - this.oldTime;

      this.wall.step( self );
      this.balloons.forEach( function( entry ) {
        if ( entry.isVisibleProperty.get() ) {
          entry.step( self, dt );
        }
      } );

      this.oldTime = curTime;
    },

    anyChargedBalloonTouchingWall: function() {
      var chargedYellowTouchingWall = this.balloons[ 0 ].touchingWall() && this.balloons[ 0 ].chargeProperty.get() < 0;
      var chargedGreenTouchingWall = this.balloons[ 1 ].touchingWall() && this.balloons[ 1 ].chargeProperty.get() < 0;

      return chargedYellowTouchingWall || chargedGreenTouchingWall;
    },

    // Reset the entire model
    reset: function() {

      //Reset the properties in this model
      PropertySet.prototype.reset.call( this );

      //Reset balloons, resetChildren don't get them
      this.balloons.forEach( function( entry ) {
        entry.reset();
      } );

      this.sweater.reset();
      this.wall.reset();
      this.oldTime = Date.now();
    },
    //check if balloon outside world borders and return it to border if outside
    checkBalloonRestrictions: function( position, objWidth, objHeight ) {
      var rightBound = this.width;
      //flag to check if we outside borders
      var isOutBounds = false;
      //if wall exist - right border smaller on wallWidth
      if ( this.wall.isVisible ) {
        rightBound -= this.wallWidth;
      }

      //if more than maxRight position - set maxRight position
      if ( position.x + objWidth > rightBound ) {
        position.x = rightBound - objWidth;
        isOutBounds = true;
      }

      //if less then top border set y to minTop position
      if ( position.y < 0 ) {
        position.y = 0;
        isOutBounds = true;
      }//if larger then bottom border set y to maxTop position
      else if ( position.y + objHeight > this.height ) {
        position.y = this.height - objHeight;
        isOutBounds = true;
      }

      //if smaller then left border set x to minLeft position
      if ( position.x < 0 ) {
        position.x = 0;
        isOutBounds = true;
      }

      //set flag
      position.isOutBounds = isOutBounds;
      return position;
    }
  } );

  return BalloonsAndStaticElectricityModel;
} );
