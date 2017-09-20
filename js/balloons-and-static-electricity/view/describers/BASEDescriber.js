// Copyright 2017, University of Colorado Boulder

/**
 * Manages descriptions for the entire simulation Balloons and Static Electricity.  Has functions that put together
 * strings for descriptions that are used throughout several view types.
 * 
 * @author Jesse Greenberg
 */

define( function( require ) {
  'use strict';

  // modules
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );
  var BASEA11yStrings = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/BASEA11yStrings' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PlayAreaMap = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/PlayAreaMap' );
  var Range = require( 'DOT/Range' );

  // strings
  // play area grid strings
  var leftShoulderOfSweaterString = BASEA11yStrings.leftShoulderOfSweaterString;
  var leftArmOfSweaterString = BASEA11yStrings.leftArmOfSweaterString;
  var bottomLeftEdgeOfSweaterString = BASEA11yStrings.bottomLeftEdgeOfSweaterString;

  var upperLeftSideOfSweaterString = BASEA11yStrings.upperLeftSideOfSweaterString;
  var leftSideOfSweaterString = BASEA11yStrings.leftSideOfSweaterString;
  var lowerLeftSideOfSweaterString = BASEA11yStrings.lowerLeftSideOfSweaterString;

  var upperRightSideOfSweaterString = BASEA11yStrings.upperRightSideOfSweaterString;
  var rightSideOfSweaterString = BASEA11yStrings.rightSideOfSweaterString;
  var lowerRightSideOfSweater = BASEA11yStrings.lowerRightSideOfSweater;

  var rightShoulderOfSweaterString = BASEA11yStrings.rightShoulderOfSweaterString;
  var rightArmOfSweaterString = BASEA11yStrings.rightArmOfSweaterString;
  var lowerRightArmOfSweaterString = BASEA11yStrings.lowerRightArmOfSweaterString;

  var upperLeftSideOfPlayAreaString = BASEA11yStrings.upperLeftSideOfPlayAreaString;
  var leftSideOfPlayAreaString = BASEA11yStrings.leftSideOfPlayAreaString;
  var lowerLeftSideOfPlayAreaString = BASEA11yStrings.lowerLeftSideOfPlayAreaString;

  var upperCenterOfPlayAreaString = BASEA11yStrings.upperCenterOfPlayAreaString;
  var centerOfPlayAreaString = BASEA11yStrings.centerOfPlayAreaString;
  var lowerCenterOfPlayAreaString = BASEA11yStrings.lowerCenterOfPlayAreaString;

  var upperRightSideOfPlayAreaString = BASEA11yStrings.upperRightSideOfPlayAreaString;
  var rightSideOfPlayAreaString = BASEA11yStrings.rightSideOfPlayAreaString;
  var lowerRightSideOfPlayAreaString = BASEA11yStrings.lowerRightSideOfPlayAreaString;

  var upperWallString = BASEA11yStrings.upperWallString;
  var wallString = BASEA11yStrings.wallString;
  var lowerWallString = BASEA11yStrings.lowerWallString;

  var upperRightEdgeOfPlayAreaString = BASEA11yStrings.upperRightEdgeOfPlayAreaString;
  var rightEdgeOfPlayAreaString = BASEA11yStrings.rightEdgeOfPlayAreaString;
  var lowerRightEdgeOfPlayAreaString = BASEA11yStrings.lowerRightEdgeOfPlayAreaString;

  // charge strings
  var noString = BASEA11yStrings.noString;
  var aFewString = BASEA11yStrings.aFewString;
  var severalString = BASEA11yStrings.severalString;
  var manyString = BASEA11yStrings.manyString;

  var landmarkNearSweaterString = BASEA11yStrings.landmarkNearSweaterString;
  var landmarkLeftEdgeString = BASEA11yStrings.landmarkLeftEdgeString;
  var landmarkNearUpperWallString = BASEA11yStrings.landmarkNearUpperWallString;
  var landmarkNearWallString = BASEA11yStrings.landmarkNearWallString;
  var landmarkNearLowerWallString = BASEA11yStrings.landmarkNearLowerWallString;

  // constants
  var LOCATION_DESCRIPTION_MAP = {
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
      UPPER_PLAY_AREA: upperCenterOfPlayAreaString,
      CENTER_PLAY_AREA: centerOfPlayAreaString,
      LOWER_PLAY_AREA: lowerCenterOfPlayAreaString
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
      UPPER_PLAY_AREA: upperRightEdgeOfPlayAreaString,
      CENTER_PLAY_AREA: rightEdgeOfPlayAreaString,
      LOWER_PLAY_AREA: lowerRightEdgeOfPlayAreaString
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

  // constants - ranges to describe relative charges in various objects
  var RELATIVE_CHARGE_DESCRIPTION_MAP = {
    NO_MORE_RANGE: {
      range: new Range( 0, 0 ),
      description: noString
    },
    A_FEW_RANGE: {
      range: new Range( 1, 15 ),
      description: aFewString
    },
    SEVERAL_RANGE: {
      range: new Range( 15, 40 ),
      description: severalString
    },
    MANY_RANGE: {
      range: new Range( 40, 57 ),
      description: manyString
    }
  };

  function BASEDescriber() {
    // TODO: Does this really need a type? Or can it be a static Object?
  }

  balloonsAndStaticElectricity.register( 'BASEDescriber', BASEDescriber );

  return inherit( Object, BASEDescriber, {}, {

    /**
     * Get the location description for the balloon. This is not a full description, but a short
     * descsription. Regions are defined in PlayAreaMap.  This will get called very often and needs to be quick.
     * 
     * @param {Vector2} location - location of the balloon, relative to its center
     * @return {string}
     */
    getLocationDescription: function( location, wallVisible ) {

      var landmarks = PlayAreaMap.LANDMARK_RANGES;
      var columns = PlayAreaMap.COLUMN_RANGES;
      var rows = PlayAreaMap.ROW_RANGES;

      // loop through keys manually to prevent a many closures from being created during object iteration in 'for in'
      // loops
      var columnsKeys = Object.keys( columns );
      var rowKeys = Object.keys( rows );
      var landmarkKeys = Object.keys( landmarks );

      var i;
      var currentLandmark;
      var currentColumn;
      var currentRow;

      for ( i = 0; i < landmarkKeys.length; i++ ) {
        if ( landmarks[ landmarkKeys[ i ] ].contains( location.x ) ) {
          currentLandmark = landmarkKeys[ i ];
        }
      }

      // landmark takes priority - only find column if we couldn't find landmark
      if ( !currentLandmark ) {
        for ( i = 0; i < columnsKeys.length; i++ ) {
          if ( columns[ columnsKeys[ i ] ].contains( location.x ) ) {
            currentColumn = columnsKeys[ i ];
          }
        }
      }
      for ( i = 0; i < rowKeys.length; i++ ) {
        if ( rows[ rowKeys[ i ] ].contains( location.y ) ) {
          currentRow = rowKeys[ i ];
        }
      }

      // use column or landmark, whichever was found
      currentColumn = currentLandmark || currentColumn;
      assert && assert( currentColumn && currentRow, 'item should be in a row or column of the play area' );

      // the wall and the right edge of the play area overlap, so if the wall is visible, chose that description
      // TODO: probably a better way to do this
      if ( wallVisible && currentColumn === 'RIGHT_EDGE' ) {
        currentColumn = 'WALL';
      }
      if ( !wallVisible && currentColumn === 'AT_WALL' || currentColumn === 'AT_NEAR_WALL' ) {
        currentColumn = 'RIGHT_PLAY_AREA';
      }

      return LOCATION_DESCRIPTION_MAP[ currentColumn ][ currentRow ];
    },

    /**
     * Get a fragment that describes the relative charge for an objet, like 'a few' or 'several', to be used in 
     * string patterns
     * 
     * @param  {number} charge
     * @return {string}
     */
    getRelativeChargeDescription: function( charge ) {

      // the description is mapped to the absolute value of charge
      var absCharge = Math.abs( charge );

      var keys = Object.keys( RELATIVE_CHARGE_DESCRIPTION_MAP );

      var description;

      for ( var i = 0; i < keys.length; i++ ) {
        var value = RELATIVE_CHARGE_DESCRIPTION_MAP[ keys[ i ] ];
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
     * @return {Range}
     */
    getDescribedChargeRange: function( charge ) {

      var describedCharge = Math.abs( charge );
      var keys = Object.keys( RELATIVE_CHARGE_DESCRIPTION_MAP );

      var range;
      for ( var i = 0; i < keys.length; i++ ) {
        var value = RELATIVE_CHARGE_DESCRIPTION_MAP[ keys[ i ] ];
        if ( value.range.contains( describedCharge ) ) {
          range = value.range;
          break;
        }
      }

      assert && assert( range, 'no charge range found for charge ' + charge );
      return range;
    },

    RELATIVE_CHARGE_DESCRIPTION_MAP: RELATIVE_CHARGE_DESCRIPTION_MAP
  } );
} );
