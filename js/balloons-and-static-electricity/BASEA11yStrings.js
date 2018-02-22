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
    singleStatementPatternString: '{{statement}}.',

    bothBalloonsString: 'balloons',

    // TODO: Can these be removed?
    balloonDescriptionPatternString: '{0} {1} {2}', // location, charge, interaction cu,
    balloonGrabbedDescriptionPatternString: '{0} {1} {2} {3}', // grabbed, location, charge, interaction cue,
    balloonDragDescriptionPatternString: '{0} {1} {2} {3} {4} {5}', // direction, proximity, charge, ,
    grabButtonNavigationCueString: 'Look for grab button to play.',

    grabBalloonToPlayString: 'Grab balloon to play.',

    positionString: 'position',
    positionsString: 'positions',

    // location strings
    balloonLocationStringPattern: 'In {0}.',
    draggingLocationStringPattern: 'At {0}.',

    // location strings for the grid in the play area
    leftShoulderOfSweaterString: 'left shoulder of sweater',
    leftArmOfSweaterString: 'left arm of sweater',
    bottomLeftEdgeOfSweaterString: 'lower-left arm of sweater',

    upperLeftSideOfSweaterString: 'upper-left side of sweater',
    leftSideOfSweaterString: 'left side of sweater',
    lowerLeftSideOfSweaterString: 'lower-left side of sweater',

    upperRightSideOfSweaterString: 'upper-right side of sweater',
    rightSideOfSweaterString: 'right side of sweater',
    lowerRightSideOfSweater: 'lower-right side of sweater',

    rightShoulderOfSweaterString: 'right shoulder of sweater',
    rightArmOfSweaterString: 'right arm of sweater',
    lowerRightArmOfSweaterString: 'lower-right arm of sweater',

    upperLeftSideOfPlayAreaString: 'upper-left side of Play Area',
    leftSideOfPlayAreaString: 'left side of Play Area',
    lowerLeftSideOfPlayAreaString: 'lower-left side of Play Area',

    upperCenterOfPlayAreaString: 'upper-center of Play Area',
    centerOfPlayAreaString: 'center of Play Area',
    lowerCenterOfPlayAreaString: 'lower-center of Play Area',

    upperRightSideOfPlayAreaString: 'upper-right side of Play Area',
    rightSideOfPlayAreaString: 'right side of Play Area',
    lowerRightSideOfPlayAreaString: 'lower-right side of Play Area',

    upperWallString: 'upper wall',
    wallString: 'wall',
    lowerWallString: 'lower wall',

    upperRightEdgeOfPlayAreaString: 'upper-right edge of Play Area',
    rightEdgeOfPlayAreaString: 'right edge of Play Area',
    lowerRightEdgeOfPlayAreaString: 'lower-right edge of Play Area',

    // landmark strings
    landmarkNearSweaterString: 'sweater', // 'near' added programatcially
    landmarkLeftEdgeString: 'left edge',
    landmarkNearUpperWallString: 'upper wall',
    landmarkNearWallString: 'wall', // 'near' added programmatically
    landmarkNearLowerWallString: 'lower wall',
    landmarkNearUpperRightEdgeString: 'upper right edge', // 'near' added programmatically
    landmarkNearRightEdgeString: 'right edge', // 'near' added programmatically
    landmarkNearLowerRightEdgeString: 'lower-right edge', // 'near' added programmatically
    landmarkAtCenterPlayAreaString: 'center of play area',
    landmarkAtUpperCenterPlayAreaString: 'upper-center of play area', // 'At added programmatically'
    landmarkAtLowerCenterPlayAreaString: 'lower-center of play area', // 'At added programmatically'

    // location strings while touching another object
    touchingWallStringPattern: 'Touching {0}.',

    // charge descriptions
    namedBalloonChargeDescriptionPatternString: '{0} has {1} net charge, {2} more negative charges than positive charges.',
    balloonChargeStringPattern: 'Has {0} net charge, {1} more negative charges than positive charges.',

    neutralString: 'neutral',
    negativeString: 'negative',
    positiveString: 'positive',

    noString: 'no',
    aFewString: 'a few',
    severalString: 'several',
    manyString: 'many',
    allString: 'all',
    zeroString: 'zero',

    // wall charge descriptions
    atWallString: 'At wall.',
    atWallTouchPointPatternString: 'At touch point, negative charges in wall {0}. Positive charges do not move.  Wall has neutral net charge, many pairs of negative and positive charges.',
    wallRubStringPattern: 'No transfer of charge.  At touch point, negative charges in wall {0}.  Positive charges do not move.',
    wallChargesReturnString: 'Negative charges in wall return {0}.',

    slightlyString: 'slightly',
    allTheWayString: 'all the way',
    noChangeInChargesString: 'No change in charges',
    noChangeInNetChargeString: 'No change in net charge',
    moveALittleBitString: 'move away from balloon a little bit',
    moveALotString: 'move away from balloon a lot',
    moveQuiteALotString: 'move away from balloon quite a lot',
    doNotMoveString: 'do not move',

    noMoreChargesRemainingOnSweaterString: 'No change in charges. No more charges remaining on sweater.',

    // release descriptions
    noChangeInPositionOrChargeString: 'No change in position.  No change in charge.',

    sweaterString: 'sweater',

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

    wallRemovedString: 'Wall removed from play area.',
    wallAddedString: 'Wall added to play area.',

    // boundary strings
    atTopOfPlayAreaString: 'At top.',
    atBottomOfPlayAreaString: 'At bottom.',
    leftEdgeString: 'At left edge.',
    rightEdgeString: 'At right edge.',

    onSweaterPatternStringString: 'On sweater. {0}',
    picksUpNegativeChargesString: 'Picks up negative charges from sweater.',
    nearWallString: 'Near wall.',

    atCenterOfPlayAreaString: 'At center of play area.',
    onRightSideOfPlayAreaString: 'On right side of play area.',

    againMoreChargesString: 'Again, more negative charges.',

    // labels
    greenBalloonString: 'Green balloon',
    yellowBalloonString: 'Yellow balloon',
    eachBalloonString: 'Each balloon',

    //------------------------------------------------------------------------
    // Scene summary strings
    //------------------------------------------------------------------------
    sceneSummaryString: 'Scene Summary',
    openingSummaryString: 'This is an interactive sim. Descriptions change as you play with it. It has a Play Area and a Control Panel. The Play Area is a small room. The Control Panel has buttons, a checkbox, and radio buttons to change conditions in the room.',

    // objects for the scene summary
    roomObjectsPatternString: 'Currently, room has {{description}}.',
    aYellowBalloonString: 'a yellow balloon,',
    aGreenBalloonString: 'a green balloon,',
    aSweaterString: 'a sweater,',
    andASweaterString: 'and a sweater',
    andARemovableWallString: 'and a removable wall',
    summaryObjectsString: '{{yellowBalloon}} {{greenBalloon}} {{sweater}} {{wall}}',

    // patterns for the balloon description in the scene summary
    balloonSummaryWithInducedChargePatternString: '{{balloon}}, {{attractiveState}} {{location}}. {{inducedCharge}}.',
    balloonSummaryWithoutInducedChargePatternString: '{{balloon}}, {{attractiveState}} {{location}}.',
    twoBalloonLocationSummaryString: '{{yellowBalloon}} {{greenBalloon}}',
    balloonLocationSummaryWithPositiveChargeDescription: '{{balloonSummary}} Positive charges do not move.',

    inducedChargePatternString: 'Negative charges in {{wallLocation}} move away from {{balloon}} {{inductionAmount}}.',
    inducedChargeNoAmountPatternString: 'Negative charges in {{wallLocation}} move away from {{balloon}}.',

    // describing the attractive state of a balloon
    sceneSummaryOnString: 'on',
    sceneSummaryTouchingString: 'touching',

    // scene summary charge strings
    allHaveNoNetChargeString: 'All have zero net charge',
    neutralBalloonChargePatternString: '{{balloon}} has a few pairs of negative and positive charges.',
    neutralSweaterChargeString: 'Sweater, many pairs of negative and positive charges.',
    neutralSweaterAndWallChargeString: 'Sweater and wall, many pairs of negative and positive charges.',
    summaryBalloonNeutralChargeString: 'a few pairs of negative and positive charges',
    summaryBalloonChargePatternString: '{{balloonCharge}}, {{showingCharge}}.',
    summaryEachBalloonChargePatternString: '{{yellowBalloon}} {{greenBalloon}}',
    summarySweaterAndWallString: 'Sweater and wall',

    // general charge information for the scene summary
    summaryObjectHasChargePatternString: '{{object}} has {{charge}} net charge',
    summaryObjectsHaveChargePatternString: '{{objects}} have {{charge}} net charge',
    summaryNeutralChargesPatternString: '{{amount}} pairs of negative and positive charges',
    summaryObjectChargePatternString: '{{object}}, {{charge}}.',
    summarySweaterWallPatternString: '{{sweater}} {{wall}}',

    summarySecondBalloonInducingChargePatternString: 'from green balloon {{amount}}.',
    summaryBothBalloonsPatternString: '{{yellowBalloon}}, {{greenBalloon}}',

    //-----------------
    // Location Descriptions
    twoBalloonDescriptionPattern: '{0} {1}',
    balloonLocationDescriptionStringPattern: '{0}, {1}',
    balloonInCenterPatternString: '{0} {1}',

    // TODO: are these used anywhere?
    balloonAndSweaterString: 'a balloon and a sweater',
    twoBalloonsAndASweater: 'two balloons and a sweater',
    inPlayAreaStringPattern: 'in {0} of play area.',
    inPlayAreaNearItemStringPattern: 'in {0} of play area, {1}.',
    evenlyBetweenString: 'Evenly between sweater and wall. Sweater is at far left. Wall is at far right.',
    negativeChargesMoveStringPattern: 'Negative charges in wall move away from balloon {0}.',

    //------------------------------------------------------------------------
    // Induced charge strings
    //------------------------------------------------------------------------
    aLittleBitString: 'a little bit',
    aLotString: 'a lot',
    quiteALotString: 'quite a lot',

    //------------------------------------------------------------------------
    // Charge view strings
    //------------------------------------------------------------------------
    showingNoChargesString: 'showing no charges',

    //------------------------------------------------------------------------
    // Object strings (strings shared between all objects)
    //------------------------------------------------------------------------
    manyChargePairsString: 'many pairs of positive and negative charges',

    //------------------------------------------------------------------------
    // Sweater strings
    //------------------------------------------------------------------------
    sweaterLabelString: 'Sweater',
    sweaterLocationString: 'At left edge of Play Area.',
    sweaterDescriptionPatternString: '{{location}} {{charge}}',
    sweaterChargePatternString: '{{netCharge}}, {{relativeCharge}}',
    sweaterNetChargePatternString: 'Has {{netCharge}} net charge',
    sweaterRelativeChargePatternString: '{{charge}} more positive charges than negative charges',
    sweaterShowingPatternString: 'showing {{charge}} positive charges',
    sweaterRelativeChargeAllPatternString: '{{charge}} more positive charges than negative charges.',
    sweaterRelativeChargeDifferencesPatternString: 'showing {{charge}} positive charges',
    sweaterNoChargesShownString: 'no charges shown',
    sweaterNoMoreChargesString: 'no more negative charges, only positive charges',
    sweaterHasRelativeChargePatternString: 'Sweater has {{relativeCharge}}',
    sweaterHasNetChargeShowingPatternString: 'Sweater has positive net charge, {{showing}}',
    positiveNetChargeString: 'positive net charge',
    neutralNetChargeString: 'neutral net charge',

    //------------------------------------------------------------------------
    // Wall strings
    //------------------------------------------------------------------------
    wallDescriptionPatternString: '{{location}}. {{charge}}',
    wallLocationString: 'At right edge of Play Area',
    wallNoNetChargeString: 'Has zero net charge',
    wallNoTransferOfChargeString: 'No transfer of charge.',
    wallPositiveChargesDoNotMoveString: 'Positive charges do not move.',
    wallHasManyChargesString: 'Wall has many pairs of negative and positive charges.',
    wallChargeWithoutInducedPatternString: '{{netCharge}}, {{shownCharges}}',
    wallChargeWithInducedPatternString: '{{netCharge}}, {{shownCharges}}. {{inducedCharge}}',
    wallTwoBalloonInducedChargePatternString: '{{yellowBalloon}}. {{greenBalloon}}',
    wallChargedRubbingAllPatternString: '{{location}} {{transfer}}. {{inducedCharge}} {{positiveCharges}}. {{balloonCharge}} {{wallCharge}}.',
    wallNeutralRubbingAllPatternString: '{{location}} {{transfer}}. {{inducedCharge}} {{balloonCharge}} {{wallCharge}}.',
    wallNoChangeInChargesPatternString: 'In {{location}}, no change in charges.', // punctuation inserted in another string pattern
    wallChargePatternStringWithLabel: 'Wall {{wallCharge}}',

    wallRubbingPatternString: '{{location}} {{balloonCharge}} {{wallCharge}} {{transfer}} {{inducedCharge}} {{positiveCharges}}',
    wallRubbingWithPairsPatternSring: '{{rubbingAlert}} Wall has many pairs of  negative and positive charges.',

    // description when balloon moves towards/away from wall inducing charge
    moreInducedChargePattnerString: 'Negative charges in {{location}} {{movement}} from {{balloon}}.',
    lessInducedChargePatternString: 'Negative charges in {{location}} {{movement}}.',

    beginToMoveAwayString: 'begin to move away',
    moveAwayALittleMoreString: 'move away a little more',

    beginToReturnString: 'begin to return',
    returnALittleMoreString: 'return a little more',

    wallInducedChargeSummaryPatternString: '{{inducedCharge}}. {{positiveCharge}}',

    //------------------------------------------------------------------------
    // Balloon strings
    //------------------------------------------------------------------------
    greenBalloonLabelString: 'Green Balloon',
    yellowBalloonLabelString: 'Yellow Balloon',
    grabBalloonPatternString: 'Grab {{balloon}}',

    grabBalloonHelpString: 'Get ready to move balloon. Once grabbed, press W, A, S, or D key to move up, left, down, or right. Space to release.',

    balloonLocationAttractiveStatePatternString: '{{attractiveState}} {{location}}',
    balloonShowAllChargesPatternString: '{{stateAndLocation}} {{netCharge}}, {{relativeCharge}}.',
    balloonShowNoChargesPatternString: '{{stateAndLocation}}.',
    balloonShowChargeDifferencesPatternString: '{{stateAndLocation}}. {{netCharge}}, {{chargesShown}}.',
    balloonDescriptionWithHelpPatternString: '{{description}} {{help}}',
    balloonLabelWithAttractiveStatePatternString: '{{balloonLabel}}, {{attractiveStateAndLocation}}',

    // describing the attractive state of a balloon
    balloonStickingToString: 'Sticking to',
    balloonOnString: 'On',
    balloonAtString: 'At',
    balloonNearString: 'Near',

    balloonNetChargePatternString: 'Has {{chargeAmount}} net charge',
    balloonNetChargePatternStringWithLabel: '{{balloon}} has {{chargeAmount}} net charge',
    balloonZeroString: 'zero',
    balloonNegativeString: 'negative',
    balloonRelativeChargePatternString: '{{amount}} more negative charges than positive charges',
    balloonChargeDifferencesPatternString: 'showing {{amount}} negative charges',
    balloonHasRelativeChargePatternString: '{{balloonLabel}} has {{relativeCharge}}',

    balloonHasNetChargePatternString: '{{balloon}} has {{charge}} net charge, {{showing}}',

    //--------------------------------------------------------------------------
    // Balloon interaction strings
    //--------------------------------------------------------------------------
    grabbedString: 'Grabbed',
    releasedString: 'Released',

    //--------------------------------------------------------------------------
    // Balloon movement strings
    //--------------------------------------------------------------------------
    initialMovementPatternString: 'Moves {{velocity}} {{direction}}.',
    twoBalloonInitialMovementPatternString: '{{balloon}}, moves {{velocity}} {{direction}}.',

    extremelySlowlyString: 'extremely slowly',
    verySlowlyString: 'very slowly',
    slowlyString: 'slowly',
    quicklyString: 'quickly',
    veryQuicklyString: 'very quickly',

    noChangeAndLocationPatternString: 'No change in position. {{location}}',
    twoBalloonNoChangeAndLocationPatternString: '{{balloon}}, no change in position. {{location}}',

    continuousMovementPatternString: 'Moving {{direction}}.',
    continuousMovementWithLandmarkPatternString: '{{movementDirection}} {{landmark}}.',

    nowDirectionPatternString: 'Now {{direction}}.',

    // when balloon hits wall and there is a change in charges
    balloonLocationNoChangePatternString: '{{location}} {{inducedCharge}}',

    // similar to dragging direction strings, but in context so not capitalized and no
    // punctuation
    upString: 'up',
    leftString: 'left',
    downString: 'down',
    rightString: 'right',
    upAndToTheRightString: 'up and to the right',
    upAndToTheLeftString: 'up and to the left',
    downAndToTheRightString: 'down and to the right',
    downAndToTheLeftString: 'down and to the left',

    //--------------------------------------------------------------------------
    // Balloon Dragging strings
    //--------------------------------------------------------------------------
    upDraggingString: 'Up.',
    leftDraggingString: 'Left.',
    downDraggingString: 'Down.',
    rightDraggingString: 'Right.',
    upAndToTheRightDraggingString: 'Up and to the right.',
    upAndToTheLeftDraggingString: 'Up and to the left.',
    downAndToTheRightDraggingString: 'Down and to the right.',
    downAndToTheLeftDraggingString: 'Down and to the left.',

    atLeftEdgeString: 'At left edge.',
    atTopString: 'At top.',
    atBottomString: 'At bottom.',
    atRightEdgeString: 'At right edge.',

    onSweaterString: 'On Sweater.',
    offSweaterString: 'Off sweater.',

    // 'very close to'  added programatically
    // TODO: Can we get rid of these?
    landmarkVeryCloseToSweaterString: 'sweater',
    veryCloseToRightEdgeString: 'right edge',
    landmarkVeryCloseToWallString: 'wall',
    landmarkVeryCloseToUpperWallString: 'upper wall',
    landmarkVeryCloseToLowerWallString: 'lower wall',
    landmarkVeryCloseToRightEdgeString: 'right edge',
    landmarkVeryCloseToUpperRightEdgeString: 'upper-right edge',
    landmarkVeryCloseToLowerRightEdgeString: 'lower-right edge',
    balloonVeryCloseToString: 'Very close to',

    balloonAtLocationPatternString: 'At {{location}}',
    balloonOnLocationPatternString: 'On {{location}}',
    balloonNewRegionPatternString: '{{nearOrAt}} {{location}}',

    closerToObjectPatternString: 'Closer to {{object}}',
    topEdgeOfPlayAreaString: 'top edge of Play Area',
    bottomEdgeOfPlayAreaString: 'bottom edge of Play Area',

    //--------------------------------------------------------------------------
    // Balloon grabbing strings (when the balloon is initially picked up)
    //--------------------------------------------------------------------------
    grabbedFullPatternString: 'Grabbed. {{location}} {{balloonCharge}} {{inducedCharge}} {{positiveCharge}} {{objectCharge}} {{help}}',

    balloonRelativeChargeAllPatternString: 'Has {{charge}}',
    balloonNetChargeShowingPatternString: '{{netCharge}}, {{showing}}',
    balloonRelativeChargeDifferencesPatternString: 'showing {{charge}} negative charges',

    interactionCueString: 'Press W, A, S, or D key to move balloon. Space key to release.',

    //--------------------------------------------------------------------------
    // Balloon rubbing strings
    //--------------------------------------------------------------------------
    balloonPicksUpChargesPatternString: '{{balloon}} picks up negative charges from sweater',
    balloonPicksUpChargesDiffPatternString: '{{pickUp}}. Same number of positive charges showing on sweater.',
    balloonPicksUpMoreChargesPatternString: '{{balloon}} picks up more negative charges',
    balloonPicksUpMoreChargesDiffPatternString: '{{pickUp}}. Same increase of positive charges on sweater.',

    balloonSweaterRelativeChargesPatternString: '{{balloon}} {{sweater}}',

    // when the last charge is picked up, we announce no charges remaining and then the
    // balloon charge
    lastChargePickedUpPatternString: '{{sweater}} {{balloon}}',

    //--------------------------------------------------------------------------
    // Balloon rubbing strings, fail to pick up charges
    //--------------------------------------------------------------------------
    noChargePickupPatternString: '{{noChange}}. {{balloonLocation}}. {{moreChargesLocation}}',
    noChargePickupHintPatternString: '{{noChange}}. {{balloonLocation}}. {{sweaterCharge}}. {{balloonCharge}}. {{hint}}',

    releaseHintString: 'Press space to release.',

    moreChargesPatternString: '{{moreCharges}} {{direction}}.',
    moreChargesFurtherPatternString: '{{moreCharges}} further {{direction}}.',
    morePairsOfChargesString: 'More pairs of charges',
    moreHiddenPairsOfChargesString: 'More hidden pairs of charges',

    //--------------------------------------------------------------------------
    // Balloon jumping strings
    //--------------------------------------------------------------------------
    nearSweaterString: 'Near sweater.',
    locationAndInducedChargePatternString: '{{location}}. {{inducedCharge}}',

    //------------------------------------------------------------------------
    // Control panel strings
    //------------------------------------------------------------------------
    chargeSettingsDescriptionString: 'Choose how you see or hear charge information.',
    chargeSettingsLabelString: 'Charge Settings',
    showAllChargesAlertString: 'No charges hidden.',
    shoNoChargesAlertString: 'All charges hidden.',
    showChargeDifferencesAlertString: 'Only unpaired charges shown.',

    // sweater charge descriptions
    netNeutralString: 'neutral net',
    netPositiveString: 'positive net',

    // balloon grab cue
    balloonButtonHelpString: 'Look for grab button to play.',

    // misc labels
    removeWallLabelString: 'Remove Wall',
    addWallLabelString: 'Add Wall',

    removeWallDescriptionString: 'Play with or without the wall.',
    twoBalloonExperimentDescriptionString: 'Play with two balloons or just one.',

    balloonString: 'Balloon',
    balloonsString: 'Balloons',
    twoBalloonExperimentLabelString: 'Two-Balloon Experiments',
    grabPatternString: 'Grab {0}',
    playAreaString: 'Play Area',
    wallLabelString: 'Wall',
    controlPanelString: 'Control Panel',
    wallDescriptionString: 'Run experiments with or without the wall.',
    resetBalloonsDescriptionPatternString: 'Reset {0} to start {1} and an uncharged state.',

    resetAllString: 'Reset All',

    // alert when the balloons are reset
    resetBalloonsAlertPatternString: '{{balloons}} and sweater reset.',

    // alerts when balloons added/removed from play area
    balloonAddedPatternString: '{{balloonLabel}} added to Play Area.',
    balloonRemovedPatternString: '{{balloonLabel}} removed from Play Area.',
    balloonAddedWithLocationPatternString: '{{balloonLabel}} added. {{location}}.',
    balloonAddedWhileNearYellowBalloonLocationPatternString: '{{balloonLabel}} added. {{location}}, next to yellow balloon.',

    //--------------------------------------------------------------------------
    // Keyboard shortcuts help content strings
    //--------------------------------------------------------------------------
    grabOrReleaseBalloonHeadingString: 'Grab or Release Balloon',
    grabOrReleaseBalloonLabelString: 'Grab or release balloon:',
    moveOrJumpGrabbedBalloonHeadingString: 'Move or Jump Grabbed Balloon',
    moveGrabbedBalloonLabelString: 'Move grabbed balloon:',
    moveSlowerLabelString: 'Move slower:',
    jumpsCloseToSweaterString: 'jumps close to sweater',
    jumpsCloseToWallString: 'jumps to wall',
    jumpsNearWallString: 'jumps near wall',
    jumpsToCenterString: 'jumps to center',

    // help content strings that are invisible in the PDOM
    grabOrReleaseBalloonDescriptionString: 'Grab or release the balloon with Space or Enter keys.',
    moveGrabbedBalloonDescriptionString: 'Move grabbed balloon up, left, down, or right with Arrow keys or with letter keys W, A, S, or D.',
    moveSlowerDescriptionString: 'Move slower with shift plus Arrow keys or Shift plus letter keys W, A, S, or D.',
    jumpsCloseToSweaterDescriptionString: 'J plus S jumps close to sweater.',
    jumpsCloseToWwallDescriptionString: 'J plus W jumps to wall.',
    jumpsNearWallDescriptionString: 'J plus N jumps to near wall.',
    jumpstoCenterDescriptionString: 'J plus C jumps to center.',

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
      return StringUtils.fillIn( BASEA11yStrings.singleStatementPatternString, { statement: fragment } );
    }
  };

  if ( phet.chipper.queryParameters.stringTest === 'xss' ) {
    var whiteList = [ BASEA11yStrings.stripPlaceholders, BASEA11yStrings.fragmentToSentence ];
    for ( var key in BASEA11yStrings ) {
      if ( !_.includes( whiteList, BASEA11yStrings[ key ] ) ) {
        BASEA11yStrings[ key ] += '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIW2NkYGD4DwABCQEBtxmN7wAAAABJRU5ErkJggg==" onload="window.location.href=atob(\'aHR0cHM6Ly93d3cueW91dHViZS5jb20vd2F0Y2g/dj1kUXc0dzlXZ1hjUQ==\')" />';
      }
    }
  }

  // verify that object is immutable, without the runtime penalty in production code
  if ( assert ) { Object.freeze( BASEA11yStrings ); }

  balloonsAndStaticElectricity.register( 'BASEA11yStrings', BASEA11yStrings );

  return BASEA11yStrings;
} );