// Copyright 2017-2021, University of Colorado Boulder

/**
 * Manages descriptions for the entire simulation Balloons and Static Electricity.  Has functions that put together
 * strings for descriptions that are used throughout several view types.
 *
 * @author Jesse Greenberg
 */

import Range from '../../../../../dot/js/Range.js';
import StringUtils from '../../../../../phetcommon/js/util/StringUtils.js';
import balloonsAndStaticElectricity from '../../../balloonsAndStaticElectricity.js';
import BASEA11yStrings from '../../BASEA11yStrings.js';
import BASEConstants from '../../BASEConstants.js';
import PlayAreaMap from '../../model/PlayAreaMap.js';

// play area grid strings
const leftShoulderOfSweaterString = BASEA11yStrings.leftShoulderOfSweater.value;
const leftArmOfSweaterString = BASEA11yStrings.leftArmOfSweater.value;
const bottomLeftEdgeOfSweaterString = BASEA11yStrings.bottomLeftEdgeOfSweater.value;

const upperLeftSideOfSweaterString = BASEA11yStrings.upperLeftSideOfSweater.value;
const leftSideOfSweaterString = BASEA11yStrings.leftSideOfSweater.value;
const lowerLeftSideOfSweaterString = BASEA11yStrings.lowerLeftSideOfSweater.value;

const upperRightSideOfSweaterString = BASEA11yStrings.upperRightSideOfSweater.value;
const rightSideOfSweaterString = BASEA11yStrings.rightSideOfSweater.value;
const lowerRightSideOfSweater = BASEA11yStrings.lowerRightSideOfSweater.value;

const rightShoulderOfSweaterString = BASEA11yStrings.rightShoulderOfSweater.value;
const rightArmOfSweaterString = BASEA11yStrings.rightArmOfSweater.value;
const lowerRightArmOfSweaterString = BASEA11yStrings.lowerRightArmOfSweater.value;

const upperLeftSideOfPlayAreaString = BASEA11yStrings.upperLeftSideOfPlayArea.value;
const leftSideOfPlayAreaString = BASEA11yStrings.leftSideOfPlayArea.value;
const lowerLeftSideOfPlayAreaString = BASEA11yStrings.lowerLeftSideOfPlayArea.value;

const upperCenterOfPlayAreaString = BASEA11yStrings.upperCenterOfPlayArea.value;
const centerOfPlayAreaString = BASEA11yStrings.centerOfPlayArea.value;
const lowerCenterOfPlayAreaString = BASEA11yStrings.lowerCenterOfPlayArea.value;

const upperRightSideOfPlayAreaString = BASEA11yStrings.upperRightSideOfPlayArea.value;
const rightSideOfPlayAreaString = BASEA11yStrings.rightSideOfPlayArea.value;
const lowerRightSideOfPlayAreaString = BASEA11yStrings.lowerRightSideOfPlayArea.value;

const upperWallString = BASEA11yStrings.upperWall.value;
const wallString = BASEA11yStrings.wall.value;
const lowerWallString = BASEA11yStrings.lowerWall.value;

const upperRightEdgeOfPlayAreaString = BASEA11yStrings.upperRightEdgeOfPlayArea.value;
const rightEdgeOfPlayAreaString = BASEA11yStrings.rightEdgeOfPlayArea.value;
const lowerRightEdgeOfPlayAreaString = BASEA11yStrings.lowerRightEdgeOfPlayArea.value;

// charge strings
const noString = BASEA11yStrings.no.value;
const zeroString = BASEA11yStrings.zero.value;
const aFewString = BASEA11yStrings.aFew.value;
const severalString = BASEA11yStrings.several.value;
const manyString = BASEA11yStrings.many.value;
const negativeString = BASEA11yStrings.negative.value;

const eachBalloonString = BASEA11yStrings.eachBalloon.value;
const balloonNetChargePatternStringWithLabel = BASEA11yStrings.balloonNetChargePatternStringWithLabel.value;

