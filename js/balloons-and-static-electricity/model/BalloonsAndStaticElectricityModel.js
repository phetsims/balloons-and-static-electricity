// Copyright 2013-2015, University of Colorado Boulder

/**
 * Main model container, which has wall, balloons & sweater.
 *
 * @author Vasily Shakhov (Mlearner.com)
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Jesse Greenberg(PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var BalloonModel = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/BalloonModel' );
  var WallModel = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/WallModel' );
  var SweaterModel = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/SweaterModel' );
  var PlayArea2 = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/PlayArea2' );
  var Property = require( 'AXON/Property' );
  var BalloonColorsEnum = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/BalloonColorsEnum' );
  var inherit = require( 'PHET_CORE/inherit' );
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );

  // phet-io modules
  var TString = require( 'ifphetio!PHET_IO/types/TString' );

  /**
   * [BalloonsAndStaticElectricityModel description]
   * @param {number} width
   * @param {number} height
   * @param {Tandem} tandem
   */
  function BalloonsAndStaticElectricityModel( width, height, tandem ) {

    // @public {string} - charge visibility setting
    this.showChargesProperty = new Property( 'all', {
      tandem: tandem.createTandem( 'showChargesProperty' ),
      phetioValueType: TString
    } );

    // @public (read-only)
    this.width = width;
    this.height = height;

    // @public {read-only}
    this.wallWidth = 80;

    this.playArea = new PlayArea2( width, height, tandem.createTandem( 'playArea' ) );

    // @public (read-only) - Model of the sweater, position empirically determined to match design
    this.sweater = new SweaterModel( 25, 20, tandem.createTandem( 'sweater' ) );

    this.bounds = {
      minX: 0,
      minY: 0,
      maxX: width - this.wallWidth,
      maxY: height
    };

    this.yellowBalloon = new BalloonModel( 440, 100, this, true, BalloonColorsEnum.YELLOW, tandem.createTandem( 'yellowBalloon' ) );
    this.greenBalloon = new BalloonModel( 380, 130, this, false, BalloonColorsEnum.GREEN, tandem.createTandem( 'greenBalloon' ) );
    this.yellowBalloon.other = this.greenBalloon;
    this.greenBalloon.other = this.yellowBalloon;

    this.wall = new WallModel( width - this.wallWidth, 600, height, this.yellowBalloon, this.greenBalloon, tandem.createTandem( 'wall' ) );

    // when the wall changes visibility, the balloons could start moving if they have charge and are near the wall
    var self = this;
    this.wall.isVisibleProperty.link( function( isVisible ) {
      self.balloons.forEach( function( balloon ) {
        if ( balloon.getCenter().x === self.playArea.atWall && balloon.chargeProperty.get() !== 0 ) {
          balloon.isStoppedProperty.set( false );
        }
      } );
    } );

    this.reset();
  }

  balloonsAndStaticElectricity.register( 'BalloonsAndStaticElectricityModel', BalloonsAndStaticElectricityModel );

  inherit( Object, BalloonsAndStaticElectricityModel, {

    /**
     * Get all of the ballons in an array, for ease of iterating over them.
     * @returns {BalloonModel[]}
     */
    get balloons() {
      return [ this.yellowBalloon, this.greenBalloon ];
    },

    // Called by the animation loop
    step: function( dt ) {
      var self = this;

      this.balloons.forEach( function( balloon ) {
        if ( balloon.isVisibleProperty.get() ) {
          balloon.step( self, dt );
        }
      } );
    },

    anyChargedBalloonTouchingWall: function() {
      var chargedYellowTouchingWall = this.yellowBalloon.touchingWall() && this.yellowBalloon.chargeProperty.get() < 0;
      var chargedGreenTouchingWall = this.greenBalloon.touchingWall() && this.greenBalloon.chargeProperty.get() < 0;

      return chargedYellowTouchingWall || chargedGreenTouchingWall;
    },

    // Reset the entire model
    reset: function() {

      //Reset the properties in this model
      this.showChargesProperty.reset();

      //Reset balloons, resetChildren don't get them
      this.balloons.forEach( function( balloon ) {
        balloon.reset();
      } );

      this.sweater.reset();
      this.wall.reset();
    },

    //check if balloon outside world borders and return it to border if outside
    checkBalloonRestrictions: function( position, objWidth, objHeight ) {
      var rightBound = this.width;

      //flag to check if we outside borders
      var isOutBounds = false;

      //if wall exist - right border smaller on wallWidth
      if ( this.wall.isVisibleProperty.get() ) {
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
      }
      else if ( position.y + objHeight > this.height ) {

        //if larger then bottom border set y to maxTop position
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
