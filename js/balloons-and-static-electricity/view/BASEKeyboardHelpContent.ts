// Copyright 2015-2026, University of Colorado Boulder

/**
 * Content for the "Keyboard Shortcuts" dialog that can be brought up from the sim navigation bar.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import BasicActionsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/BasicActionsKeyboardHelpSection.js';
import KeyboardHelpSection, { KeyboardHelpSectionOptions } from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSection.js';
import KeyboardHelpSectionRow from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSectionRow.js';
import TwoColumnKeyboardHelpContent from '../../../../scenery-phet/js/keyboard/help/TwoColumnKeyboardHelpContent.js';
import SceneryPhetFluent from '../../../../scenery-phet/js/SceneryPhetFluent.js';
import HotkeyData from '../../../../scenery/js/input/HotkeyData.js';
import KeyboardDragListener from '../../../../scenery/js/listeners/KeyboardDragListener.js';
import balloonsAndStaticElectricity from '../../balloonsAndStaticElectricity.js';
import BalloonsAndStaticElectricityStrings from '../../BalloonsAndStaticElectricityStrings.js';
import BalloonNode from './BalloonNode.js';

const grabOrReleaseBalloonHeadingString = BalloonsAndStaticElectricityStrings.grabOrReleaseBalloonHeading;
const moveGrabbedBalloonLabelStringProperty = BalloonsAndStaticElectricityStrings.moveGrabbedBalloonLabelStringProperty;
const moveOrJumpGrabbedBalloonHeadingString = BalloonsAndStaticElectricityStrings.moveOrJumpGrabbedBalloonHeading;

// constants
// the english strings are shorter for the balloon help content, so we restrict that content width for i18n more
// so that the whole content will fit in dev bounds
const BALLOON_CONTENT_MAX_WIDTH = 174;
const GENERAL_CONTENT_MAX_WIDTH = 214;

export default class BASEKeyboardHelpContent extends TwoColumnKeyboardHelpContent {

  public constructor() {

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
 *
 * Note that this could use GrabReleaseKeyboardHelpSection, but I did not want to lose
 * the existing translations for this content.
 */
class BalloonGrabHelpSection extends KeyboardHelpSection {
  public constructor( options?: KeyboardHelpSectionOptions ) {
    const labelWithContent = KeyboardHelpSectionRow.fromHotkeyData( new HotkeyData( {
      keys: [ 'space', 'enter' ],
      repoName: balloonsAndStaticElectricity.name,
      keyboardHelpDialogLabelStringProperty: BalloonsAndStaticElectricityStrings.grabOrReleaseBalloonLabelStringProperty
    } ) );

    super( grabOrReleaseBalloonHeadingString, [ labelWithContent ] );
  }
}

/**
 * Help section for how to move the balloon or use hotkeys to make the balloon jump to positions.
 */
class MoveBalloonHelpSection extends KeyboardHelpSection {

  public constructor( options?: KeyboardHelpSectionOptions ) {
    const labelWithContent = KeyboardHelpSectionRow.fromHotkeyData( KeyboardDragListener.MOVE_HOTKEY_DATA, {
      labelStringProperty: moveGrabbedBalloonLabelStringProperty
    } );

    const labelWithIconList = KeyboardHelpSectionRow.fromHotkeyData( KeyboardDragListener.MOVE_SLOWER_HOTKEY_DATA, {
      labelStringProperty: SceneryPhetFluent.keyboardHelpDialog.moveSlowerStringProperty
    } );

    // hotkey rows for how to jump the balloon
    const jumpToSweaterRow = KeyboardHelpSectionRow.fromHotkeyData( BalloonNode.JUMP_NEAR_SWEATER_HOTKEY_DATA );
    const jumpToWallRow = KeyboardHelpSectionRow.fromHotkeyData( BalloonNode.JUMP_WALL_HOTKEY_DATA );
    const jumpNearWallRow = KeyboardHelpSectionRow.fromHotkeyData( BalloonNode.JUMP_NEAR_WALL_HOTKEY_DATA );
    const jumpToCenterRow = KeyboardHelpSectionRow.fromHotkeyData( BalloonNode.JUMP_CENTER_HOTKEY_DATA );

    // all rows contained in a left aligned vbox
    const rows = [ labelWithContent, labelWithIconList, jumpToSweaterRow, jumpToWallRow, jumpNearWallRow, jumpToCenterRow ];

    super( moveOrJumpGrabbedBalloonHeadingString, rows, options );
  }
}