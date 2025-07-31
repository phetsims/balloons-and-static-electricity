// Copyright 2017-2021, University of Colorado Boulder

/**
 * A map of the 2D play area for this simulation.  The play area includes anywhere that the Balloons can move about,
 * so it contains the entire bounds of the model.  This map is used for accessibility to generate descriptions about
 * where the balloons are as they move around the play area.
 *
 * The map is composed of regions and critical landmarks. For the regions, the map has columns and rows that are
 * broken up into ranges. Each intersection of a column and row creates a described region in the play area.
 *
 * The X_POSITIONS define critical places in the play area and the landmarks are slim columns around these, with
 * width LANDMARK_WIDTH.
 *
 * @author Jesse Greenberg
 */

import Range from '../../../../dot/js/Range.js';
import balloonsAndStaticElectricity from '../../balloonsAndStaticElectricity.js';

// constants
// when within this width of an X_POSITION, balloon is considered in a landmark
const LANDMARK_WIDTH = 20;
const HALF_LANDMARK_WIDTH = LANDMARK_WIDTH / 2;

// critical x positions for the balloon (relative to the balloon's center)
const X_POSITIONS = {
  AT_NEAR_SWEATER: 393,
  AT_CENTER_PLAY_AREA: 507,
  AT_NEAR_WALL: 596,
  AT_WALL: 621,
  AT_NEAR_RIGHT_EDGE: 676
};

// critical y positions for the balloon (relative to the balloon's center)
const Y_POSITIONS = {
  AT_BOTTOM: 393,
  AT_CENTER_PLAY_AREA: 249
};

// horizontal boundary positions, the left and right edges
const X_BOUNDARY_POSITIONS = {
  AT_LEFT_EDGE: 67,
  AT_RIGHT_EDGE: 701
};

// vertical boundary positions, the top and bottom edges
const Y_BOUNDARY_POSITIONS = {
  AT_TOP: 111,
  AT_BOTTOM: 393
};


/**
 * Create a range of the play area, optionally taking a previous range. If provided, the range that is returned will
 * start from the max value of the previous range.
 *
 * @param {number} width - desired width of the next range
 * @param {Range} [previousRange] - if provided, next range will start from max of this range
 *
 * @returns {Range}
 */
const createNextRange = ( width, previousRange ) => {
  const min = previousRange ? previousRange.max : 0;
  return new Range( min, min + width );
};

/**
 * Create a range in the play area that signifies a landmark. A landmark is a specific position in the Play Area
 * that is critical and has more important information. It is generally more narrow than the larger regions of the
 * PlayArea that define how the balloon's position should be described.
 *
 * @param {number} xPosition - center of the landmark
 * @returns {Range}
 */
const createLandmarkRange = xPosition => {
  return new Range( xPosition - HALF_LANDMARK_WIDTH, xPosition + HALF_LANDMARK_WIDTH );
};

// landmark ranges that surround critical x positions, but more are added below that depend on these ranges
const atNearSweaterRange = createLandmarkRange( X_POSITIONS.AT_NEAR_SWEATER );
const atCenterPlayAreaRange = createLandmarkRange( X_POSITIONS.AT_CENTER_PLAY_AREA );
const atNearWallRange = createLandmarkRange( X_POSITIONS.AT_NEAR_WALL );
const atNearRightEdgeRange = createLandmarkRange( X_POSITIONS.AT_NEAR_RIGHT_EDGE );

// special ranges with slightly different widths, but that behave just like a landmark in the play area
// at 'very close to sweater' landmark which extends to the left off the 'near sweater' landmark until we hit the
// sweater
const atVeryCloseToSweaterRange = new Range( atNearSweaterRange.min - LANDMARK_WIDTH, atNearSweaterRange.min );

// at 'very close to wall' landmark which extends to the right  off the 'near wall' landmark until just before we hit
// the wall
const atVeryCloseToWallRange = new Range( atNearWallRange.max, X_POSITIONS.AT_WALL - 1 );

// at 'very close to right edge' landmark, which extends to right of the 'near right edge' landmark until just before
// we hit the right edge
const atVeryCloseToRightEdgeRange = new Range( atNearRightEdgeRange.max, X_BOUNDARY_POSITIONS.AT_RIGHT_EDGE - 1 );
const LANDMARK_RANGES = {
  AT_NEAR_SWEATER: atNearSweaterRange,
  AT_CENTER_PLAY_AREA: atCenterPlayAreaRange,
  AT_NEAR_WALL: atNearWallRange,
  AT_NEAR_RIGHT_EDGE: atNearRightEdgeRange,
  AT_VERY_CLOSE_TO_SWEATER: atVeryCloseToSweaterRange,
  AT_VERY_CLOSE_TO_WALL: atVeryCloseToWallRange,
  AT_VERY_CLOSE_TO_RIGHT_EDGE: atVeryCloseToRightEdgeRange
};

