// Copyright 2017, University of Colorado Boulder

/**
 * Single location of all accessibility strings.  These strings are not meant to be translatable yet.  Rosetta needs
 * some work to provide translators with context for these strings, and we want to receive some community feedback
 * before these strings are submitted for translation.
 * 
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );

  var BASEA11yStrings = {
    balloonDescriptionPatternString: '{0} {1} {2}', // location, charge, interaction cu,
    balloonGrabbedDescriptionPatternString: '{0} {1} {2} {3}', // grabbed, location, charge, interaction cue,
    balloonDragDescriptionPatternString: '{0} {1} {2} {3} {4} {5}', // direction, proximity, charge, ,
    grabButtonNavigationCueString: 'Look for grab button to play.',
    dragNavigationCueString: 'Press W, A, S, or D key to drag balloon. Space key to let go.',

    grabbedString: 'Grabbed.',

    // location strings
    balloonLocationStringPattern: 'In {0}.',
    draggingLocationStringPattern: 'At {0}.',
    stickingToLocationPatternString: 'Sticking to {0}.',

    topLeftEdgeOfSweaterString: 'left shoulder of sweater',
    upperLeftEdgeOfSweaterString: 'left arm of sweater',
    lowerLeftEdgeOfSweaterString: 'left arm of sweater',
    bottomLeftEdgeOfSweaterString: 'lower-left arm of sweater',

    topLeftArmString: 'left shoulder',
    upperLeftArmString: 'left arm',
    lowerLeftArmString: 'left arm',
    bottomLeftArmString: 'lower-left arm',

    topLeftSideOfSweaterString: 'upper-left side of sweater',
    upperLeftSideOfSweaterString: 'left side of sweater',
    lowerLeftSideOfSweaterString: 'left side of sweater',
    bottomLeftSideOfSweaterString: 'lower-left side of sweater',

    topRightSideOfSweaterString: 'upper-right side of sweater',
    upperRightSideOfSweaterString: 'right side of sweater',
    lowerRightSideOfSweaterString: 'right side of sweater',
    bottomRightSideOfSweaterString: 'lower-right side of sweater',

    topRightArmString: 'right shoulder',
    upperRightArmString: 'right arm',
    lowerRightArmString: 'right arm',
    bottomRightArmString: 'lower-right arm',

    topLeftSideOfPlayAreaString: 'upper-left side of play area',
    upperLeftSideOfPlayAreaString: 'left side of play area',
    lowerLeftSideOfPlayAreaString: 'left side of play area',
    bottomLeftSideOfPlayAreaString: 'lower-left side of play area',

    topCenterOfPlayAreaString: 'upper-center of play area',
    upperCenterOfPlayAreaString: 'center of play area',
    lowerCenterOfPlayAreaString: 'center of play area',
    bottomCenterOfPlayAreaString: 'lower-center of play area',

    topRightSideOfPlayAreaString: 'upper-right side of play area',
    upperRightSideOfPlayAreaString: 'right side of play area',
    lowerRightSideOfPlayAreaString: 'right side of play area',
    bottomRightSideOfPlayAreaString: 'lower-right side of play area',

    topRightEdgeOfPlayAreaString: 'upper-right edge of play area',
    upperRightEdgeOfPlayAreaString: 'right edge of play area',
    lowerRightEdgeOfPlayAreaString: 'right edge of play area',
    bottomRightEdgeOfPlayAreaString: 'lower-right edge of play area',

    // location strings while touching another object
    touchingWallStringPattern: 'Touching {0}.',
    stickingToWallStringPattern: 'Sticking to {0}.',
	generalWallString: 'wall',
    lowerWallString: 'lower wall',
    upperWallString: 'upper wall',

    stickingToSweaterString: 'Sticking to right side of sweater.',

    // charge descriptions
    namedBalloonChargeDescriptionPatternString: '{0} has {1} net charge, {2} more negative charges than positive charges.',
    balloonChargeStringPattern: 'Has {0} net charge, {1} more negative charges than positive charges.',
    sweaterChargePatternString: 'Sweater has {0} net charge, {1} more positive charges than negative charges.',

    neutralString: 'neutral',
    negativeString: 'negative',
    positiveString: 'positive',

    noString: 'no',
    aFewString: 'a few',
    severalString: 'several',
    manyString: 'many',

    // wall charge descriptions
    atWallString: 'At wall.',
    atWallTouchPointPatternString: 'At touch point, negative charges in wall {0}. Positive charges do not move.  Wall has neutral net charge, many pairs of negative and positive charges.',
    wallRubStringPattern: 'No transfer of charge.  At touch point, negative charges in wall {0}.  Positive charges do not move.',
    wallChargesReturnString: 'Negative charges in wall return {0}.',

    slightlyString: 'slightly',
    allTheWayString: 'all the way',

    noChangeInChargesString: 'No change in charges.',
    moveALittleBitString: 'move away from balloon a little bit',
    moveALotString: 'move away from balloon a lot',
    moveQuiteALotString: 'move away from balloon quite a lot',
    doNotMoveString: 'do not move',

    noMoreChargesRemainingOnSweaterString: 'No change in charges. No more charges remaining on sweater.',

     // release descriptions
    balloonReleasedPatternString: 'Balloon released. Moved {0} to {1}.', //need end location string
    balloonReleasedNoChangePatternString: 'Balloon Released. {0}',
    noChangeInPositionOrChargeString: 'No change in position.  No change in charge.',

    wallString: 'wall',
    sweaterString: 'sweater',

    movesToObjectPatternString: 'Moves {0} towards {1}.',

    // interaction descriptions
    upTowardsTopString: 'Up. Towards top.',
    leftTowardsSweaterString: 'Left. Towards sweater.',
    downTowardsBottomString: 'Down. Towards bottom.',
    rightTowardsWallString: 'Right. Towards wall.',
    rightTowardsRightSideOfPlayAreaString: 'Right. Towards right side of play area.',

    closerToTopString: 'Up. Closer to top.',
    closerToSweaterString: 'Left. Closer to sweater.',
    closerToBottomString: 'Down. Closer to bottom.',
    closerToWallString: 'Right. Closer to wall.',
    closerToRightSideString: 'Right. Closer to right side of play area.',

    moveUpString: 'Up.',
    moveLeftString: 'Left.',
    moveDownString: 'Down.',
    moveRightString: 'Right.',

    morePairsOfChargesStringPattern: 'More pairs of charges {0}.',

    wallRemovedString: 'Wall removed from play area.',
    wallAddedString: 'Wall added to play area.',

    // boundary strings
    atTopOfPlayAreaString: 'At top.',
    atBottomOfPlayAreaString: 'At bottom.',
    leftEdgeString: 'At left edge.',
    rightEdgeString: 'At right edge.',

    nearSweaterString: 'Near sweater.',
    onSweaterPatternStringString: 'On sweater. {0}',
    picksUpNegativeChargesString: 'Picks up negative charges from sweater.',
    nearWallString: 'Near wall.',
    offSweaterString: 'Off sweater.',

    atCenterOfPlayAreaString: 'At center of play area.',
    onRightSideOfPlayAreaString: 'On right side of play area.',

    balloonPicksUpMoreChargesString: 'Balloon picks up more negative charges.',
    againMoreChargesString: 'Again, more negative charges.',

    // labels
    greenBalloonString: 'Green balloon',
    yellowBalloonString: 'Yellow balloon',

    // scene summary
    sceneSummaryLabelString: 'Scene Summary',
    openingSummaryString: 'Simulation contains a Play Area and a Control Panel. The play area is a small room. The control panel has buttons and switches to change conditions in the room.',
    roomItemsStringPattern: 'Currently, room has {0}',

    //-----------------
    // Location Descriptions
    twoBalloonDescriptionPattern: '{0} {1}',
    balloonLocationDescriptionStringPattern: '{0}, {1}',
    balloonInCenterPatternString: '{0} {1}',

    // possible items in the room
    balloonSweaterAndRemovableWallString: 'a balloon, a sweater, and a removable wall.',
    twoBalloonsSweaterAndRemovableWallString: 'two balloons, a sweater, and a removable wall',
    balloonAndSweaterString: 'a balloon and a sweater',
    twoBalloonsAndASweater: 'two balloons and a sweater',
    inPlayAreaStringPattern: 'in {0} of play area.',
    inPlayAreaNearItemStringPattern: 'in {0} of play area, {1}.',
    evenlyBetweenString: 'Evenly between sweater and wall. Sweater is at far left. Wall is at far right.',
    stickingToWallWithChargesStringPattern: 'sticking to {0} wall. {1}',
    negativeChargesMoveStringPattern: 'Negative charges in wall move away from balloon {0}.',

    aLittleBitString: 'a little bit',
    aLotString: 'a lot',
    quiteALotString: 'quite a lot',

    stickingToSweaterStringPattern: 'sticking to {0} of sweater.',

    upperLeftSideSweaterString: 'upper left side',
    upperRightSideSweaterString: 'upper right side',
    lowerLeftSideSweaterString: 'lower left side',
    lowerRightSideSweaterString: 'lower right side',

    greenBalloonLabelString: 'Green Balloon',
    yellowBalloonLabelString: 'Yellow Balloon',

    // directions
    upString: 'up',
    downString: 'down',
    rightString: 'right',
    leftString: 'left',
    upAndRightString: 'up and to the right',
    upAndLeftString: 'up and to the left',
    downAndRightString: 'down and to the right',
    downAndLeftString: 'down and to the left',

    // sweater charge descriptions
    sweaterNetChargePatternString: 'Sweater has {0} charge',
    netNeutralString: 'neutral net',
    netPositiveString: 'positive net',

    // balloon grab cue
    balloonGrabCueString: 'Once grabbed, get ready to drag balloon.  Press W, A, S, or D key to drag up, left, down, or right.  To let go, press Space key.',

    // misc labels
    removeWallLabelString: 'Remove Wall',
    addWallLabelString: 'Add Wall',

    balloonString: 'Balloon',
    balloonsString: 'Balloons',
    twoBalloonExperimentLabelString: 'Two-Balloon Experiment',
    grabPatternString: 'Grab {0}',
    greenBalloonRemovedString: 'Green balloon removed from Play Area',
    greenBalloonAddedString: 'Green balloon added to Play Area',
    playAreaLabelString: 'Play Area',
    sweaterLabelString: 'Sweater',
    wallLabelString: 'Wall',
    controlPanelLabelString: 'Control Panel',
    wallDescriptionString: 'Run experiments with or without the wall.',
    resetBalloonsDescriptionPatternString: 'Reset {0} to start {1} and an uncharged state.',

    resetAllString: 'Reset All',

    // strings for keyboard help content
    keyboardHelpDialogString: 'Balloon Hot Keys and Keyboard Help',
    keysForDraggingAndRubbingString: 'Keys for Dragging and Rubbing',
    draggindDescriptionString: 'Press the W, A, S, or D keys to drag or rub the balloon up, left, down, or right.',
	addShiftString: 'Add the Shift key to a letter key to drag or rub with smaller steps.',
    pressWString: 'Press W to drag up, or Shift key plus W to drag up a little.',
    pressAString: 'Press A to drag left, or Shift key plus A to drag left a little. ',
    pressSString: 'Press S to drag down, or Shift key plus S to drag down a little.',
    pressDString: 'Press D to drag right, or Shift key plus D to drag right a little.',
    hotkeysJumpingString: 'Hot Keys for Jumping',
    pressToJumpString: 'Move the balloon quickly to a location with these hot key pairs:',
    JSString: 'JS jumps close to Sweater.',
    JWString: 'JW jumps to Wall.',
    JNString: 'JN jumps to near Wall.',
    JCString: 'JC jumps to center of Play Area.',
    releaseBalloonString: 'Release Balloon',
    spacebarString: 'Press Space key to release the balloon.',
    tabString: 'Pressing the Tab key also releases the Balloon as you go to the next item in the simulation.',
    grabDescriptionString: 'Press Space key or Enter key to pick up or grab the Balloon. Once grabbed, press the W, A, S, or D key to drag the balloon.',
    grabBalloonString: 'Grab balloon',

    // sweater descriptions
    sweaterDescriptionPatternString: 'Sweater has {0} net charge, {1} more positive charges than negative charges.',
    sweaterChargeDepletedString: 'Sweater has positive net charge, no negative charges, only positive charges.',

    // wall strings
      // strings
    wallNeutralChargeDescriptionString: 'Wall has neutral net charge, many pairs of negative and positive charges.',

    twoBalloonsTouchingWallPatternString: '{0}. {1}. {2}.',
    oneBalloonTouchingWallPatternString: '{0} {1}',
    balloonTouchPointDescriptionPatternString: 'At {0} touch point, {1}',
    chargeDescriptionPatternString: 'negative charges in wall move away from balloon {0}.  Positive charges do not move.'

  };

  // verify that object is immutable, without the runtime penalty in production code
  if ( assert ) { Object.freeze( BASEA11yStrings ); }

  balloonsAndStaticElectricity.register( 'BASEA11yStrings', BASEA11yStrings );

  return BASEA11yStrings;
} );