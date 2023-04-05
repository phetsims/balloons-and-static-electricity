// Copyright 2015-2023, University of Colorado Boulder

/**
 * Content for the "Keyboard Shortcuts" dialog that can be brought up from the sim navigation bar.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import BasicActionsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/BasicActionsKeyboardHelpSection.js';
import KeyboardHelpIconFactory from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpIconFactory.js';
import KeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSection.js';
import KeyboardHelpSectionRow from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSectionRow.js';
import TwoColumnKeyboardHelpContent from '../../../../scenery-phet/js/keyboard/help/TwoColumnKeyboardHelpContent.js';
import TextKeyNode from '../../../../scenery-phet/js/keyboard/TextKeyNode.js';
import balloonsAndStaticElectricity from '../../balloonsAndStaticElectricity.js';
import BalloonsAndStaticElectricityStrings from '../../BalloonsAndStaticElectricityStrings.js';
import BASEA11yStrings from '../BASEA11yStrings.js';

const grabOrReleaseBalloonHeadingString = BalloonsAndStaticElectricityStrings.grabOrReleaseBalloonHeading;
const grabOrReleaseBalloonLabelString = BalloonsAndStaticElectricityStrings.grabOrReleaseBalloonLabel;
const jumpCloseToSweaterLabelString = BalloonsAndStaticElectricityStrings.jumpCloseToSweaterLabel;
const jumpCloseToWallLabelString = BalloonsAndStaticElectricityStrings.jumpCloseToWallLabel;
const jumpNearWallLabelString = BalloonsAndStaticElectricityStrings.jumpNearWallLabel;
const jumpToCenterLabelString = BalloonsAndStaticElectricityStrings.jumpToCenterLabel;
const moveGrabbedBalloonLabelString = BalloonsAndStaticElectricityStrings.moveGrabbedBalloonLabel;
const moveOrJumpGrabbedBalloonHeadingString = BalloonsAndStaticElectricityStrings.moveOrJumpGrabbedBalloonHeading;
const moveSlowerLabelString = BalloonsAndStaticElectricityStrings.moveSlowerLabel;

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
      textMaxWidth: BALLOON_CONTENT_MAX_WIDTH
    } );
    const basicActionsHelpSection = new BasicActionsKeyboardHelpSection( {
      textMaxWidth: GENERAL_CONTENT_MAX_WIDTH
    } );
    const moveBalloonHelpSection = new MoveBalloonHelpSection( {
      textMaxWidth: BALLOON_CONTENT_MAX_WIDTH
    } );

    // vertically align the left sections
    KeyboardHelpSection.alignHelpSectionIcons( [ balloonGrabHelpSection, moveBalloonHelpSection ] );

    // left aligned sections, and section about how to move the grabbed balloon are horizontally aligned
    super( [ balloonGrabHelpSection, moveBalloonHelpSection ], [ basicActionsHelpSection ], {
      columnSpacing: 27
    } );

    // the reading order for screen readers
    this.pdomOrder = [ balloonGrabHelpSection, moveBalloonHelpSection, basicActionsHelpSection ];
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
    const labelWithContent = KeyboardHelpSectionRow.labelWithIcon( grabOrReleaseBalloonLabelString, icons, {
      labelInnerContent: grabOrReleaseBalloonDescriptionString,
      iconOptions: {
        tagName: 'p' // it is the only item so it is a p rather than a li
      }
    } );

    super( grabOrReleaseBalloonHeadingString, [ labelWithContent ], merge( {
      a11yContentTagName: null // just a paragraph for this section, no list
    }, options ) );

    this.disposeEmitter.addListener( () => {
      labelWithContent.dispose();
      icons.dispose();
      spaceKeyNode.dispose();
      enterKeyNode.dispose();
    } );
  }
}

/**
 * Help section for how to move the balloon or use hotkeys to make the balloon jump to positions.
 */
class MoveBalloonHelpSection extends KeyboardHelpSection {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    const arrowOrWasdKeysIcon = KeyboardHelpIconFactory.arrowOrWasdKeysRowIcon();
    const labelWithContent = KeyboardHelpSectionRow.labelWithIcon( moveGrabbedBalloonLabelString, arrowOrWasdKeysIcon, {
      labelInnerContent: moveGrabbedBalloonDescriptionString
    } );

    const arrowKeysIcon = KeyboardHelpIconFactory.arrowKeysRowIcon();
    const shiftAndArrowKeysIcon = KeyboardHelpIconFactory.shiftPlusIcon( arrowKeysIcon );
    const wasdRowIcon = KeyboardHelpIconFactory.wasdRowIcon();
    const shiftAndWasdRowIcon = KeyboardHelpIconFactory.shiftPlusIcon( wasdRowIcon );
    const labelWithIconList = KeyboardHelpSectionRow.labelWithIconList( moveSlowerLabelString, [ shiftAndArrowKeysIcon, shiftAndWasdRowIcon ], {
      labelInnerContent: moveSlowerDescriptionString
    } );

    // hotkey rows for how to jump the balloon
    const jumpToSweaterRow = KeyboardHelpSectionRow.createJumpKeyRow( 'S', jumpCloseToSweaterLabelString, {
      labelInnerContent: jumpsCloseToSweaterDescriptionString
    } );
    const jumpToWallRow = KeyboardHelpSectionRow.createJumpKeyRow( 'W', jumpCloseToWallLabelString, {
      labelInnerContent: jumpsCloseToWwallDescriptionString
    } );
    const jumpNearWallRow = KeyboardHelpSectionRow.createJumpKeyRow( 'N', jumpNearWallLabelString, {
      labelInnerContent: jumpsNearWallDescriptionString
    } );
    const jumpToCenterRow = KeyboardHelpSectionRow.createJumpKeyRow( 'C', jumpToCenterLabelString, {
      labelInnerContent: jumpstoCenterDescriptionString
    } );

    // all rows contained in a left aligned vbox
    const rows = [ labelWithContent, labelWithIconList, jumpToSweaterRow, jumpToWallRow, jumpNearWallRow, jumpToCenterRow ];

    super( moveOrJumpGrabbedBalloonHeadingString, rows, options );
    this.disposeEmitter.addListener( () => rows.forEach( row => row.dispose() ) );
  }
}

export default BASEKeyboardHelpContent;