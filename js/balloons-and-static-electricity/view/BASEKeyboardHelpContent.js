// Copyright 2015-2018, University of Colorado Boulder

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
  var Text = require( 'SCENERY/nodes/Text' );
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

  /**
   * Constructor.
   * @constructor
   */
  function BASEKeyboardHelpContent() {

    //  the groups of help content
    var balloonGrabHelpContent = new BalloonGrabHelpContent();
    var generalNavigationHelpContent = new GeneralNavigationHelpContent( { withGroupContent: true } );
    var moveBalloonHelpContent = new MoveBalloonHelpContent();

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
      spacing: 30,
      maxWidth: 625 // i18n, about the width of the screen
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
  function BalloonGrabHelpContent() {

    var label = new Text( grabOrReleaseBalloonLabelString, {
      font: HelpContent.DEFAULT_LABEL_FONT,
      maxWidth: 225
    } );

    var spaceKeyNode = new SpaceKeyNode();
    var enterKeyNode = new EnterKeyNode();
    var icons = HelpContent.iconOrIcon( spaceKeyNode, enterKeyNode );
    var labelWithContent = HelpContent.labelWithIcon( label, icons, grabOrReleaseBalloonDescriptionString, {
      iconOptions: {
        tagName: 'p' // it is the only item so it is a p rather than an li
      }
    } );

    HelpContent.call( this, grabOrReleaseBalloonHeadingString, [ labelWithContent ], {
      a11yContentTagName: null // just a paragraph for this content, no list
    } );
  }

  inherit( HelpContent, BalloonGrabHelpContent );

  /**
   * Help content for how to move the balloon or use hot keys to make the balloon jump to locations.
   * @constructor
   */
  function MoveBalloonHelpContent() {

    // label for the first row
    var moveGrabbedBalloonLabel = new Text( moveGrabbedBalloonLabelString, {
      font: HelpContent.DEFAULT_LABEL_FONT,
      maxWidth: 225
    } );

    // label for second row
    var moveSlowerLabel = new Text( moveSlowerLabelString, {
      font: HelpContent.DEFAULT_LABEL_FONT,
      maxWidth: 225
    } );

    var arrowOrWasdKeysIcon = HelpContent.arrowOrWasdKeysRowIcon();
    var labelWithContent = HelpContent.labelWithIcon( moveGrabbedBalloonLabel, arrowOrWasdKeysIcon, moveGrabbedBalloonDescriptionString );

    var arrowKeysIcon = HelpContent.arrowKeysRowIcon();
    var shiftAndArrowKeysIcon = HelpContent.shiftPlusIcon( arrowKeysIcon );
    var wasdRowIcon = HelpContent.wasdRowIcon();
    var shiftAndWasdRowIcon = HelpContent.shiftPlusIcon( wasdRowIcon );
    var labelWithIconList = HelpContent.labelWithIconList( moveSlowerLabel, [ shiftAndArrowKeysIcon, shiftAndWasdRowIcon ], moveSlowerDescriptionString );

    // hot key content for how to jump the balloon
    var jumpToSweaterRow = createJumpKeyRow( 'S', jumpCloseToSweaterLabelString, jumpsCloseToSweaterDescriptionString );
    var jumpToWallRow = createJumpKeyRow( 'W', jumpCloseToWallLabelString, jumpsCloseToWwallDescriptionString );
    var jumpNearWallRow = createJumpKeyRow( 'N', jumpNearWallLabelString, jumpsNearWallDescriptionString );
    var jumpToCenterRow = createJumpKeyRow( 'C', jumpToCenterLabelString, jumpstoCenterDescriptionString );

    // all content contained in a left aligned vbox
    var content = [ labelWithContent, labelWithIconList, jumpToSweaterRow, jumpToWallRow, jumpNearWallRow, jumpToCenterRow ];

    HelpContent.call( this, moveOrJumpGrabbedBalloonHeadingString, content );
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
   * @return {HBox}
   */
  function createJumpKeyRow( keyString, labelString, innerContent ) {

    var label = new Text( labelString, {
      font: HelpContent.DEFAULT_LABEL_FONT,
      maxWidth: 150
    } );

    var jKey = new LetterKeyNode( 'J' );
    var otherKey = new LetterKeyNode( keyString );

    var jPlusOtherKey = HelpContent.iconPlusIcon( jKey, otherKey );
    return HelpContent.labelWithIcon( label, jPlusOtherKey, innerContent );
  }

  return BASEKeyboardHelpContent;
} );