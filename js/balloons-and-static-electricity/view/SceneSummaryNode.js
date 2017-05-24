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
  var Node = require( 'SCENERY/nodes/Node' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );
  var Range = require( 'DOT/Range' );
  var BASEA11yStrings = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/BASEA11yStrings' );
  var AccessibleSectionNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/AccessibleSectionNode' );
  var TNode = require( 'SCENERY/nodes/TNode' );

  // strings
  var sceneSummaryString = BASEA11yStrings.sceneSummaryString;
  var openingSummaryString = BASEA11yStrings.openingSummaryString;
  var keyboardShortcutsHelpString = BASEA11yStrings.keyboardShortcutsHelpString;
  var grabBalloonToPlayString = BASEA11yStrings.grabBalloonToPlayString;

  // constants
  var BALLOON_LABELS = {
    YELLOW: BASEA11yStrings.yellowBalloonLabelString,
    GREEN: BASEA11yStrings.greenBalloonLabelString
  };

  var BALLOON_ON_SWEATER_DESCRIPTION_MAP = {
    TOP_RIGHT_SWEATER: BASEA11yStrings.upperRightSideSweaterString,
    UPPER_RIGHT_SWEATER: BASEA11yStrings.upperRightSideSweaterString,

    BOTTOM_RIGHT_SWEATER: BASEA11yStrings.lowerRightSideSweaterString,
    LOWER_RIGHT_SWEATER: BASEA11yStrings.lowerRightSideSweaterString,

    TOP_LEFT_SWEATER: BASEA11yStrings.upperLeftSideSweaterString,
    UPPER_LEFT_SWEATER: BASEA11yStrings.upperLeftSideSweaterString,

    LOWER_LEFT_SWEATER: BASEA11yStrings.lowerLeftSideSweaterString,
    BOTTOM_LEFT_SWEATER: BASEA11yStrings.lowerLeftSideSweaterString,

    TOP_RIGHT_ARM: BASEA11yStrings.upperRightArmString,
    UPPER_RIGHT_ARM: BASEA11yStrings.upperRightArmString,

    BOTTOM_RIGHT_ARM: BASEA11yStrings.lowerRightArmString,
    LOWER_RIGHT_ARM: BASEA11yStrings.lowerRightArmString,

    TOP_LEFT_ARM: BASEA11yStrings.upperLeftArmString,
    UPPER_LEFT_ARM: BASEA11yStrings.upperLeftArmString,

    BOTTOM_LEFT_ARM: BASEA11yStrings.lowerLeftArmString,
    LOWER_LEFT_ARM: BASEA11yStrings.lowerLeftArmString,

    TOP_LEFT: BASEA11yStrings.upperLeftArmString,
    UPPER_LEFT: BASEA11yStrings.upperLeftArmString,

    BOTTOM_LEFT: BASEA11yStrings.lowerLeftArmString,
    LOWER_LEFT: BASEA11yStrings.lowerLeftArmString,

    UPPER_LEFT_PLAY_AREA: BASEA11yStrings.upperRightArmString,
    TOP_LEFT_PLAY_AREA: BASEA11yStrings.upperRightArmString,
    LOWER_LEFT_PLAY_AREA: BASEA11yStrings.lowerRightArmString,
    BOTTOM_LEFT_PLAY_AREA: BASEA11yStrings.lowerRightArmString,

    TOP_RIGHT: BASEA11yStrings.topRightEdgeOfPlayAreaString,
    UPPER_RIGHT: BASEA11yStrings.upperRightEdgeOfPlayAreaString,
    LOWER_RIGHT: BASEA11yStrings.lowerRightEdgeOfPlayAreaString,
    BOTTOM_RIGHT: BASEA11yStrings.bottomRightEdgeOfPlayAreaString

  };

  // ranges to describe induced charge
  var LITTLE_BIT_RANGE = new Range( 0, 20 );
  var A_LOT_RANGE = new Range( 20, 40 );
  var QUITE_A_LOT_RANGE = new Range( 40, 60 );

  /**
   * @constructor
   * @param {BalloonsAndStaticElectricityModel} model
   * @param {Tandem} tandem
   */
  function SceneSummaryNode( model, tandem ) {

    var self = this;

    AccessibleSectionNode.call( this, sceneSummaryString );

    // @private
    this.model = model;

    // @private - describers for each of the balloons
    this.yellowBalloonDescriber = model.yellowBalloon.balloonDescriber;
    this.greenBalloonDescriber = model.greenBalloon.balloonDescriber;

    // opening paragraph for the simulation
    var openingSummaryNode = new Node( {
      pickable: false,

      // a11y
      tagName: 'p',
      accessibleLabel: openingSummaryString
    } );
    this.addChild( openingSummaryNode );

    // list of dynamic description content that will update with the state of the simulation
    var listNode = new Node( { tagName: 'ul' } );
    var roomObjectsNode = new Node( { tagName: 'li' } );
    var locationDescriptionNode = new Node( { tagName: 'li' } );
    var chargeDescriptionNode = new Node( { tagName: 'li' } );

    this.addChild( listNode );
    listNode.addChild( roomObjectsNode );
    listNode.addChild( locationDescriptionNode );
    listNode.addChild( chargeDescriptionNode );

    // static interaction hints
    this.addChild( new Node( { tagName: 'p', accessibleLabel: grabBalloonToPlayString } ) );
    this.addChild( new Node( { tagName: 'p', accessibleLabel: keyboardShortcutsHelpString } ) );

    // update the description of room items depending on visibility
    var roomItemsDescriptionListener = function() {
      var visibleItemsDescription;

      if ( model.wall.isVisibleProperty.get() ) {
        if ( model.greenBalloon.isVisibleProperty.get() ) {
          visibleItemsDescription = BASEA11yStrings.twoBalloonsSweaterAndRemovableWallString;
        }
        else {
          visibleItemsDescription = BASEA11yStrings.balloonSweaterAndRemovableWallString;
        }
      }
      else {
        if ( model.greenBalloon.isVisibleProperty.get() ) {
          visibleItemsDescription = BASEA11yStrings.twoBalloonsAndASweater;
        }
        else {
          visibleItemsDescription = BASEA11yStrings.balloonAndSweaterString;
        }
      }

      assert && assert( visibleItemsDescription, 'There must be a combination of visible items which can be described.' );
      roomObjectsNode.accessibleLabel = StringUtils.format( BASEA11yStrings.roomItemsStringPattern, visibleItemsDescription );
    };

    model.wall.isVisibleProperty.link( roomItemsDescriptionListener );
    model.greenBalloon.isVisibleProperty.link( roomItemsDescriptionListener );

    /**
     * Updates the description of where the balloon is in the play area with information about the proximity
     * of other objects in the play area.
     *
     * @param {Balloon} balloon
     */
    var balloonLocationListener = function( location, oldLocation ) {
      var yellowBalloonDescription = self.getBalloonLocationDescription( model.yellowBalloon );

      // if both balloons are visible, we need a description for both
      if ( model.greenBalloon.isVisibleProperty.get() ) {
        var greenBalloonDescription = self.getBalloonLocationDescription( model.greenBalloon );

        var combinedDescription = StringUtils.format( BASEA11yStrings.twoBalloonDescriptionPattern, yellowBalloonDescription, greenBalloonDescription );
        locationDescriptionNode.accessibleLabel = combinedDescription;
      }
      else {

        // if the single balloon is in the center of the play area, there also needs to be a description
        // for the relative locations of the other items in the play area
        if ( model.yellowBalloon.getCenter().x === model.playArea.atCenter && model.wall.isVisibleProperty.get() ) {
          yellowBalloonDescription = StringUtils.format( BASEA11yStrings.balloonInCenterPatternString, yellowBalloonDescription, BASEA11yStrings.evenlyBetweenString );
        }

        locationDescriptionNode.accessibleLabel = yellowBalloonDescription;
      }
    };
    model.yellowBalloon.locationProperty.link( balloonLocationListener );
    model.greenBalloon.locationProperty.link( balloonLocationListener );

    var balloonChargeListener = function( charge ) {
      var balloonDescriber = self.yellowBalloonDescriber;
      var balloonChargeDescription = balloonDescriber.getBalloonChargeDescription( model.yellowBalloon, true );
      var sweaterChargeDescription = balloonDescriber.getSweaterChargeDescription( model.yellowBalloon );
      var wallDescription = 'Wall has a net neutral charge.';

      var stringPattern;
      var string;
      if ( self.model.wall.isVisibleProperty.get() ) {
        stringPattern = '{0} {1} {2}';
        string = StringUtils.format( stringPattern, balloonChargeDescription, sweaterChargeDescription, wallDescription );
      }
      else {
        stringPattern = '{0} {1}';
        string = StringUtils.format( stringPattern, balloonChargeDescription, sweaterChargeDescription );
      }
      chargeDescriptionNode.accessibleLabel = string;

      return string;
    };
    model.yellowBalloon.chargeProperty.link( balloonChargeListener );

    // update charge descriptions when wall visibility toggles.
    model.wall.isVisibleProperty.link( function() {
      balloonChargeListener( model.yellowBalloon.chargeProperty.get() );
    } );

    // tandem support
    tandem.addInstance( this, TNode );
  }

  balloonsAndStaticElectricity.register( 'SceneSummaryNode', SceneSummaryNode );

  return inherit( AccessibleSectionNode, SceneSummaryNode, {

    /**
     * Get a description for the balloon when it is in the right side of the play area.
     * Formats a description string to include information about whether the balloon is in the upper or
     * lower part, and if the balloon is close to the wall.
     *
     * @param  {boolean} nearWall - is the balloon near the wall?
     * @param  {string} upperOrLowerString description
     * @param {string} balloonLabel - label for the balloon
     * @returns {string}
     */
    getRightSideOfPlayAreaDescription: function( nearWall, upperOrLowerString, balloonLabel ) {
      var locationString;

      // if near the wall, that needs to be described
      if ( nearWall && this.model.wall.isVisibleProperty.get() ) {
        locationString = StringUtils.format( BASEA11yStrings.inPlayAreaNearItemStringPattern, upperOrLowerString, BASEA11yStrings.nearWallString );
      }
      else {
        locationString = StringUtils.format( BASEA11yStrings.inPlayAreaStringPattern, upperOrLowerString );
      }
      return StringUtils.format( BASEA11yStrings.balloonLocationDescriptionStringPattern, balloonLabel, locationString );
    },

    /**
     * Get a description string for the balloon in the left side of the play area that includes sinformation about
     * whether the balloon is in the upper or lower part of the play area, and if it is close to the sweater
     *
     * @param  {boolean} nearSweater - is the balloon near the sweater?
     * @param  {string} upperOrLowerString - string that describes whether the balloon is in the upper or lower part
     *                                        of the play area
     * @param {string} balloonLabel - translatable label for the balloon
     * @returns {string} - formatted string
     */
    getLeftSideOfPlayAreaDescription: function( nearSweater, upperOrLowerString, balloonLabel ) {
      var locationString;

      // if near sweater, that needs to be described
      if ( nearSweater ) {
        locationString = StringUtils.format( BASEA11yStrings.inPlayAreaNearItemStringPattern, upperOrLowerString, BASEA11yStrings.nearSweaterString );
      }
      else {
        locationString = StringUtils.format( BASEA11yStrings.inPlayAreaStringPattern, upperOrLowerString );
      }
      return StringUtils.format( BASEA11yStrings.balloonLocationDescriptionStringPattern, balloonLabel, locationString );
    },

    getBalloonTouchingWallDescription: function( charge, upperOrLowerString, balloonLabel ) {
      var balloonLocationDescription;

      if ( charge < 0 ) {
        var absCharge = Math.abs( charge );
        var chargeString;

        if ( LITTLE_BIT_RANGE.contains( absCharge ) ) {
          chargeString = BASEA11yStrings.aLittleBitString;
        }
        else if ( A_LOT_RANGE.contains( absCharge ) ) {
          chargeString = BASEA11yStrings.aLotString;
        }
        else if ( QUITE_A_LOT_RANGE.contains( absCharge ) ) {
          chargeString = BASEA11yStrings.quiteALotString;
        }
        assert && assert( chargeString, 'could not describe induced charge for balloon with charge: ' + charge );
        var wallChargesString = StringUtils.format( BASEA11yStrings.negativeChargesMoveStringPattern, chargeString );

        var stickingToWallString = StringUtils.format( BASEA11yStrings.stickingToWallWithChargesStringPattern, upperOrLowerString, wallChargesString );
        balloonLocationDescription = StringUtils.format( BASEA11yStrings.balloonLocationDescriptionStringPattern, balloonLabel, stickingToWallString );

      }
      else {
        var touchingWallString = StringUtils.format( BASEA11yStrings.touchingWallStringPattern, upperOrLowerString );
        balloonLocationDescription = StringUtils.format( BASEA11yStrings.balloonLocationDescriptionStringPattern, balloonLabel, touchingWallString );
      }
      return balloonLocationDescription;
    },

    getBalloonTouchingSweaterDescription: function( balloonLabel, currentBounds ) {
      var balloonLocationDescription;
      var onSweaterDescription = BALLOON_ON_SWEATER_DESCRIPTION_MAP[ currentBounds ];
      assert && assert( onSweaterDescription, 'could not find description for location of sweater' );

      var stickingToSweaterString = StringUtils.format( BASEA11yStrings.stickingToSweaterStringPattern, onSweaterDescription );
      balloonLocationDescription = StringUtils.format( BASEA11yStrings.balloonLocationDescriptionStringPattern, balloonLabel, stickingToSweaterString );
      return balloonLocationDescription;
    },

    getBalloonLocationDescription: function( balloon ) {

      var balloonLabel = BALLOON_LABELS[ balloon.balloonLabel ];
      var locationDescription = balloon.balloonDescriber.getBalloonLocationDescription( balloon );

      // piece them together
      var balloonLocationDescription = StringUtils.format( BASEA11yStrings.balloonLocationDescriptionStringPattern, balloonLabel, locationDescription );
      return balloonLocationDescription;
    }
  } );
} );