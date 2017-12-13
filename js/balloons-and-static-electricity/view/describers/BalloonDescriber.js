// Copyright 2016-2017, University of Colorado Boulder

/**
 * This type allows for determining descriptions for the balloon.  Describing the location of the balloon
 * is quite complicated so this distributes the description work so that BalloonNode does not become
 * a massive file.  Used for accessibility.
 *
 * TODO: Bring up to standards, immprove documentation, delete many functions which are now unused.
 *
 * @author Jesse Greenberg
 */

define( function( require ) {
  'use strict';

  // modules
  var BalloonDirectionEnum = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/BalloonDirectionEnum' );
  var BalloonLocationEnum = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/BalloonLocationEnum' );
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );
  var BASEA11yStrings = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/BASEA11yStrings' );
  var BASEConstants = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/BASEConstants' );
  var BASEDescriber = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/describers/BASEDescriber' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PlayAreaMap = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/PlayAreaMap' );
  var Range = require( 'DOT/Range' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var SweaterDescriber = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/describers/SweaterDescriber' );
  var WallDescriber = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/describers/WallDescriber' );

  // strings
  var atWallString = BASEA11yStrings.atWallString;
  var balloonButtonHelpString = BASEA11yStrings.balloonButtonHelpString;
  var balloonStickingToString = BASEA11yStrings.balloonStickingToString;
  var balloonOnString = BASEA11yStrings.balloonOnString;
  var balloonAtString = BASEA11yStrings.balloonAtString;
  var balloonNetChargePatternString = BASEA11yStrings.balloonNetChargePatternString;
  var balloonZeroString = BASEA11yStrings.balloonZeroString;
  var balloonNegativeString = BASEA11yStrings.balloonNegativeString;
  var balloonRelativeChargePatternString = BASEA11yStrings.balloonRelativeChargePatternString;
  var balloonChargeDifferencesPatternString = BASEA11yStrings.balloonChargeDifferencesPatternString;
  var balloonLocationAttractiveStatePatternString = BASEA11yStrings.balloonLocationAttractiveStatePatternString;
  var balloonShowAllChargesPatternString = BASEA11yStrings.balloonShowAllChargesPatternString;
  var balloonDescriptionWithHelpPatternString = BASEA11yStrings.balloonDescriptionWithHelpPatternString;
  var balloonShowNoChargesPatternString = BASEA11yStrings.balloonShowNoChargesPatternString;
  var releasedString = BASEA11yStrings.releasedString;
  var initialMovementPatternString = BASEA11yStrings.initialMovementPatternString;
  var extremelySlowlyString  = BASEA11yStrings.extremelySlowlyString;
  var verySlowlyString = BASEA11yStrings.verySlowlyString;
  var slowlyString = BASEA11yStrings.slowlyString;
  var quicklyString = BASEA11yStrings.quicklyString;
  var veryQuicklyString = BASEA11yStrings.veryQuicklyString;
  var upDraggingString = BASEA11yStrings.upDraggingString;
  var leftDraggingString = BASEA11yStrings.leftDraggingString;
  var downDraggingString = BASEA11yStrings.downDraggingString;
  var rightDraggingString = BASEA11yStrings.rightDraggingString;
  var upAndToTheRightDraggingString = BASEA11yStrings.upAndToTheRightDraggingString;
  var upAndToTheLeftDraggingString = BASEA11yStrings.upAndToTheLeftDraggingString;
  var downAndToTheRightDraggingString = BASEA11yStrings.downAndToTheRightDraggingString;
  var downAndToTheLeftDraggingString = BASEA11yStrings.downAndToTheLeftDraggingString;
  var upString = BASEA11yStrings.upString;
  var leftString = BASEA11yStrings.leftString;
  var downString = BASEA11yStrings.downString;
  var rightString = BASEA11yStrings.rightString;
  var upAndToTheRightString = BASEA11yStrings.upAndToTheRightString;
  var upAndToTheLeftString = BASEA11yStrings.upAndToTheLeftString;
  var downAndToTheRightString = BASEA11yStrings.downAndToTheRightString;
  var downAndToTheLeftString = BASEA11yStrings.downAndToTheLeftString;
  var atLeftEdgeString = BASEA11yStrings.atLeftEdgeString;
  var atTopString = BASEA11yStrings.atTopString;
  var atBottomString = BASEA11yStrings.atBottomString;
  var atRightEdgeString = BASEA11yStrings.atRightEdgeString;
  var onSweaterString = BASEA11yStrings.onSweaterString;
  var offSweaterString = BASEA11yStrings.offSweaterString;  
  var balloonAtLocationPatternString = BASEA11yStrings.balloonAtLocationPatternString;
  var balloonNewRegionPatternString = BASEA11yStrings.balloonNewRegionPatternString;
  var closerToObjectPatternString = BASEA11yStrings.closerToObjectPatternString;
  var sweaterString = BASEA11yStrings.sweaterString;
  var wallString = BASEA11yStrings.wallString;
  var centerOfPlayAreaString = BASEA11yStrings.centerOfPlayAreaString;
  var rightEdgeOfPlayAreaString = BASEA11yStrings.rightEdgeOfPlayAreaString;
  var topEdgeOfPlayAreaString = BASEA11yStrings.topEdgeOfPlayAreaString;
  var bottomEdgeOfPlayAreaString = BASEA11yStrings.bottomEdgeOfPlayAreaString;
  var noChangeInPositionString = BASEA11yStrings.noChangeInPositionString;
  var noChangeAndLocationPatternString = BASEA11yStrings.noChangeAndLocationPatternString;
  var nearSweaterString = BASEA11yStrings.nearSweaterString;
  var balloonNearString = BASEA11yStrings.balloonNearString;
  var locationAndInducedChargePatternString = BASEA11yStrings.locationAndInducedChargePatternString;
  var singleStatementPatternString = BASEA11yStrings.singleStatementPatternString;
  var wallNoTransferOfChargeString = BASEA11yStrings.wallNoTransferOfChargeString;
  var wallHasManyChargesString = BASEA11yStrings.wallHasManyChargesString;
  var balloonHasRelativeChargePatternString = BASEA11yStrings.balloonHasRelativeChargePatternString;
  var wallPositiveChargesDoNotMoveString = BASEA11yStrings.wallPositiveChargesDoNotMoveString;
  var interactionCueString = BASEA11yStrings.interactionCueString;
  var balloonRelativeChargeAllPatternString = BASEA11yStrings.balloonRelativeChargeAllPatternString;
  var balloonNetChargeShowingPatternString = BASEA11yStrings.balloonNetChargeShowingPatternString;
  var showingNoChargesString = BASEA11yStrings.showingNoChargesString;
  var balloonPicksUpChargesPatternString = BASEA11yStrings.balloonPicksUpChargesPatternString;
  var balloonPicksUpMoreChargesPatternString = BASEA11yStrings.balloonPicksUpMoreChargesPatternString;
  var balloonPicksUpChargesDiffPatternString = BASEA11yStrings.balloonPicksUpChargesDiffPatternString;
  var balloonPicksUpMoreChargesDiffPatternString = BASEA11yStrings.balloonPicksUpMoreChargesDiffPatternString;
  var balloonSweaterRelativeChargesPatternString = BASEA11yStrings.balloonSweaterRelativeChargesPatternString;
  var balloonHasNetChargePatternString = BASEA11yStrings.balloonHasNetChargePatternString;
  var lastChargePickedUpPatternString = BASEA11yStrings.lastChargePickedUpPatternString;
  var grabbedFullPatternString = BASEA11yStrings.grabbedFullPatternString;
  var noChargePickupPatternString = BASEA11yStrings.noChargePickupPatternString;
  var noChangeInChargesString = BASEA11yStrings.noChangeInChargesString;
  var noChangeInNetChargeString = BASEA11yStrings.noChangeInNetChargeString;
  var noChargePickupHintPatternString = BASEA11yStrings.noChargePickupHintPatternString;
  var releaseHintString = BASEA11yStrings.releaseHintString;
  var balloonStickingToPatternString = BASEA11yStrings.balloonStickingToPatternString;
  var balloonLabelWithAttractiveStatePatternString = BASEA11yStrings.balloonLabelWithAttractiveStatePatternString;
  var wallRubbingPatternString = BASEA11yStrings.wallRubbingPatternString;
  var balloonVeryCloseToString = BASEA11yStrings.balloonVeryCloseToString;
  var balloonNetChargePatternStringWithLabel = BASEA11yStrings.balloonNetChargePatternStringWithLabel;
  var continuousMovementPatternString = BASEA11yStrings.continuousMovementPatternString;
  var continuousMovementWithLandmarkPatternString = BASEA11yStrings.continuousMovementWithLandmarkPatternString;
  var nowDirectionPatternString = BASEA11yStrings.nowDirectionPatternString;
  var balloonLocationNoChangePatternString = BASEA11yStrings.balloonLocationNoChangePatternString;
  var balloonAddedPatternString = BASEA11yStrings.balloonAddedPatternString;
  var balloonRemovedPatternString = BASEA11yStrings.balloonRemovedPatternString;
  var balloonAddedWithLocationPatternString = BASEA11yStrings.balloonAddedWithLocationPatternString;
  var balloonAddedWhileNearYellowBalloonLocationPatternString = BASEA11yStrings.balloonAddedWhileNearYellowBalloonLocationPatternString;
  
  // constants
  // maps balloon direction to a description string while the balloon is being dragged
  var BALLOON_DIRECTION_DRAGGING_MAP = {
    UP: upDraggingString,
    DOWN: downDraggingString,
    LEFT: leftDraggingString,
    RIGHT: rightDraggingString,
    UP_RIGHT: upAndToTheRightDraggingString,
    UP_LEFT: upAndToTheLeftDraggingString,
    DOWN_RIGHT: downAndToTheRightDraggingString,
    DOWN_LEFT: downAndToTheLeftDraggingString
  };

  // maps balloon direction to a description string for while the balloon is released
  var BALLOON_DIRECTION_RELEASE_MAP = {
    UP: upString,
    DOWN: downString,
    LEFT: leftString,
    RIGHT: rightString,
    UP_RIGHT: upAndToTheRightString,
    UP_LEFT: upAndToTheLeftString,
    DOWN_RIGHT: downAndToTheRightString,
    DOWN_LEFT: downAndToTheLeftString
  };

  // maximum velocity of a balloon immediately after release in this simulation, determined by observation
  var MAXIMUM_VELOCITY_ON_RELEASE = 0.4;

  // speed of the balloon to be considered moving slowly, determined empirically
  var SLOW_BALLOON_SPEED = 0.09;

  // when balloons are withing this distance of each other, some descriptions will reflect this
  var NEXT_TO_BALLOON_THRESHOLD = 100;

  // maps magnitude of velocity to the description
  var BALLOON_VELOCITY_MAP = {
    EXTREMELY_SLOWLY_STRING: {
      range: new Range( 0, MAXIMUM_VELOCITY_ON_RELEASE / 200 ),
      description: extremelySlowlyString
    },
    VERY_SLOWLY_RANGE: {
      range: new Range( MAXIMUM_VELOCITY_ON_RELEASE / 200, MAXIMUM_VELOCITY_ON_RELEASE / 100 ),
      description: verySlowlyString
    },
    SLOWLY_RANGE: {
      range: new Range( MAXIMUM_VELOCITY_ON_RELEASE / 100, MAXIMUM_VELOCITY_ON_RELEASE  / 50 ),
      description: slowlyString
    },
    QUICKLY_RANGE: {
      range: new Range( MAXIMUM_VELOCITY_ON_RELEASE / 50,  MAXIMUM_VELOCITY_ON_RELEASE / 4 ),
      description: quicklyString
    },
    VERY_QUICKLY_RANGE: {
      range: new Range( MAXIMUM_VELOCITY_ON_RELEASE / 4, Number.MAX_VALUE ),
      description: veryQuicklyString
    }
  };

  /**
   * @param {BASEModel} model
   * @param {WallModel} wall
   * @param {BalloonModel} balloon
   * @constructor
   */
  function BalloonDescriber( model, wall, balloon, accessibleLabel ) {

    // @private
    this.model = model;
    this.wall = wall;
    this.balloonModel = balloon;
    this.accessibleLabel = accessibleLabel;
    this.showChargesProperty = model.showChargesProperty;

    // @private - the charge on the balloon when we generate a pickup description,
    // tracked so we know how to describe the next pickup
    this.chargeOnPickupDescription = this.balloonModel.chargeProperty.get();

    this.describedChargeRange = null;

    // @private - once the balloon has been picked up, we don't need to include certain information on grab until
    // it is reset again
    this.balloonPickedUp = false;
  }

  balloonsAndStaticElectricity.register( 'BalloonDescriber', BalloonDescriber );

  return inherit( Object, BalloonDescriber, {

    /**
     * Reset the describer, resetting flags that are required to manipulate provided descriptions.
     * @public
     */
    reset: function() {
      this.balloonPickedUp = false;
      this.describedChargeRange = null;
    },

    /**
     * Get the description for this balloon, including information about the Balloon's location, and charge
     * 
     * @return {string}
     */
    getBalloonDescription: function() {
      var description;
      var showCharges = this.showChargesProperty.get();

      var attractiveStateAndLocationString = this.getAttractiveStateAndLocationDescription();
      attractiveStateAndLocationString = StringUtils.fillIn( singleStatementPatternString, {
        statement: attractiveStateAndLocationString
      } );

      if ( showCharges === 'none' ) {
        description = StringUtils.fillIn( balloonShowNoChargesPatternString, {
          stateAndLocation: attractiveStateAndLocationString
        } );
      }
      else {
        // balloon net charge description
        var netChargeDescriptionString = this.getNetChargeDescription();

        // balloon relative charge string, dependent on charge visibility
        var relativeChargesString = this.getRelativeChargeDescription();

        description = StringUtils.fillIn( balloonShowAllChargesPatternString, {
          stateAndLocation: attractiveStateAndLocationString,
          netCharge: netChargeDescriptionString,
          relativeCharge: relativeChargesString
        } );
      }

      return StringUtils.fillIn( balloonDescriptionWithHelpPatternString, {
        description: description,
        help: balloonButtonHelpString
      } );
    },

    /**
     * Get a description of the  net charge. Will return something like
     * "Has negative net charge." or
     * "Has neutral net charge." 
     *
     * @return {string}
     */
    getNetChargeDescription: function() {
      var chargeAmountString = this.balloonModel.chargeProperty.get() < 0 ? balloonNegativeString : balloonZeroString;
      return StringUtils.fillIn( balloonNetChargePatternString, {
        chargeAmount: chargeAmountString
      } );
    },

    /**
     * Get a description of the net charge for the balloon, including the label. Will return something like
     * "Yellow balloon has negative net charge." or
     * "Green balloon has no net charge."
     *
     * @return {string}
     */
    getNetChargeDescriptionWithLabel: function() {
      var chargeAmountString = this.balloonModel.chargeProperty.get() < 0 ? balloonNegativeString : balloonZeroString;
      return StringUtils.fillIn( balloonNetChargePatternStringWithLabel, {
        chargeAmount: chargeAmountString,
        balloon: this.accessibleLabel
      } );
    },

    /**
     * Get a description of the relative charge of the balloon, just a segment like
     * "several more negative charges than positive charges".  Usages will place the
     * segment into the correct context.
     * 
     * @return {string}
     */
    getRelativeChargeDescription: function() {
      var description;
      var chargeValue = Math.abs( this.balloonModel.chargeProperty.get() );
      var showCharges = this.showChargesProperty.get();

      // if charge view is 'diff' and there are no charges, we simply say that there are no
      // charges shown
      if ( chargeValue === 0 && showCharges === 'diff' ) {
        description = showingNoChargesString;
      }
      else {
        var relativeChargesString = BASEDescriber.getRelativeChargeDescription( chargeValue );
        var stringPattern;
        if ( showCharges === 'all' ) {
          stringPattern = balloonRelativeChargePatternString;
        }
        else if ( showCharges === 'diff' ) {
          stringPattern = balloonChargeDifferencesPatternString;
        }
        assert && assert( stringPattern, 'stringPattern not found for showChargesProperty value ' + showCharges );

        description = StringUtils.fillIn( stringPattern, {
          amount: relativeChargesString
        } );
      }

      return description;
    },

    /**
     * Get the relative charge with the accessible label, something like
     * "Yellow balloon has a few more negative charges than positive charges." or
     * "Yellow balloon has negative net charge, showing several negative charges." or 
     * "Yellow balloon has no net charge, showing no charges."
     *
     * Dependent on the charge view.
     * 
     * @return {string}
     */
    getRelativeChargeDescriptionWithLabel: function() {
      var description;
      var relativeCharge = this.getRelativeChargeDescription();
      var chargesShown = this.showChargesProperty.get();

      assert && assert( chargesShown !== 'none', 'relative description with label should never be read when no charges are shown' );

      if ( chargesShown === 'all' ) {
        description = StringUtils.fillIn( balloonHasRelativeChargePatternString, {
          balloonLabel: this.accessibleLabel,
          relativeCharge: relativeCharge
        } );
      }
      else if ( chargesShown === 'diff' ) {
        var balloonCharge = this.balloonModel.chargeProperty.get();
        var chargeString = ( balloonCharge < 0 ) ? balloonNegativeString : balloonZeroString; 

        description = StringUtils.fillIn( balloonHasNetChargePatternString, {
          balloon: this.accessibleLabel,
          charge: chargeString,
          showing: relativeCharge
        } );
      }

      return description;
    },

    /**
     * Get a description that describes the attractive state or proximity of the balloon, such as
     * "On...", "sticking to...", "Near..." and so on.
     * 
     * @return {string}
     */
    getAttractiveStateOrProximityDescription: function() {
      var string = '';

      if ( this.balloonModel.onSweater() ) {
        if ( !this.balloonModel.isDraggedProperty.get() && Math.abs( this.balloonModel.chargeProperty.get() ) > 0 ) {

          // has charged and not dragging, balloon is sticking to the object
          string = balloonStickingToString;
        }
        else {
          string = balloonOnString;
        }
      }
      else {
        string = this.getPreposition();
      }

      return string;
    },

    /**
     * Get the 'near' or 'on' or 'At' description for the balloon, depending on where the balloon is.
     * This is used as part of the balloon location description, and changes depending on interaction
     * or location of balloon.
     *
     * If the balloon is at a landmark position, bail because the landmark description includes proximity
     * information. TODO: Come back to this.
     *
     * NOTE: this function is probably horrible for i18n
     * 
     * @return {string}
     */
    getPreposition: function() {
      var string = '';

      var wallVisible = this.wall.isVisibleProperty.get();
      var balloonInCenterPlayArea = this.balloonModel.playAreaColumnProperty.get() === BalloonLocationEnum.CENTER_PLAY_AREA;

      if ( this.balloonModel.nearWall() && wallVisible ) {

        if ( wallVisible ) {
          string = balloonNearString;
        }
        else {
          string = balloonOnString;
        }
      }
      else if ( this.balloonModel.nearSweater() ) {
        string = balloonNearString;
      }
      else if ( this.balloonModel.nearRightEdge() ) {
        string = balloonNearString;
      }
      else if ( this.balloonModel.veryCloseToObject() ) {
        string = balloonVeryCloseToString;
      }
      else if ( this.balloonModel.touchingWall() || balloonInCenterPlayArea || this.balloonModel.atLeftEdge() ) {
        string = balloonAtString;
      }
      else {
        string = balloonOnString;
      }

      return string;
    },

    /**
     * Returns a string that combines the balloon's attractive state and location descriptions. Something
     * like "On center of play area" or "Sticking to wall". This fragment is used in a number of different
     * contexts, so it doesn't include punctuation at the end.
     * 
     * @return {string}
     */
    getAttractiveStateAndLocationDescription: function() {
      // a string that peices together attractive state and location.
      var locationDescriptionString = this.getBalloonLocationDescription();
      
      var attractiveStateDescriptionString = this.getAttractiveStateOrProximityDescription();
      var attractiveStateAndLocationString = StringUtils.fillIn( balloonLocationAttractiveStatePatternString, {
        attractiveState: attractiveStateDescriptionString,
        location: locationDescriptionString 
      } );

      return attractiveStateAndLocationString;
    },

    /**
     * Get a description about how the balloon is sticking to an object with a label. This will form a full sentence.
     * Returns something like:
     * Yellow balloon, sticking to right arm of sweater.
     *
     * @return {string} [description]
     */
    getAttractiveStateAndLocationDescriptionWithLabel: function() {
      var alert;

      // to lower case since it is used elsewhere in the string
      var location = this.getAttractiveStateAndLocationDescription().toLowerCase();
      alert = StringUtils.fillIn( balloonLabelWithAttractiveStatePatternString, {
        balloonLabel: this.accessibleLabel,
        attractiveStateAndLocation: location
      } );

      return BASEA11yStrings.fragmentToSentence( alert );
    },

    /**
     * Get a description of the balloon being "on" an item in the play area. Instead of getting
     * the attractive state of the balloon (like 'touching' or 'sticking' or 'near'), simply say
     * 'on' wherever the balloon is.
     * 
     * @return {string}
     */
    getOnLocationDescription: function() {

      var locationDescription = this.getBalloonLocationDescription();

      return StringUtils.fillIn( balloonLocationAttractiveStatePatternString, {
        attractiveState: this.getPreposition(),
        location: locationDescription
      } );
    },

    /**
     * Return a phrase describing the location of the balloon in the play area.  This is usually described relative
     * to the center of the balloon, unless the balloon is touching an object, in which case it will be relative to the
     * point where the objects are touching.
     * 
     * @return {[type]} [description]
     */
    getBalloonLocationDescription: function() {
      var describedBalloonPosition = this.getDescribedPoint();
      var wallVisible = this.wall.isVisibleProperty.get();

      return BASEDescriber.getLocationDescription( describedBalloonPosition, wallVisible );
    },

    /**
     * Get the point on the balloon that should be described. Generally, this is the balloon center.  If the balloon
     * is touching the sweater or the wall, the point of touching should be described.  If near the wall, the described
     * point is the edge of the wall to accomplish a description like "Yellow balloon, Near upper wall".
     * 
     * @return {Vector2}
     */
    getDescribedPoint: function() {
      var describedBalloonPosition;

      if ( this.balloonModel.onSweater() ) {
        describedBalloonPosition = this.balloonModel.getSweaterTouchingCenter();
      }
      else {
        describedBalloonPosition = this.balloonModel.getCenter();
      }

      return describedBalloonPosition;
    },

    /**
     * Get an alert that indicates that the balloon has been grabbed for dragging. Will compose
     * a description containing charge information, location information, and help for how
     * to interact with balloon. Amount of charge information will depend on charge visibility
     * setting. If the balloon is inducing charge, information about induced charge will be included.
     * If the balloon is on the sweater, will include infomation about the charges on the sweater. After the
     * balloon has been picked up once, we don't need to describe help information until reset.
     * 
     * @return {string}
     */
    getGrabbedAlert: function() {
      var alertString;
      var patternString = grabbedFullPatternString;
      var chargesShown = this.showChargesProperty.get();
      var wallVisible = this.model.wall.isVisibleProperty.get();

      // attractive state and location is described for every charge view, it is a single sentence in this use cases
      var stateAndLocation = this.getOnLocationDescription();
      stateAndLocation = BASEA11yStrings.fragmentToSentence( stateAndLocation );

      // the first time the balloon is picked up, we include help content
      if ( this.balloonPickedUp ) {
        patternString = BASEA11yStrings.stripPlaceholders( grabbedFullPatternString, [ 'help' ] );
      }

      var relativeChargeString;
      var chargeString;
      if ( chargesShown === 'all' ) {

        relativeChargeString = this.getRelativeChargeDescription();

        // format the relative charge descriptions, it is a single sentence in this use case
        chargeString = StringUtils.fillIn( balloonRelativeChargeAllPatternString, {
          charge: relativeChargeString
        } );
        chargeString = BASEA11yStrings.fragmentToSentence( chargeString );

        // if the balloon is inducing charge, or touching wall, the state of induced charge needs to be included in
        // the description for the balloon
        var inducedChargeString;
        if ( this.balloonModel.touchingWall() && this.balloonModel.isCharged() ) {
          inducedChargeString = WallDescriber.getInducedChargeDescription( this.balloonModel, this.accessibleLabel, wallVisible );
          alertString = StringUtils.fillIn( patternString, {
            location: stateAndLocation,
            balloonCharge: chargeString,
            inducedCharge: inducedChargeString,
            positiveCharge: wallPositiveChargesDoNotMoveString,
            objectCharge: wallHasManyChargesString,
            help: interactionCueString 
          } );
        }
        else if ( this.balloonModel.touchingWall() && !this.balloonModel.isCharged() ) {

          // if inducing charge but not touching the wall, we need induced charge to not include amount
          inducedChargeString = WallDescriber.getInducedChargeDescription( this.balloonModel, this.accessibleLabel, wallVisible );

          patternString = BASEA11yStrings.stripPlaceholders( patternString, [ 'positiveCharge' ] );
          alertString = StringUtils.fillIn( patternString, {
            location: stateAndLocation,
            balloonCharge: chargeString,
            inducedCharge: inducedChargeString,
            objectCharge: wallHasManyChargesString,
            help: interactionCueString 
          } );
        }
        else if ( this.balloonModel.onSweater() ) {
          var sweaterCharge = this.model.sweater.chargeProperty.get();
          var relativeSweaterCharge = SweaterDescriber.getRelativeChargeDescriptionWithLabel( sweaterCharge, chargesShown );
          patternString = BASEA11yStrings.stripPlaceholders( patternString, [ 'inducedCharge', 'positiveCharge' ] );

          alertString = StringUtils.fillIn( patternString, {
            location: stateAndLocation,
            balloonCharge: chargeString,
            objectCharge: relativeSweaterCharge,
            help: interactionCueString
          } );
        }
        else if ( this.balloonModel.inducingCharge ) {
          patternString = BASEA11yStrings.stripPlaceholders( patternString, [ 'positiveCharge', 'objectCharge' ] );
          inducedChargeString = WallDescriber.getInducedChargeDescriptionWithNoAmount( this.balloonModel, this.accessibleLabel, wallVisible );

          alertString = StringUtils.fillIn( patternString, {
            location: stateAndLocation,
            balloonCharge: chargeString,
            inducedCharge: inducedChargeString,
            help: interactionCueString
          } );
        }
        else {
          patternString = BASEA11yStrings.stripPlaceholders( patternString, [ 'inducedCharge', 'positiveCharge',  'objectCharge' ] );
          alertString = StringUtils.fillIn( patternString, {
            location: stateAndLocation,
            balloonCharge: chargeString,
            help: interactionCueString
          } );
        }
      }
      else if ( chargesShown === 'none' ) {

        // if no charges are shown, we should only hear location and help information on grab
        patternString = BASEA11yStrings.stripPlaceholders( patternString, [ 'balloonCharge', 'inducedCharge', 'positiveCharge', 'objectCharge' ] );
        alertString = StringUtils.fillIn( patternString, {
          location: stateAndLocation,
          help: interactionCueString 
        } );
      }
      else if ( chargesShown === 'diff' ) {
        var netChargeString = this.getNetChargeDescription();
        relativeChargeString = this.getRelativeChargeDescription();

        var netAndRelativeString = StringUtils.fillIn( balloonNetChargeShowingPatternString, {
          netCharge: netChargeString,
          showing: relativeChargeString
        } );

        if ( this.balloonModel.touchingWall() || this.balloonModel.onSweater() ) {
          patternString = BASEA11yStrings.stripPlaceholders( patternString, [ 'inducedCharge', 'positiveCharge' ] );

          var objectChargeString;
          if ( this.balloonModel.touchingWall() ) {
            objectChargeString = WallDescriber.getWallChargeDescriptionWithLabel( this.balloonModel, this.balloonModel.other, wallVisible, chargesShown );
          }
          else {
            objectChargeString = SweaterDescriber.getRelativeChargeDescriptionWithLabel( this.balloonModel.chargeProperty.get(), chargesShown );
          }

          alertString = StringUtils.fillIn( patternString, {
            location: stateAndLocation,
            balloonCharge: netAndRelativeString,
            objectCharge: objectChargeString,
            help: interactionCueString
          } );
        }
        else {
          patternString = BASEA11yStrings.stripPlaceholders( patternString, [ 'inducedCharge', 'positiveCharge', 'objectCharge' ] );
          alertString = StringUtils.fillIn( patternString, {
            location: stateAndLocation,
            balloonCharge: netAndRelativeString,
            help: interactionCueString
          } );
        }
      }

      // after assembling the alert, this flag will prevent help information until reset
      this.balloonPickedUp = true;

      assert && assert( alertString, 'No grabbed alert for charge view ' + chargesShown );
      return alertString;
    },

    /**
     * Get an alert that indicates that the balloon has been released.
     * @return {string}
     */
    getReleasedAlert: function() {
      return StringUtils.fillIn( singleStatementPatternString, {
        statement: releasedString
      } );
    },

    /**
     * Generally announced right after the balloon as been released, this is read as an alert. Generates
     * something like "Moves toward sweater."
     *
     * @param {Vector2} location - the current location of the balloon
     * @param {Vector2} oldLocation - the previous location of the balloon
     * @return {string}
     */
    getInitialReleaseDescription: function( location, oldLocation ) {

      // the balloon is moving with some initial velocity, describe that
      var velocityString = this.getVelocityString();
      var directionString= this.getReleaseDirectionDescription( this.balloonModel.directionProperty.get() );

      var description = StringUtils.fillIn( initialMovementPatternString, {
        velocity: velocityString,
        direction: directionString
      } );

      return description;
    },

    /**
     * Get a description of continuous movement of the balloon after it has been released and is
     * still moving through the play area. Will return something like
     * "Moving Left." or
     * "Moving Left. Near wall."
     * 
     * @param {Vector2} location   
     * @param {Vector2} oldLocation
     * @return
     */
    getContinuousReleaseDescription: function() {
      var description;
      var directionString = this.getReleaseDirectionDescription( this.balloonModel.directionProperty.get() );

      // describes movement and direction
      description = StringUtils.fillIn( continuousMovementPatternString, {
        direction: directionString
      } );

      // if we are in a landmark, it will be added to the continuous movement description
      if ( this.balloonModel.playAreaLandmarkProperty.get() ) {
        description = StringUtils.fillIn( continuousMovementWithLandmarkPatternString, {
          movementDirection: description,
          landmark: this.getOnLocationDescription()
        } );
      }

      return description;
    },

    /**
     * Produces an alert when there is no change in position.  Indicates that there is no change
     * and also reminds user where the balloon currently is. Will return something like
     * "No change in position. Yellow balloon, on left side of Play Area."
     * 
     * @return {string}
     */
    getNoChangeReleaseDescription: function() {
      var attractiveStateAndLocationDescription = this.getAttractiveStateAndLocationDescriptionWithLabel();
      return StringUtils.fillIn( noChangeAndLocationPatternString, {
        noChange: noChangeInPositionString,
        location: attractiveStateAndLocationDescription
      } );
    },

    /**
     * Get a description of velocity for this balloon, one of "very slowly", "slowly", "quickly", "very quickly"
     * 
     * @private
     * @return {string}
     */
    getVelocityString: function() {
      var velocityString;

      var balloonVelocity = this.balloonModel.velocityProperty.get();

      var keys = Object.keys( BALLOON_VELOCITY_MAP );
      for ( var i = 0; i < keys.length; i++ ) {
        var entry = BALLOON_VELOCITY_MAP[ keys[ i ] ];
        if ( entry.range.contains( balloonVelocity.magnitude() ) ) {
          velocityString = entry.description;
          break;
        }
      }

      assert && assert( velocityString, 'no velocity description found' );

      return velocityString;
    },

    /**
     * Get a movement description from the movement direction tracked in the model.  The direction
     * is one of BalloonDirectionEnum.
     *
     * @param {string} direction - one of BalloonDirectionEnum
     * @return {string}
     */
    getDraggingDirectionDescription: function( direction ) {
      var movementString = BALLOON_DIRECTION_DRAGGING_MAP[ direction ];

      assert && assert( movementString, 'no direction description found for balloon moving direction ' + direction );
      return movementString;
    },

    /**
     * Get a description of the balloon movement direction when the balloon is not currently
     * being dragged.
     * 
     * @param  {string} direction - one of BalloonDirectionEnum
     */
    getReleaseDirectionDescription: function( direction ) {
      var movementString = BALLOON_DIRECTION_RELEASE_MAP[ direction ];

      assert && assert( movementString, 'no direction description found for balloon moving direction ' + direction );
      return movementString;
    },

    /**
     * Get a short description of the balloon's location at a boundary when there is an attempted drag beyond
     * the boundary.  Will return something like "At bottom" or "At top".
     * 
     * @return {string}
     */
    getTouchingBoundaryDescription: function( attemptedDirection ) {
      assert && assert ( this.balloonModel.isTouchingBoundary(), 'balloon is not touching a boundary' );

      var boundaryString;
      if ( this.balloonModel.isTouchingBottomBoundary() && attemptedDirection === BalloonDirectionEnum.DOWN ) {
        boundaryString = atBottomString;
      }
      else if ( this.balloonModel.isTouchingLeftBoundary() && attemptedDirection === BalloonDirectionEnum.LEFT ) {
        boundaryString = atLeftEdgeString;
      }
      else if ( this.balloonModel.touchingWall() && attemptedDirection === BalloonDirectionEnum.RIGHT ) {
        boundaryString = atWallString;
      }
      else if ( this.balloonModel.isTouchingRightEdge() && attemptedDirection === BalloonDirectionEnum.RIGHT) {
        boundaryString = atRightEdgeString;
      }
      else if ( this.balloonModel.isTouchingTopBoundary() && attemptedDirection === BalloonDirectionEnum.UP ) {
        boundaryString = atTopString;
      }

      assert && assert ( boundaryString, 'No boundary string found for balloon.' );
      return boundaryString;
    },

    getOnSweaterString: function( onSweater ) {
     return onSweater ? onSweaterString : offSweaterString;
    },

    /**
     * Get a description of the balloon's dragging movement when it enters a landmark. Dependent on balloon velocity,
     * drag velocity, and movement direction. Depending on these variables, we might not announce this alert, so
     * this function can return null.
     *
     * @return {string|null}
     */
    getLandmarkDragDescription: function() {
      var playAreaLandmark = this.balloonModel.playAreaLandmarkProperty.get();
      var dragSpeed = this.balloonModel.dragVelocityProperty.get().magnitude();
      var alert = this.getAttractiveStateAndLocationDescription();

      // wrap as a single statement with punctuation
      alert = StringUtils.fillIn( singleStatementPatternString, { statement: alert } );

      // cases where we do not want to announce the alert
      if ( this.balloonModel.movingRight() && playAreaLandmark === 'AT_NEAR_SWEATER' ) {

        // if moving to the right and we enter the 'near sweater' landmark, ignore
        alert = null;
      }
      else if ( playAreaLandmark === 'AT_VERY_CLOSE_TO_SWEATER' ) {
        var movingSlowlyLeft = this.balloonModel.movingLeft() && dragSpeed < SLOW_BALLOON_SPEED;

        // only announce that we are very close to the sweater when moving slowly to the left
        if ( !movingSlowlyLeft ) {
          alert = null;
        }
      }
      else if ( playAreaLandmark === 'AT_VERY_CLOSE_TO_WALL' || playAreaLandmark === 'AT_VERY_CLOSE_TO_RIGHT_EDGE' ) {

        // only announce that we are very close to the wall when moving slowly and when the wall is visible
        if ( dragSpeed > SLOW_BALLOON_SPEED ) {
          alert = null;
        }
      }

      return alert;
    },

    /**
     * Get the dragging description while the balloon is moving through the play area being dragged and enters
     * a new region in the play area.
     * 
     * @return {string}
     */
    getPlayAreaDragNewRegionDescription: function() {

      var nearOrAt = this.getPreposition();
      var balloonCenter = this.balloonModel.getCenter();

      var wallVisible = this.model.wall.isVisibleProperty.get();
      var locationString = BASEDescriber.getLocationDescription( balloonCenter, wallVisible );

      return StringUtils.fillIn( balloonNewRegionPatternString, {
        nearOrAt: nearOrAt,
        location: locationString 
      } );
    },

    /**
     * Get a progress string toward the sweater, wall, top edge, bottom edge, or center of play area.
     * 
     * @return {string}
     */
    getPlayAreaDragProgressDescription: function() {
      var alert;
      var nearestObjectString;

      var centerPlayAreaX = PlayAreaMap.X_LOCATIONS.AT_CENTER_PLAY_AREA;
      var centerPlayAreaY = PlayAreaMap.Y_LOCATIONS.AT_CENTER_PLAY_AREA;
      var balloonCenterX = this.balloonModel.getCenterX();
      var balloonCenterY = this.balloonModel.getCenterY();
      var balloonDirection = this.balloonModel.directionProperty.get();

      if ( balloonDirection === BalloonDirectionEnum.LEFT ) {

        // if right of center, describe closer to center, otherwise closer to sweater
        nearestObjectString = ( balloonCenterX > centerPlayAreaX ) ? centerOfPlayAreaString : sweaterString;
      }
      else if ( balloonDirection === BalloonDirectionEnum.RIGHT ) {

        if ( balloonCenterX < centerPlayAreaX ) {

          // if left of center, describe that we are closer to the center
          nearestObjectString = centerOfPlayAreaString;
        }
        else {

          // otherwise describe closer to wall or righe edge depending on wall visibility
          nearestObjectString = this.model.wall.isVisibleProperty.get() ? wallString : rightEdgeOfPlayAreaString;
        }
      }
      else if ( balloonDirection === BalloonDirectionEnum.UP ) {

        // below center describe closer to center, otherwise closer to top of play area
        nearestObjectString = ( balloonCenterY > centerPlayAreaY ) ? centerOfPlayAreaString : topEdgeOfPlayAreaString;
      }
      else if ( balloonDirection === BalloonDirectionEnum.DOWN ) {

        // above center describe closer to center, otherwise closer to bottom edge of play area
        nearestObjectString = ( balloonCenterY < centerPlayAreaY ) ? centerOfPlayAreaString : bottomEdgeOfPlayAreaString;
      }

      assert && assert( nearestObjectString, 'no nearest object found for movement direction: ' + balloonDirection );
      alert = StringUtils.fillIn( closerToObjectPatternString, {
        object: nearestObjectString
      } );

      return BASEA11yStrings.fragmentToSentence( alert );
    },

    /**
     * Get a description of where the balloon jumped to.  Depending on where the balloon goes, there
     * could be an indication of where the balloon is in the play area, and potentially the state of
     * the induced charge in the wall.
     *
     * TODO: location descriptions have been isolated, is this still necessary?
     * 
     * @public
     * @param  {Vector2} center
     * @return {string}
     */
    getJumpingDescription: function( center ) {
      var description = '';

      // all jumping is in the x direction
      var centerX = center.x;

      // determine which description we should use depending on the center location of the balloon
      if ( centerX === PlayAreaMap.X_LOCATIONS.AT_NEAR_SWEATER ) {
        description = nearSweaterString;
      }
      else {

        // general location description for the balloon
        var locationDescription = this.getAttractiveStateAndLocationDescription();

        // state variables used to generate description content
        var wallVisible = this.wall.isVisibleProperty.get();
        var inducingCharge = this.balloonModel.inducingCharge;
        var showCharges = this.showChargesProperty.get();

        // if there is an induced charge and the charges are visible, describe induced charge
        if ( wallVisible && inducingCharge && showCharges === 'all' ) {
          var inducedChargeDescription = WallDescriber.getInducedChargeDescription( this.balloonModel, this.accessibleLabel, wallVisible );
          description = StringUtils.fillIn( locationAndInducedChargePatternString, {
            location: locationDescription,
            inducedCharge: inducedChargeDescription
          } );
        }
        else {

          // otherwise, only provide the location description
          description = locationDescription;
        }
      }
      return description;
    },

    getSweaterRubbingDescription: function() {
      
    },

    /**
     * Get a description of the balloon rubbing on the wall, including a description for the
     * induced charge if there is any and depending on the charge view. Will return something like
     *
     * "At wall. No transfer of charge. In wall, no change in charges." or
     * "At upper wall. No transfer of charge. Negative charges in upper wall move away from yellow balloon a lot.
     * Positive charges do not move" or
     * "At upper wall." or
     * "At lower wall. Yellow balloon has negative net charge, showing several more negative charges than positive charges."
     * 
     * @return {string}
     */
    getWallRubbingDescription: function() {
      var patternString = wallRubbingPatternString;
      var descriptionString;

      // the location string is used for all charge views, used as a single sentence
      var locationString = this.getBalloonLocationDescription();
      var atLocationString = StringUtils.fillIn( balloonAtLocationPatternString, {
        location: locationString
      } );
      atLocationString = BASEA11yStrings.fragmentToSentence( atLocationString );

      var shownCharges = this.showChargesProperty.get();
      var wallVisible = this.wall.isVisibleProperty.get();
      if ( shownCharges === 'none' ) {
        descriptionString = atLocationString;
      }
      else if ( shownCharges === 'all' ) {
        var inducedChargeString = WallDescriber.getInducedChargeDescription( this.balloonModel, this.accessibleLabel, wallVisible );
        if ( this.balloonModel.isCharged() ) {
          patternString = BASEA11yStrings.stripPlaceholders( patternString, [ 'balloonCharge', 'wallCharge' ] );
          descriptionString = StringUtils.fillIn( patternString, {
            location: atLocationString,
            transfer: wallNoTransferOfChargeString,
            inducedCharge: inducedChargeString,
            positiveCharges: wallPositiveChargesDoNotMoveString
          } );
        }
        else {
          patternString = BASEA11yStrings.stripPlaceholders( patternString, [ 'balloonCharge', 'wallCharge', 'positiveCharges' ] );
          descriptionString = StringUtils.fillIn( patternString, {
            location: atLocationString,
            transfer: wallNoTransferOfChargeString,
            inducedCharge: inducedChargeString
          } );
        }
      }
      else {
        var wallChargeString = WallDescriber.getWallChargeDescriptionWithLabel( this.model.yellowBalloon, this.model.greenBalloon, wallVisible, shownCharges );
        var balloonChargeString = this.getRelativeChargeDescriptionWithLabel();

        // wallRubbingPatternString: '{{location}} {{balloonCharge}} {{wallCharge}} {{transfer}} {{inducedCharge}}',
        patternString = BASEA11yStrings.stripPlaceholders( patternString, [ 'transfer', 'inducedCharge', 'positiveCharges' ] );
        descriptionString = StringUtils.fillIn( patternString, {
          location: atLocationString,
          balloonCharge: balloonChargeString,
          wallCharge: wallChargeString
        } );
      }

      return descriptionString;
    },

    /**
     * The first time the balloon picks up charges from the sweater after leaving the play
     * area, we get an initial alert like "Yellow Balloon picks up negative charges
     * from sweater.".
     * 
     * @return {string}
     */
    getInitialChargePickupDescription: function() {
      var description;
      var shownCharges = this.showChargesProperty.get();

      var picksUpCharges = StringUtils.fillIn( balloonPicksUpChargesPatternString, {
        balloon: this.accessibleLabel
      } );

      if ( shownCharges === 'all' ) {
        description = StringUtils.fillIn( singleStatementPatternString, {
          statement: picksUpCharges
        } );
      }
      else if ( shownCharges === 'diff' ) {    
        description = StringUtils.fillIn( balloonPicksUpChargesDiffPatternString, {
          pickUp: picksUpCharges
        } );
      }

      return description;
    },

    /**
     * Get the alert description for when a charge is picked up off of the sweater. Dependent
     * on charge view, whether the balloon has picked up charges already since moving on to the
     * sweater, and the number of charges that the balloon has picked up.
     * 
     * @param  {boolean} firstPickup - special behavior if the first charge pickup since landing on sweater
     * @return {string}
     */
    getChargePickupDescription: function( firstPickup ) {
      var description;
      var shownCharges = this.showChargesProperty.get();

      var newCharge = this.balloonModel.chargeProperty.get();
      var newRange = BASEDescriber.getDescribedChargeRange( newCharge );

      if ( shownCharges === 'none' )  {
        description = this.getAttractiveStateAndLocationDescription();
        description = StringUtils.fillIn( singleStatementPatternString, { statement: description } );
      }
      else if ( firstPickup ) {

        // if this is the first charge picked up after moving onto sweater, generate
        // a special description to announce that charges have been transfered
        description = this.getInitialChargePickupDescription();
      }
      else if ( !this.describedChargeRange || !newRange.equals( this.describedChargeRange ) ) {

        // if we have entered a new described range since the previous charge alert,
        // we will generate a special description that mentions the relative charges
        var sweaterCharge = this.model.sweater.chargeProperty.get();

        var relativeBalloonCharge = this.getRelativeChargeDescriptionWithLabel();
        var relativeSweaterCharge = SweaterDescriber.getRelativeChargeDescriptionWithLabel( sweaterCharge, shownCharges );

        description = StringUtils.fillIn( balloonSweaterRelativeChargesPatternString, {
          balloon: relativeBalloonCharge,
          sweater: relativeSweaterCharge
        } );
        
        this.describedChargeRange = BASEDescriber.getDescribedChargeRange( newCharge );
      }
      else {

        // in same described range of charges, describe how balloon picks up more charges
        var picksUpCharges = StringUtils.fillIn( balloonPicksUpMoreChargesPatternString, {
          balloon: this.accessibleLabel
        } );

        if ( shownCharges === 'all' ) {
          description = StringUtils.fillIn( singleStatementPatternString, {
            statement: picksUpCharges
          } );
        }
        else if ( shownCharges === 'diff' ) {
          description = StringUtils.fillIn( balloonPicksUpMoreChargesDiffPatternString, {
            pickUp: picksUpCharges
          } );
        }

        this.describedChargeRange = BASEDescriber.getDescribedChargeRange( newCharge );
      }      

      // update the charge for this generated description
      // this.chargeOnPickupDescription = newCharge;

      assert && assert( description, 'no charge pickup alert generated for charge view ' + shownCharges );
      return description;
    },

    /**
     * Get the description when the balloon has picked up the last charge on the sweater.
     * Dependent on the charge view.
     * 
     * @return {string}
     */
    getLastChargePickupDescription: function() {
      var shownCharges = this.showChargesProperty.get();
      var charge = this.balloonModel.chargeProperty.get();

      var sweaterChargeString = SweaterDescriber.getNoMoreChargesAlert( charge, shownCharges );
      var balloonChargeString = this.getRelativeChargeDescriptionWithLabel();

      return StringUtils.fillIn( lastChargePickedUpPatternString, {
        sweater: sweaterChargeString,
        balloon: balloonChargeString
      } );
    },

    /**
     * Get an alert that describes progress of balloon movement through a single cell in the play area. This information
     * will only be provided to a keyboard user.
     *
     * Will  be something like:
     * "At center of play area." or
     * "Closer to sweater."
     *
     * @return {string}
     */
    getKeyboardMovementAlert: function() {
      var alert;

      // percent of progress through the region
      var progressThroughCell = this.balloonModel.getProgressThroughRegion();
      var dragVelocity = this.balloonModel.dragVelocityProperty.get().magnitude();
      var movingDiagonally = this.balloonModel.movingDiagonally();

      if ( dragVelocity > SLOW_BALLOON_SPEED && progressThroughCell >= 0.66 && !movingDiagonally ) {

        // if drag velocity fast and progress through the cell is greater than 60%, announce progress towards destination
        alert = this.getPlayAreaDragProgressDescription();
      }
      else if ( dragVelocity < SLOW_BALLOON_SPEED && progressThroughCell >= 0.5 && !movingDiagonally ) {

        // when drag velocity slow and progress through cell greater than 0.5, announce progress towards destination
        alert = this.getPlayAreaDragProgressDescription();
      }
      else {

        // just announce the current location in the play area
        alert = this.getAttractiveStateAndLocationDescription();
        alert = StringUtils.fillIn( singleStatementPatternString, { statement: alert } );
      }
      return alert;
    },

    /**
     * Get an alert that describes that no charges were picked up during the drag interaction. This alert is dependent
     * on which charges are visible. Will return a string like
     *
     * "No change in charges. On left side of sweater. More pairs of charges down and to the right." or
     * "No change in net charge. On left side of sweater. More hidden pairs of charges down and to the right." or
     * "On left side of sweater".
     *
     * @return {string}
     */
    getNoChargePickupDescription: function() {
      var alert;
      var chargesShown = this.showChargesProperty.get();
      
      var balloonLocationString = this.getAttractiveStateAndLocationDescription();
      var sweaterCharge = this.model.sweater.chargeProperty.get();

      if ( chargesShown === 'none' ) {

        // if no charges are shown, just describe position of balloon as a complete sentence
        alert = BASEA11yStrings.fragmentToSentence( balloonLocationString );
      }
      else if ( sweaterCharge < BASEConstants.MAX_BALLOON_CHARGE ) {

        // there are still charges on the sweater
        var sweaterCharges = this.model.sweater.minusCharges;
        var moreChargesString = SweaterDescriber.getMoreChargesDescription( this.balloonModel, sweaterCharge, sweaterCharges, chargesShown );
        var patternString = noChargePickupPatternString;
        if ( chargesShown === 'all' ) {
          alert = StringUtils.fillIn( noChargePickupPatternString, {
            noChange: noChangeInChargesString,
            balloonLocation: balloonLocationString,
            moreChargesLocation: moreChargesString,
          } );
        }
        else if ( chargesShown === 'diff' )  {
          alert = StringUtils.fillIn( noChargePickupPatternString, {
            noChange: noChangeInNetChargeString,
            balloonLocation: balloonLocationString,
            moreChargesLocation: moreChargesString
          } );
        }
      }
      else {

        // there are no more charges remaining on the sweater
        if ( chargesShown === 'all' ) {
          var relativeSweaterCharge = SweaterDescriber.getNetChargeDescription( sweaterCharge );
          var relativeBalloonCharge = this.getNetChargeDescriptionWithLabel();
          alert = StringUtils.fillIn( noChargePickupHintPatternString, {
            noChange:  noChangeInChargesString,
            balloonLocation: balloonLocationString,
            sweaterCharge: relativeSweaterCharge,
            balloonCharge: relativeBalloonCharge,
            hint: releaseHintString
          } );
        }
        else if ( chargesShown === 'diff' ) {
          patternString = BASEA11yStrings.stripPlaceholders( noChargePickupHintPatternString, [ 'sweaterCharge', 'balloonCharge' ] );
          alert = StringUtils.fillIn( patternString, {
            noChange: noChangeInNetChargeString,
            balloonLocation: balloonLocationString,
            hint: releaseHintString
          } );
        }
      }

      return alert;
    },

    /**
     * Get a description about how the balloon is sticking to an object, something like
     * "Yellow balloon, sticking to"
     *
     * @return {string}
     */
    getStickingToObjectDescription: function() {
      var balloonLocationDescription = this.getBalloonLocationDescription();
      return StringUtils.fillIn( balloonStickingToPatternString, {
        balloonLabel: this.accessibleLabel,
        location: balloonLocationDescription
      } );
    },

    /**
     * Get a description about the change in direction. If the balloon is grabbed, only the direction will be in the
     * description. Otherwise, it will be an update to direction, so add "Now". Will return something like
     *
     * "Left." or
     * "Now Left."
     *
     * @return {string}
     */
    getDirectionChangedDescription: function() {
      var description;

      var direction = this.balloonModel.directionProperty.get();
      if ( this.balloonModel.isDraggedProperty.get() ) {

        // when dragged, just the direction
        description = this.getDraggingDirectionDescription( direction );
      }
      else {

        // when not dragged, add 'Now' to direction
        var directionString = this.getReleaseDirectionDescription( direction );
        description = StringUtils.fillIn( nowDirectionPatternString, {
          direction: directionString
        } );
      }

      return description;
    },

    /**
     * Get a description of the balloon when it hits the wall. If charges are shown and the balloon is inducing charge,
     * will include induced charge information
     * Will return something like
     *
     * "Green balloon, at upper wall. In upper wall, no change in charges." or
     * "Green balloon, at wall. Negative charges in wall move away from yellow balloon a little bit."
     *
     * @return {string}
     */
    getForcedIntoWallDescription: function() {
      var descriptionString;

      // the location string is used for all charge views, used as a single sentence
      var locationString = this.getAttractiveStateAndLocationDescriptionWithLabel();

      var shownCharges = this.showChargesProperty.get();

      if ( shownCharges === 'all' ) {
        var chargeLocationString = this.getBalloonLocationDescription();

        var chargeString;
        if ( this.balloonModel.inducingCharge ) {
          chargeString = WallDescriber.getInducedChargeDescription( this.balloonModel, this.accessibleLabel, this.wall.isVisibleProperty.get() );
        }
        else {
          chargeString = WallDescriber.getNoChangeInChargesDescription( chargeLocationString );
        }
        descriptionString = StringUtils.fillIn( balloonLocationNoChangePatternString, {
          location: locationString,
          inducedCharge: chargeString
        } );
      }
      else {
        descriptionString = locationString;
      }

      return descriptionString;
    },

    /**
     * Get a description for when a balloon is added to the play area. Will change depending on whether balloon has been
     * successfully moved and whether the two balloons are adjacent to each other. Will return something like
     * "Green balloon added to play area" or
     * "Green balloon added. Sticking to left shoulder of sweater." or
     * "Green balloon added. On left side of play area, next to yellow balloon."
     *
     * @return {string}
     */
    getVisibilityChangedDescription: function() {
      var description;
      var locationProperty = this.balloonModel.locationProperty;
      var visible = this.balloonModel.isVisibleProperty.get();

      if ( !visible ) {

        // if removed, simply state that
        description = StringUtils.fillIn( balloonRemovedPatternString, {
          balloonLabel: this.accessibleLabel
        } );
      }
      else {
        if ( locationProperty.get().equals( locationProperty.initialValue ) ) {

          // if add at initial location, generic string
          description = StringUtils.fillIn( balloonAddedPatternString, {
            balloonLabel: this.accessibleLabel
          } );
        }
        else if ( this.model.getDistance() < NEXT_TO_BALLOON_THRESHOLD ) {

          // if the two balloons are next to each other
          description = StringUtils.fillIn( balloonAddedWhileNearYellowBalloonLocationPatternString, {
            balloonLabel: this.accessibleLabel,
            location: this.getAttractiveStateAndLocationDescription()
          } );
        }
        else {

          // if not at initial location, include attractive state and location
          description = StringUtils.fillIn( balloonAddedWithLocationPatternString, {
            balloonLabel: this.accessibleLabel,
            location: this.getAttractiveStateAndLocationDescription()
          } );
        }
      }

      return description;
    },

    /**
     * Returns whether or now the balloon is considered to be moving 'slowly'. Used in descriptions and is empirical
     * in nature so this is part of the describer, not the model.
     *
     * @return {}
     */
    balloonMovingSlowly: function() {
      console.log( this.balloonModel.velocityProperty.get().magnitude() < BALLOON_VELOCITY_MAP.SLOWLY_RANGE.range.max );
      return this.balloonModel.velocityProperty.get().magnitude() < BALLOON_VELOCITY_MAP.SLOWLY_RANGE.range.max;
    }
  } );
} );