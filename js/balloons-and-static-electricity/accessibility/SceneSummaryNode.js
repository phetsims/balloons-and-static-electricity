// Copyright 2002-2016, University of Colorado Boulder

/**
 * Scene summary for this sim.  The scene summary is composed of a dynamic list of descriptions
 * for parts of the play area and control panel.  By breaking up the summary into a list of items,
 * the user can find specific information about the scene very quickly, and in an orginizied way.
 *
 *  Example 1:
 *  Yellow balloon, touching lower wall.
 *
 *  Example 2:
 *  Yellow balloon, touching upper wall. Green balloon, in lower play area, at center.
 *
 *  Example 3:
 *  Yellow balloon, in upper-right side of play areal.
 *
 *  Example 4:
 *  Yellow balloon, in lower-left side of play area. Green balloon, sticking to upper wall. Negative charges in wall move away from balloon a little bit.
 *
 *  Example 5:
 *  Yellow balloon, in upper play area, at center. Green balloon, sticking to lower-right arm of sweater.
 *
 *  @author Jesse Greenberg
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var AccessibleNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/accessibility/AccessibleNode' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var BalloonLocationEnum = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/BalloonLocationEnum' );
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );
  var Range = require( 'DOT/Range' );

  // strings
  var sceneSummaryLabelString = 'Scene Summary';
  var openingSummaryString = 'Simulation contains a Play Area and a Control Panel. The play area is a small room. The control panel has buttons and switches to change conditions in the room.';
  var roomItemsStringPattern = 'Currently, room has {0}';

  //-----------------
  // Location Descriptions
  var twoBalloonDescriptionPattern = '{0} {1}'; // used when both balloons are visible
  var balloonLocationDescriptionStringPattern = '{0}, {1}';
  var balloonInCenterPatternString = '{0} {1}';


  // possible items in the room
  var balloonSweaterAndRemovableWallString = 'a balloon, a sweater, and a removable wall.';
  var twoBalloonsSweaterAndRemovableWallString = 'two balloons, a sweater, and a removable wall';
  var balloonAndSweaterString = 'a balloon and a sweater';
  var twoBalloonsAndASweater = 'two balloons and a sweater';

  var inCenterPlayAreaStringPattern = 'in {0} play area, at center.';
  var lowerPlayAreaString = 'lower';
  var upperPlayAreaString = 'upper';

  var touchingWallStringPattern = 'touching {0} wall.';
  var lowerWallString = 'lower';
  var upperWallString = 'upper';

  var inPlayAreaStringPattern = 'in {0} of play area.';
  var upperLeftSideString = 'upper left side';
  var lowerLeftSideString = 'lower left side';
  var upperRightSideString = 'upper right side';
  var lowerRightSideString = 'lower right side';

  var inPlayAreaNearItemStringPattern = 'in {0} of play area, {1}.';
  var nearWallString = 'near wall';
  var nearSweaterString = 'near sweater';

  var evenlyBetweenString = 'Evenly between sweater and wall. Sweater is at far left. Wall is at far right.';

  var stickingToWallStringPattern = 'sticking to {0} wall. {1}';
  var negativeChargesMoveStringPattern = 'Negative charges in wall move away from balloon {0}.';

  var aLittleBitString = 'a little bit';
  var aLotString = 'a lot';
  var quiteALotString = 'quite a lot';

  var stickingToSweaterStringPattern = 'sticking to {0} of sweater.';
  var upperLeftArmString = 'upper left arm';
  var upperRightArmString = 'upper right arm';
  var lowerLeftArmString = 'lower left arm';
  var lowerRightArmString = 'lower right arm';

  var upperLeftSideSweaterString = 'upper left side';
  var upperRightSideSweaterString = 'upper right side';
  var lowerLeftSideSweaterString = 'lower left side';
  var lowerRightSideSweaterString = 'lower right side';

  var greenBalloonLabelString = 'Green Balloon';
  var yellowBalloonLabelString = 'Yellow Balloon';

  //--------------------------
  // Charge descriptions
  // var tempChargeDescriptionString = 'No charge descriptions in the summary for now, to be implemented soon.';

  //--------------------------
  // navigation hints
  var grabBalloonHintString = 'Grab balloon to play.';

  // constants
  var BALLOON_LABELS = {
    YELLOW: yellowBalloonLabelString,
    GREEN: greenBalloonLabelString
  };

  var BALLOON_ON_SWEATER_DESCRIPTION_MAP = {
    TOP_RIGHT_SWEATER: upperRightSideSweaterString,
    UPPER_RIGHT_SWEATER: upperRightSideSweaterString,

    BOTTOM_RIGHT_SWEATER: lowerRightSideSweaterString,
    LOWER_RIGHT_SWEATER: lowerRightSideSweaterString,

    TOP_LEFT_SWEATER: upperLeftSideSweaterString,
    UPPER_LEFT_SWEATER: upperLeftSideSweaterString,

    LOWER_LEFT_SWEATER: lowerLeftSideSweaterString,
    BOTTOM_LEFT_SWEATER: lowerLeftSideSweaterString,

    TOP_RIGHT_ARM: upperRightArmString,
    UPPER_RIGHT_ARM: upperRightArmString,

    BOTTOM_RIGHT_ARM: lowerRightArmString,
    LOWER_RIGHT_ARM: lowerRightArmString,

    TOP_LEFT_ARM: upperLeftArmString,
    UPPER_LEFT_ARM: upperLeftArmString,

    BOTTOM_LEFT_ARM: lowerLeftArmString,
    LOWER_LEFT_ARM: lowerLeftArmString,

    TOP_LEFT: upperLeftArmString,
    UPPER_LEFT: upperLeftArmString,

    BOTTOM_LEFT: lowerLeftArmString,
    LOWER_LEFT: lowerLeftArmString,

    UPPER_LEFT_PLAY_AREA: upperRightArmString,
    TOP_LEFT_PLAY_AREA: upperRightArmString,
    LOWER_LEFT_PLAY_AREA: lowerRightArmString,
    BOTTOM_LEFT_PLAY_AREA: lowerRightArmString
  };

  // ranges to describe induced charge
  var LITTLE_BIT_RANGE = new Range( 0, 20 );
  var A_LOT_RANGE = new Range( 20, 40 );
  var QUITE_A_LOT_RANGE = new Range( 40, 60 );

  /**
   *
   * @constructor
   */
  function SceneSummaryNode( model ) {

    var self = this;

    AccessibleNode.call( this, {
      tagName: 'section',
      labelTagName: 'h2',
      label: sceneSummaryLabelString,
      descriptionTagName: 'ul' // description contained in an unordered list
    } );

    // @private
    this.model = model;

    // the description node is a list composed of these items:
    this.addDescriptionItem( openingSummaryString ); // ID not needed for static content
    var roomItemsItemID = this.addDescriptionItem( StringUtils.format( roomItemsStringPattern, balloonSweaterAndRemovableWallString ) );
    var locationItemID = this.addDescriptionItem( '' ); // text content set by listener
    var chargeItemID = this.addDescriptionItem( 'Balloon, sweater, and wall all have net neutral charge.' ); // id not needed for static content
    this.addDescriptionItem( grabBalloonHintString ); // id not needed for static content

    // update the description of room items depending on visibility
    var roomItemsDescriptionListener = function() {
      var visibleItemsDescription;

      if ( model.wall.isVisible ) {
        if ( model.balloons[ 1 ].isVisible ) {
          visibleItemsDescription = twoBalloonsSweaterAndRemovableWallString;
        }
        else {
          visibleItemsDescription = balloonSweaterAndRemovableWallString;
        }
      }
      else {
        if ( model.balloons[ 1 ].isVisible ) {
          visibleItemsDescription = twoBalloonsAndASweater;
        }
        else {
          visibleItemsDescription = balloonAndSweaterString;
        }
      }

      assert && assert( visibleItemsDescription, 'There must be a combination of visible items which can be described.' );
      self.updateDescriptionItem( roomItemsItemID, StringUtils.format( roomItemsStringPattern, visibleItemsDescription ) );

    };
    model.wall.isVisibleProperty.link( roomItemsDescriptionListener );
    model.balloons[ 1 ].isVisibleProperty.link( roomItemsDescriptionListener );

    /**
     * Updates the description of where the balloon is in the play area with information about the proximity
     * of other objects in the play area.
     *
     * @param {Balloon} balloon
     */
    var balloonLocationListener = function( location, oldLocation ) {
      var yellowBalloonDescription = self.getBalloonLocationDescription( model.balloons[ 0 ] );

      // if both balloons are visible, we need a description for both
      if ( model.balloons[ 1 ].isVisibleProperty.get() ) {
        var greenBalloonDescription = self.getBalloonLocationDescription( model.balloons[ 1 ] );

        var combinedDescription = StringUtils.format( twoBalloonDescriptionPattern, yellowBalloonDescription, greenBalloonDescription );
        self.updateDescriptionItem( locationItemID, combinedDescription );
      }
      else {
        // if the single balloon is in the center of the play area, there also needs to be a description
        // for the relative locations of the other items in the play area
        if ( model.balloons[ 0 ].getCenter().x === model.playArea.atCenter && model.wall.isVisibleProperty.get() ) {
          yellowBalloonDescription = StringUtils.format( balloonInCenterPatternString, yellowBalloonDescription, evenlyBetweenString );
        }
        self.updateDescriptionItem( locationItemID, yellowBalloonDescription );
      }
    };
    model.balloons[ 0 ].locationProperty.link( balloonLocationListener );
    model.balloons[ 1 ].locationProperty.link( balloonLocationListener );

    var balloonChargeListener = function( charge ) {
      var balloonDescriber = model.balloons[ 0 ].balloonDescriber;
      var balloonChargeDescription = balloonDescriber.getBalloonChargeDescription( model.balloons[ 0 ], true );
      var sweaterChargeDescription = balloonDescriber.getSweaterChargeDescription( model.balloons[ 0 ] );
      var wallDescription = 'Wall has a net neutral charge.';

      var stringPattern;
      var string;
      if ( self.model.wall.isVisibleProperty.get() ) {
        stringPattern = '{0} {1} {2}';
        string = StringUtils.format( stringPattern, balloonChargeDescription, sweaterChargeDescription, wallDescription );
        self.updateDescriptionItem( chargeItemID, string );
      }
      else {
        stringPattern = '{0} {1}';
        string = StringUtils.format( stringPattern, balloonChargeDescription, sweaterChargeDescription );
        self.updateDescriptionItem( chargeItemID, string );
      }


      return string;
    };
    model.balloons[ 0 ].chargeProperty.link( balloonChargeListener );

    // update charge descriptions when wall visibility toggles.
    model.wall.isVisibleProperty.link( function() {
      balloonChargeListener( model.balloons[ 0 ].chargeProperty.get() );
    } );

  }

  balloonsAndStaticElectricity.register( 'SceneSummaryNode', SceneSummaryNode );

  return inherit( AccessibleNode, SceneSummaryNode, {

    /**
     * Get a description for the balloon when it is in the right side of the play area.
     * Formats a desription string to include information about whether the balloon is in the upper or
     * lower part, and if the balloon is close to the wall.
     *
     * @param  {boolean} nearWall - is the balloon near the wall?
     * @param  {string} upperOrLowerString description
     * @param {string} balloonLabel - label for the balloon
     * @return {string}
     */
    getRightSideOfPlayAreaDescription: function( nearWall, upperOrLowerString, balloonLabel ) {
      var locationString;

      // if near the wall, that needs to be described
      if ( nearWall && this.model.wall.isVisibleProperty.get() ) {
        locationString = StringUtils.format( inPlayAreaNearItemStringPattern, upperOrLowerString, nearWallString );
      }
      else {
        locationString = StringUtils.format( inPlayAreaStringPattern, upperOrLowerString );
      }
      return StringUtils.format( balloonLocationDescriptionStringPattern, balloonLabel, locationString );
    },

    /**
     * Get a description string for the balloon in the left side of the play area that includes sinformation about
     * whether the balloon is in the upper or lower part of the play area, and if it is close to the sweater
     *
     * @param  {boolean} nearSweater - is the balloon near the sweater?
     * @param  {string} upperOrLowerString - string that describes whether the balloon is in the upper or lower part
     *                                        of the play area
     * @param {string} balloonLabel - translatable label for the balloon
     * @return {string} - formatted string
     */
    getLeftSideOfPlayAreaDescription: function( nearSweater, upperOrLowerString, balloonLabel ) {
      var locationString;

      // if near sweater, that needs to be described
      if ( nearSweater ) {
        locationString = StringUtils.format( inPlayAreaNearItemStringPattern, upperOrLowerString, nearSweaterString );
      }
      else {
        locationString = StringUtils.format( inPlayAreaStringPattern, upperOrLowerString );
      }
      return StringUtils.format( balloonLocationDescriptionStringPattern, balloonLabel, locationString );
    },

    getBalloonTouchingWallDescription: function( charge, upperOrLowerString, balloonLabel ) {
      var balloonLocationDescription;

      if ( charge < 0 ) {
        var absCharge = Math.abs( charge );
        var chargeString;

        if ( LITTLE_BIT_RANGE.contains( absCharge ) ) {
          chargeString = aLittleBitString;
        }
        else if ( A_LOT_RANGE.contains( absCharge ) ) {
          chargeString = aLotString;
        }
        else if( QUITE_A_LOT_RANGE.contains( absCharge ) ) {
          chargeString = quiteALotString;
        }
        assert && assert( chargeString, 'could not describe induced charge for balloon with charge: ' + charge );
        var wallChargesString = StringUtils.format( negativeChargesMoveStringPattern, chargeString );

        var stickingToWallString = StringUtils.format( stickingToWallStringPattern, upperOrLowerString, wallChargesString );
        balloonLocationDescription = StringUtils.format( balloonLocationDescriptionStringPattern, balloonLabel, stickingToWallString );

      }
      else {
        var touchingWallString = StringUtils.format( touchingWallStringPattern, upperOrLowerString );
        balloonLocationDescription = StringUtils.format( balloonLocationDescriptionStringPattern, balloonLabel, touchingWallString );
      }
      return balloonLocationDescription;
    },

    getBalloonTouchingSweaterDescription: function( balloonLabel, currentBounds ) {
      var balloonLocationDescription;
      var onSweaterDescription = BALLOON_ON_SWEATER_DESCRIPTION_MAP[ currentBounds ];
      assert && assert( onSweaterDescription, 'could not find description for location of sweater' );

      var stickingToSweaterString = StringUtils.format( stickingToSweaterStringPattern, onSweaterDescription );
      balloonLocationDescription = StringUtils.format( balloonLocationDescriptionStringPattern, balloonLabel, stickingToSweaterString );
      return balloonLocationDescription;
    },

    getBalloonLocationDescription: function( balloon ) {
      var balloonLocationDescription;
      var upperOrLowerString;
      var balloonLabel = BALLOON_LABELS[ balloon.balloonLabel ];

      // get a one of the possible locations values to map balloon location to a description
      var currentBounds = this.model.playArea.getPointBounds( balloon.getCenter() );

      if ( this.model.playArea.atWall === balloon.getCenter().x ) {

        // if touching the wall, describe whether it is touching the upper or lower parts, and include
        // a description of induced charge if the balloon is charged
        upperOrLowerString = balloon.inUpperHalfOfPlayArea() ? upperWallString : lowerWallString;
        balloonLocationDescription = this.getBalloonTouchingWallDescription( balloon.chargeProperty.value, upperOrLowerString, balloonLabel );

      }
      else if ( balloon.onSweater() && balloon.chargeProperty.get() < 0 ) {
        upperOrLowerString = balloon.inUpperHalfOfPlayArea() ? upperWallString : lowerWallString;
        balloonLocationDescription= this.getBalloonTouchingSweaterDescription( balloonLabel, currentBounds );
      }
      else if ( currentBounds === BalloonLocationEnum.TOP_CENTER_PLAY_AREA || currentBounds === BalloonLocationEnum.UPPER_CENTER_PLAY_AREA ) {
        var upperCenterString = StringUtils.format( inCenterPlayAreaStringPattern, upperPlayAreaString );
        balloonLocationDescription = StringUtils.format( balloonLocationDescriptionStringPattern, balloonLabel, upperCenterString );
      }
      else if ( currentBounds === BalloonLocationEnum.BOTTOM_CENTER_PLAY_AREA || currentBounds === BalloonLocationEnum.LOWER_CENTER_PLAY_AREA ) {
        var lowerCenterString = StringUtils.format( inCenterPlayAreaStringPattern, lowerPlayAreaString );
        balloonLocationDescription = StringUtils.format( balloonLocationDescriptionStringPattern, balloonLabel, lowerCenterString );
      }
      else if ( currentBounds === BalloonLocationEnum.TOP_RIGHT_PLAY_AREA || currentBounds === BalloonLocationEnum.UPPER_RIGHT_PLAY_AREA ) {
        balloonLocationDescription = this.getRightSideOfPlayAreaDescription( balloon.nearWall(), upperRightSideString, balloonLabel );
      }
      else if ( currentBounds === BalloonLocationEnum.BOTTOM_RIGHT_PLAY_AREA || currentBounds === BalloonLocationEnum.LOWER_RIGHT_PLAY_AREA ) {
        balloonLocationDescription = this.getRightSideOfPlayAreaDescription( balloon.nearWall(), lowerRightSideString, balloonLabel );
      }
      else if ( currentBounds === BalloonLocationEnum.TOP_LEFT_PLAY_AREA || currentBounds === BalloonLocationEnum.UPPER_LEFT_PLAY_AREA ) {
        balloonLocationDescription = this.getLeftSideOfPlayAreaDescription( balloon.nearSweater(), upperLeftSideString, balloonLabel );
      }
      else if ( currentBounds === BalloonLocationEnum.BOTTOM_LEFT_PLAY_AREA || currentBounds === BalloonLocationEnum.LOWER_LEFT_PLAY_AREA ) {
        balloonLocationDescription = this.getLeftSideOfPlayAreaDescription( balloon.nearSweater(), lowerLeftSideString, balloonLabel );
      }

      return balloonLocationDescription;
    }

  } );

} );
