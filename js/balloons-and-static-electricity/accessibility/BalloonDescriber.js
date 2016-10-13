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
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );

  // constants

  // strings

  // location strings (organized by collumns in the play area)
  var balloonLocationStringPattern = 'At {0}.';

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
  var touchingWallStringPattern = 'touching {0} wall.';
  var lowerWallString = 'lower';
  var upperWallString = 'upper';

  /**
   *
   * @constructor
   */
  function BalloonDescriber( model ) {

    // @private
    this.model = model;

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
      if ( balloon.chargeProperty.get() === 0 && ( this.model.playArea.atWall === balloon.getCenter().x ) )  {
        var upperLowerString;
        if ( balloon.inUpperHalfOfPlayArea() ) {
          upperLowerString = upperWallString;
        }
        else {
          upperLowerString = lowerWallString;
        }
        balloonLocationDescription = StringUtils.format( touchingWallStringPattern, upperLowerString );
      }
      else {
        var locationBounds = this.model.playArea.getPointBounds( balloon.getCenter().x );
        var locationDescription = this.locationDescriptionMap[ locationBounds ];
        balloonLocationDescription = StringUtils.format( balloonLocationStringPattern, locationDescription );
      }

      assert && assert( balloonLocationDescription, 'no description found for balloon location' );
      return balloonLocationDescription;
    }
  } );

} );
