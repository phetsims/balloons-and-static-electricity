// Copyright 2002-2016, University of Colorado Boulder

/**
 * This type allows for determining descriptions for the balloon.  Describing the location of the balloon
 * is quite complicated so this distributes the description work so that BalloonNode does not become
 * a massive file.  Used for accessibility.
 *
 * !! The LocationEnum maps nicely to these descriptions, so this shouldn't be so bad!
 *
 * @author Jesse Greenberg
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Range = require( 'DOT/Range' );
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );

  // constants
  var A_FEW_RANGE = new Range( 1, 15 );
  var SEVERAL_RANGE = new Range( 15, 40 );
  var MANY_RANGE = new Range( 40, 56 );

  // strings
  var balloonDescriptionPatternString = '{0} {1} {2}';
  var grabButtonNavigationCueString = 'Look for grab button to play';
  // var dragNavigationCueString = 'Press W, A, S, or D key to drag balloon. Spacebar to let go. H key for hotkeys and help.'

  // location strings (organized by collumns in the play area)
  var balloonLocationStringPattern = 'In {0}.';

  var topLeftEdgeOfSweaterString = 'top left edge of sweater';
  var upperLeftEdgeOfSweaterString = 'upper left edge of sweater';
  var lowerLeftEdgeOfSweaterString = 'lower left edge of sweater';
  var bottomLeftEdgeOfSweaterString = 'bottom left edge of sweater';

  var topLeftArmString = 'top left arm';
  var upperLeftArmString = 'upper left arm';
  var lowerLeftArmString = 'lower left arm';
  var bottomLeftArmString = 'bottom left arm';

  var topLeftSideOfSweaterString = 'top left side of sweater';
  var upperLeftSideOfSweaterString = 'upper left side of sweater';
  var lowerLeftSideOfSweaterString = 'lower left side of sweater';
  var bottomLeftSideOfSweaterString = 'bottom left side of sweater';

  var topRightSideOfSweaterString = 'top right side of sweater';
  var upperRightSideOfSweaterString = 'upper right side of sweater';
  var lowerRightSideOfSweaterString = 'lower right side of sweater';
  var bottomRightSideOfSweaterString = 'bottom right side of sweater';

  var topRightArmString = 'top right arm';
  var upperRightArmString = 'upper right arm';
  var lowerRightArmString = 'lower right arm';
  var bottomRightArmString = 'bottom right arm';

  var topLeftSideOfPlayAreaString = 'top left side of play area';
  var upperLeftSideOfPlayAreaString = 'upper left side of play area';
  var lowerLeftSideOfPlayAreaString = 'lower left side of play area';
  var bottomLeftSideOfPlayAreaString = 'bottom left side of play area';

  var topCenterOfPlayAreaString = 'top center of play area';
  var upperCenterOfPlayAreaString = 'upper center of play area';
  var lowerCenterOfPlayAreaString = 'lower center of play area';
  var bottomCenterOfPlayAreaString = 'bottom center of play area';

  var topRightSideOfPlayAreaString = 'top right side of play area';
  var upperRightSideOfPlayAreaString = 'upper right side of play area';
  var lowerRightSideOfPlayAreaString = 'lower right side of play area';
  var bottomRightSideOfPlayAreaString = 'bottom right side of play area';

  var topRightEdgeOfPlayAreaString = 'top right edge of play area';
  var upperRightEdgeOfPlayAreaString = 'upper right edge of play area';
  var lowerRightEdgeOfPlayAreaString = 'lower right edge of play area';
  var bottomRightEdgeOfPlayAreaString = 'bottom right edge of play area';

  // location strings while touching another object
  var touchingWallStringPattern = 'Touching {0} wall.';
  var stickintToWallStringPattern = 'Sticking to {0} wall.';
  var lowerWallString = 'lower';
  var upperWallString = 'upper';

  // charge descriptions
  var balloonChargeStringPattern = 'Has net {0} charge, {1} more negative charges than positive charges.';

  var neutralString = 'neutral';
  var negativeString = 'negative';

  var noString = 'no';
  var aFewString = 'a few';
  var severalString = 'several';
  var manyString = 'many';

  // wall charge descriptions
  var atWallString = 'At wall.';
  var atWallTouchPointPatternString = 'At touch point, negative charges in wall move away from balloon {0}.';

  var noChangeInChargesString = 'no change in charges';
  var aLittleBitString = 'a little bit';
  var aLotString = 'a lot';
  var quiteALotString = 'quite a lot';

  var positiveChargesDoNotMoveString = 'Positive charges do not move.';
  var wallHasChargePairsString = 'Wall has many pairs of positive and negative charges';

  var balloonHasChargesPatternString = 'Balloon has {0} more negative charges than positive charges.';

  // release descriptions

  /**
   * @param {BalloonsAndStaticElectricityModel} model
   * @param {WallModel} wall
   * @constructor
   */
  function BalloonDescriber( model, wall ) {

    // @private
    this.model = model;
    this.wall = wall;

    // @private
    this.locationDescriptionMap = {
      TOP_LEFT: topLeftEdgeOfSweaterString,
      UPPER_LEFT: upperLeftEdgeOfSweaterString,
      LOWER_LEFT: lowerLeftEdgeOfSweaterString,
      BOTTOM_LEFT: bottomLeftEdgeOfSweaterString,

      TOP_LEFT_ARM: topLeftArmString,
      UPPER_LEFT_ARM: upperLeftArmString,
      LOWER_LEFT_ARM: lowerLeftArmString,
      BOTTOM_LEFT_ARM: bottomLeftArmString,

      TOP_LEFT_SWEATER: topLeftSideOfSweaterString,
      UPPER_LEFT_SWEATER: upperLeftSideOfSweaterString,
      LOWER_LEFT_SWEATER: lowerLeftSideOfSweaterString,
      BOTTOM_LEFT_SWEATER: bottomLeftSideOfSweaterString,

      TOP_RIGHT_SWEATER: topRightSideOfSweaterString,
      UPPER_RIGHT_SWEATER: upperRightSideOfSweaterString,
      LOWER_RIGHT_SWEATER: lowerRightSideOfSweaterString,
      BOTTOM_RIGHT_SWEATER: bottomRightSideOfSweaterString,

      TOP_RIGHT_ARM: topRightArmString,
      UPPER_RIGHT_ARM: upperRightArmString,
      LOWER_RIGHT_ARM: lowerRightArmString,
      BOTTOM_RIGHT_ARM: bottomRightArmString,

      TOP_LEFT_PLAY_AREA: topLeftSideOfPlayAreaString,
      UPPER_LEFT_PLAY_AREA: upperLeftSideOfPlayAreaString,
      LOWER_LEFT_PLAY_AREA: lowerLeftSideOfPlayAreaString,
      BOTTOM_LEFT_PLAY_AREA: bottomLeftSideOfPlayAreaString,

      TOP_CENTER_PLAY_AREA: topCenterOfPlayAreaString,
      UPPER_CENTER_PLAY_AREA: upperCenterOfPlayAreaString,
      LOWER_CENTER_PLAY_AREA: lowerCenterOfPlayAreaString,
      BOTTOM_CENTER_PLAY_AREA: bottomCenterOfPlayAreaString,

      TOP_RIGHT_PLAY_AREA: topRightSideOfPlayAreaString,
      UPPER_RIGHT_PLAY_AREA: upperRightSideOfPlayAreaString,
      LOWER_RIGHT_PLAY_AREA: lowerRightSideOfPlayAreaString,
      BOTTOM_RIGHT_PLAY_AREA: bottomRightSideOfPlayAreaString,

      TOP_RIGHT: topRightEdgeOfPlayAreaString,
      UPPER_RIGHT: upperRightEdgeOfPlayAreaString,
      LOWER_RIGHT: lowerRightEdgeOfPlayAreaString,
      BOTTOM_RIGHT: bottomRightEdgeOfPlayAreaString
    };
  }

  balloonsAndStaticElectricity.register( 'BalloonDescriber', BalloonDescriber );

  return inherit( Object, BalloonDescriber, {

    /**
     * Get a description of the balloon location.
     *
     * @param  {Balloon} balloon
     * @return {string}
     */
    getBalloonLocationDescription: function( balloon ) {
      var balloonLocationDescription;

      // if touching the wall (balloon has no charge)
      if ( this.model.playArea.atWall === balloon.getCenter().x ) {
        var upperLowerString;
        if ( balloon.inUpperHalfOfPlayArea() ) {
          upperLowerString = upperWallString;
        }
        else {
          upperLowerString = lowerWallString;
        }

        if ( balloon.chargeProperty.get() === 0 ) {
          balloonLocationDescription = StringUtils.format( touchingWallStringPattern, upperLowerString );
        }
        else {
          balloonLocationDescription = StringUtils.format( stickintToWallStringPattern, upperLowerString );
        }
      }
      else {
        var locationBounds = this.model.playArea.getPointBounds( balloon.getCenter() );
        var locationDescription = this.locationDescriptionMap[ locationBounds ];

        balloonLocationDescription = StringUtils.format( balloonLocationStringPattern, locationDescription );
      }

      assert && assert( balloonLocationDescription, 'no description found for balloon location' );
      return balloonLocationDescription;
    },

    /**
     * Get a description of the balloon's charge.
     * TODO: This kind of method of getting descriptions based on numerical values in a range
     * could be generalized some how.
     * 
     * @param  {Baloon} balloon
     * @return {string}
     */
    getBalloonChargeDescription: function( balloon ) {
      var chargeString;
      var neutralityString;

      var charge = Math.abs( balloon.chargeProperty.value );
      if ( charge === 0 ) {
        chargeString = noString;
        neutralityString = neutralString;
      }
      else if ( A_FEW_RANGE.contains( charge ) ) {
        chargeString = aFewString;
        neutralityString = negativeString;
      }
      else if ( SEVERAL_RANGE.contains( charge ) ) {
        chargeString = severalString;
        neutralityString = negativeString;
      }
      else if ( MANY_RANGE.contains( charge ) ) {
        chargeString = manyString;
        neutralityString = negativeString;
      }

      assert && assert( chargeString, 'no description found for balloon with charge: ' + balloon.charge );
      return StringUtils.format( balloonChargeStringPattern, neutralityString, chargeString );

    },

    /**
     * Get a description of the balloon as it is dragging.  This should be called when the user completes 
     * a drag interaction (on key up, typically).
     *
     * @param  {Balloon} balloon
     * @return {string}        
     */
    getDraggingDescription: function( balloon ) {
      var draggingDescription;

      console.log( this.getBalloonLocationDescription( balloon ) );

      assert && assert( draggingDescription, 'No description for the balloon dragging' );
    },

    /**
     * Get a description for the balloon, including charge and location.
     * 
     * @param  {Balloon} balloon
     * @return {string}
     */
    getDescription: function( balloon ) {
      var locationDescription = this.getBalloonLocationDescription( balloon );
      var chargeDescription = this.getBalloonChargeDescription( balloon );
      return StringUtils.format( balloonDescriptionPatternString, locationDescription, chargeDescription, grabButtonNavigationCueString );
    }
  } );

} );