const landmarkNearSweaterString = BASEA11yStrings.landmarkNearSweater.value;
const landmarkLeftEdgeString = BASEA11yStrings.landmarkLeftEdge.value;
const landmarkNearUpperWallString = BASEA11yStrings.landmarkNearUpperWall.value;
const landmarkNearWallString = BASEA11yStrings.landmarkNearWall.value;
const landmarkNearLowerWallString = BASEA11yStrings.landmarkNearLowerWall.value;
const landmarkNearUpperRightEdgeString = BASEA11yStrings.landmarkNearUpperRightEdge.value;
const landmarkNearRightEdgeString = BASEA11yStrings.landmarkNearRightEdge.value;
const landmarkNearLowerRightEdgeString = BASEA11yStrings.landmarkNearLowerRightEdge.value;
const landmarkAtCenterPlayAreaString = BASEA11yStrings.landmarkAtCenterPlayArea.value;
const landmarkAtUpperCenterPlayAreaString = BASEA11yStrings.landmarkAtUpperCenterPlayArea.value;
const landmarkAtLowerCenterPlayAreaString = BASEA11yStrings.landmarkAtLowerCenterPlayArea.value;

const upString = BASEA11yStrings.up.value;
const leftString = BASEA11yStrings.left.value;
const downString = BASEA11yStrings.down.value;
const rightString = BASEA11yStrings.right.value;
const upAndToTheRightString = BASEA11yStrings.upAndToTheRight.value;
const upAndToTheLeftString = BASEA11yStrings.upAndToTheLeft.value;
const downAndToTheRightString = BASEA11yStrings.downAndToTheRight.value;
const downAndToTheLeftString = BASEA11yStrings.downAndToTheLeft.value;

// charge strings
const summaryNeutralChargesPatternString = BASEA11yStrings.summaryNeutralChargesPattern.value;
const showingNoChargesString = BASEA11yStrings.showingNoCharges.value;

