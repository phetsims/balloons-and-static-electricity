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
  var PlayAreaMap = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/PlayAreaMap' );
  var Property = require( 'AXON/Property' );
  var Bounds2 = require( 'DOT/Bounds2' );
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

    // @public {string} - charge visibility setting, valid values of 'all', 'none', 'diff'
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

    // @public
    this.bounds = new Bounds2( 0, 0, width - this.wallWidth, height );

    this.yellowBalloon = new BalloonModel( 440, 100, this, true, BalloonColorsEnum.YELLOW, tandem.createTandem( 'yellowBalloon' ) );
    this.greenBalloon = new BalloonModel( 380, 130, this, false, BalloonColorsEnum.GREEN, tandem.createTandem( 'greenBalloon' ) );
    this.yellowBalloon.other = this.greenBalloon;
    this.greenBalloon.other = this.yellowBalloon;

    // @public (read-only) - Model of the wall
    this.wall = new WallModel( width - this.wallWidth, this.wallWidth, height, this.yellowBalloon, this.greenBalloon, tandem.createTandem( 'wall' ) );

    // when the wall changes visibility, the balloons could start moving if they have charge and are near the wall
    var self = this;
    this.wall.isVisibleProperty.link( function( isVisible ) {
      self.balloons.forEach( function( balloon ) {
        if ( balloon.getCenter().x === self.playArea.atWall && balloon.chargeProperty.get() !== 0 ) {
          balloon.isStoppedProperty.set( false );
        }
      } );

      // update the model bounds
      var newWidth = isVisible ? width - self.wallWidth : width;
      self.bounds.setMaxX( newWidth );
    } );

    // when the balloon locations change, update the closest charge in the wall
    this.balloons.forEach( function( balloon ) {
      balloon.locationProperty.link( function( location ) {
        balloon.closestChargeInWall = self.wall.getClosestChargeToBalloon( balloon );
        balloon.inducingCharge = balloon.closestChargeInWall.displacementIndicatesInducedCharge();

        // update the balloon play area row and column
        balloon.playAreaRowProperty.set( PlayAreaMap.getPlayAreaRow( balloon.getCenter(), self.wall.isVisibleProperty.get() ) );
        balloon.playAreaColumnProperty.set( PlayAreaMap.getPlayAreaColumn( balloon.getCenter() ) );
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

      //flag to check if we outside borders
      var isOutBounds = false;

      // if wall visible, right bound will be smaller by width of wall
      var rightBound = this.bounds.width;

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
  }, {

    /**
     * Get the column of the play area for the a given location in the model.
     * 
     * @param  {Vector2} location
     * @return {string}         
     */
    getPlayAreaColumn: function( location, wallVisible ) {
      var columns = PlayAreaMap.COLUMN_RANGES;

      // loop through keys manually to prevent a many closures from being created during object iteration in 'for in'
      // loops
      var columnsKeys = Object.keys( columns );

      var column;
      var i;
      for ( i = 0; i < columnsKeys.length; i++ ) {
        if ( columns[ columnsKeys[ i ] ].contains( location.x ) ) {
          column = columnsKeys[ i ];
        }
      }
      assert && assert( column, 'object should be in a column of the play area' );

      // the wall and the right edge of the play area overlap, so if the wall is visible, chose that description
      if ( wallVisible && column === 'RIGHT_EDGE' ) {
        column = 'WALL';
      }

      return column;
    },

    /**
     * Get a row in the play area that contains the location in the model.
     * @param  {Vector2} location 
     * @return {strint}
     */
    getPlayAreaRow: function( location ) {
      var rows = PlayAreaMap.ROW_RANGES;

      // loop through keys manually to prevent a many closures from being created during object iteration in 'for in' loops
      var rowKeys = Object.keys( rows );

      var row;
      var i;
      for ( i = 0; i < rowKeys.length; i++ ) {
        if ( rows[ rowKeys[ i ] ].contains( location.y ) ) {
          row = rowKeys[ i ];
        }
      }
      assert && assert( row, 'item should be in a row of the play area' );

      return row;
    }
  } );

  return BalloonsAndStaticElectricityModel;
} );
