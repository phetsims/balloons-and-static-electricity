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

  var X_BOUNDARY_LOCATIONS = {
    AT_LEFT_EDGE: 67,
    AT_RIGHT_EDGE: 701
  };

  var Y_BOUNDARY_LOCATIONS = {
    AT_TOP: 111,
    AT_BOTTOM: 393
  };

  // landmark ranges that surround critical x locations, but more are added below that depend on these ranges
  var LANDMARK_RANGES = {
    AT_NEAR_SWEATER: new Range( X_LOCATIONS.AT_NEAR_SWEATER - HALF_LANDMARK_WIDTH, X_LOCATIONS.AT_NEAR_SWEATER + HALF_LANDMARK_WIDTH ),
    AT_CENTER_PLAY_AREA: new Range( X_LOCATIONS.AT_CENTER_PLAY_AREA - HALF_LANDMARK_WIDTH, X_LOCATIONS.AT_CENTER_PLAY_AREA + HALF_LANDMARK_WIDTH ),
    AT_NEAR_WALL: new Range( X_LOCATIONS.AT_NEAR_WALL - HALF_LANDMARK_WIDTH, X_LOCATIONS.AT_NEAR_WALL + HALF_LANDMARK_WIDTH ),
    AT_NEAR_RIGHT_EDGE: new Range( X_LOCATIONS.AT_NEAR_RIGHT_EDGE - HALF_LANDMARK_WIDTH, X_LOCATIONS.AT_NEAR_RIGHT_EDGE + HALF_LANDMARK_WIDTH )
  };

  // at 'very close to sweater' landmark which extends to the left off the 'near sweater' landmark until we hit the sweater
  LANDMARK_RANGES.AT_VERY_CLOSE_TO_SWEATER = new Range( LANDMARK_RANGES.AT_NEAR_SWEATER.min - LANDMARK_WIDTH, LANDMARK_RANGES.AT_NEAR_SWEATER.min );

  // AT 'very close to wall' landmark which extends to the right  off the 'near wall' landmark until just before we hit the wall
  LANDMARK_RANGES.AT_VERY_CLOSE_TO_WALL = new Range( LANDMARK_RANGES.AT_NEAR_WALL.max, X_LOCATIONS.AT_WALL - 1 );

  // at 'very close to right edge' landmark, which extends to right of the 'near right edge' landmark until just before we hit the right edge
  LANDMARK_RANGES.AT_VERY_CLOSE_TO_RIGHT_EDGE = new Range( LANDMARK_RANGES.AT_NEAR_RIGHT_EDGE.max, X_BOUNDARY_LOCATIONS.AT_RIGHT_EDGE - 1 );

  // ranges that define columns in the play area
  var COLUMN_RANGES = {
    LEFT_ARM: new Range( -Number.MAX_VALUE, 138 ),
    LEFT_SIDE_OF_SWEATER: new Range( 138, 203 ),
    RIGHT_SIDE_OF_SWEATER: new Range( 203, 270 ),
    RIGHT_ARM: new Range( 270, 335 ),
    LEFT_PLAY_AREA: new Range( 335, 467 ),
    CENTER_PLAY_AREA: new Range( 467, 544 ),
    RIGHT_PLAY_AREA: new Range( 544, 676 ),
    RIGHT_EDGE: new Range( 676, Number.MAX_VALUE )
  };

  // ranges that define the rows of the play area
  var ROW_RANGES = {
    UPPER_PLAY_AREA: new Range( -Number.MAX_VALUE, 172 ),
    CENTER_PLAY_AREA: new Range( 172, 326 ),
    LOWER_PLAY_AREA: new Range( 326, Number.MAX_VALUE )
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

  return PlayAreaMap;
} );
