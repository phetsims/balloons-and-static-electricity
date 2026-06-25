// Copyright 2017-2026, University of Colorado Boulder

/**
 * Manages descriptions for the entire simulation Balloons and Static Electricity.  Has functions that put together
 * strings for descriptions that are used throughout several view types.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Range from '../../../../../dot/js/Range.js';
import Vector2 from '../../../../../dot/js/Vector2.js';
import StringUtils from '../../../../../phetcommon/js/util/StringUtils.js';
import BalloonsAndStaticElectricityFluent from '../../../BalloonsAndStaticElectricityFluent.js';
import BASEConstants from '../../BASEConstants.js';
import BalloonModel from '../../model/BalloonModel.js';
import PlayAreaMap from '../../model/PlayAreaMap.js';
import { BalloonDirection } from '../../model/PlayAreaMapTypes.js';

// play area grid strings
const leftShoulderOfSweaterString = BalloonsAndStaticElectricityFluent.a11y.leftShoulderOfSweaterStringProperty.value;
const leftArmOfSweaterString = BalloonsAndStaticElectricityFluent.a11y.leftArmOfSweaterStringProperty.value;
const bottomLeftEdgeOfSweaterString = BalloonsAndStaticElectricityFluent.a11y.bottomLeftEdgeOfSweaterStringProperty.value;

const upperLeftSideOfSweaterString = BalloonsAndStaticElectricityFluent.a11y.upperLeftSideOfSweaterStringProperty.value;
const leftSideOfSweaterString = BalloonsAndStaticElectricityFluent.a11y.leftSideOfSweaterStringProperty.value;
const lowerLeftSideOfSweaterString = BalloonsAndStaticElectricityFluent.a11y.lowerLeftSideOfSweaterStringProperty.value;

const upperRightSideOfSweaterString = BalloonsAndStaticElectricityFluent.a11y.upperRightSideOfSweaterStringProperty.value;
const rightSideOfSweaterString = BalloonsAndStaticElectricityFluent.a11y.rightSideOfSweaterStringProperty.value;
const lowerRightSideOfSweater = BalloonsAndStaticElectricityFluent.a11y.lowerRightSideOfSweaterStringProperty.value;

const rightShoulderOfSweaterString = BalloonsAndStaticElectricityFluent.a11y.rightShoulderOfSweaterStringProperty.value;
const rightArmOfSweaterString = BalloonsAndStaticElectricityFluent.a11y.rightArmOfSweaterStringProperty.value;
const lowerRightArmOfSweaterString = BalloonsAndStaticElectricityFluent.a11y.lowerRightArmOfSweaterStringProperty.value;

const upperLeftSideOfPlayAreaString = BalloonsAndStaticElectricityFluent.a11y.upperLeftSideOfPlayAreaStringProperty.value;
const leftSideOfPlayAreaString = BalloonsAndStaticElectricityFluent.a11y.leftSideOfPlayAreaStringProperty.value;
const lowerLeftSideOfPlayAreaString = BalloonsAndStaticElectricityFluent.a11y.lowerLeftSideOfPlayAreaStringProperty.value;

const upperCenterOfPlayAreaString = BalloonsAndStaticElectricityFluent.a11y.upperCenterOfPlayAreaStringProperty.value;
const centerOfPlayAreaString = BalloonsAndStaticElectricityFluent.a11y.centerOfPlayAreaStringProperty.value;
const lowerCenterOfPlayAreaString = BalloonsAndStaticElectricityFluent.a11y.lowerCenterOfPlayAreaStringProperty.value;

const upperRightSideOfPlayAreaString = BalloonsAndStaticElectricityFluent.a11y.upperRightSideOfPlayAreaStringProperty.value;
const rightSideOfPlayAreaString = BalloonsAndStaticElectricityFluent.a11y.rightSideOfPlayAreaStringProperty.value;
const lowerRightSideOfPlayAreaString = BalloonsAndStaticElectricityFluent.a11y.lowerRightSideOfPlayAreaStringProperty.value;

const upperWallString = BalloonsAndStaticElectricityFluent.a11y.upperWallStringProperty.value;
const wallString = BalloonsAndStaticElectricityFluent.a11y.wallStringProperty.value;
const lowerWallString = BalloonsAndStaticElectricityFluent.a11y.lowerWallStringProperty.value;

const upperRightEdgeOfPlayAreaString = BalloonsAndStaticElectricityFluent.a11y.upperRightEdgeOfPlayAreaStringProperty.value;
const rightEdgeOfPlayAreaString = BalloonsAndStaticElectricityFluent.a11y.rightEdgeOfPlayAreaStringProperty.value;
const lowerRightEdgeOfPlayAreaString = BalloonsAndStaticElectricityFluent.a11y.lowerRightEdgeOfPlayAreaStringProperty.value;

// charge strings
const noString = BalloonsAndStaticElectricityFluent.a11y.noStringProperty.value;
const zeroString = BalloonsAndStaticElectricityFluent.a11y.zeroStringProperty.value;
const aFewString = BalloonsAndStaticElectricityFluent.a11y.aFewStringProperty.value;
const severalString = BalloonsAndStaticElectricityFluent.a11y.severalStringProperty.value;
const manyString = BalloonsAndStaticElectricityFluent.a11y.manyStringProperty.value;
const negativeString = BalloonsAndStaticElectricityFluent.a11y.negativeStringProperty.value;

const eachBalloonString = BalloonsAndStaticElectricityFluent.a11y.eachBalloonStringProperty.value;
const balloonNetChargePatternStringWithLabel = BalloonsAndStaticElectricityFluent.a11y.balloonNetChargePatternStringWithLabelStringProperty.value;

const landmarkNearSweaterString = BalloonsAndStaticElectricityFluent.a11y.landmarkNearSweaterStringProperty.value;
const landmarkLeftEdgeString = BalloonsAndStaticElectricityFluent.a11y.landmarkLeftEdgeStringProperty.value;
const landmarkNearUpperWallString = BalloonsAndStaticElectricityFluent.a11y.landmarkNearUpperWallStringProperty.value;
const landmarkNearWallString = BalloonsAndStaticElectricityFluent.a11y.landmarkNearWallStringProperty.value;
const landmarkNearLowerWallString = BalloonsAndStaticElectricityFluent.a11y.landmarkNearLowerWallStringProperty.value;
const landmarkNearUpperRightEdgeString = BalloonsAndStaticElectricityFluent.a11y.landmarkNearUpperRightEdgeStringProperty.value;
const landmarkNearRightEdgeString = BalloonsAndStaticElectricityFluent.a11y.landmarkNearRightEdgeStringProperty.value;
const landmarkNearLowerRightEdgeString = BalloonsAndStaticElectricityFluent.a11y.landmarkNearLowerRightEdgeStringProperty.value;
const landmarkAtCenterPlayAreaString = BalloonsAndStaticElectricityFluent.a11y.landmarkAtCenterPlayAreaStringProperty.value;
const landmarkAtUpperCenterPlayAreaString = BalloonsAndStaticElectricityFluent.a11y.landmarkAtUpperCenterPlayAreaStringProperty.value;
const landmarkAtLowerCenterPlayAreaString = BalloonsAndStaticElectricityFluent.a11y.landmarkAtLowerCenterPlayAreaStringProperty.value;

const upString = BalloonsAndStaticElectricityFluent.a11y.upStringProperty.value;
const leftString = BalloonsAndStaticElectricityFluent.a11y.leftStringProperty.value;
const downString = BalloonsAndStaticElectricityFluent.a11y.downStringProperty.value;
const rightString = BalloonsAndStaticElectricityFluent.a11y.rightStringProperty.value;
const upAndToTheRightString = BalloonsAndStaticElectricityFluent.a11y.upAndToTheRightStringProperty.value;
const upAndToTheLeftString = BalloonsAndStaticElectricityFluent.a11y.upAndToTheLeftStringProperty.value;
const downAndToTheRightString = BalloonsAndStaticElectricityFluent.a11y.downAndToTheRightStringProperty.value;
const downAndToTheLeftString = BalloonsAndStaticElectricityFluent.a11y.downAndToTheLeftStringProperty.value;

// charge strings
const summaryNeutralChargesPatternString = BalloonsAndStaticElectricityFluent.a11y.summaryNeutralChargesPatternStringProperty.value;
const showingNoChargesString = BalloonsAndStaticElectricityFluent.a11y.showingNoChargesStringProperty.value;

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
 * @param descriptionArray
 * @param valueRange
 * @param entries - Additional entries to add to the mapped value range, will look something like
 *                             { description: {string}, range: {Range} }
 */
