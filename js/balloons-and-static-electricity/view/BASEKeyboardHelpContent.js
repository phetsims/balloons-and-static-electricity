// Copyright 2015-2017, University of Colorado Boulder

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
  var Panel = require( 'SUN/Panel' );
  var SpaceKeyNode = require( 'SCENERY_PHET/keyboard/SpaceKeyNode' );
  var Text = require( 'SCENERY/nodes/Text' );
  var TextKeyNode = require( 'SCENERY_PHET/keyboard/TextKeyNode' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var grabOrReleaseBalloonHeadingString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/grabOrReleaseBalloonHeading' );
  var grabOrReleaseBalloonLabelString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/grabOrReleaseBalloonLabel' );
  var moveOrJumpGrabbedBalloonHeadingString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/moveOrJumpGrabbedBalloonHeading' );
  var moveGrabbedBalloonLabelString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/moveGrabbedBalloonLabel' );
  var moveSlowerLabelString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/moveSlowerLabel' );
  var jumpsCloseToSweaterString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/jumpsCloseToSweater' );
  var jumpsCloseToWallString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/jumpsCloseToWall' );
  var jumpsNearWallString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/jumpsNearWall' );
  var jumpsToCenterString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/jumpsToCenter' );

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
    var content = new HBox( {
      children: [ leftContent, generalNavigationHelpContent ],
      align: 'top',
      spacing: 30
    } );

    Panel.call( this, content, {
      stroke: null,
      fill: 'rgb( 214, 237, 249 )',
      maxWidth: 700 // i18n, about the width of the screen
    } );

    // the reading order for screen readers
    this.accessibleOrder = [ balloonGrabHelpContent, moveBalloonHelpContent, generalNavigationHelpContent ];
  }

  balloonsAndStaticElectricity.register( 'BASEKeyboardHelpContent', BASEKeyboardHelpContent );

  inherit( Panel, BASEKeyboardHelpContent );

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
    var labelWithContent = HelpContent.labelWithIcon( label, icons, {
      iconOptions: {
        innerContent: grabOrReleaseBalloonDescriptionString
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
    var labelWithContent = HelpContent.labelWithIcon( moveGrabbedBalloonLabel, arrowOrWasdKeysIcon, {
      iconOptions: {
        innerContent: moveGrabbedBalloonDescriptionString
      }
    } );

    var arrowKeysIcon = HelpContent.arrowKeysRowIcon();
    var shiftAndArrowKeysIcon = HelpContent.shiftPlusIcon( arrowKeysIcon );
    var wasdRowIcon = HelpContent.wasdRowIcon();
    var shiftAndWasdRowIcon = HelpContent.shiftPlusIcon( wasdRowIcon );
    var labelWithIconList = HelpContent.labelWithIconList( moveSlowerLabel, [ shiftAndArrowKeysIcon, shiftAndWasdRowIcon ], {
      iconsVBoxOptions: {
        innerContent: moveSlowerDescriptionString
      }
    } );

    // hot key content for how to jump the balloon
    var jumpToSweaterRow = createJumpKeyRow( 'S', jumpsCloseToSweaterString, { innerContent: jumpsCloseToSweaterDescriptionString } );
    var jumpToWallRow = createJumpKeyRow( 'W', jumpsCloseToWallString, { innerContent: jumpsCloseToWwallDescriptionString } );
    var jumpNearWallRow = createJumpKeyRow( 'N', jumpsNearWallString, { innerContent: jumpsNearWallDescriptionString } );
    var jumpToCenterRow = createJumpKeyRow( 'C', jumpsToCenterString, { innerContent: jumpstoCenterDescriptionString } );

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
   * @param {Object} options - options passed to HelpContent
   * @return {HBox}
   */
  function createJumpKeyRow( keyString, labelString, options ) {

    options = _.extend( {
      innerContent: null
    }, options );

    var label = new Text( labelString, {
      font: HelpContent.DEFAULT_LABEL_FONT,
      maxWidth: 150
    } );

    var jKey = new TextKeyNode( 'J' );
    var otherKey = new TextKeyNode( keyString );

    var jPlusOtherKey = HelpContent.iconPlusIcon( jKey, otherKey );
    return HelpContent.labelWithIcon( label, jPlusOtherKey, {
      iconOptions: options
    } );
  }

  return BASEKeyboardHelpContent;
} );