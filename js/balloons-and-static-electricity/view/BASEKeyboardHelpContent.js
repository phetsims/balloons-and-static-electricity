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
  var GeneralKeyboardHelpSection = require( 'SCENERY_PHET/keyboard/help/GeneralKeyboardHelpSection' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var KeyboardHelpSection = require( 'SCENERY_PHET/keyboard/help/KeyboardHelpSection' );
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

    //  the sections of help content
    var balloonGrabHelpSection = new BalloonGrabHelpSection( {
      labelMaxWidth: BALLOON_CONTENT_MAX_WIDTH
    } );
    var generalNavigationHelpSection = new GeneralKeyboardHelpSection( {
      withGroupContent: true,
      labelMaxWidth: GENERAL_CONTENT_MAX_WIDTH
    } );
    var moveBalloonHelpSection = new MoveBalloonHelpSection( {
      labelMaxWidth: BALLOON_CONTENT_MAX_WIDTH
    } );

    // vertically align the left sections
    KeyboardHelpSection.alignHelpSectionIcons( [ balloonGrabHelpSection, moveBalloonHelpSection ] );

    // sections for how to grab the balloon and general navigation are aligned to the left of the dialog
    var leftContent = new VBox( {
      children: [ balloonGrabHelpSection, moveBalloonHelpSection ],
      align: 'left',
      spacing: 30
    } );

    // left aligned sections, and section about how to move the grabbed balloon are horizontally aligned
    HBox.call( this, {
      children: [ leftContent, generalNavigationHelpSection ],
      align: 'top',
      spacing: 20
    } );

    // the reading order for screen readers
    this.accessibleOrder = [ balloonGrabHelpSection, moveBalloonHelpSection, generalNavigationHelpSection ];
  }

  balloonsAndStaticElectricity.register( 'BASEKeyboardHelpContent', BASEKeyboardHelpContent );

  inherit( HBox, BASEKeyboardHelpContent );

  /**
   * Help section for how to grab and release the balloon.
   * @constructor
   */
  function BalloonGrabHelpSection( options ) {
    var spaceKeyNode = new SpaceKeyNode();
    var enterKeyNode = new EnterKeyNode();
    var icons = KeyboardHelpSection.iconOrIcon( spaceKeyNode, enterKeyNode );
    var labelWithContent = KeyboardHelpSection.labelWithIcon( grabOrReleaseBalloonLabelString, icons, grabOrReleaseBalloonDescriptionString, {
      iconOptions: {
        tagName: 'p' // it is the only item so it is a p rather than an li
      }
    } );

    KeyboardHelpSection.call( this, grabOrReleaseBalloonHeadingString, [ labelWithContent ], _.extend( {
      a11yContentTagName: null // just a paragraph for this section, no list
    }, options ) );
  }

  inherit( KeyboardHelpSection, BalloonGrabHelpSection );

  /**
   * Help section for how to move the balloon or use hot keys to make the balloon jump to locations.
   * @constructor
   */
  function MoveBalloonHelpSection( options ) {

    var arrowOrWasdKeysIcon = KeyboardHelpSection.arrowOrWasdKeysRowIcon();
    var labelWithContent = KeyboardHelpSection.labelWithIcon( moveGrabbedBalloonLabelString, arrowOrWasdKeysIcon, moveGrabbedBalloonDescriptionString );

    var arrowKeysIcon = KeyboardHelpSection.arrowKeysRowIcon();
    var shiftAndArrowKeysIcon = KeyboardHelpSection.shiftPlusIcon( arrowKeysIcon );
    var wasdRowIcon = KeyboardHelpSection.wasdRowIcon();
    var shiftAndWasdRowIcon = KeyboardHelpSection.shiftPlusIcon( wasdRowIcon );
    var labelWithIconList = KeyboardHelpSection.labelWithIconList( moveSlowerLabelString, [ shiftAndArrowKeysIcon, shiftAndWasdRowIcon ], moveSlowerDescriptionString );

    // hot key rows for how to jump the balloon
    var jumpToSweaterRow = createJumpKeyRow( 'S', jumpCloseToSweaterLabelString, jumpsCloseToSweaterDescriptionString );
    var jumpToWallRow = createJumpKeyRow( 'W', jumpCloseToWallLabelString, jumpsCloseToWwallDescriptionString );
    var jumpNearWallRow = createJumpKeyRow( 'N', jumpNearWallLabelString, jumpsNearWallDescriptionString );
    var jumpToCenterRow = createJumpKeyRow( 'C', jumpToCenterLabelString, jumpstoCenterDescriptionString );

    // all rows contained in a left aligned vbox
    var rows = [ labelWithContent, labelWithIconList, jumpToSweaterRow, jumpToWallRow, jumpNearWallRow, jumpToCenterRow ];

    KeyboardHelpSection.call( this, moveOrJumpGrabbedBalloonHeadingString, rows, options );
  }

  inherit( KeyboardHelpSection, MoveBalloonHelpSection );

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

    var jPlusOtherKey = KeyboardHelpSection.iconPlusIcon( jKey, otherKey );
    return KeyboardHelpSection.labelWithIcon( labelString, jPlusOtherKey, innerContent );
  }

  return BASEKeyboardHelpContent;
} );