const generateDescriptionMapWithEntries = ( descriptionArray: string[], valueRange: Range, entries?: { description: string; range: Range }[] ): Record<string, { description: string; range: Range }> => {
  entries = entries || [];
  const map: Record<string, { description: string; range: Range }> = {};

  let minValue = valueRange.min;
  for ( let i = 0; i < descriptionArray.length; i++ ) {

    const nextMin = minValue + valueRange.getLength() / descriptionArray.length;

    map[ i ] = {
      description: descriptionArray[ i ],
      range: new Range( minValue, nextMin )
    };

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
   * description. Regions are defined in PlayAreaMap.  This will get called very often and needs to be quick.
   *
   * @param position - position of the balloon, relative to its center
   * @param wallVisible
   */
  getPositionDescription( position: Vector2, wallVisible: boolean ): string {

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

    let i: number;
    let currentPosition: string | undefined;
    let currentLandmark: string | undefined;
    let currentColumn: string | undefined;
    let currentRow: string | undefined;

    // critical x positions take priority, start there
    for ( i = 0; i < positionKeys.length; i++ ) {
      if ( position.x === positions[ positionKeys[ i ] as keyof typeof positions ] ) {
        currentPosition = positionKeys[ i ];
      }
    }

    for ( i = 0; i < landmarkKeys.length; i++ ) {
      if ( landmarks[ landmarkKeys[ i ] as keyof typeof landmarks ].contains( position.x ) ) {
        currentLandmark = landmarkKeys[ i ];
      }
    }

    // landmark takes priority - only find column if we couldn't find landmark
    if ( !currentLandmark ) {
      for ( i = 0; i < columnsKeys.length; i++ ) {
        if ( columns[ columnsKeys[ i ] as keyof typeof columns ].contains( position.x ) ) {
          currentColumn = columnsKeys[ i ];
        }
      }
    }
    for ( i = 0; i < rowKeys.length; i++ ) {
      if ( rows[ rowKeys[ i ] as keyof typeof rows ].contains( position.y ) ) {
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
    if ( !wallVisible && currentColumn && BASEDescriber.inWallColumn( currentColumn ) ) {
      currentColumn = 'RIGHT_PLAY_AREA';
    }

    return POSITION_DESCRIPTION_MAP[ currentColumn! as keyof typeof POSITION_DESCRIPTION_MAP ][ currentRow! as keyof typeof POSITION_DESCRIPTION_MAP[ keyof typeof POSITION_DESCRIPTION_MAP ] ];
  },

  /**
   * Returns whether the column is in one of the 'wall' columns, could  be at, near, or very close to wall.
   *
   * @param column - one of keys in POSITION_DESCRIPTION_MAP
   */
  inWallColumn( column: string ): boolean {
    return ( column === 'AT_WALL' || column === 'AT_NEAR_WALL' || column === 'WALL' || column === 'AT_VERY_CLOSE_TO_WALL' );
  },

  /**
   * Get a fragment that describes the relative charge for an objet, like 'a few' or 'several', to be used in
   * string patterns
   */
  getRelativeChargeDescription( charge: number ): string {

    // the description is mapped to the absolute value of charge
    const absCharge = Math.abs( charge );

    const keys = Object.keys( RELATIVE_CHARGE_DESCRIPTION_MAP );
    let description = '';

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
   */
  getDescribedChargeRange( charge: number ): Range {

    const describedCharge = Math.abs( charge );
    const keys = Object.keys( RELATIVE_CHARGE_DESCRIPTION_MAP );

    let range!: Range;
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
   */
  getBalloonsVisibleWithSameChargeRange( balloonA: BalloonModel, balloonB: BalloonModel ): boolean {
    const rangeA = BASEDescriber.getDescribedChargeRange( balloonA.chargeProperty.get() );
    const rangeB = BASEDescriber.getDescribedChargeRange( balloonB.chargeProperty.get() );

    const visibleA = balloonA.isVisibleProperty.get();
    const visibleB = balloonB.isVisibleProperty.get();

    return rangeA.equals( rangeB ) && ( visibleA && visibleB );
  },

  /**
   * Get a direction description from one of DirectionEnum. Something like down', or 'up and to the left'.
   *
   * @param direction - one of DirectionEnum
   */
  getDirectionDescription( direction: BalloonDirection ): string {
    return DIRECTION_MAP[ direction ];
  },

  /**
   * Get a description of the net charge for each balloon, including the label 'Each balloon'. Will return something
   * like
   * "Each balloon has negative net charge." or
   * "Each balloon has zero net charge."
   */
  getNetChargeDescriptionWithLabel( charge: number ): string {
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
   */
  getNeutralChargesShownDescription( chargesShown: string, numberOfCharges: number ): string {
    let description: string;

    const relativeCharge = BASEDescriber.getRelativeChargeDescription( numberOfCharges );
    if ( chargesShown === 'allCharges' ) {
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

export default BASEDescriber;
