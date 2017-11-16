// Copyright 2017, University of Colorado Boulder

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
  var grabOrReleaseBalloonHeadingString = BASEA11yStrings.grabOrReleaseBalloonHeadingString;
  var grabOrReleaseBalloonLabelString = BASEA11yStrings.grabOrReleaseBalloonLabelString;
  var moveOrJumpGrabbedBalloonHeadingString = BASEA11yStrings.moveOrJumpGrabbedBalloonHeadingString;
  var moveGrabbedBalloonLabelString = BASEA11yStrings.moveGrabbedBalloonLabelString;
  var moveSlowerLabelString = BASEA11yStrings.moveSlowerLabelString;
  var jumpsCloseToSweaterString = BASEA11yStrings.jumpsCloseToSweaterString;
  var jumpsCloseToWallString = BASEA11yStrings.jumpsCloseToWallString;
  var jumpsNearWallString = BASEA11yStrings.jumpsNearWallString;
  var jumpsToCenterString = BASEA11yStrings.jumpsToCenterString;
  var grabOrReleaseBalloonDescriptionString = BASEA11yStrings.grabOrReleaseBalloonDescriptionString;
  var moveGrabbedBalloonDescriptionString = BASEA11yStrings.moveGrabbedBalloonDescriptionString;
  var moveSlowerDescriptionString = BASEA11yStrings.moveSlowerDescriptionString;
  var jumpsCloseToSweaterDescriptionString = BASEA11yStrings.jumpsCloseToSweaterDescriptionString;
  var jumpsCloseToWwallDescriptionString = BASEA11yStrings.jumpsCloseToWwallDescriptionString;
  var jumpsNearWallDescriptionString = BASEA11yStrings.jumpsNearWallDescriptionString;
  var jumpstoCenterDescriptionString = BASEA11yStrings.jumpstoCenterDescriptionString;
  
  /**
   * Constructor.
   *
   * @param {Tandem} tandem
   * @constructor
   */
  function BASEKeyboardHelpContent( tandem ) {

    //  the groups of help content
    var balloonGrabHelpContent = new BalloonGrabHelpContent();
    var generalNavigationHelpContent = new GeneralNavigationHelpContent( { withGroupContent: true } );
    var moveBalloonHelpContent = new MoveBalloonHelpContent();

    // content about how to grab the balloon and general navigation are aligned to the left of the dialog
    var leftContent = new VBox( {
      children: [ balloonGrabHelpContent, generalNavigationHelpContent ],
      align: 'left',
      spacing: 60
    } );

    // left aligned content, and content about how to move the grabbed balloon are horizontally aligned
    var content = new HBox( {
      children: [ leftContent, moveBalloonHelpContent ],
      align: 'top',
      spacing: 30
    } );

    Panel.call( this, content, {
      stroke: null,
      fill: 'rgb( 214, 237, 249 )',
      tandem: tandem
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
    var labelWithContent = HelpContent.labelWithIcon( label, icons, { accessibleLabel: grabOrReleaseBalloonDescriptionString } );

    HelpContent.call( this, grabOrReleaseBalloonHeadingString, labelWithContent );
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

      // a11y
      accessibleLabel: moveGrabbedBalloonDescriptionString
    } );

    var arrowKeysIcon = HelpContent.arrowKeysRowIcon();
    var shiftAndArrowKeysIcon = HelpContent.shiftPlusIcon( arrowKeysIcon );
    var wasdRowIcon = HelpContent.wasdRowIcon();
    var shiftAndWasdRowIcon = HelpContent.shiftPlusIcon( wasdRowIcon );
    var labelWithIconList = HelpContent.labelWithIconList( moveSlowerLabel, [ shiftAndArrowKeysIcon, shiftAndWasdRowIcon ], {
      accessibleLabel: moveSlowerDescriptionString
    } );

    // hot key content for how to jump the balloon
    var jumpToSweaterRow = createJumpKeyRow( 'S', jumpsCloseToSweaterString, { accessibleLabel: jumpsCloseToSweaterDescriptionString } );
    var jumpToWallRow = createJumpKeyRow( 'W', jumpsCloseToWallString, { accessibleLabel: jumpsCloseToWwallDescriptionString } );
    var jumpNearWallRow = createJumpKeyRow( 'N', jumpsNearWallString, { accessibleLabel: jumpsNearWallDescriptionString} );
    var jumpToCenterRow = createJumpKeyRow( 'C', jumpsToCenterString, { accessibleLabel: jumpstoCenterDescriptionString } );

    // all content contained in a left aligned vbox
    var content = new VBox( {
      children: [ labelWithContent, labelWithIconList, jumpToSweaterRow, jumpToWallRow, jumpNearWallRow, jumpToCenterRow ],
      align: 'left',
      spacing: HelpContent.DEFAULT_VERTICAL_ICON_SPACING
    } );

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
   * @return {HBox}
   */
  function createJumpKeyRow( keyString, labelString, options ) {

    options = _.extend( {

      // so the icon comes first visually
      labelFirst: false
    }, options );

    var label = new Text( labelString, {
      font: HelpContent.DEFAULT_LABEL_FONT,
      maxWidth: 150
    } );

    var jKey = new TextKeyNode( 'J' );
    var otherKey = new TextKeyNode( keyString );

    var jPlusOtherKey = HelpContent.iconPlusIcon( jKey, otherKey );
    return HelpContent.labelWithIcon( label, jPlusOtherKey, options );
  }

  return BASEKeyboardHelpContent;
} );