// constants
const POSITION_DESCRIPTION_MAP = {
  AT_LEFT_EDGE: {
    UPPER_PLAY_AREA: landmarkLeftEdgeString,
    CENTER_PLAY_AREA: landmarkLeftEdgeString,
    LOWER_PLAY_AREA: landmarkLeftEdgeString
  },
  LEFT_ARM: {
    UPPER_PLAY_AREA: leftShoulderOfSweaterString,
    CENTER_PLAY_AREA: leftArmOfSweaterString,
    LOWER_PLAY_AREA: bottomLeftEdgeOfSweaterString
  },
  LEFT_SIDE_OF_SWEATER: {
    UPPER_PLAY_AREA: upperLeftSideOfSweaterString,
    CENTER_PLAY_AREA: leftSideOfSweaterString,
    LOWER_PLAY_AREA: lowerLeftSideOfSweaterString
  },
  RIGHT_SIDE_OF_SWEATER: {
    UPPER_PLAY_AREA: upperRightSideOfSweaterString,
    CENTER_PLAY_AREA: rightSideOfSweaterString,
    LOWER_PLAY_AREA: lowerRightSideOfSweater
  },
  RIGHT_ARM: {
    UPPER_PLAY_AREA: rightShoulderOfSweaterString,
    CENTER_PLAY_AREA: rightArmOfSweaterString,
    LOWER_PLAY_AREA: lowerRightArmOfSweaterString
  },
  AT_VERY_CLOSE_TO_SWEATER: {
    UPPER_PLAY_AREA: landmarkNearSweaterString,
    CENTER_PLAY_AREA: landmarkNearSweaterString,
    LOWER_PLAY_AREA: landmarkNearSweaterString
  },
  AT_NEAR_SWEATER: {
    UPPER_PLAY_AREA: landmarkNearSweaterString,
    CENTER_PLAY_AREA: landmarkNearSweaterString,
    LOWER_PLAY_AREA: landmarkNearSweaterString
  },
  LEFT_PLAY_AREA: {
    UPPER_PLAY_AREA: upperLeftSideOfPlayAreaString,
    CENTER_PLAY_AREA: leftSideOfPlayAreaString,
    LOWER_PLAY_AREA: lowerLeftSideOfPlayAreaString
  },
  AT_CENTER_PLAY_AREA: {
    UPPER_PLAY_AREA: landmarkAtUpperCenterPlayAreaString,
    CENTER_PLAY_AREA: landmarkAtCenterPlayAreaString,
    LOWER_PLAY_AREA: landmarkAtLowerCenterPlayAreaString
  },
  CENTER_PLAY_AREA: {
    UPPER_PLAY_AREA: upperCenterOfPlayAreaString,
    CENTER_PLAY_AREA: centerOfPlayAreaString,
    LOWER_PLAY_AREA: lowerCenterOfPlayAreaString
  },
  RIGHT_PLAY_AREA: {
    UPPER_PLAY_AREA: upperRightSideOfPlayAreaString,
    CENTER_PLAY_AREA: rightSideOfPlayAreaString,
    LOWER_PLAY_AREA: lowerRightSideOfPlayAreaString
  },
  AT_NEAR_WALL: {
    UPPER_PLAY_AREA: landmarkNearUpperWallString,
    CENTER_PLAY_AREA: landmarkNearWallString,
    LOWER_PLAY_AREA: landmarkNearLowerWallString
  },
  AT_VERY_CLOSE_TO_WALL: {
    UPPER_PLAY_AREA: landmarkNearUpperWallString,
    CENTER_PLAY_AREA: landmarkNearWallString,
    LOWER_PLAY_AREA: landmarkNearLowerWallString
  },
  AT_WALL: {
    UPPER_PLAY_AREA: upperWallString,
    CENTER_PLAY_AREA: wallString,
    LOWER_PLAY_AREA: lowerWallString
  },
  WALL: {
    UPPER_PLAY_AREA: upperWallString,
    CENTER_PLAY_AREA: wallString,
    LOWER_PLAY_AREA: lowerWallString
  },
  AT_NEAR_RIGHT_EDGE: {
    UPPER_PLAY_AREA: landmarkNearUpperRightEdgeString,
    CENTER_PLAY_AREA: landmarkNearRightEdgeString,
    LOWER_PLAY_AREA: landmarkNearLowerRightEdgeString
  },
  AT_VERY_CLOSE_TO_RIGHT_EDGE: {
    UPPER_PLAY_AREA: landmarkNearUpperRightEdgeString,
    CENTER_PLAY_AREA: landmarkNearRightEdgeString,
    LOWER_PLAY_AREA: landmarkNearLowerRightEdgeString
  },
  RIGHT_EDGE: {
    UPPER_PLAY_AREA: upperRightEdgeOfPlayAreaString,
    CENTER_PLAY_AREA: rightEdgeOfPlayAreaString,
    LOWER_PLAY_AREA: lowerRightEdgeOfPlayAreaString
  },
  AT_RIGHT_EDGE: {
    UPPER_PLAY_AREA: upperRightEdgeOfPlayAreaString,
    CENTER_PLAY_AREA: rightEdgeOfPlayAreaString,
    LOWER_PLAY_AREA: lowerRightEdgeOfPlayAreaString
  }
};

/**
 * Generate a map from physical value to accessible descripton. Each described range has a length of
 * valueRange / descriptionArray.length
 *
 * @param {[].string} descriptionArray
 * @param {RangeWithValue} valueRange
 * @param {Object[]} [entries] - Additional entries to add to the mapped value range, will look something like
 *                             { description: {string}, range: {Range} }
 *
 * @returns {Object}
 */
const generateDescriptionMapWithEntries = ( descriptionArray, valueRange, entries ) => {
  entries = entries || [];
  const map = {};

  let minValue = valueRange.min;
  for ( let i = 0; i < descriptionArray.length; i++ ) {

    const nextMin = minValue + valueRange.getLength() / descriptionArray.length;

    map[ i ] = {};
    map[ i ].description = descriptionArray[ i ];
    map[ i ].range = new Range( minValue, nextMin );

    // correct for any precision issues
    if ( i === descriptionArray.length - 1 ) {
      map[ descriptionArray.length - 1 ].range = new Range( minValue, valueRange.max );
    }

    minValue = nextMin;
  }

  if ( entries.length > 0 ) {
    for ( let j = 0; j < entries.length; j++ ) {
      map[ descriptionArray.length + j ] = entries[ j ];
    }
  }

  return map;
};

