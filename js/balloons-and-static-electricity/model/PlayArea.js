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

  // constants
  var ORIGIN = new Vector2( 0, 0 );
  var HEIGHT = 16; // way to break up the play area into rows
  var WIDTH = 23; // way to break up the play area into collumns

  /**
   * @constructor
   */
  function PlayArea( width, height ) {

    // total bounds of the play area
    Bounds2.call( this, ORIGIN.x, ORIGIN.y, width, height );

    // collection of critical points in the play area
    // @public (read-only) - at the wall
    this.atWall = 621;
    this.atCenter = 507;
    this.atNearSweater = 393;
    this.atNearWall = 577;

    // width values for each collumn accross the play area
    var leftEdgeWidth = 2 * width / WIDTH;
    var sweaterSectionWidth = 2 * width / WIDTH;
    var centerWidth = 2 * width / WIDTH;
    var rightSideWidth = 4 * width / WIDTH;
    var leftSideWidth = 4 * width / WIDTH;
    var rightEdgeWidth = 3 * width / WIDTH;

    // height values for each row down the play area
    var topHeight = 3.6 * height / HEIGHT;
    var upperHeight = 4.4 * height / HEIGHT;
    var lowerHeight = 4.4 * height / HEIGHT;
    var bottomHeight = 3.6 * height / HEIGHT; 

    // create the rows that run horizontally down the play area'
    var x = ORIGIN.x;
    var y = ORIGIN.y;

    // @public (read-only) - very top of play area
    this.topEdge = new Bounds2( x, y, width, y + topHeight );
    y += topHeight;

    // @public (read-only) - upper part of play area
    this.upper = new Bounds2( x, y, width, y + upperHeight );
    y += upperHeight;

    // @public (read-only) - lower part of play area
    this.lower = new Bounds2( x, y, width, y + lowerHeight );
    y += lowerHeight;

    // @public (read-only) - lower part of play area
    this.bottomEdge = new Bounds2( x, y, width, y + bottomHeight );

    // create the collumns that run vertically accross the play area
    x = ORIGIN.x;
    y = ORIGIN.y;

    // @public (read-only) - left edge of play area
    this.leftEdge = new Bounds2( x, y, x + leftEdgeWidth, height );
    x += leftEdgeWidth;

    // @public (read-only) - left arm down sweater
    this.leftArm = new Bounds2( x, y, x + sweaterSectionWidth, height );
    x += sweaterSectionWidth;

    // @public (read-only) - left side of sweater body arm down sweater
    this.sweaterBodyLeft = new Bounds2( x, y, x + sweaterSectionWidth, height );
    x += sweaterSectionWidth;

    // @public (read-only) - right side of sweater body arm down sweater
    this.sweaterBodyRight = new Bounds2( x, y, x + sweaterSectionWidth, height );
    x += sweaterSectionWidth;

    // @public (read-only) - right arm down sweater
    this.rightArm = new Bounds2( x, y, x + sweaterSectionWidth, height );
    x += sweaterSectionWidth;

    // @public (read-only) - left side of play area (but to the right of sweater)
    this.playAreaLeft = new Bounds2( x, y, x + leftSideWidth, height );
    x += leftSideWidth;

    // @public (read-only) - center of the play area
    this.playAreaCenter = new Bounds2( x, y, x + centerWidth, height );
    x += centerWidth;

    // @public (read-only) - right side of play area (but to the left of the wall)
    this.playAreaRight = new Bounds2( x, y, x + rightSideWidth, height );
    x += rightSideWidth;

    // @public (read-only) - right edge of play area
    this.rightEdge = new Bounds2( x, y, x + rightEdgeWidth, height );

  }

  return inherit( Bounds2, PlayArea );
} );
