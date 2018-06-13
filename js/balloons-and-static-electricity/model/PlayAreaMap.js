// Copyright 2017, University of Colorado Boulder

/**
 * A map of the 2D play area for this simulation.  The play area includes anywhere that the Balloons can move about,
 * so it contains the entire bounds of the model.  This map is used for accessibility to generate descriptions about
 * where the balloons are as they move around the play area.
 * 
 * The map is composed of regions and critical landmarks. For the regions, the map has columns and rows that are
 * broken up into ranges. Each intersection of a column and row creates a described region in the play area.
 *
 * The X_LOCATIONS define critical places in the play area and the landmarks are slim columns around these, with
 * width LANDMARK_WIDTH.
 * 
 * @author Jesse Greenberg
 */

define( function( require ) {
  'use strict';

  // modules
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );
  var Range = require( 'DOT/Range' );

  // constants
  // when within this width of an X_LOCATION, balloon is considered in a landmark
  var LANDMARK_WIDTH = 20;
  var HALF_LANDMARK_WIDTH = LANDMARK_WIDTH / 2;

  // critical x locations for the balloon (relative to the balloon's center)
  var X_LOCATIONS = {
    AT_NEAR_SWEATER: 393,
    AT_CENTER_PLAY_AREA: 507,
    AT_NEAR_WALL: 596,
    AT_WALL: 621,
    AT_NEAR_RIGHT_EDGE: 676
  };

  // critical y locations for the balloon (relative to the balloon's center)
  var Y_LOCATIONS = {
    AT_BOTTOM: 393,
    AT_CENTER_PLAY_AREA: 249
  };

  // horizontal boundary locations, the left and right edges
  var X_BOUNDARY_LOCATIONS = {
    AT_LEFT_EDGE: 67,
    AT_RIGHT_EDGE: 701
  };

  // vertical boundary locations, the top and bottom edges
  var Y_BOUNDARY_LOCATIONS = {
    AT_TOP: 111,
    AT_BOTTOM: 393
  };

  // landmark ranges that surround critical x locations, but more are added below that depend on these ranges
  var atNearSweaterRange = createLandmarkRange( X_LOCATIONS.AT_NEAR_SWEATER );
  var atCenterPlayAreaRange = createLandmarkRange( X_LOCATIONS.AT_CENTER_PLAY_AREA );
  var atNearWallRange = createLandmarkRange( X_LOCATIONS.AT_NEAR_WALL );
  var atNearRightEdgeRange = createLandmarkRange( X_LOCATIONS.AT_NEAR_RIGHT_EDGE );

  // special ranges with slightly different widths, but that behave just like a landmark in the play area
  // at 'very close to sweater' landmark which extends to the left off the 'near sweater' landmark until we hit the
  // sweater
  var atVeryCloseToSweaterRange = new Range( atNearSweaterRange.min - LANDMARK_WIDTH, atNearSweaterRange.min );

  // at 'very close to wall' landmark which extends to the right  off the 'near wall' landmark until just before we hit
  // the wall
  var atVeryCloseToWallRange = new Range( atNearWallRange.max, X_LOCATIONS.AT_WALL - 1 );

  // at 'very close to right edge' landmark, which extends to right of the 'near right edge' landmark until just before
  // we hit the right edge
  var atVeryCloseToRightEdgeRange = new Range( atNearRightEdgeRange.max, X_BOUNDARY_LOCATIONS.AT_RIGHT_EDGE - 1 );
  var LANDMARK_RANGES = {
    AT_NEAR_SWEATER: atNearSweaterRange,
    AT_CENTER_PLAY_AREA: atCenterPlayAreaRange,
    AT_NEAR_WALL: atNearWallRange,
    AT_NEAR_RIGHT_EDGE: atNearRightEdgeRange,
    AT_VERY_CLOSE_TO_SWEATER: atVeryCloseToSweaterRange,
    AT_VERY_CLOSE_TO_WALL: atVeryCloseToWallRange,
    AT_VERY_CLOSE_TO_RIGHT_EDGE: atVeryCloseToRightEdgeRange
  };

  // ranges that define columns in the play area, exact widths chosen by inspection to match mockup provided in #222
  var leftArmRange = createNextRange( 138 );
  var leftSideOfSweaterRange = createNextRange( 65, leftArmRange );
  var rightSideOfSweaterRange = createNextRange( 67, leftSideOfSweaterRange );
  var rightArmRange = createNextRange( 65, rightSideOfSweaterRange );
  var leftPlayAreaRange = createNextRange( 132, rightArmRange );
  var centerPlayAreaRange = createNextRange( 77, leftPlayAreaRange );
  var rightPlayAreaRange = createNextRange( 132, centerPlayAreaRange );
  var rightEdgeRange = createNextRange( 500, rightPlayAreaRange ); // extends far beyond the play area bounds
  var COLUMN_RANGES = {
    LEFT_ARM: leftArmRange,
    LEFT_SIDE_OF_SWEATER: leftSideOfSweaterRange,
    RIGHT_SIDE_OF_SWEATER: rightSideOfSweaterRange,
    RIGHT_ARM: rightArmRange,
    LEFT_PLAY_AREA: leftPlayAreaRange,
    CENTER_PLAY_AREA: centerPlayAreaRange,
    RIGHT_PLAY_AREA: rightPlayAreaRange,
    RIGHT_EDGE: rightEdgeRange
  };

  // ranges that define the rows of the play area, exact heights chosen by inspection to match mockup in #222
  var upperPlayAreaRange = createNextRange( 172 );
  var centerPlayAreaRowRange = createNextRange( 154, upperPlayAreaRange );
  var lowerPlayAreaRange = createNextRange( 500, centerPlayAreaRowRange );
  var ROW_RANGES = {
    UPPER_PLAY_AREA: upperPlayAreaRange,
    CENTER_PLAY_AREA: centerPlayAreaRowRange,
    LOWER_PLAY_AREA: lowerPlayAreaRange
  };

  var PlayAreaMap = {
    X_LOCATIONS: X_LOCATIONS,
    Y_LOCATIONS: Y_LOCATIONS,
    X_BOUNDARY_LOCATIONS: X_BOUNDARY_LOCATIONS,
    Y_BOUNDARY_LOCATIONS: Y_BOUNDARY_LOCATIONS,
    COLUMN_RANGES: COLUMN_RANGES,
    ROW_RANGES: ROW_RANGES,
    LANDMARK_RANGES: LANDMARK_RANGES,
    WIDTH: 768,
    HEIGHT: 504,

    /**
     * Get the column of the play area for the a given location in the model, including landmark locations.
     * 
     * @param  {Vector2} location
     * @return {string}         
     */
    getPlayAreaColumn: function( location, wallVisible ) {
      var columns = COLUMN_RANGES;

      // loop through keys manually to prevent a many closures from being created during object iteration in 'for in'
      // loops
      var columnsKeys = Object.keys( columns );

      var column;
      for ( var i = 0; i < columnsKeys.length; i++ ) {
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
     * Get the landmark of the play area for the a given location in the model.
     * 
     * @param  {Vector2} location
     * @return {string}         
     */
    getPlayAreaLandmark: function( location, wallVisible ) {
      var landmarks = LANDMARK_RANGES;

      // loop through keys manually to prevent a many closures from being created during object iteration in 'for in'
      // loops
      var landmarksKeys = Object.keys( landmarks );

      var landmark =  null;
      for ( var i = 0; i < landmarksKeys.length; i++ ) {
        if ( landmarks[ landmarksKeys[ i ] ].contains( location.x ) ) {
          landmark = landmarksKeys[ i ];
        }
      }

      // the wall and the right edge of the play area overlap, so if the wall is visible, chose that description
      if ( wallVisible && landmark === 'RIGHT_EDGE' ) {
        landmark = 'WALL';
      }

      return landmark;
    },

    /**
     * Get a row in the play area that contains the location in the model.
     * 
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
    },

    /**
     * Returns true if the location is determined to be in one of the landmark columns. These are the ranges
     * that surround critical x locations.
     *
     * @param {Vector2s} location
     * @return {boolean}
     */
    inLandmarkColumn: function( location ) {
      var landmarks = PlayAreaMap.LANDMARK_RANGES;

      // loop through keys manually to prevent many closures from being created during object iteration in for loops
      var landmarkKeys = Object.keys( landmarks );
      var inLandmarkColumn = false;
      for( var i = 0; i < landmarkKeys.length; i++ ) {
        if ( landmarks[ landmarkKeys[ i ] ].contains( location.x ) ) {
          inLandmarkColumn = true;
          break;
        }
      }

      return inLandmarkColumn;
    }
  };

  balloonsAndStaticElectricity.register( 'PlayAreaMap', PlayAreaMap );

  /**
   * Create a range of the play area, optionally taking a previous range. If provided, the range that is returned will
   * start from the max value of the previous range.
   *
   * @param {number} width - desired width of the next range
   * @param {Range} [previousRange] - if provided, next range will start from max of this range
   *
   * @return {Range}
   */
  function createNextRange( width, previousRange ) {
    var min = previousRange ? previousRange.max : 0;
    return new Range( min, min + width );
  }

  /**
   * Create a range in the play area that signifies a landmark. A landmark is a specific location in the Play Area
   * that is critical and has more important information. It is generally more narrow than the larger regions of the
   * PlayArea that define how the balloon's location should be described.
   *
   * @param {number} xLocation - center of the landmark
   * @return {Range}
   */
  function createLandmarkRange( xLocation ) {
    return new Range( xLocation - HALF_LANDMARK_WIDTH, xLocation + HALF_LANDMARK_WIDTH );
  }

  return PlayAreaMap;
} );
