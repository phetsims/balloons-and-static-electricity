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
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );

  var BASEA11yStrings = {

  //------------------------------------------------------------------------
  // General utility strings
  //------------------------------------------------------------------------
  singleStatementPatternString: {
    value: '{{statement}}.'
  },

  bothBalloonsString: {
    value: 'balloons'
  },

  // TODO: Can these be removed?
  balloonDescriptionPatternString: {
    value: '{0} {1} {2}' // location, charge, interaction cu
  },
  balloonGrabbedDescriptionPatternString: {
    value: '{0} {1} {2} {3}' // grabbed, location, charge, interaction cue
  },
  balloonDragDescriptionPatternString: {
    value: '{0} {1} {2} {3} {4} {5}' // direction, proximity, charge,
  },
  grabButtonNavigationCueString: {
    value: 'Look for grab button to play.'
  },

  grabBalloonToPlayString: {
    value: 'Grab balloon to play.'
  },

  positionString: {
    value: 'position'
  },
  positionsString: {
    value: 'positions'
  },

    // location strings
  balloonLocationStringPattern: {
    value: 'In {0}.'
  },
  draggingLocationStringPattern: {
    value: 'At {0}.'
  },

    // location strings for the grid in the play area
  leftShoulderOfSweaterString: {
    value: 'left shoulder of sweater'
  },
  leftArmOfSweaterString: {
    value: 'left arm of sweater'
  },
  bottomLeftEdgeOfSweaterString: {
    value: 'lower-left arm of sweater'
  },

  upperLeftSideOfSweaterString: {
    value: 'upper-left side of sweater'
  },
  leftSideOfSweaterString: {
    value: 'left side of sweater'
  },
  lowerLeftSideOfSweaterString: {
    value: 'lower-left side of sweater'
  },

  upperRightSideOfSweaterString: {
    value: 'upper-right side of sweater'
  },
  rightSideOfSweaterString: {
    value: 'right side of sweater'
  },
  lowerRightSideOfSweater: {
    value: 'lower-right side of sweater'
  },

  rightShoulderOfSweaterString: {
    value: 'right shoulder of sweater'
  },
  rightArmOfSweaterString: {
    value: 'right arm of sweater'
  },
  lowerRightArmOfSweaterString: {
    value: 'lower-right arm of sweater'
  },

  upperLeftSideOfPlayAreaString: {
    value: 'upper-left side of Play Area'
  },
  leftSideOfPlayAreaString: {
    value: 'left side of Play Area'
  },
  lowerLeftSideOfPlayAreaString: {
    value: 'lower-left side of Play Area'
  },

  upperCenterOfPlayAreaString: {
    value: 'upper-center of Play Area'
  },
  centerOfPlayAreaString: {
    value: 'center of Play Area'
  },
  lowerCenterOfPlayAreaString: {
    value: 'lower-center of Play Area'
  },

  upperRightSideOfPlayAreaString: {
    value: 'upper-right side of Play Area'
  },
  rightSideOfPlayAreaString: {
    value: 'right side of Play Area'
  },
  lowerRightSideOfPlayAreaString: {
    value: 'lower-right side of Play Area'
  },

  upperWallString: {
    value: 'upper wall'
  },
  wallString: {
    value: 'wall'
  },
  lowerWallString: {
    value: 'lower wall'
  },

  upperRightEdgeOfPlayAreaString: {
    value: 'upper-right edge of Play Area'
  },
  rightEdgeOfPlayAreaString: {
    value: 'right edge of Play Area'
  },
  lowerRightEdgeOfPlayAreaString: {
    value: 'lower-right edge of Play Area'
  },

    // landmark strings
  landmarkNearSweaterString: {
    value: 'sweater' // 'near' added programatciall
  },
  landmarkLeftEdgeString: {
    value: 'left edge'
  },
  landmarkNearUpperWallString: {
    value: 'upper wall'
  },
  landmarkNearWallString: {
    value: 'wall' // 'near' added programmaticall
  },
  landmarkNearLowerWallString: {
    value: 'lower wall'
  },
  landmarkNearUpperRightEdgeString: {
    value: 'upper right edge' // 'near' added programmaticall
  },
  landmarkNearRightEdgeString: {
    value: 'right edge' // 'near' added programmaticall
  },
  landmarkNearLowerRightEdgeString: {
    value: 'lower-right edge' // 'near' added programmaticall
  },
  landmarkAtCenterPlayAreaString: {
    value: 'center of play area'
  },
  landmarkAtUpperCenterPlayAreaString: {
    value: 'upper-center of play area' // 'At added programmatically
  },
  landmarkAtLowerCenterPlayAreaString: {
    value: 'lower-center of play area' // 'At added programmatically
  },

    // location strings while touching another object
  touchingWallStringPattern: {
    value: 'Touching {0}.'
  },

    // charge descriptions
  namedBalloonChargeDescriptionPatternString: {
    value: '{0} has {1} net charge, {2} more negative charges than positive charges.'
  },
  balloonChargeStringPattern: {
    value: 'Has {0} net charge, {1} more negative charges than positive charges.'
  },

  neutralString: {
    value: 'neutral'
  },
  negativeString: {
    value: 'negative'
  },
  positiveString: {
    value: 'positive'
  },

  noString: {
    value: 'no'
  },
  aFewString: {
    value: 'a few'
  },
  severalString: {
    value: 'several'
  },
  manyString: {
    value: 'many'
  },
  allString: {
    value: 'all'
  },
  zeroString: {
    value: 'zero'
  },

    // wall charge descriptions
  atWallString: {
    value: 'At wall.'
  },
  wallChargesReturnString: {
    value: 'Negative charges in wall return {0}.'
  },

  slightlyString: {
    value: 'slightly'
  },
  allTheWayString: {
    value: 'all the way'
  },
  noChangeInChargesString: {
    value: 'No change in charges'
  },
  noChangeInNetChargeString: {
    value: 'No change in net charge'
  },
  moveALittleBitString: {
    value: 'move away from balloon a little bit'
  },
  moveALotString: {
    value: 'move away from balloon a lot'
  },
  moveQuiteALotString: {
    value: 'move away from balloon quite a lot'
  },
  doNotMoveString: {
    value: 'do not move'
  },

  noMoreChargesRemainingOnSweaterString: {
    value: 'No change in charges. No more charges remaining on sweater.'
  },

    // release descriptions
  noChangeInPositionOrChargeString: {
    value: 'No change in position.  No change in charge.'
  },

  sweaterString: {
    value: 'sweater'
  },

    // interaction descriptions
  upTowardsTopString: {
    value: 'Up. Towards top.'
  },
  leftTowardsSweaterString: {
    value: 'Left. Towards sweater.'
  },
  downTowardsBottomString: {
    value: 'Down. Towards bottom.'
  },
  rightTowardsWallString: {
    value: 'Right. Towards wall.'
  },
  rightTowardsRightSideOfPlayAreaString: {
    value: 'Right. Towards right side of play area.'
  },

  closerToTopString: {
    value: 'Up. Closer to top.'
  },
  closerToSweaterString: {
    value: 'Left. Closer to sweater.'
  },
  closerToBottomString: {
    value: 'Down. Closer to bottom.'
  },
  closerToWallString: {
    value: 'Right. Closer to wall.'
  },
  closerToRightSideString: {
    value: 'Right. Closer to right side of play area.'
  },

  wallRemovedString: {
    value: 'Wall removed from play area.'
  },
  wallAddedString: {
    value: 'Wall added to play area.'
  },

    // boundary strings
  atTopOfPlayAreaString: {
    value: 'At top.'
  },
  atBottomOfPlayAreaString: {
    value: 'At bottom.'
  },
  leftEdgeString: {
    value: 'At left edge.'
  },
  rightEdgeString: {
    value: 'At right edge.'
  },

  onSweaterPatternStringString: {
    value: 'On sweater. {0}'
  },
  picksUpNegativeChargesString: {
    value: 'Picks up negative charges from sweater.'
  },
  nearWallString: {
    value: 'Near wall.'
  },

  atCenterOfPlayAreaString: {
    value: 'At center of play area.'
  },
  onRightSideOfPlayAreaString: {
    value: 'On right side of play area.'
  },

  againMoreChargesString: {
    value: 'Again, more negative charges.'
  },

    // labels
  greenBalloonString: {
    value: 'Green balloon'
  },
  yellowBalloonString: {
    value: 'Yellow balloon'
  },
  eachBalloonString: {
    value: 'Each balloon'
  },

    //------------------------------------------------------------------------
    // Scene summary strings
    //------------------------------------------------------------------------
  sceneSummaryString: {
    value: 'Scene Summary'
  },
  openingSummaryString: {
    value: 'This is an interactive sim. Descriptions change as you play with it. It has a Play Area and a Control Panel. The Play Area is a small room. The Control Panel has buttons, a checkbox, and radio buttons to change conditions in the room.'
  },

    // objects for the scene summary
  roomObjectsPatternString: {
    value: 'Currently, room has {{description}}.'
  },
  aYellowBalloonString: {
    value: 'a yellow balloon,'
  },
  aGreenBalloonString: {
    value: 'a green balloon,'
  },
  aSweaterString: {
    value: 'a sweater,'
  },
  andASweaterString: {
    value: 'and a sweater'
  },
  andARemovableWallString: {
    value: 'and a removable wall'
  },
  summaryObjectsString: {
    value: '{{yellowBalloon}} {{greenBalloon}} {{sweater}} {{wall}}'
  },

    // patterns for the balloon description in the scene summary
  balloonSummaryWithInducedChargePatternString: {
    value: '{{balloon}}, {{attractiveState}} {{location}}. {{inducedCharge}}.'
  },
  balloonSummaryWithoutInducedChargePatternString: {
    value: '{{balloon}}, {{attractiveState}} {{location}}.'
  },
  twoBalloonLocationSummaryString: {
    value: '{{yellowBalloon}} {{greenBalloon}}'
  },

  inducedChargePatternString: {
    value: 'Negative charges in {{wallLocation}} move away from {{balloon}} {{inductionAmount}}.'
  },
  inducedChargeNoAmountPatternString: {
    value: 'Negative charges in {{wallLocation}} move away from {{balloon}}.'
  },

    // describing the attractive state of a balloon
  sceneSummaryOnString: {
    value: 'on'
  },
  sceneSummaryTouchingString: {
    value: 'touching'
  },

    // scene summary charge strings
  allHaveNoNetChargeString: {
    value: 'All have zero net charge'
  },
  neutralBalloonChargePatternString: {
    value: '{{balloon}} has a few pairs of negative and positive charges.'
  },
  neutralSweaterChargeString: {
    value: 'Sweater, many pairs of negative and positive charges.'
  },
  neutralSweaterAndWallChargeString: {
    value: 'Sweater and wall, many pairs of negative and positive charges.'
  },
  summaryBalloonNeutralChargeString: {
    value: 'a few pairs of negative and positive charges'
  },
  summaryBalloonChargePatternString: {
    value: '{{balloonCharge}}, {{showingCharge}}.'
  },
  summaryEachBalloonChargePatternString: {
    value: '{{yellowBalloon}} {{greenBalloon}}'
  },
  summarySweaterAndWallString: {
    value: 'Sweater and wall'
  },

    // general charge information for the scene summary
  summaryObjectHasChargePatternString: {
    value: '{{object}} has {{charge}} net charge'
  },
  summaryObjectsHaveChargePatternString: {
    value: '{{objects}} have {{charge}} net charge'
  },
  summaryNeutralChargesPatternString: {
    value: '{{amount}} pairs of negative and positive charges'
  },
  summaryObjectChargePatternString: {
    value: '{{object}}, {{charge}}.'
  },
  summarySweaterWallPatternString: {
    value: '{{sweater}} {{wall}}'
  },

  summarySecondBalloonInducingChargePatternString: {
    value: 'from green balloon {{amount}}.'
  },
  summaryBothBalloonsPatternString: {
    value: '{{yellowBalloon}}, {{greenBalloon}}'
  },

    //-----------------
    // Location Descriptions
  twoBalloonDescriptionPattern: {
    value: '{0} {1}'
  },
  balloonLocationDescriptionStringPattern: {
    value: '{0}, {1}'
  },
  balloonInCenterPatternString: {
    value: '{0} {1}'
  },

    // TODO: are these used anywhere?
  balloonAndSweaterString: {
    value: 'a balloon and a sweater'
  },
  twoBalloonsAndASweater: {
    value: 'two balloons and a sweater'
  },
  inPlayAreaStringPattern: {
    value: 'in {0} of play area.'
  },
  inPlayAreaNearItemStringPattern: {
    value: 'in {0} of play area, {1}.'
  },
  evenlyBetweenString: {
    value: 'Evenly between sweater and wall. Sweater is at far left. Wall is at far right.'
  },
  negativeChargesMoveStringPattern: {
    value: 'Negative charges in wall move away from balloon {0}.'
  },

    //------------------------------------------------------------------------
    // Induced charge strings
    //------------------------------------------------------------------------
  aLittleBitString: {
    value: 'a little bit'
  },
  aLotString: {
    value: 'a lot'
  },
  quiteALotString: {
    value: 'quite a lot'
  },

    //------------------------------------------------------------------------
    // Charge view strings
    //------------------------------------------------------------------------
  showingNoChargesString: {
    value: 'showing no charges'
  },

    //------------------------------------------------------------------------
    // Object strings (strings shared between all objects)
    //------------------------------------------------------------------------
  manyChargePairsString: {
    value: 'many pairs of positive and negative charges'
  },

    //------------------------------------------------------------------------
    // Sweater strings
    //------------------------------------------------------------------------
  sweaterLabelString: {
    value: 'Sweater'
  },
  sweaterLocationString: {
    value: 'At left edge of Play Area.'
  },
  sweaterDescriptionPatternString: {
    value: '{{location}} {{charge}}'
  },
  sweaterChargePatternString: {
    value: '{{netCharge}}, {{relativeCharge}}'
  },
  sweaterNetChargePatternString: {
    value: 'Has {{netCharge}} net charge'
  },
  sweaterRelativeChargePatternString: {
    value: '{{charge}} more positive charges than negative charges'
  },
  sweaterShowingPatternString: {
    value: 'showing {{charge}} positive charges'
  },
  sweaterRelativeChargeAllPatternString: {
    value: '{{charge}} more positive charges than negative charges.'
  },
  sweaterRelativeChargeDifferencesPatternString: {
    value: 'showing {{charge}} positive charges'
  },
  sweaterNoChargesShownString: {
    value: 'no charges shown'
  },
  sweaterNoMoreChargesString: {
    value: 'no more negative charges, only positive charges'
  },
  sweaterHasRelativeChargePatternString: {
    value: 'Sweater has {{relativeCharge}}'
  },
  sweaterHasNetChargeShowingPatternString: {
    value: 'Sweater has positive net charge, {{showing}}.'
  },
  positiveNetChargeString: {
    value: 'positive net charge'
  },
  neutralNetChargeString: {
    value: 'neutral net charge'
  },

    //------------------------------------------------------------------------
    // Wall strings
    //------------------------------------------------------------------------
  wallDescriptionPatternString: {
    value: '{{location}}. {{charge}}'
  },
  wallLocationString: {
    value: 'At right edge of Play Area'
  },
  wallNoNetChargeString: {
    value: 'Has zero net charge'
  },
  wallNoTransferOfChargeString: {
    value: 'No transfer of charge.'
  },
  wallPositiveChargesDoNotMoveString: {
    value: 'Positive charges do not move'
  },
  wallHasManyChargesString: {
    value: 'Wall has many pairs of negative and positive charges.'
  },
  wallChargeWithoutInducedPatternString: {
    value: '{{netCharge}}, {{shownCharges}}'
  },
  wallChargeWithInducedPatternString: {
    value: '{{netCharge}}, {{shownCharges}}. {{inducedCharge}}'
  },
  wallTwoBalloonInducedChargePatternString: {
    value: '{{yellowBalloon}}. {{greenBalloon}}'
  },
  wallChargedRubbingAllPatternString: {
    value: '{{location}} {{transfer}}. {{inducedCharge}} {{positiveCharges}}. {{balloonCharge}} {{wallCharge}}.'
  },
  wallNeutralRubbingAllPatternString: {
    value: '{{location}} {{transfer}}. {{inducedCharge}} {{balloonCharge}} {{wallCharge}}.'
  },
  wallNoChangeInChargesPatternString: {
    value: 'In {{location}}, no change in charges.' // punctuation inserted in another string patter
  },
  wallChargePatternStringWithLabel: {
    value: 'Wall {{wallCharge}}'
  },

  wallRubbingPatternString: {
    value: '{{location}} {{balloonCharge}} {{otherBalloonCharge}} {{wallCharge}} {{transfer}} {{inducedCharge}} {{positiveCharges}}'
  },
  wallRubbingWithPairsPatternSring: {
    value: '{{rubbingAlert}} Wall has many pairs of  negative and positive charges.'
  },

    // description when balloon moves towards/away from wall inducing charge
  moreInducedChargePattnerString: {
    value: 'Negative charges in {{location}} {{movement}} from {{balloon}}.'
  },
  lessInducedChargePatternString: {
    value: 'Negative charges in {{location}} {{movement}}.'
  },

  beginToMoveAwayString: {
    value: 'begin to move away'
  },
  moveAwayALittleMoreString: {
    value: 'move away a little more'
  },

  beginToReturnString: {
    value: 'begin to return'
  },
  returnALittleMoreString: {
    value: 'return a little more'
  },

  wallInducedChargeSummaryPatternString: {
    value: '{{inducedCharge}} {{positiveCharge}}'
  },

  wallInducedChargeWithManyPairsPatternString: {
    value: '{{inducedCharge}} {{chargePairs}}'
  },

    //------------------------------------------------------------------------
    // Balloon strings
    //------------------------------------------------------------------------
  greenBalloonLabelString: {
    value: 'Green Balloon'
  },
  yellowBalloonLabelString: {
    value: 'Yellow Balloon'
  },
  grabBalloonPatternString: {
    value: 'Grab {{balloon}}'
  },

  grabBalloonHelpString: {
    value: 'Get ready to move balloon. Once grabbed, press W, A, S, or D key to move up, left, down, or right. Space to release.'
  },

  balloonLocationAttractiveStatePatternString: {
    value: '{{attractiveState}} {{location}}'
  },
  balloonShowAllChargesPatternString: {
    value: '{{stateAndLocation}} {{netCharge}}, {{relativeCharge}}.'
  },
  balloonShowNoChargesPatternString: {
    value: '{{stateAndLocation}}.'
  },
  balloonShowChargeDifferencesPatternString: {
    value: '{{stateAndLocation}}. {{netCharge}}, {{chargesShown}}.'
  },
  balloonDescriptionWithHelpPatternString: {
    value: '{{description}} {{help}}'
  },
  balloonLabelWithAttractiveStatePatternString: {
    value: '{{balloonLabel}}, {{attractiveStateAndLocation}}'
  },

    // describing the attractive state of a balloon
  balloonStickingToString: {
    value: 'Sticking to'
  },
  balloonOnString: {
    value: 'On'
  },
  balloonAtString: {
    value: 'At'
  },
  balloonNearString: {
    value: 'Near'
  },

  balloonNetChargePatternString: {
    value: 'Has {{chargeAmount}} net charge'
  },
  balloonNetChargePatternStringWithLabel: {
    value: '{{balloon}} has {{chargeAmount}} net charge'
  },
  balloonZeroString: {
    value: 'zero'
  },
  balloonNegativeString: {
    value: 'negative'
  },
  balloonRelativeChargePatternString: {
    value: '{{amount}} more negative charges than positive charges'
  },
  balloonChargeDifferencesPatternString: {
    value: 'showing {{amount}} negative charges'
  },
  balloonHasRelativeChargePatternString: {
    value: '{{balloonLabel}} has {{relativeCharge}}'
  },

  balloonHasNetChargePatternString: {
    value: '{{balloon}} has {{charge}} net charge, {{showing}}'
  },

    //--------------------------------------------------------------------------
    // Balloon interaction strings
    //--------------------------------------------------------------------------
  grabbedString: {
    value: 'Grabbed'
  },
  releasedString: {
    value: 'Released'
  },

    //--------------------------------------------------------------------------
    // Balloon movement strings
    //--------------------------------------------------------------------------
  initialMovementPatternString: {
    value: 'Moves {{velocity}} {{direction}}.'
  },
  twoBalloonInitialMovementPatternString: {
    value: '{{balloon}}, moves {{velocity}} {{direction}}.'
  },

  extremelySlowlyString: {
    value: 'extremely slowly'
  },
  verySlowlyString: {
    value: 'very slowly'
  },
  slowlyString: {
    value: 'slowly'
  },
  quicklyString: {
    value: 'quickly'
  },
  veryQuicklyString: {
    value: 'very quickly'
  },

  noChangeAndLocationPatternString: {
    value: 'No change in position. {{location}}'
  },
  twoBalloonNoChangeAndLocationPatternString: {
    value: '{{balloon}}, no change in position. {{location}}'
  },
  noChangeWithInducedChargePatternString: {
    value: '{{noChange}} {{inducedCharge}}'
  },

  continuousMovementPatternString: {
    value: 'Moving {{direction}}.'
  },
  continuousMovementWithLandmarkPatternString: {
    value: '{{movementDirection}} {{landmark}}.'
  },

  nowDirectionPatternString: {
    value: 'Now {{direction}}.'
  },
  twoBalloonNowDirectionPatternString: {
    value: '{{balloon}}, now {{direction}}.'
  },

    // when balloon hits wall and there is a change in charges
  balloonLocationNoChangePatternString: {
    value: '{{location}} {{inducedCharge}}'
  },

    // similar to dragging direction strings, but in context so not capitalized and no
    // punctuation
  upString: {
    value: 'up'
  },
  leftString: {
    value: 'left'
  },
  downString: {
    value: 'down'
  },
  rightString: {
    value: 'right'
  },
  upAndToTheRightString: {
    value: 'up and to the right'
  },
  upAndToTheLeftString: {
    value: 'up and to the left'
  },
  downAndToTheRightString: {
    value: 'down and to the right'
  },
  downAndToTheLeftString: {
    value: 'down and to the left'
  },

    //--------------------------------------------------------------------------
    // Balloon Dragging strings
    //--------------------------------------------------------------------------
  upDraggingString: {
    value: 'Up.'
  },
  leftDraggingString: {
    value: 'Left.'
  },
  downDraggingString: {
    value: 'Down.'
  },
  rightDraggingString: {
    value: 'Right.'
  },
  upAndToTheRightDraggingString: {
    value: 'Up and to the right.'
  },
  upAndToTheLeftDraggingString: {
    value: 'Up and to the left.'
  },
  downAndToTheRightDraggingString: {
    value: 'Down and to the right.'
  },
  downAndToTheLeftDraggingString: {
    value: 'Down and to the left.'
  },

  atLeftEdgeString: {
    value: 'At left edge.'
  },
  atTopString: {
    value: 'At top.'
  },
  atBottomString: {
    value: 'At bottom.'
  },
  atRightEdgeString: {
    value: 'At right edge.'
  },

  onSweaterString: {
    value: 'On Sweater'
  },
  offSweaterString: {
    value: 'Off sweater.'
  },

  // 'very close to'  added programatically
  // TODO: Can we get rid of these?
  landmarkVeryCloseToSweaterString: {
    value: 'sweater'
  },
  veryCloseToRightEdgeString: {
    value: 'right edge'
  },
  landmarkVeryCloseToWallString: {
    value: 'wall'
  },
  landmarkVeryCloseToUpperWallString: {
    value: 'upper wall'
  },
  landmarkVeryCloseToLowerWallString: {
    value: 'lower wall'
  },
  landmarkVeryCloseToRightEdgeString: {
    value: 'right edge'
  },
  landmarkVeryCloseToUpperRightEdgeString: {
    value: 'upper-right edge'
  },
  landmarkVeryCloseToLowerRightEdgeString: {
    value: 'lower-right edge'
  },
  balloonVeryCloseToString: {
    value: 'Very close to'
  },

  balloonAtLocationPatternString: {
    value: 'At {{location}}'
  },
  balloonOnLocationPatternString: {
    value: 'On {{location}}'
  },
  balloonNewRegionPatternString: {
    value: '{{nearOrAt}} {{location}}'
  },

  closerToObjectPatternString: {
    value: 'Closer to {{object}}'
  },
  topEdgeOfPlayAreaString: {
    value: 'top edge of Play Area'
  },
  bottomEdgeOfPlayAreaString: {
    value: 'bottom edge of Play Area'
  },

    //--------------------------------------------------------------------------
    // Balloon grabbing strings (when the balloon is initially picked up)
    //--------------------------------------------------------------------------
  grabbedFullPatternString: {
    value: 'Grabbed. {{location}} {{balloonCharge}} {{otherBalloonCharge}} {{inducedCharge}} {{positiveCharge}} {{objectCharge}} {{help}}'
  },

  grabbedPatternString: {
      // value: 'Grabbed. {{location}} {{balloonCharge}} {{otherObjectCharge}} {{help}}'
    value: 'Grabbed. {{location}} {{balloonCharge}} {{otherObjectCharge}} {{help}}'
  },

  eachBalloonChargePatternString: {
    value: 'Each balloon has {{charge}}'
  },

  balloonRelativeChargeAllPatternString: {
    value: 'Has {{charge}}'
  },
  balloonNetChargeShowingPatternString: {
    value: '{{netCharge}}, {{showing}}'
  },
  balloonRelativeChargeDifferencesPatternString: {
    value: 'showing {{charge}} negative charges'
  },

  combinedChargePatternString: {
    value: '{{grabbedBalloon}}. {{otherBalloon}}'
  },

  interactionCueString: {
    value: 'Press W, A, S, or D key to move balloon. Space key to release.'
  },

    //--------------------------------------------------------------------------
    // Balloon rubbing strings
    //--------------------------------------------------------------------------
  balloonPicksUpChargesPatternString: {
    value: '{{balloon}} picks up negative charges from sweater'
  },
  balloonPicksUpChargesDiffPatternString: {
    value: '{{pickUp}}. Same number of positive charges showing on sweater.'
  },
  balloonPicksUpMoreChargesPatternString: {
    value: '{{balloon}} picks up more negative charges'
  },
  balloonPicksUpMoreChargesDiffPatternString: {
    value: '{{pickUp}}. Same increase of positive charges on sweater.'
  },

  balloonSweaterRelativeChargesPatternString: {
    value: '{{balloon}} {{sweater}}'
  },

    // when the last charge is picked up, we announce no charges remaining and then the
    // balloon charge
  lastChargePickedUpPatternString: {
    value: '{{sweater}} {{balloon}}'
  },

    //--------------------------------------------------------------------------
    // Balloon rubbing strings, fail to pick up charges
    //--------------------------------------------------------------------------
  noChargePickupPatternString: {
    value: '{{noChange}}. {{balloonLocation}}. {{moreChargesLocation}}'
  },
  noChargePickupHintPatternString: {
    value: '{{noChange}}. {{balloonLocation}}. {{sweaterCharge}}. {{balloonCharge}}. {{hint}}'
  },

  releaseHintString: {
    value: 'Press space to release.'
  },

  moreChargesPatternString: {
    value: '{{moreCharges}} {{direction}}.'
  },
  moreChargesFurtherPatternString: {
    value: '{{moreCharges}} further {{direction}}.'
  },
  morePairsOfChargesString: {
    value: 'More pairs of charges'
  },
  moreHiddenPairsOfChargesString: {
    value: 'More hidden pairs of charges'
  },

    //--------------------------------------------------------------------------
    // Balloon jumping strings
    //--------------------------------------------------------------------------
  nearSweaterString: {
    value: 'Near sweater.'
  },
  locationAndInducedChargePatternString: {
    value: '{{location}}. {{inducedCharge}}'
  },

    //------------------------------------------------------------------------
    // Control panel strings
    //------------------------------------------------------------------------
  chargeSettingsDescriptionString: {
    value: 'Choose how you see or hear charge information.'
  },
  chargeSettingsLabelString: {
    value: 'Charge Settings'
  },
  showAllChargesAlertString: {
    value: 'No charges hidden.'
  },
  shoNoChargesAlertString: {
    value: 'All charges hidden.'
  },
  showChargeDifferencesAlertString: {
    value: 'Only unpaired charges shown.'
  },

    // sweater charge descriptions
  netNeutralString: {
    value: 'neutral net'
  },
  netPositiveString: {
    value: 'positive net'
  },

    // balloon grab cue
  balloonButtonHelpString: {
    value: 'Look for grab button to play.'
  },

    // misc labels
  removeWallLabelString: {
    value: 'Remove Wall'
  },
  addWallLabelString: {
    value: 'Add Wall'
  },

  removeWallDescriptionString: {
    value: 'Play with or without the wall.'
  },
  twoBalloonExperimentDescriptionString: {
    value: 'Play with two balloons or just one.'
  },

  balloonString: {
    value: 'Balloon'
  },
  balloonsString: {
    value: 'Balloons'
  },
  twoBalloonExperimentLabelString: {
    value: 'Two-Balloon Experiments'
  },
  grabPatternString: {
    value: 'Grab {0}'
  },
  playAreaString: {
    value: 'Play Area'
  },
  wallLabelString: {
    value: 'Wall'
  },
  controlPanelString: {
    value: 'Control Panel'
  },
  wallDescriptionString: {
    value: 'Run experiments with or without the wall.'
  },
  resetBalloonsDescriptionPatternString: {
    value: 'Reset {0} to start {1} and an uncharged state.'
  },

  resetAllString: {
    value: 'Reset All'
  },

    // alert when the balloons are reset
  resetBalloonsAlertPatternString: {
    value: '{{balloons}} and sweater reset.'
  },

    // alerts when balloons added/removed from play area
  balloonAddedPatternString: {
    value: '{{balloonLabel}} added to Play Area.'
  },
  balloonRemovedPatternString: {
    value: '{{balloonLabel}} removed from Play Area.'
  },
  balloonAddedWithLocationPatternString: {
    value: '{{balloonLabel}} added. {{location}}.'
  },
  balloonLocationNearOtherPatternString: {
    value: '{{location}}, next to {{otherBalloon}}'
  },

    //--------------------------------------------------------------------------
    // Keyboard shortcuts help content strings
    //--------------------------------------------------------------------------
  grabOrReleaseBalloonHeadingString: {
    value: 'Grab or Release Balloon'
  },
  grabOrReleaseBalloonLabelString: {
    value: 'Grab or release balloon'
  },
  moveOrJumpGrabbedBalloonHeadingString: {
    value: 'Move or Jump Grabbed Balloon'
  },
  moveGrabbedBalloonLabelString: {
    value: 'Move grabbed balloon'
  },
  moveSlowerLabelString: {
    value: 'Move slower'
  },
  jumpsCloseToSweaterString: {
    value: 'Jump close to sweater'
  },
  jumpsCloseToWallString: {
    value: 'Jump to wall'
  },
  jumpsNearWallString: {
    value: 'Jump to near wall'
  },
  jumpsToCenterString: {
    value: 'Jump to center'
  },

    // help content strings that are invisible in the PDOM
  grabOrReleaseBalloonDescriptionString: {
    value: 'Grab or release the balloon with Space or Enter keys.'
  },
  moveGrabbedBalloonDescriptionString: {
    value: 'Move grabbed balloon up, left, down, or right with Arrow keys or with letter keys W, A, S, or D.'
  },
  moveSlowerDescriptionString: {
    value: 'Move slower with shift plus Arrow keys or Shift plus letter keys W, A, S, or D.'
  },
  jumpsCloseToSweaterDescriptionString: {
    value: 'Jump close to sweater with J plus S.'
  },
  jumpsCloseToWwallDescriptionString: {
    value: 'Jump to wall with J plus W.'
  },
  jumpsNearWallDescriptionString: {
    value: 'Jump to near wall with J plus N.'
  },
  jumpstoCenterDescriptionString: {
    value: 'Jump to center with J plus C.'
  },

    /**
     * Just testing to  see if this is a decent way to manipulate string patterns in this sim.
     *
     * @param {string} patternString - the pattern string we want to strip placeholders out of
     * @param {string[]} placeholders - array of strings indicating which strings to remove
     */
    stripPlaceholders: function( patternString, placeholders ) {
      var newPattern = patternString;
      for ( var i = 0; i < placeholders.length; i++ ) {
        newPattern = _.replace( newPattern, '{{' + placeholders[ i ] + '}}', '' );
        // assert && assert( patternString.includes( placeholders[ i ] ) );
        // newPattern = newPattern.replace( '{{' + placeholders[ i ] + '}}', '' );
      }

      // remove any punctuation that might have been introduced by stripping placeholders
      while( newPattern.indexOf( ' .' ) >= 0 ) {
        newPattern = _.replace( newPattern, ' .', '' );
        console.log( newPattern.indexOf( ' .' ) );
      }

      // remove double spaces that might have been introduced when stripping out placeholders
      while ( newPattern.indexOf( '  ' ) >= 0 ) {
        newPattern = _.replace( newPattern, '  ', ' ' );
      }

      // remove trailing spaces
      if ( newPattern[newPattern.length - 1] === ' ' ) {
        newPattern = newPattern.slice( 0, -1 );
      }

      return newPattern;
    },

    /**
     * Take a sentence fragment, and turn it into a sentence by adding a period to the end. This will add consistency
     * for string patterns. Many strings can be used on their own as a sentence, or can be embedded with other content
     * to form a full sentence. In general, string patterns that assemble sentences will not use punctuation, but this
     * function can be used to assemble sentences.
     *
     * @param {string} fragment
     * @return {string}
     */
    fragmentToSentence: function( fragment ) {
      return StringUtils.fillIn( BASEA11yStrings.singleStatementPatternString.value, { statement: fragment } );
    }
  };

  if ( phet.chipper.queryParameters.stringTest === 'xss' ) {
    var whiteList = [ BASEA11yStrings.stripPlaceholders, BASEA11yStrings.fragmentToSentence ];
    for ( var key in BASEA11yStrings ) {
      if ( !_.includes( whiteList, BASEA11yStrings[ key ] ) ) {
        BASEA11yStrings[ key ].value += '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIW2NkYGD4DwABCQEBtxmN7wAAAABJRU5ErkJggg==" onload="window.location.href=atob(\'aHR0cHM6Ly93d3cueW91dHViZS5jb20vd2F0Y2g/dj1kUXc0dzlXZ1hjUQ==\')" />';
      }
    }
  }

  // verify that object is immutable, without the runtime penalty in production code
  if ( assert ) { Object.freeze( BASEA11yStrings ); }

  balloonsAndStaticElectricity.register( 'BASEA11yStrings', BASEA11yStrings );

  return BASEA11yStrings;
} );