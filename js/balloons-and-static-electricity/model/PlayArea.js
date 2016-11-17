// Copyright 2016, University of Colorado Boulder

/**
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Vector2 = require( 'DOT/Vector2' );
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );
  var BalloonLocationEnum = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/BalloonLocationEnum' );

  // constants
  var ORIGIN = new Vector2( 0, 0 );
  var HEIGHT = 16; // way to break up the play area into rows
  var WIDTH = 23; // way to break up the play area into collumns

  /**
   * @constructor
   * @param {number} width
   * @param {number} height
   * @param {Tandem} tandem
   */
  function PlayArea( width, height, tandem ) {

    // total bounds of the play area
    Bounds2.call( this, ORIGIN.x, ORIGIN.y, width, height );

    // collection of critical x points in the play area
    // @public (read-only) - at the wall
    this.atWall = 621;
    this.atCenter = 507;
    this.atNearSweater = 375;
    this.atNearWall = 577;
    this.atSweater = 393;
    this.atRightEdgeOfPlayArea = 701;
    this.atLeftEdgeOfPlayArea = 67;

    // collection of critical y points in the play area
    this.atTopOfPlayArea = 118;
    this.atBottomOfPlayArea = 393;

    // width values for each collumn accross the play area
    var leftEdgeWidth = 2.1 * width / WIDTH;
    var sweaterSectionWidth = 2 * width / WIDTH;
    var centerWidth = 2 * width / WIDTH;
    var rightSideWidth = 4 * width / WIDTH;
    var leftSideWidth = 4 * width / WIDTH;
    var rightEdgeWidth = 2.9 * width / WIDTH;

    // height values for each row down the play area
    var topHeight = 3.6 * height / HEIGHT;
    var upperHeight = 4.4 * height / HEIGHT;
    var lowerHeight = 4.4 * height / HEIGHT;
    var bottomHeight = 3.6 * height / HEIGHT;

    // create the rows that run horizontally down the play area'
    var x = ORIGIN.x;
    var y = ORIGIN.y;

    // @public (read-only) - very top of play area
    this.topRow = new Bounds2( x, y, width, y + topHeight );
    y += topHeight;

    // @public (read-only) - upper part of play area
    this.upperRow = new Bounds2( x, y, width, y + upperHeight );
    y += upperHeight;

    // @public (read-only) - lower part of play area
    this.lowerRow = new Bounds2( x, y, width, y + lowerHeight );
    y += lowerHeight;

    // @public (read-only) - lower part of play area
    this.bottomRow = new Bounds2( x, y, width, y + bottomHeight );

    // create the collumns that run vertically accross the play area
    x = ORIGIN.x;
    y = ORIGIN.y;

    // @public (read-only) - left edge of play area
    this.leftColumn = new Bounds2( x, y, x + leftEdgeWidth, height );
    x += leftEdgeWidth;

    // @public (read-only) - left arm down sweater
    this.leftArmColumn = new Bounds2( x, y, x + sweaterSectionWidth, height );
    x += sweaterSectionWidth;

    // @public (read-only) - left side of sweater body arm down sweater
    this.leftBodyColumn = new Bounds2( x, y, x + sweaterSectionWidth, height );
    x += sweaterSectionWidth;

    // @public (read-only) - right side of sweater body arm down sweater
    this.rightBodyColumn = new Bounds2( x, y, x + sweaterSectionWidth, height );
    x += sweaterSectionWidth;

    // @public (read-only) - right arm down sweater
    this.rightArmColumn = new Bounds2( x, y, x + sweaterSectionWidth, height );
    x += sweaterSectionWidth;

    // @public (read-only) - left side of play area (but to the right of sweater)
    this.playAreaLeftColumn = new Bounds2( x, y, x + leftSideWidth, height );
    x += leftSideWidth;

    // @public (read-only) - center of the play area
    this.playAreaCenterColumn = new Bounds2( x, y, x + centerWidth, height );
    x += centerWidth;

    // @public (read-only) - right side of play area (but to the left of the wall)
    this.playAreaRightColumn = new Bounds2( x, y, x + rightSideWidth, height );
    x += rightSideWidth;

    // @public (read-only) - right edge of play area
    this.rightColumn = new Bounds2( x, y, x + rightEdgeWidth, height );

  }

  balloonsAndStaticElectricity.register( 'PlayArea', PlayArea );

  return inherit( Bounds2, PlayArea, {

    /**
     * Determine which section of the play area the location vector is.
     * NOTE: Is this relative to upper left corner of balloon bounds or its center?
     * @param  {Vector2} position
     * @return {string}
     */
    getPointBounds: function( position ) {

      // bounds along the bottom row
      if ( this.bottomRow.containsPoint( position ) && this.leftColumn.containsPoint( position ) ) {
        return BalloonLocationEnum.BOTTOM_LEFT;
      }
      else if ( this.bottomRow.containsPoint( position ) && this.leftArmColumn.containsPoint( position ) ) {
        return BalloonLocationEnum.BOTTOM_LEFT_ARM;
      }
      else if ( this.bottomRow.containsPoint( position ) && this.leftBodyColumn.containsPoint( position ) ) {
        return BalloonLocationEnum.BOTTOM_LEFT_SWEATER;
      }
      else if ( this.bottomRow.containsPoint( position ) && this.rightBodyColumn.containsPoint( position ) ) {
        return BalloonLocationEnum.BOTTOM_RIGHT_SWEATER;
      }
      else if ( this.bottomRow.containsPoint( position ) && this.rightArmColumn.containsPoint( position ) ) {
        return BalloonLocationEnum.BOTTOM_RIGHT_ARM;
      }
      else if ( this.bottomRow.containsPoint( position ) && this.playAreaLeftColumn.containsPoint( position ) ) {
        return BalloonLocationEnum.BOTTOM_LEFT_PLAY_AREA;
      }
      else if ( this.bottomRow.containsPoint( position ) && this.playAreaCenterColumn.containsPoint( position ) ) {
        return BalloonLocationEnum.BOTTOM_CENTER_PLAY_AREA;
      }
      else if ( this.bottomRow.containsPoint( position ) && this.playAreaRightColumn.containsPoint( position ) ) {
        return BalloonLocationEnum.BOTTOM_RIGHT_PLAY_AREA;
      }
      else if ( this.bottomRow.containsPoint( position ) && this.rightColumn.containsPoint( position ) ) {
        return BalloonLocationEnum.BOTTOM_RIGHT;
      }

      // bounds along the lower row
      else if ( this.lowerRow.containsPoint( position ) && this.leftColumn.containsPoint( position ) ) {
        return BalloonLocationEnum.LOWER_LEFT;
      }
      else if ( this.lowerRow.containsPoint( position ) && this.leftArmColumn.containsPoint( position ) ) {
        return BalloonLocationEnum.LOWER_LEFT_ARM;
      }
      else if ( this.lowerRow.containsPoint( position ) && this.leftBodyColumn.containsPoint( position ) ) {
        return BalloonLocationEnum.LOWER_LEFT_SWEATER;
      }
      else if ( this.lowerRow.containsPoint( position ) && this.rightBodyColumn.containsPoint( position ) ) {
        return BalloonLocationEnum.LOWER_RIGHT_SWEATER;
      }
      else if ( this.lowerRow.containsPoint( position ) && this.rightArmColumn.containsPoint( position ) ) {
        return BalloonLocationEnum.LOWER_RIGHT_ARM;
      }
      else if ( this.lowerRow.containsPoint( position ) && this.playAreaLeftColumn.containsPoint( position ) ) {
        return BalloonLocationEnum.LOWER_LEFT_PLAY_AREA;
      }
      else if ( this.lowerRow.containsPoint( position ) && this.playAreaCenterColumn.containsPoint( position ) ) {
        return BalloonLocationEnum.LOWER_CENTER_PLAY_AREA;
      }
      else if ( this.lowerRow.containsPoint( position ) && this.playAreaRightColumn.containsPoint( position ) ) {
        return BalloonLocationEnum.LOWER_RIGHT_PLAY_AREA;
      }
      else if ( this.lowerRow.containsPoint( position ) && this.rightColumn.containsPoint( position ) ) {
        return BalloonLocationEnum.LOWER_RIGHT;
      }

      // bounds along the upper row
      else if ( this.upperRow.containsPoint( position ) && this.leftColumn.containsPoint( position ) ) {
        return BalloonLocationEnum.UPPER_LEFT;
      }
      else if ( this.upperRow.containsPoint( position ) && this.leftArmColumn.containsPoint( position ) ) {
        return BalloonLocationEnum.UPPER_LEFT_ARM;
      }
      else if ( this.upperRow.containsPoint( position ) && this.leftBodyColumn.containsPoint( position ) ) {
        return BalloonLocationEnum.UPPER_LEFT_SWEATER;
      }
      else if ( this.upperRow.containsPoint( position ) && this.rightBodyColumn.containsPoint( position ) ) {
        return BalloonLocationEnum.UPPER_RIGHT_SWEATER;
      }
      else if ( this.upperRow.containsPoint( position ) && this.rightArmColumn.containsPoint( position ) ) {
        return BalloonLocationEnum.UPPER_RIGHT_ARM;
      }
      else if ( this.upperRow.containsPoint( position ) && this.playAreaLeftColumn.containsPoint( position ) ) {
        return BalloonLocationEnum.UPPER_LEFT_PLAY_AREA;
      }
      else if ( this.upperRow.containsPoint( position ) && this.playAreaCenterColumn.containsPoint( position ) ) {
        return BalloonLocationEnum.UPPER_CENTER_PLAY_AREA;
      }
      else if ( this.upperRow.containsPoint( position ) && this.playAreaRightColumn.containsPoint( position ) ) {
        return BalloonLocationEnum.UPPER_RIGHT_PLAY_AREA;
      }
      else if ( this.upperRow.containsPoint( position ) && this.rightColumn.containsPoint( position ) ) {
        return BalloonLocationEnum.UPPER_RIGHT;
      }

      // bounds along the top row
      else if ( this.topRow.containsPoint( position ) && this.leftColumn.containsPoint( position ) ) {
        return BalloonLocationEnum.TOP_LEFT;
      }
      else if ( this.topRow.containsPoint( position ) && this.leftArmColumn.containsPoint( position ) ) {
        return BalloonLocationEnum.TOP_LEFT_ARM;
      }
      else if ( this.topRow.containsPoint( position ) && this.leftBodyColumn.containsPoint( position ) ) {
        return BalloonLocationEnum.TOP_LEFT_SWEATER;
      }
      else if ( this.topRow.containsPoint( position ) && this.rightBodyColumn.containsPoint( position ) ) {
        return BalloonLocationEnum.TOP_RIGHT_SWEATER;
      }
      else if ( this.topRow.containsPoint( position ) && this.rightArmColumn.containsPoint( position ) ) {
        return BalloonLocationEnum.TOP_RIGHT_ARM;
      }
      else if ( this.topRow.containsPoint( position ) && this.playAreaLeftColumn.containsPoint( position ) ) {
        return BalloonLocationEnum.TOP_LEFT_PLAY_AREA;
      }
      else if ( this.topRow.containsPoint( position ) && this.playAreaCenterColumn.containsPoint( position ) ) {
        return BalloonLocationEnum.TOP_CENTER_PLAY_AREA;
      }
      else if ( this.topRow.containsPoint( position ) && this.playAreaRightColumn.containsPoint( position ) ) {
        return BalloonLocationEnum.TOP_RIGHT_PLAY_AREA;
      }
      else if ( this.topRow.containsPoint( position ) && this.rightColumn.containsPoint( position ) ) {
        return BalloonLocationEnum.TOP_RIGHT;
      }
    }
  } );
} );
