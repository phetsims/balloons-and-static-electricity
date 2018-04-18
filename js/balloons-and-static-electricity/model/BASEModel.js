// Copyright 2013-2017, University of Colorado Boulder

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
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );
  var BASEConstants = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/BASEConstants' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PointChargeModel = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/PointChargeModel' );
  var PlayAreaMap = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/PlayAreaMap' );
  var Property = require( 'AXON/Property' );
  var PropertyIO = require( 'AXON/PropertyIO' );
  var SweaterModel = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/SweaterModel' );
  var WallModel = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/WallModel' );

  // phet-io modules
  var StringIO = require( 'ifphetio!PHET_IO/types/StringIO' );

  /**
   * Constructor for main model for the Balloons and Static Electricity sim. 
   * @param {number} width
   * @param {number} height
   * @param {Tandem} tandem
   */
  function BASEModel( width, height, tandem ) {

    // @public {string} - charge visibility setting, valid values of 'all', 'none', 'diff'
    this.showChargesProperty = new Property( 'all', {
      tandem: tandem.createTandem( 'showChargesProperty' ),
      phetioType: PropertyIO( StringIO )
    } );

    // @public {boolean} - whether or not the two balloons are considered 'next to' each other, primarily used for a11y
    this.balloonsAdjacentProperty = new Property( false );

    // @public (read-only)
    this.width = width;
    this.height = height;

    // @public {read-only}
    this.wallWidth = 80;

    // @public (read-only) - Model of the sweater, position empirically determined to match design
    this.sweater = new SweaterModel( 25, 20, tandem.createTandem( 'sweater' ) );

    // @public
    this.playAreaBounds = new Bounds2( 0, 0, width - this.wallWidth, height );

    this.yellowBalloon = new BalloonModel( 440, 100, this, true, tandem.createTandem( 'yellowBalloon' ) );
    this.greenBalloon = new BalloonModel( 380, 130, this, false, tandem.createTandem( 'greenBalloon' ) );
    this.yellowBalloon.other = this.greenBalloon;
    this.greenBalloon.other = this.yellowBalloon;

    // @public (read-only) - Model of the wall
    this.wall = new WallModel( width - this.wallWidth, this.wallWidth, height, this.yellowBalloon, this.greenBalloon, tandem.createTandem( 'wall' ) );

    // when the wall changes visibility, the balloons could start moving if they have charge and are near the wall
    var self = this;
    this.wall.isVisibleProperty.link( function( isVisible ) {

      // update the model bounds
      var newWidth = isVisible ? width - self.wallWidth : width;
      self.playAreaBounds.setMaxX( newWidth );
    } );

    // when the balloon locations change, update the closest charge in the wall
    this.balloons.forEach( function( balloon ) {
      balloon.locationProperty.link( function( location ) {

        // update whether or not the  balloon is inducing charge in the wall - can this be moved to a callback for the
        // chargeDisplacementroperty?
        balloon.closestChargeInWall = self.wall.getClosestChargeToBalloon( balloon );
        var balloonForce = BalloonModel.getForce(
          balloon.closestChargeInWall.locationProperty.get(),
          balloon.getCenter(),
          BASEConstants.COULOMBS_LAW_CONSTANT * balloon.chargeProperty.get() * PointChargeModel.CHARGE,
          2.35
        );
        balloon.inducingChargeProperty.set( balloon.closestChargeInWall.forceIndicatesInducedCharge( balloonForce ) );

        // update whether or not the two balloons are close to each other
        self.balloonsAdjacentProperty.set( self.getBalloonsAdjacent() );

        // update the balloon play area row and column
        balloon.playAreaRowProperty.set( PlayAreaMap.getPlayAreaRow( balloon.getCenter(), self.wall.isVisibleProperty.get() ) );
        balloon.playAreaColumnProperty.set( PlayAreaMap.getPlayAreaColumn( balloon.getCenter() ) );
        balloon.playAreaLandmarkProperty.set( PlayAreaMap.getPlayAreaLandmark( balloon.getCenter() ) );
      } );
    } ); 

    this.reset();
  }

  balloonsAndStaticElectricity.register( 'BASEModel', BASEModel );

  inherit( Object, BASEModel, {

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

    /**
     * Return true when both balloons are visible.
     * @public
     *
     * @return {boolean}
     */
    bothBalloonsVisible: function() {
      return this.greenBalloon.isVisibleProperty.get() && this.yellowBalloon.isVisibleProperty.get();
    },

    /**
     * Returns true when both balloons are visible and adjacent to each other.
     *
     * @return {boolean}
     */
    getBalloonsAdjacent: function() {
      var balloonsAdjacent = ( this.yellowBalloon.getCenter().minus( this.greenBalloon.getCenter() ).magnitude() ) < BalloonModel.BALLOON_WIDTH;
      return balloonsAdjacent && this.bothBalloonsVisible();
    },

    //check if balloon outside world borders and return it to border if outside
    checkBalloonRestrictions: function( position, objWidth, objHeight ) {

      //flag to check if we outside borders
      var isOutBounds = false;

      // if wall visible, right bound will be smaller by width of wall
      var rightBound = this.playAreaBounds.width;

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
    },

    /**
     * Get the distance between the two balloons.
     *
     * @return {number}
     */
    getDistance: function() {
      return this.greenBalloon.getCenter().distance( this.yellowBalloon.getCenter() );
    }
  }, {

    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
    UP: 'UP',
    DOWN: 'DOWN',
    UP_LEFT: 'UP_LEFT',
    UP_RIGHT: 'UP_RIGHT',
    DOWN_LEFT: 'DOWN_LEFT',
    DOWN_RIGHT: 'DOWN_RIGHT'
  } );

  return BASEModel;
} );
