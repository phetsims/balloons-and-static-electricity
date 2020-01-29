// Copyright 2015-2019, University of Colorado Boulder

/**
 * Content for the "Keyboard Shortcuts" dialog that can be brought up from the sim navigation bar.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );
  const BASEA11yStrings = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/BASEA11yStrings' );
  const EnterKeyNode = require( 'SCENERY_PHET/keyboard/EnterKeyNode' );
  const GeneralKeyboardHelpSection = require( 'SCENERY_PHET/keyboard/help/GeneralKeyboardHelpSection' );
  const KeyboardHelpIconFactory = require( 'SCENERY_PHET/keyboard/help/KeyboardHelpIconFactory' );
  const KeyboardHelpSection = require( 'SCENERY_PHET/keyboard/help/KeyboardHelpSection' );
  const merge = require( 'PHET_CORE/merge' );
  const SpaceKeyNode = require( 'SCENERY_PHET/keyboard/SpaceKeyNode' );
  const TwoColumnKeyboardHelpContent = require( 'SCENERY_PHET/keyboard/help/TwoColumnKeyboardHelpContent' );

  // strings
  const grabOrReleaseBalloonHeadingString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/grabOrReleaseBalloonHeading' );
  const grabOrReleaseBalloonLabelString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/grabOrReleaseBalloonLabel' );
  const jumpCloseToSweaterLabelString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/jumpCloseToSweaterLabel' );
  const jumpCloseToWallLabelString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/jumpCloseToWallLabel' );
  const jumpNearWallLabelString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/jumpNearWallLabel' );
  const jumpToCenterLabelString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/jumpToCenterLabel' );
  const moveGrabbedBalloonLabelString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/moveGrabbedBalloonLabel' );
  const moveOrJumpGrabbedBalloonHeadingString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/moveOrJumpGrabbedBalloonHeading' );
  const moveSlowerLabelString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/moveSlowerLabel' );

  // a11y strings
  const grabOrReleaseBalloonDescriptionString = BASEA11yStrings.grabOrReleaseBalloonDescription.value;
  const moveGrabbedBalloonDescriptionString = BASEA11yStrings.moveGrabbedBalloonDescription.value;
  const moveSlowerDescriptionString = BASEA11yStrings.moveSlowerDescription.value;
  const jumpsCloseToSweaterDescriptionString = BASEA11yStrings.jumpsCloseToSweaterDescription.value;
  const jumpsCloseToWwallDescriptionString = BASEA11yStrings.jumpsCloseToWwallDescription.value;
  const jumpsNearWallDescriptionString = BASEA11yStrings.jumpsNearWallDescription.value;
  const jumpstoCenterDescriptionString = BASEA11yStrings.jumpstoCenterDescription.value;

  // constants
  // the english strings are shorter for the balloon help content, so we restrict that content width for i18n more
  // so that the whole content will fit in dev bounds 
  const BALLOON_CONTENT_MAX_WIDTH = 130;
  const GENERAL_CONTENT_MAX_WIDTH = 160;

  /**
   * Constructor.
   * @constructor
   */
  class BASEKeyboardHelpContent extends TwoColumnKeyboardHelpContent {
    constructor() {

      //  the sections of help content
      const balloonGrabHelpSection = new BalloonGrabHelpSection( {
        labelMaxWidth: BALLOON_CONTENT_MAX_WIDTH
      } );
      const generalNavigationHelpSection = new GeneralKeyboardHelpSection( {
        withGroupContent: true,
        labelMaxWidth: GENERAL_CONTENT_MAX_WIDTH
      } );
      const moveBalloonHelpSection = new MoveBalloonHelpSection( {
        labelMaxWidth: BALLOON_CONTENT_MAX_WIDTH
      } );

      // vertically align the left sections
      KeyboardHelpSection.alignHelpSectionIcons( [ balloonGrabHelpSection, moveBalloonHelpSection ] );

      // left aligned sections, and section about how to move the grabbed balloon are horizontally aligned
      super( [ balloonGrabHelpSection, moveBalloonHelpSection ], [ generalNavigationHelpSection ], {
        columnSpacing: 20
      } );

      // the reading order for screen readers
      this.accessibleOrder = [ balloonGrabHelpSection, moveBalloonHelpSection, generalNavigationHelpSection ];
    }
  }

  balloonsAndStaticElectricity.register( 'BASEKeyboardHelpContent', BASEKeyboardHelpContent );

  /**
   * Inner class. Help section for how to grab and release the balloon.
   */
  class BalloonGrabHelpSection extends KeyboardHelpSection {

    /**
     * @param {Object} options
     */
    constructor( options ) {
      const spaceKeyNode = new SpaceKeyNode();
      const enterKeyNode = new EnterKeyNode();
      const icons = KeyboardHelpIconFactory.iconOrIcon( spaceKeyNode, enterKeyNode );
      const labelWithContent = KeyboardHelpSection.labelWithIcon( grabOrReleaseBalloonLabelString, icons, grabOrReleaseBalloonDescriptionString, {
        iconOptions: {
          tagName: 'p' // it is the only item so it is a p rather than an li
        }
      } );

      super( grabOrReleaseBalloonHeadingString, [ labelWithContent ], merge( {
        a11yContentTagName: null // just a paragraph for this section, no list
      }, options ) );
    }
  }

  /**
   * Help section for how to move the balloon or use hot keys to make the balloon jump to positions.
   */
  class MoveBalloonHelpSection extends KeyboardHelpSection  {

    /**
     * @param {Object} options
     */
    constructor( options ) {

      const arrowOrWasdKeysIcon = KeyboardHelpSection.arrowOrWasdKeysRowIcon();
      const labelWithContent = KeyboardHelpSection.labelWithIcon( moveGrabbedBalloonLabelString, arrowOrWasdKeysIcon, moveGrabbedBalloonDescriptionString );

      const arrowKeysIcon = KeyboardHelpIconFactory.arrowKeysRowIcon();
      const shiftAndArrowKeysIcon = KeyboardHelpSection.shiftPlusIcon( arrowKeysIcon );
      const wasdRowIcon = KeyboardHelpSection.wasdRowIcon();
      const shiftAndWasdRowIcon = KeyboardHelpSection.shiftPlusIcon( wasdRowIcon );
      const labelWithIconList = KeyboardHelpSection.labelWithIconList( moveSlowerLabelString, [ shiftAndArrowKeysIcon, shiftAndWasdRowIcon ], moveSlowerDescriptionString );

      // hot key rows for how to jump the balloon
      const jumpToSweaterRow = KeyboardHelpSection.createJumpKeyRow( 'S', jumpCloseToSweaterLabelString, jumpsCloseToSweaterDescriptionString );
      const jumpToWallRow = KeyboardHelpSection.createJumpKeyRow( 'W', jumpCloseToWallLabelString, jumpsCloseToWwallDescriptionString );
      const jumpNearWallRow = KeyboardHelpSection.createJumpKeyRow( 'N', jumpNearWallLabelString, jumpsNearWallDescriptionString );
      const jumpToCenterRow = KeyboardHelpSection.createJumpKeyRow( 'C', jumpToCenterLabelString, jumpstoCenterDescriptionString );

      // all rows contained in a left aligned vbox
      const rows = [ labelWithContent, labelWithIconList, jumpToSweaterRow, jumpToWallRow, jumpNearWallRow, jumpToCenterRow ];

      super( moveOrJumpGrabbedBalloonHeadingString, rows, options );
    }
  }

  return BASEKeyboardHelpContent;
} );