const relativeChargeStrings = [ aFewString, severalString, manyString ];
const RELATIVE_CHARGE_DESCRIPTION_MAP = generateDescriptionMapWithEntries( relativeChargeStrings, new Range( 1, BASEConstants.MAX_BALLOON_CHARGE ), [ {
  range: new Range( 0, 0 ),
  description: noString
} ] );

// maps  direction to a description string
const DIRECTION_MAP = {
  UP: upString,
  DOWN: downString,
  LEFT: leftString,
  RIGHT: rightString,
  UP_RIGHT: upAndToTheRightString,
  UP_LEFT: upAndToTheLeftString,
  DOWN_RIGHT: downAndToTheRightString,
  DOWN_LEFT: downAndToTheLeftString
};

const BASEDescriber = {

  /**
   * Get the position description for the balloon. This is not a full description, but a short
   * descsription. Regions are defined in PlayAreaMap.  This will get called very often and needs to be quick.
   *
   * @param {Vector2} position - position of the balloon, relative to its center
   * @returns {string}
   */
  getPositionDescription( position, wallVisible ) {

    const landmarks = PlayAreaMap.LANDMARK_RANGES;
    const columns = PlayAreaMap.COLUMN_RANGES;
    const positions = PlayAreaMap.X_POSITIONS;
    const rows = PlayAreaMap.ROW_RANGES;

    // loop through keys manually to prevent a many closures from being created during object iteration in 'for in'
    // loops
    const columnsKeys = Object.keys( columns );
    const rowKeys = Object.keys( rows );
    const landmarkKeys = Object.keys( landmarks );
    const positionKeys = Object.keys( positions );

    let i;
    let currentPosition;
    let currentLandmark;
    let currentColumn;
    let currentRow;

    // critical x positions take priority, start there
    for ( i = 0; i < positionKeys.length; i++ ) {
      if ( position.x === positions[ positionKeys[ i ] ] ) {
        currentPosition = positionKeys[ i ];
      }
    }

    for ( i = 0; i < landmarkKeys.length; i++ ) {
      if ( landmarks[ landmarkKeys[ i ] ].contains( position.x ) ) {
        currentLandmark = landmarkKeys[ i ];
      }
    }

    // landmark takes priority - only find column if we couldn't find landmark
    if ( !currentLandmark ) {
      for ( i = 0; i < columnsKeys.length; i++ ) {
        if ( columns[ columnsKeys[ i ] ].contains( position.x ) ) {
          currentColumn = columnsKeys[ i ];
        }
      }
    }
    for ( i = 0; i < rowKeys.length; i++ ) {
      if ( rows[ rowKeys[ i ] ].contains( position.y ) ) {
        currentRow = rowKeys[ i ];
      }
    }

    // use position, column, or landmark, whichever was found, prioritizing position
    currentColumn = currentPosition || currentLandmark || currentColumn;
    assert && assert( currentColumn && currentRow, 'item should be in a row or column of the play area' );

    // the wall and the right edge of the play area overlap, so if the wall is visible chose that description
    if ( wallVisible && ( currentColumn === 'RIGHT_EDGE' || currentColumn === 'AT_RIGHT_EDGE' ) ) {
      currentColumn = 'WALL';
    }
    if ( !wallVisible && BASEDescriber.inWallColumn( currentColumn ) ) {
      currentColumn = 'RIGHT_PLAY_AREA';
    }

    return POSITION_DESCRIPTION_MAP[ currentColumn ][ currentRow ];
  },

  /**
   * Returns whether or not the column is in one of the 'wall' columns, could  be at, near, or very close to wall.
   * @private
   *
   * @param {string} column - one of keys in POSITION_DESCRIPTION_MAP
   * @returns {boolean}
   */
  inWallColumn( column ) {
    return ( column === 'AT_WALL' || column === 'AT_NEAR_WALL' || column === 'WALL' || column === 'AT_VERY_CLOSE_TO_WALL' );
  },

  /**
   * Get a fragment that describes the relative charge for an objet, like 'a few' or 'several', to be used in
   * string patterns
   *
   * @param  {number} charge
   * @returns {string}
   */
  getRelativeChargeDescription( charge ) {

    // the description is mapped to the absolute value of charge
    const absCharge = Math.abs( charge );

    const keys = Object.keys( RELATIVE_CHARGE_DESCRIPTION_MAP );
    let description;

    for ( let i = 0; i < keys.length; i++ ) {
      const value = RELATIVE_CHARGE_DESCRIPTION_MAP[ keys[ i ] ];
      if ( value.range.contains( absCharge ) ) {
        description = value.description;
        break;
      }
    }

    assert && assert( description, 'no relative description found for charge value, check value or entries in description map' );
    return description;
  },

  /**
   * For a given charge, get the described range. Useful for comparing ranges before and after
   * a charge pickup. Descriptions are generated relative to the absolute value of the charge.
   *
   * @param  {number} charge
   * @returns {Range}
   */
  getDescribedChargeRange( charge ) {

    const describedCharge = Math.abs( charge );
    const keys = Object.keys( RELATIVE_CHARGE_DESCRIPTION_MAP );

    let range;
    for ( let i = 0; i < keys.length; i++ ) {
      const value = RELATIVE_CHARGE_DESCRIPTION_MAP[ keys[ i ] ];
      if ( value.range.contains( describedCharge ) ) {
        range = value.range;
        break;
      }
    }

    assert && assert( range, `no charge range found for charge ${charge}` );
    return range;
  },

  /**
   * Returns true if both balloons the same described charge range.
   *
   * @param {BalloonModel} balloonA
   * @param {BalloonModel} balloonB
   *
   * @returns {[type]} [description]
   */
  getBalloonsVisibleWithSameChargeRange( balloonA, balloonB ) {
    const rangeA = BASEDescriber.getDescribedChargeRange( balloonA.chargeProperty.get() );
    const rangeB = BASEDescriber.getDescribedChargeRange( balloonB.chargeProperty.get() );

    const visibleA = balloonA.isVisibleProperty.get();
    const visibleB = balloonB.isVisibleProperty.get();

    return rangeA.equals( rangeB ) && ( visibleA && visibleB );
  },

  /**
   * Get a direction description from one of BalloonDirectionEnum. Something like down', or 'up and to the left'.
   * @public
   *
   * @param {string} direction - one of BalloonDirectionEnum
   * @returns {string}
   */
  getDirectionDescription( direction ) {
    return DIRECTION_MAP[ direction ];
  },

  /**
   * Get a description of the net charge for each balloon, including the label 'Each balloon'. Will return something
   * like
   * "Each balloon has negative net charge." or
   * "Each balloon has zero net charge."
   *
   * @returns {string}
   */
  getNetChargeDescriptionWithLabel( charge ) {
    const chargeAmountString = charge < 0 ? negativeString : zeroString;
    return StringUtils.fillIn( balloonNetChargePatternStringWithLabel, {
      chargeAmount: chargeAmountString,
      balloon: eachBalloonString
    } );
  },

  /**
   * Get a description for the charges shown when the object is neutral. When neutral, the object will either be
   * showing no charges, or showing "{{many}} pairs of negative and positive charges". Will return something like
   *
   * "no charges shown" or
   * "showing many pairs of positive and negative charges"
   *
   * @param {string} chargesShown
   * @param {number} numberOfCharges
   * @returns {string}
   */
  getNeutralChargesShownDescription( chargesShown, numberOfCharges ) {
    let description;

    const relativeCharge = BASEDescriber.getRelativeChargeDescription( numberOfCharges );
    if ( chargesShown === 'all' ) {
      description = StringUtils.fillIn( summaryNeutralChargesPatternString, {
        amount: relativeCharge
      } );
    }
    else {
      description = showingNoChargesString;
    }

    return description;
  }
};

balloonsAndStaticElectricity.register( 'BASEDescriber', BASEDescriber );

export default BASEDescriber;