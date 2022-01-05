// Copyright 2017-2022, University of Colorado Boulder

/**
 * Single position of all accessibility strings.  These strings are not meant to be translatable yet.  Rosetta needs
 * some work to provide translators with context for these strings, and we want to receive some community feedback
 * before these strings are submitted for translation.
 *
 * @author Jesse Greenberg
 */

import balloonsAndStaticElectricity from '../balloonsAndStaticElectricity.js';

const BASEA11yStrings = {

  //------------------------------------------------------------------------
  // General utility strings
  //------------------------------------------------------------------------
  singleStatementPattern: {
    value: '{{statement}}.'
  },

  //--------------------------------------------------------------------------
  // General labels
  //--------------------------------------------------------------------------
  position: {
    value: 'position'
  },
  positions: {
    value: 'positions'
  },

  //--------------------------------------------------------------------------
  // Play Area map grid strings
  //--------------------------------------------------------------------------
  leftShoulderOfSweater: {
    value: 'left shoulder of sweater'
  },
  leftArmOfSweater: {
    value: 'left arm of sweater'
  },
  bottomLeftEdgeOfSweater: {
    value: 'lower-left arm of sweater'
  },
  upperLeftSideOfSweater: {
    value: 'upper-left side of sweater'
  },
  leftSideOfSweater: {
    value: 'left side of sweater'
  },
  lowerLeftSideOfSweater: {
    value: 'lower-left side of sweater'
  },
  upperRightSideOfSweater: {
    value: 'upper-right side of sweater'
  },
  rightSideOfSweater: {
    value: 'right side of sweater'
  },
  lowerRightSideOfSweater: {
    value: 'lower-right side of sweater'
  },
  rightShoulderOfSweater: {
    value: 'right shoulder of sweater'
  },
  rightArmOfSweater: {
    value: 'right arm of sweater'
  },
  lowerRightArmOfSweater: {
    value: 'lower-right arm of sweater'
  },
  upperLeftSideOfPlayArea: {
    value: 'upper-left side of Play Area'
  },
  leftSideOfPlayArea: {
    value: 'left side of Play Area'
  },
  lowerLeftSideOfPlayArea: {
    value: 'lower-left side of Play Area'
  },
  upperCenterOfPlayArea: {
    value: 'upper-center of Play Area'
  },
  centerOfPlayArea: {
    value: 'center of Play Area'
  },
  lowerCenterOfPlayArea: {
    value: 'lower-center of Play Area'
  },
  upperRightSideOfPlayArea: {
    value: 'upper-right side of Play Area'
  },
  rightSideOfPlayArea: {
    value: 'right side of Play Area'
  },
  lowerRightSideOfPlayArea: {
    value: 'lower-right side of Play Area'
  },
  upperWall: {
    value: 'upper wall'
  },
  wall: {
    value: 'wall'
  },
  lowerWall: {
    value: 'lower wall'
  },
  upperRightEdgeOfPlayArea: {
    value: 'upper-right edge of Play Area'
  },
  rightEdgeOfPlayArea: {
    value: 'right edge of Play Area'
  },
  lowerRightEdgeOfPlayArea: {
    value: 'lower-right edge of Play Area'
  },

  //--------------------------------------------------------------------------
  // Play Area landmark strings, 'near' or  'at' added  through string patterns
  //--------------------------------------------------------------------------
  landmarkNearSweater: {
    value: 'sweater'
  },
  landmarkLeftEdge: {
    value: 'left edge'
  },
  landmarkNearUpperWall: {
    value: 'upper wall'
  },
  landmarkNearWall: {
    value: 'wall'
  },
  landmarkNearLowerWall: {
    value: 'lower wall'
  },
  landmarkNearUpperRightEdge: {
    value: 'upper right edge'
  },
  landmarkNearRightEdge: {
    value: 'right edge'
  },
  landmarkNearLowerRightEdge: {
    value: 'lower-right edge'
  },
  landmarkAtCenterPlayArea: {
    value: 'center of Play Area'
  },
  landmarkAtUpperCenterPlayArea: {
    value: 'upper-center of Play Area'
  },
  landmarkAtLowerCenterPlayArea: {
    value: 'lower-center of Play Area'
  },
  balloonVeryCloseTo: {
    value: 'Very close to'
  },

  //--------------------------------------------------------------------------
  // Boundary or Critical position strings
  //--------------------------------------------------------------------------
  atLeftEdge: {
    value: 'At left edge.'
  },
  atTop: {
    value: 'At top.'
  },
  atBottom: {
    value: 'At bottom.'
  },
  atRightEdge: {
    value: 'At right edge.'
  },
  atWall: {
    value: 'At wall.'
  },
  onSweater: {
    value: 'On Sweater'
  },
  offSweater: {
    value: 'Off sweater.'
  },

  //--------------------------------------------------------------------------
  // Charge capacity strings
  //--------------------------------------------------------------------------
  neutral: {
    value: 'neutral'
  },
  negative: {
    value: 'negative'
  },
  positive: {
    value: 'positive'
  },

  no: {
    value: 'no'
  },
  aFew: {
    value: 'a few'
  },
  several: {
    value: 'several'
  },
  many: {
    value: 'many'
  },
  all: {
    value: 'all'
  },
  zero: {
    value: 'zero'
  },

  sweater: {
    value: 'sweater'
  },

  // alerts for when wall is added or removed from play area
  wallRemoved: {
    value: 'Wall removed from Play Area.'
  },
  wallAdded: {
    value: 'Wall added to Play Area.'
  },

  //------------------------------------------------------------------------
  // screen summary strings
  //------------------------------------------------------------------------
  simOpening: {
    value: 'The Play Area is a small room. The Control Area has buttons, a checkbox, and radio buttons to change conditions in the room.'
  },

  // objects for the screen summary
  roomObjectsPattern: {
    value: 'Currently, room has {{description}}.'
  },
  aYellowBalloon: {
    value: 'a yellow balloon,'
  },
  aGreenBalloon: {
    value: 'a green balloon,'
  },
  aSweater: {
    value: 'a sweater,'
  },
  andASweater: {
    value: 'and a sweater'
  },
  andARemovableWall: {
    value: 'and a removable wall'
  },
  summaryYellowGreenSweaterWallPattern: {
    value: '{{yellowBalloon}} {{greenBalloon}} {{sweater}} {{wall}}'
  },
  summaryYellowGreenSweaterPattern: {
    value: '{{yellowBalloon}} {{greenBalloon}} {{sweater}}'
  },
  summaryYellowSweaterWallPattern: {
    value: '{{yellowBalloon}} {{sweater}} {{wall}}'
  },
  summaryYellowSweaterPattern: {
    value: '{{yellowBalloon}} {{sweater}}'
  },
  inducedChargePattern: {
    value: 'Negative charges in {{wallPosition}} move away from {{balloon}} {{inductionAmount}}'
  },
  inducedChargeNoAmountPattern: {
    value: 'Negative charges in {{wallPosition}} move away from {{balloon}}.'
  },
  summaryBalloonNeutralCharge: {
    value: 'a few pairs of negative and positive charges'
  },
  summaryBalloonChargePattern: {
    value: '{{balloonCharge}}, {{showingCharge}}.'
  },
  summaryEachBalloonChargePattern: {
    value: '{{yellowBalloon}} {{greenBalloon}}'
  },
  summarySweaterAndWall: {
    value: 'Sweater and wall'
  },
  initialObjectPositions: {
    value: 'Yellow balloon is at center of Play Area, evenly between sweater and wall. Sweater is at far left, wall at far right.'
  },

  // general charge information for the screen summary
  summaryObjectHasChargePattern: {
    value: '{{object}} has {{charge}} net charge'
  },
  summaryObjectsHaveChargePattern: {
    value: '{{objects}} have {{charge}} net charge'
  },
  summaryNeutralChargesPattern: {
    value: '{{amount}} pairs of negative and positive charges'
  },
  summaryObjectChargePattern: {
    value: '{{object}}, {{charge}}.'
  },
  summaryObjectEachHasPattern: {
    value: '{{object}}, each has {{charge}}.'
  },
  summaryObjectEachPattern: {
    value: '{{object}}, each {{charge}}.'
  },
  summarySweaterWallPattern: {
    value: '{{sweater}} {{wall}}'
  },

  // summary phrases when both balloons are inducing charge
  summarySecondBalloonInducingChargePattern: {
    value: 'from Green Balloon {{amount}}.'
  },
  summaryBothBalloonsPattern: {
    value: '{{yellowBalloon}}, {{greenBalloon}} Positive charges do not move.'
  },

  //------------------------------------------------------------------------
  // Induced charge strings
  //------------------------------------------------------------------------
  aLittleBit: {
    value: 'a little bit'
  },
  aLot: {
    value: 'a lot'
  },
  quiteALot: {
    value: 'quite a lot'
  },

  //------------------------------------------------------------------------
  // Charge view strings
  //------------------------------------------------------------------------
  showingNoCharges: {
    value: 'showing no charges'
  },

  //------------------------------------------------------------------------
  // Object strings (strings shared between all objects)
  //------------------------------------------------------------------------
  manyChargePairs: {
    value: 'many pairs of negative and positive charges'
  },

  //------------------------------------------------------------------------
  // Sweater strings
  //------------------------------------------------------------------------
  sweaterLabel: {
    value: 'Sweater'
  },
  sweaterPosition: {
    value: 'At left edge of Play Area.'
  },
  sweaterDescriptionPattern: {
    value: '{{position}} {{charge}}'
  },
  sweaterChargePattern: {
    value: '{{netCharge}}, {{relativeCharge}}'
  },
  sweaterNetChargePattern: {
    value: 'Has {{netCharge}} net charge'
  },
  sweaterRelativeChargePattern: {
    value: '{{charge}} more positive charges than negative charges'
  },
  sweaterShowingPattern: {
    value: 'showing {{charge}} positive charges'
  },
  sweaterRelativeChargeAllPattern: {
    value: '{{charge}} more positive charges than negative charges'
  },
  sweaterRelativeChargeDifferencesPattern: {
    value: 'showing {{charge}} positive charges'
  },
  sweaterNoMoreCharges: {
    value: 'no more negative charges, only positive charges'
  },
  showingAllPositiveCharges: {
    value: 'showing all positive charges'
  },
  sweaterHasRelativeChargePattern: {
    value: 'Sweater has {{relativeCharge}}.'
  },
  sweaterHasNetChargeShowingPattern: {
    value: 'Sweater has positive net charge, {{showing}}.'
  },
  positiveNetCharge: {
    value: 'positive net charge'
  },
  neutralNetCharge: {
    value: 'neutral net charge'
  },
  netNeutral: {
    value: 'neutral net'
  },
  netPositive: {
    value: 'positive net'
  },

  //------------------------------------------------------------------------
  // Wall strings
  //------------------------------------------------------------------------
  wallDescriptionPattern: {
    value: '{{position}}. {{charge}}.'
  },
  wallPosition: {
    value: 'At right edge of Play Area'
  },
  wallNoNetCharge: {
    value: 'Has zero net charge'
  },
  wallHasManyCharges: {
    value: 'Wall has many pairs of negative and positive charges.'
  },
  wallChargeWithoutInducedPattern: {
    value: '{{netCharge}}, {{shownCharges}}'
  },
  wallChargeWithInducedPattern: {
    value: '{{netCharge}}, {{shownCharges}}. {{inducedCharge}}'
  },
  wallTwoBalloonInducedChargePattern: {
    value: '{{yellowBalloon}} {{greenBalloon}}'
  },
  wallNoChangeInChargesPattern: {
    value: 'In {{position}}, no change in charges' // punctuation inserted in another string pattern
  },
  wallChargePatternStringWithLabel: {
    value: 'Wall {{wallCharge}}'
  },
  wallRubPattern: {
    value: '{{position}} {{charge}}'
  },
  wallRubAllPattern: {
    value: 'No transfer of charge. {{inducedCharge}}'
  },
  wallRubDiffPattern: {
    value: '{{balloonCharge}} {{wallCharge}}'
  },
  wallRubbingWithPairsPattern: {
    value: '{{rubbingAlert}} Wall has many pairs of negative and positive charges.'
  },
  noChangeInCharges: {
    value: 'No change in charges'
  },
  noChangeInNetCharge: {
    value: 'No change in net charge'
  },
  wallInducedChargeSummaryPattern: {
    value: '{{inducedCharge}} {{positiveCharges}}'
  },
  wallInducedChargeWithManyPairsPattern: {
    value: '{{inducedCharge}} {{chargePairs}}'
  },

  //--------------------------------------------------------------------------
  // Induced charge change strings
  //--------------------------------------------------------------------------
  moreInducedChargePattern: {
    value: 'Negative charges in {{position}} {{movement}} from {{balloon}}.'
  },
  lessInducedChargePattern: {
    value: 'Negative charges in {{position}} {{movement}}.'
  },
  moveAwayALittleMore: {
    value: 'move away a little more'
  },
  beginToReturn: {
    value: 'begin to return'
  },
  returnALittleMore: {
    value: 'return a little more'
  },
  positiveChargesDoNotMove: {
    value: 'Positive charges do not move'
  },

  //------------------------------------------------------------------------
  // Balloon strings
  //------------------------------------------------------------------------
  greenBalloonLabel: {
    value: 'Green Balloon'
  },
  yellowBalloonLabel: {
    value: 'Yellow Balloon'
  },
  grabBalloonPattern: {
    value: 'Grab {{balloon}}'
  },
  eachBalloon: {
    value: 'Each balloon'
  },
  bothBalloons: {
    value: 'balloons'
  },
  grabBalloonToPlay: {
    value: 'Grab balloon to play.'
  },
  grabBalloonKeyboardHelp: {
    value: 'Look for grab button to play. Once grabbed, use keyboard shortcuts to move balloon. Space to release.'
  },
  balloonPositionAttractiveStatePattern: {
    value: '{{attractiveState}} {{position}}'
  },
  balloonShowAllChargesPattern: {
    value: '{{stateAndPosition}} {{netCharge}}, {{relativeCharge}}.'
  },
  balloonLabelWithAttractiveStatePattern: {
    value: '{{balloonLabel}}, {{attractiveStateAndPosition}}'
  },

  // describing the attractive state of a balloon
  balloonStickingTo: {
    value: 'Sticking to'
  },
  balloonOn: {
    value: 'On'
  },
  balloonAt: {
    value: 'At'
  },
  balloonNear: {
    value: 'Near'
  },

  // balloon charge strings
  balloonNetChargePattern: {
    value: 'Has {{chargeAmount}} net charge'
  },
  balloonNetChargePatternStringWithLabel: {
    value: '{{balloon}} has {{chargeAmount}} net charge'
  },
  balloonZero: {
    value: 'zero'
  },
  balloonNegative: {
    value: 'negative'
  },
  balloonRelativeChargePattern: {
    value: '{{amount}} more negative charges than positive charges'
  },
  balloonChargeDifferencesPattern: {
    value: 'showing {{amount}} negative charges'
  },
  balloonHasRelativeChargePattern: {
    value: '{{balloonLabel}} has {{relativeCharge}}'
  },

  balloonHasNetChargePattern: {
    value: '{{balloon}} has {{charge}} net charge, {{showing}}'
  },

  //--------------------------------------------------------------------------
  // Balloon interaction strings
  //--------------------------------------------------------------------------
  released: {
    value: 'Released'
  },

  //--------------------------------------------------------------------------
  // Balloon movement strings
  //--------------------------------------------------------------------------
  initialMovementPattern: {
    value: 'Moves {{velocity}} {{direction}}.'
  },
  twoBalloonInitialMovementPattern: {
    value: '{{balloon}}, moves {{velocity}} {{direction}}.'
  },

  // described velocities
  extremelySlowly: {
    value: 'extremely slowly'
  },
  verySlowly: {
    value: 'very slowly'
  },
  slowly: {
    value: 'slowly'
  },
  quickly: {
    value: 'quickly'
  },
  veryQuickly: {
    value: 'very quickly'
  },

  noChangeAndPositionPattern: {
    value: 'No change in position. {{position}}'
  },
  twoBalloonNoChangeAndPositionPattern: {
    value: '{{balloon}}, no change in position. {{position}}'
  },
  noChangeWithInducedChargePattern: {
    value: '{{noChange}} {{inducedCharge}}'
  },

  continuousMovementPattern: {
    value: 'Moving {{direction}}.'
  },
  continuousMovementWithLandmarkPattern: {
    value: '{{movementDirection}} {{landmark}}.'
  },
  continuousMovementWithLabelPattern: {
    value: '{{balloonLabel}}, moving {{direction}}.'
  },

  nowDirectionPattern: {
    value: 'Now {{direction}}.'
  },
  twoBalloonNowDirectionPattern: {
    value: '{{balloon}}, now {{direction}}.'
  },

  // when balloon hits wall and there is a change in charges
  balloonPositionNoChangePattern: {
    value: '{{position}} {{inducedCharge}}'
  },

  //--------------------------------------------------------------------------
  // Balloon Dragging strings, single statement with no other context
  //--------------------------------------------------------------------------
  upDragging: {
    value: 'Up.'
  },
  leftDragging: {
    value: 'Left.'
  },
  downDragging: {
    value: 'Down.'
  },
  rightDragging: {
    value: 'Right.'
  },
  upAndToTheRightDragging: {
    value: 'Up and to the right.'
  },
  upAndToTheLeftDragging: {
    value: 'Up and to the left.'
  },
  downAndToTheRightDragging: {
    value: 'Down and to the right.'
  },
  downAndToTheLeftDragging: {
    value: 'Down and to the left.'
  },

  // similar to dragging direction strings, but in context so not capitalized and no punctuation
  up: {
    value: 'up'
  },
  left: {
    value: 'left'
  },
  down: {
    value: 'down'
  },
  right: {
    value: 'right'
  },
  upAndToTheRight: {
    value: 'up and to the right'
  },
  upAndToTheLeft: {
    value: 'up and to the left'
  },
  downAndToTheRight: {
    value: 'down and to the right'
  },
  downAndToTheLeft: {
    value: 'down and to the left'
  },

  // dragging, specific cues when the balloon enters an important area
  balloonAtPositionPattern: {
    value: 'At {{position}}'
  },
  balloonNewRegionPattern: {
    value: '{{nearOrAt}} {{position}}'
  },
  closerToObjectPattern: {
    value: 'Closer to {{object}}'
  },
  topEdgeOfPlayArea: {
    value: 'top edge of Play Area'
  },
  bottomEdgeOfPlayArea: {
    value: 'bottom edge of Play Area'
  },

  //--------------------------------------------------------------------------
  // Balloon grabbing strings (when the balloon is initially picked up)
  //--------------------------------------------------------------------------
  grabbedNonePattern: {
    value: 'Grabbed. {{position}}'
  },
  grabbedChargePattern: {
    value: 'Grabbed. {{position}} {{charge}}'
  },
  grabbedWithOtherChargePattern: {
    value: '{{balloonCharge}} {{otherObjectCharge}}'
  },
  grabbedWithHelpPattern: {
    value: '{{grabbedAlert}} {{help}}'
  },
  balloonHasChargePattern: {
    value: 'Has {{charge}}'
  },
  balloonHasChargeShowingPattern: {
    value: 'Has {{charge}} net charge, {{showing}}'
  },
  balloonRelativeChargeAllPattern: {
    value: 'Has {{charge}}'
  },
  combinedChargePattern: {
    value: '{{grabbedBalloon}}. {{otherBalloon}}'
  },
  keyboardInteractionCue: {
    value: 'Press W, A, S, or D key to move balloon. Space to release.'
  },
  touchInteractionCue: {
    value: 'Drag finger to move balloon. Lift finger to release.'
  },

  //--------------------------------------------------------------------------
  // Balloon sweater rubbing strings
  //--------------------------------------------------------------------------
  balloonPicksUpChargesPattern: {
    value: '{{balloon}} picks up negative charges from sweater'
  },
  balloonPicksUpChargesDiffPattern: {
    value: '{{pickUp}}. Same increase of positive charges on sweater.'
  },
  balloonPicksUpMoreChargesPattern: {
    value: '{{balloon}} picks up more negative charges'
  },
  balloonPicksUpMoreChargesDiffPattern: {
    value: '{{pickUp}}. Same increase of positive charges on sweater.'
  },
  balloonSweaterRelativeChargesPattern: {
    value: '{{balloon}} {{sweater}}'
  },
  lastChargePickedUpPattern: {
    value: '{{sweater}} {{balloon}}.'
  },

  //--------------------------------------------------------------------------
  // Balloon rubbing strings, fail to pick up charges
  //--------------------------------------------------------------------------
  noChargePickupPattern: {
    value: '{{noChange}}. {{balloonPosition}}. {{moreChargesPosition}}'
  },
  nochargePickupWithObjectChargeAndHint: {
    value: '{{noChange}}. {{balloonPosition}}. {{sweaterCharge}} {{balloonCharge}} {{hint}}'
  },
  noChargePickupHintPattern: {
    value: '{{noChange}}. {{balloonPosition}}. {{hint}}'
  },
  releaseHint: {
    value: 'Press Space to release.'
  },
  moreChargesPattern: {
    value: '{{moreCharges}} {{direction}}.'
  },
  moreChargesFurtherPattern: {
    value: '{{moreCharges}} further {{direction}}.'
  },
  morePairsOfCharges: {
    value: 'More pairs of charges'
  },
  moreHiddenPairsOfCharges: {
    value: 'More hidden pairs of charges'
  },

  //--------------------------------------------------------------------------
  // Balloon jumping strings
  //--------------------------------------------------------------------------
  nearSweater: {
    value: 'Near sweater.'
  },
  positionAndInducedChargePattern: {
    value: '{{position}}. {{inducedCharge}}'
  },

  //------------------------------------------------------------------------
  // Control panel strings
  //------------------------------------------------------------------------
  balloonSettingsLabel: {
    value: 'Balloon Settings'
  },
  chargeSettingsDescription: {
    value: 'Choose how you see or hear charge information.'
  },
  chargeSettingsLabel: {
    value: 'Charge Settings'
  },
  showAllChargesAlert: {
    value: 'No charges hidden.'
  },
  shoNoChargesAlert: {
    value: 'All charges hidden.'
  },
  showChargeDifferencesAlert: {
    value: 'Only unpaired charges shown.'
  },
  resetBalloonsDescriptionPattern: {
    value: 'Reset {{balloons}} to start {{positions}} and an uncharged state.'
  },

  // balloon grab cue
  balloonButtonHelp: {
    value: 'Look for grab button to play.'
  },

  // misc labels
  removeWallDescription: {
    value: 'Play with or without the wall.'
  },
  twoBalloonExperimentDescription: {
    value: 'Play with two balloons or just one.'
  },

  balloon: {
    value: 'Balloon'
  },
  balloons: {
    value: 'Balloons'
  },
  twoBalloonExperimentLabel: {
    value: 'Two-Balloon Experiments'
  },
  wallLabel: {
    value: 'Wall'
  },

  // alert when the balloons are reset
  resetBalloonsAlertPattern: {
    value: '{{balloons}} and sweater reset.'
  },

  // alerts when balloons added/removed from play area
  balloonAddedPattern: {
    value: '{{balloonLabel}} added to Play Area.'
  },
  balloonRemovedPattern: {
    value: '{{balloonLabel}} removed from Play Area.'
  },
  balloonAddedWithPositionPattern: {
    value: '{{balloonLabel}} added. {{position}}.'
  },
  balloonPositionNearOtherPattern: {
    value: '{{position}}, next to {{otherBalloon}}'
  },

  //--------------------------------------------------------------------------
  // Keyboard shortcuts help content strings
  //--------------------------------------------------------------------------
  grabOrReleaseBalloonDescription: {
    value: 'Grab or release the balloon with Space or Enter keys.'
  },
  moveGrabbedBalloonDescription: {
    value: 'Move grabbed balloon up, left, down, or right with Arrow keys or with letter keys W, A, S, or D.'
  },
  moveSlowerDescription: {
    value: 'Move slower with Shift plus Arrow keys or Shift plus letter keys W, A, S, or D.'
  },
  jumpsCloseToSweaterDescription: {
    value: 'Jump close to sweater with J plus S.'
  },
  jumpsCloseToWwallDescription: {
    value: 'Jump to wall with J plus W.'
  },
  jumpsNearWallDescription: {
    value: 'Jump to near wall with J plus N.'
  },
  jumpstoCenterDescription: {
    value: 'Jump to center with J plus C.'
  }
};

if ( phet.chipper.queryParameters.stringTest === 'xss' ) {
  for ( const key in BASEA11yStrings ) {
    BASEA11yStrings[ key ].value += '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIW2NkYGD4DwABCQEBtxmN7wAAAABJRU5ErkJggg==" onload="window.position.href=atob(\'aHR0cHM6Ly93d3cueW91dHViZS5jb20vd2F0Y2g/dj1kUXc0dzlXZ1hjUQ==\')" />';
  }
}

// verify that object is immutable, without the runtime penalty in production code
if ( assert ) { Object.freeze( BASEA11yStrings ); }

balloonsAndStaticElectricity.register( 'BASEA11yStrings', BASEA11yStrings );

export default BASEA11yStrings;