// ranges that define columns in the play area, exact widths chosen by inspection to match mockup provided in #222
const leftArmRange = createNextRange( 138 );
const leftSideOfSweaterRange = createNextRange( 65, leftArmRange );
const rightSideOfSweaterRange = createNextRange( 67, leftSideOfSweaterRange );
const rightArmRange = createNextRange( 65, rightSideOfSweaterRange );
const leftPlayAreaRange = createNextRange( 132, rightArmRange );
const centerPlayAreaRange = createNextRange( 77, leftPlayAreaRange );
const rightPlayAreaRange = createNextRange( 132, centerPlayAreaRange );
const rightEdgeRange = createNextRange( 500, rightPlayAreaRange ); // extends far beyond the play area bounds
const COLUMN_RANGES = {
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
const upperPlayAreaRange = createNextRange( 172 );
const centerPlayAreaRowRange = createNextRange( 154, upperPlayAreaRange );
const lowerPlayAreaRange = createNextRange( 500, centerPlayAreaRowRange );
const ROW_RANGES = {
  UPPER_PLAY_AREA: upperPlayAreaRange,
  CENTER_PLAY_AREA: centerPlayAreaRowRange,
  LOWER_PLAY_AREA: lowerPlayAreaRange
};

const PlayAreaMap = {
  X_POSITIONS: X_POSITIONS,
  Y_POSITIONS: Y_POSITIONS,
  X_BOUNDARY_POSITIONS: X_BOUNDARY_POSITIONS,
  Y_BOUNDARY_POSITIONS: Y_BOUNDARY_POSITIONS,
  COLUMN_RANGES: COLUMN_RANGES,
  ROW_RANGES: ROW_RANGES,
  LANDMARK_RANGES: LANDMARK_RANGES,
  WIDTH: 768,
  HEIGHT: 504,

  /**
   * Get the column of the play area for the a given position in the model, including landmark positions.
   *
   * @param  {Vector2} position
   * @returns {string}
   */
  getPlayAreaColumn( position, wallVisible ) {
    const columns = COLUMN_RANGES;

    // loop through keys manually to prevent a many closures from being created during object iteration in 'for in'
    // loops
    const columnsKeys = Object.keys( columns );

    let column;
    for ( let i = 0; i < columnsKeys.length; i++ ) {
      if ( columns[ columnsKeys[ i ] ].contains( position.x ) ) {
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
   * Get the landmark of the play area for the a given position in the model.
   *
   * @param  {Vector2} position
   * @returns {string}
   */
  getPlayAreaLandmark( position, wallVisible ) {
    const landmarks = LANDMARK_RANGES;

    // loop through keys manually to prevent a many closures from being created during object iteration in 'for in'
    // loops
    const landmarksKeys = Object.keys( landmarks );

    let landmark = null;
    for ( let i = 0; i < landmarksKeys.length; i++ ) {
      if ( landmarks[ landmarksKeys[ i ] ].contains( position.x ) ) {
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
   * Get a row in the play area that contains the position in the model.
   *
   * @param  {Vector2} position
   * @returns {strint}
   */
  getPlayAreaRow( position ) {
    const rows = PlayAreaMap.ROW_RANGES;

    // loop through keys manually to prevent a many closures from being created during object iteration in 'for in' loops
    const rowKeys = Object.keys( rows );

    let row;
    let i;
    for ( i = 0; i < rowKeys.length; i++ ) {
      if ( rows[ rowKeys[ i ] ].contains( position.y ) ) {
        row = rowKeys[ i ];
      }
    }
    assert && assert( row, 'item should be in a row of the play area' );

    return row;
  },

  /**
   * Returns true if the position is determined to be in one of the landmark columns. These are the ranges
   * that surround critical x positions.
   *
   * @param {Vector2} position
   * @returns {boolean}
   */
  inLandmarkColumn( position ) {
    const landmarks = PlayAreaMap.LANDMARK_RANGES;

    // loop through keys manually to prevent many closures from being created during object iteration in for loops
    const landmarkKeys = Object.keys( landmarks );
    let inLandmarkColumn = false;
    for ( let i = 0; i < landmarkKeys.length; i++ ) {
      if ( landmarks[ landmarkKeys[ i ] ].contains( position.x ) ) {
        inLandmarkColumn = true;
        break;
      }
    }

    return inLandmarkColumn;
  }
};

balloonsAndStaticElectricity.register( 'PlayAreaMap', PlayAreaMap );

export default PlayAreaMap;