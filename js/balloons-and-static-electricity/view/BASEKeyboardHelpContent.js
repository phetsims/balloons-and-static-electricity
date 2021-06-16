[object Promise]

/**
 * Content for the "Keyboard Shortcuts" dialog that can be brought up from the sim navigation bar.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import TextKeyNode from '../../../../scenery-phet/js/keyboard/TextKeyNode.js';
import GeneralKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/GeneralKeyboardHelpSection.js';
import KeyboardHelpIconFactory from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpIconFactory.js';
import KeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSection.js';
import TwoColumnKeyboardHelpContent from '../../../../scenery-phet/js/keyboard/help/TwoColumnKeyboardHelpContent.js';
import balloonsAndStaticElectricity from '../../balloonsAndStaticElectricity.js';
import balloonsAndStaticElectricityStrings from '../../balloonsAndStaticElectricityStrings.js';
import BASEA11yStrings from '../BASEA11yStrings.js';

const grabOrReleaseBalloonHeadingString = balloonsAndStaticElectricityStrings.grabOrReleaseBalloonHeading;
const grabOrReleaseBalloonLabelString = balloonsAndStaticElectricityStrings.grabOrReleaseBalloonLabel;
const jumpCloseToSweaterLabelString = balloonsAndStaticElectricityStrings.jumpCloseToSweaterLabel;
const jumpCloseToWallLabelString = balloonsAndStaticElectricityStrings.jumpCloseToWallLabel;
const jumpNearWallLabelString = balloonsAndStaticElectricityStrings.jumpNearWallLabel;
const jumpToCenterLabelString = balloonsAndStaticElectricityStrings.jumpToCenterLabel;
const moveGrabbedBalloonLabelString = balloonsAndStaticElectricityStrings.moveGrabbedBalloonLabel;
const moveOrJumpGrabbedBalloonHeadingString = balloonsAndStaticElectricityStrings.moveOrJumpGrabbedBalloonHeading;
const moveSlowerLabelString = balloonsAndStaticElectricityStrings.moveSlowerLabel;

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
const BALLOON_CONTENT_MAX_WIDTH = 174;
const GENERAL_CONTENT_MAX_WIDTH = 214;

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
      labelMaxWidth: GENERAL_CONTENT_MAX_WIDTH
    } );
    const moveBalloonHelpSection = new MoveBalloonHelpSection( {
      labelMaxWidth: BALLOON_CONTENT_MAX_WIDTH
    } );

    // vertically align the left sections
    KeyboardHelpSection.alignHelpSectionIcons( [ balloonGrabHelpSection, moveBalloonHelpSection ] );

    // left aligned sections, and section about how to move the grabbed balloon are horizontally aligned
    super( [ balloonGrabHelpSection, moveBalloonHelpSection ], [ generalNavigationHelpSection ], {
      columnSpacing: 27
    } );

    // the reading order for screen readers
    this.pdomOrder = [ balloonGrabHelpSection, moveBalloonHelpSection, generalNavigationHelpSection ];
  }
}

balloonsAndStaticElectricity.register( 'BASEKeyboardHelpContent', BASEKeyboardHelpContent );

/**
 * Inner class. Help section for how to grab and release the balloon.
 */
class BalloonGrabHelpSection extends KeyboardHelpSection {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {
    const spaceKeyNode = TextKeyNode.space();
    const enterKeyNode = TextKeyNode.enter();
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
class MoveBalloonHelpSection extends KeyboardHelpSection {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    const arrowOrWasdKeysIcon = KeyboardHelpIconFactory.arrowOrWasdKeysRowIcon();
    const labelWithContent = KeyboardHelpSection.labelWithIcon( moveGrabbedBalloonLabelString, arrowOrWasdKeysIcon, moveGrabbedBalloonDescriptionString );

    const arrowKeysIcon = KeyboardHelpIconFactory.arrowKeysRowIcon();
    const shiftAndArrowKeysIcon = KeyboardHelpIconFactory.shiftPlusIcon( arrowKeysIcon );
    const wasdRowIcon = KeyboardHelpIconFactory.wasdRowIcon();
    const shiftAndWasdRowIcon = KeyboardHelpIconFactory.shiftPlusIcon( wasdRowIcon );
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

export default BASEKeyboardHelpContent;