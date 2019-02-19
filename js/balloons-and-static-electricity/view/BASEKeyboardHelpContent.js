// Copyright 2015-2019, University of Colorado Boulder

/**
 * Content for the "Keyboard Shortcuts" dialog that can be brought up from the sim navigation bar.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );
  var BASEA11yStrings = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/BASEA11yStrings' );
  var EnterKeyNode = require( 'SCENERY_PHET/keyboard/EnterKeyNode' );
  var GeneralNavigationHelpContent = require( 'SCENERY_PHET/keyboard/help/GeneralNavigationHelpContent' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HelpContent = require( 'SCENERY_PHET/keyboard/help/HelpContent' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LetterKeyNode = require( 'SCENERY_PHET/keyboard/LetterKeyNode' );
  var SpaceKeyNode = require( 'SCENERY_PHET/keyboard/SpaceKeyNode' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var grabOrReleaseBalloonHeadingString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/grabOrReleaseBalloonHeading' );
  var grabOrReleaseBalloonLabelString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/grabOrReleaseBalloonLabel' );
  var jumpCloseToSweaterLabelString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/jumpCloseToSweaterLabel' );
  var jumpCloseToWallLabelString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/jumpCloseToWallLabel' );
  var jumpNearWallLabelString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/jumpNearWallLabel' );
  var jumpToCenterLabelString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/jumpToCenterLabel' );
  var moveGrabbedBalloonLabelString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/moveGrabbedBalloonLabel' );
  var moveOrJumpGrabbedBalloonHeadingString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/moveOrJumpGrabbedBalloonHeading' );
  var moveSlowerLabelString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/moveSlowerLabel' );

  // a11y strings
  var grabOrReleaseBalloonDescriptionString = BASEA11yStrings.grabOrReleaseBalloonDescription.value;
  var moveGrabbedBalloonDescriptionString = BASEA11yStrings.moveGrabbedBalloonDescription.value;
  var moveSlowerDescriptionString = BASEA11yStrings.moveSlowerDescription.value;
  var jumpsCloseToSweaterDescriptionString = BASEA11yStrings.jumpsCloseToSweaterDescription.value;
  var jumpsCloseToWwallDescriptionString = BASEA11yStrings.jumpsCloseToWwallDescription.value;
  var jumpsNearWallDescriptionString = BASEA11yStrings.jumpsNearWallDescription.value;
  var jumpstoCenterDescriptionString = BASEA11yStrings.jumpstoCenterDescription.value;

  // constants
  // the english strings are shorter for the balloon help content, so we restrict that content width for i18n more
  // so that the whole content will fit in dev bounds 
  var BALLOON_CONTENT_MAX_WIDTH = 130;
  var GENERAL_CONTENT_MAX_WIDTH = 160;

  /**
   * Constructor.
   * @constructor
   */
  function BASEKeyboardHelpContent() {

    //  the groups of help content
    var balloonGrabHelpContent = new BalloonGrabHelpContent( {
      labelMaxWidth: BALLOON_CONTENT_MAX_WIDTH
    } );
    var generalNavigationHelpContent = new GeneralNavigationHelpContent( {
      withGroupContent: true,
      labelMaxWidth: GENERAL_CONTENT_MAX_WIDTH
    } );
    var moveBalloonHelpContent = new MoveBalloonHelpContent( {
      labelMaxWidth: BALLOON_CONTENT_MAX_WIDTH
    } );

    // vertically align the left content groups
    HelpContent.alignHelpContentIcons( [ balloonGrabHelpContent, moveBalloonHelpContent ] );

    // content about how to grab the balloon and general navigation are aligned to the left of the dialog
    var leftContent = new VBox( {
      children: [ balloonGrabHelpContent, moveBalloonHelpContent ],
      align: 'left',
      spacing: 30
    } );

    // left aligned content, and content about how to move the grabbed balloon are horizontally aligned
    HBox.call( this, {
      children: [ leftContent, generalNavigationHelpContent ],
      align: 'top',
      spacing: 20
    } );

    // the reading order for screen readers
    this.accessibleOrder = [ balloonGrabHelpContent, moveBalloonHelpContent, generalNavigationHelpContent ];
  }

  balloonsAndStaticElectricity.register( 'BASEKeyboardHelpContent', BASEKeyboardHelpContent );

  inherit( HBox, BASEKeyboardHelpContent );

  /**
   * Help content for how to grab and release the balloon.
   * @constructor
   */
  function BalloonGrabHelpContent( options ) {
    var spaceKeyNode = new SpaceKeyNode();
    var enterKeyNode = new EnterKeyNode();
    var icons = HelpContent.iconOrIcon( spaceKeyNode, enterKeyNode );
    var labelWithContent = HelpContent.labelWithIcon( grabOrReleaseBalloonLabelString, icons, grabOrReleaseBalloonDescriptionString, {
      iconOptions: {
        tagName: 'p' // it is the only item so it is a p rather than an li
      }
    } );

    HelpContent.call( this, grabOrReleaseBalloonHeadingString, [ labelWithContent ], _.extend( {
      a11yContentTagName: null // just a paragraph for this content, no list
    }, options ) );
  }

  inherit( HelpContent, BalloonGrabHelpContent );

  /**
   * Help content for how to move the balloon or use hot keys to make the balloon jump to locations.
   * @constructor
   */
  function MoveBalloonHelpContent( options ) {

    var arrowOrWasdKeysIcon = HelpContent.arrowOrWasdKeysRowIcon();
    var labelWithContent = HelpContent.labelWithIcon( moveGrabbedBalloonLabelString, arrowOrWasdKeysIcon, moveGrabbedBalloonDescriptionString );

    var arrowKeysIcon = HelpContent.arrowKeysRowIcon();
    var shiftAndArrowKeysIcon = HelpContent.shiftPlusIcon( arrowKeysIcon );
    var wasdRowIcon = HelpContent.wasdRowIcon();
    var shiftAndWasdRowIcon = HelpContent.shiftPlusIcon( wasdRowIcon );
    var labelWithIconList = HelpContent.labelWithIconList( moveSlowerLabelString, [ shiftAndArrowKeysIcon, shiftAndWasdRowIcon ], moveSlowerDescriptionString );

    // hot key content for how to jump the balloon
    var jumpToSweaterRow = createJumpKeyRow( 'S', jumpCloseToSweaterLabelString, jumpsCloseToSweaterDescriptionString );
    var jumpToWallRow = createJumpKeyRow( 'W', jumpCloseToWallLabelString, jumpsCloseToWwallDescriptionString );
    var jumpNearWallRow = createJumpKeyRow( 'N', jumpNearWallLabelString, jumpsNearWallDescriptionString );
    var jumpToCenterRow = createJumpKeyRow( 'C', jumpToCenterLabelString, jumpstoCenterDescriptionString );

    // all content contained in a left aligned vbox
    var content = [ labelWithContent, labelWithIconList, jumpToSweaterRow, jumpToWallRow, jumpNearWallRow, jumpToCenterRow ];

    HelpContent.call( this, moveOrJumpGrabbedBalloonHeadingString, content, options );
  }

  inherit( HelpContent, MoveBalloonHelpContent );

  /**
   * Create an entry for the dialog that looks horizontally aligns a letter key with a 'J' key separated by a plus
   * sign, with a descriptive label. Something like
   :   * "J + S jumps close to sweater"
   *
   * @param {string} keyString - the letter name that will come after 'j'
   * @param {string} labelString
   * @param {string} innerContent
   * @returns {HBox}
   */
  function createJumpKeyRow( keyString, labelString, innerContent ) {

    var jKey = new LetterKeyNode( 'J' );
    var otherKey = new LetterKeyNode( keyString );

    var jPlusOtherKey = HelpContent.iconPlusIcon( jKey, otherKey );
    return HelpContent.labelWithIcon( labelString, jPlusOtherKey, innerContent );
  }

  return BASEKeyboardHelpContent;
} );