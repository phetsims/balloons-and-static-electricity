// Copyright 2002-2016, University of Colorado Boulder

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
  var inherit = require( 'PHET_CORE/inherit' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var PlayAreaMap = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/PlayAreaMap' );
  var BalloonDirectionEnum = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/BalloonDirectionEnum' );
  var BalloonLocationEnum = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/BalloonLocationEnum' );
  var Range = require( 'DOT/Range' );
  var Vector2 = require( 'DOT/Vector2' );
  var WallDescriber = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/describers/WallDescriber' );
  var BASEA11yStrings = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/BASEA11yStrings' );
  var BalloonsAndStaticElectricityDescriber = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/describers/BalloonsAndStaticElectricityDescriber' );
  var SweaterDescriber = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/describers/SweaterDescriber' );
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );

  // strings
  var balloonButtonHelpString = BASEA11yStrings.balloonButtonHelpString;
  var balloonStickingToString = BASEA11yStrings.balloonStickingToString;
  var balloonOnString = BASEA11yStrings.balloonOnString;
  var balloonAtString = BASEA11yStrings.balloonAtString;
  var balloonNetChargePatternString = BASEA11yStrings.balloonNetChargePatternString;
  var balloonNoString = BASEA11yStrings.balloonNoString;
  var balloonNegativeString = BASEA11yStrings.balloonNegativeString;
  var balloonRelativeChargePatternString = BASEA11yStrings.balloonRelativeChargePatternString;
  var balloonChargeDifferencesPatternString = BASEA11yStrings.balloonChargeDifferencesPatternString;
  var balloonLocationAttractiveStatePatternString = BASEA11yStrings.balloonLocationAttractiveStatePatternString;
  var balloonShowAllChargesPatternString = BASEA11yStrings.balloonShowAllChargesPatternString;
  var balloonDescriptionWithHelpPatternString = BASEA11yStrings.balloonDescriptionWithHelpPatternString;
  var balloonShowNoChargesPatternString = BASEA11yStrings.balloonShowNoChargesPatternString;
  var grabbedString = BASEA11yStrings.grabbedString;
  var releasedString = BASEA11yStrings.releasedString;
  var movesToObjectPatternString = BASEA11yStrings.movesToObjectPatternString;
  var towardsSweaterString = BASEA11yStrings.towardsSweaterString;
  var toWallString = BASEA11yStrings.toWallString;
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
  var upReleasedString = BASEA11yStrings.upReleasedString;
  var leftReleasedString = BASEA11yStrings.leftReleasedString;
  var downReleasedString = BASEA11yStrings.downReleasedString;
  var rightReleasedString = BASEA11yStrings.rightReleasedString;
  var upAndToTheRightReleasedString = BASEA11yStrings.upAndToTheRightReleasedString;
  var upAndToTheLeftReleasedString = BASEA11yStrings.upAndToTheLeftReleasedString;
  var downAndToTheRightReleasedString = BASEA11yStrings.downAndToTheRightReleasedString;
  var downAndToTheLeftReleasedString = BASEA11yStrings.downAndToTheLeftReleasedString;
  var atLeftEdgeString = BASEA11yStrings.atLeftEdgeString;
  var atTopString = BASEA11yStrings.atTopString;
  var atBottomString = BASEA11yStrings.atBottomString;
  var atRightEdgeString = BASEA11yStrings.atRightEdgeString;
  var onSweaterString = BASEA11yStrings.onSweaterString;
  var offSweaterString = BASEA11yStrings.offSweaterString;  
  var balloonAtLocationPatternString = BASEA11yStrings.balloonAtLocationPatternString;
  var balloonOnLocationPatternString = BASEA11yStrings.balloonOnLocationPatternString;
  var closerToObjectPatternString = BASEA11yStrings.closerToObjectPatternString;
  var sweaterString = BASEA11yStrings.sweaterString;
  var wallString = BASEA11yStrings.wallString;
  var centerOfPlayAreaString = BASEA11yStrings.centerOfPlayAreaString;
  var rightEdgeOfPlayAreaString = BASEA11yStrings.rightEdgeOfPlayAreaString;
  var topEdgeOfPlayAreaString = BASEA11yStrings.topEdgeOfPlayAreaString;
  var bottomEdgeOfPlayAreaString = BASEA11yStrings.bottomEdgeOfPlayAreaString;
  var noChangeInPositionPatternString = BASEA11yStrings.noChangeInPositionPatternString;
  var noChangeAndLocationPatternString = BASEA11yStrings.noChangeAndLocationPatternString;
  var nearSweaterString = BASEA11yStrings.nearSweaterString;
  var balloonNearString = BASEA11yStrings.balloonNearString;
  var locationAndInducedChargePatternString = BASEA11yStrings.locationAndInducedChargePatternString;
  var singleStatementPatternString = BASEA11yStrings.singleStatementPatternString;
  var stillMovingPatternString= BASEA11yStrings.stillMovingPatternString;
  var wallNoTransferOfChargeString = BASEA11yStrings.wallNoTransferOfChargeString;
  var wallChargedRubbingAllPatternString = BASEA11yStrings.wallChargedRubbingAllPatternString;
  var wallNeutralRubbingAllPatternString = BASEA11yStrings.wallNeutralRubbingAllPatternString;
  var wallHasManyChargesString = BASEA11yStrings.wallHasManyChargesString;
  var balloonHasRelativeChargePatternString = BASEA11yStrings.balloonHasRelativeChargePatternString;
  var wallPositiveChargesDoNotMoveString = BASEA11yStrings.wallPositiveChargesDoNotMoveString;
  var showAllGrabbedPatternString = BASEA11yStrings.showAllGrabbedPatternString;
  var showNoneGrabbedPatternString = BASEA11yStrings.showNoneGrabbedPatternString;
  var showDifferencesGrabbedPatternString = BASEA11yStrings.showDifferencesGrabbedPatternString;
  var interactionCueString = BASEA11yStrings.interactionCueString;
  var balloonRelativeChargeAllPatternString = BASEA11yStrings.balloonRelativeChargeAllPatternString;
  var balloonNetChargeShowingPatternString = BASEA11yStrings.balloonNetChargeShowingPatternString;
  var showingNoChargesString = BASEA11yStrings.showingNoChargesString;
  var balloonPicksUpChargesPatternString = BASEA11yStrings.balloonPicksUpChargesPatternString;
  var balloonPicksUpMoreChargesPatternString = BASEA11yStrings.balloonPicksUpMoreChargesPatternString;
  var balloonPicksUpChargesDiffPatternString = BASEA11yStrings.balloonPicksUpChargesDiffPatternString;
  var balloonPicksUpMoreChargesDiffPatternString = BASEA11yStrings.balloonPicksUpMoreChargesDiffPatternString;
  var balloonSweaterRelativeChargesPatternString = BASEA11yStrings.balloonSweaterRelativeChargesPatternString;
  var balloonHasNegativeChargePatternString = BASEA11yStrings.balloonHasNegativeChargePatternString;
  var lastChargePickedUpPatternString = BASEA11yStrings.lastChargePickedUpPatternString;

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
    UP: upReleasedString,
    DOWN: downReleasedString,
    LEFT: leftReleasedString,
    RIGHT: rightReleasedString,
    UP_RIGHT: upAndToTheRightReleasedString,
    UP_LEFT: upAndToTheLeftReleasedString,
    DOWN_RIGHT: downAndToTheRightReleasedString,
    DOWN_LEFT: downAndToTheLeftReleasedString
  };

  // maximum velocity of a balloon immediately after release in this simulation, determined by observation
  var MAXIMUM_VELOCITY_ON_RELEASE = 0.4;

  // maps magnitude of velocity to the description
  var BALLOON_VELOCITY_MAP = {
    VERY_SLOWLY_RANGE: {
      range: new Range( 0, MAXIMUM_VELOCITY_ON_RELEASE / 100 ),
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
   * @param {BalloonsAndStaticElectricityModel} model
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
  }

  balloonsAndStaticElectricity.register( 'BalloonDescriber', BalloonDescriber );

  return inherit( Object, BalloonDescriber, {

    /**
     * Get the description for this balloon, including information about the Balloon's location, and charge
     * 
     * @return {string}
     */
    getBalloonDescription: function() {
      var description;
      var showCharges = this.showChargesProperty.get();

      var attractiveStateAndLocationString = this.getAttractiveStateAndLocationDescription();

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

    getNetChargeDescription: function() {
      var chargeAmountString = this.balloonModel.chargeProperty.get() < 0 ? balloonNegativeString : balloonNoString;
      return StringUtils.fillIn( balloonNetChargePatternString, {
        chargeAmount: chargeAmountString
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
        var relativeChargesString = BalloonsAndStaticElectricityDescriber.getRelativeChargeDescription( chargeValue );
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
     * "Yellow balloon has negative net charge, showing several negative charges."
     *
     * Dependent on the charge view.
     * 
     * @return {string}
     */
    getRelativeChargeDescriptionWithLabel: function() {
      var description;
      var relativeCharge = this.getRelativeChargeDescription();
      var chargesShown = this.showChargesProperty.get();

      assert && assert( chargesShown !== 'none', 'relative description with label does not support' );

      if ( chargesShown === 'all' ) {
        description = StringUtils.fillIn( balloonHasRelativeChargePatternString, {
          balloonLabel: this.accessibleLabel,
          relativeCharge: relativeCharge
        } );
      }
      else if ( chargesShown === 'diff' ) {
        description = StringUtils.fillIn( balloonHasNegativeChargePatternString, {
          showing: relativeCharge,
          balloon: this.accessibleLabel
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
        string = this.getNearOrOnDescription();
      }

      return string;
    },

    /**
     * Get the 'near' or 'on' or 'At' description for the balloon, depending on where the balloon is.
     * This is used as part of the balloon location description, and changes depending on interaction
     * or location of balloon.
     * 
     * @return {string}
     */
    getNearOrOnDescription: function() {
      var string;

      var wallVisible = this.wall.isVisibleProperty.get();
      var balloonRight = this.balloonModel.getRight();
      var wallLeft = this.wall.x;
      var balloonInCenterPlayArea = this.balloonModel.playAreaColumnProperty.get() === BalloonLocationEnum.CENTER_PLAY_AREA;

      if ( this.balloonModel.nearWall() || ( balloonRight === wallLeft && !wallVisible ) ) {

        // use 'near' if near the wall, or at the wall location when the the wall is invisible
        // because we are near the right edge
        string = balloonNearString;
      }
      else if ( this.balloonModel.touchingWall() || balloonInCenterPlayArea ) {
        string = balloonAtString;
      }
      else {
        string = balloonOnString;
      }

      return string;
    },

    /**
     * Returns a string that combines the balloon's attractive state and location descriptions. Something
     * like "On center of play area." or "Sticking to wall."
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
     * Get a description of the balloon being "on" an item in the play area. Instead of getting
     * the attractive state of the balloon (like 'touching' or 'sticking' or 'near'), simply say
     * 'on' wherever the balloon is.
     * 
     * @return {string}
     */
    getOnLocationDescription: function() {

      var locationDescription = this.getBalloonLocationDescription();

      return StringUtils.fillIn( balloonLocationAttractiveStatePatternString, {
        attractiveState: this.getNearOrOnDescription(),
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

      return BalloonsAndStaticElectricityDescriber.getLocationDescription( describedBalloonPosition, wallVisible );
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

      var balloonRight = this.balloonModel.getRight();

      // if the balloon is touching the wall (regardless of whether or not it is visible, describe
      // its right edge)
      if ( PlayAreaMap.COLUMN_RANGES.RIGHT_EDGE.contains( balloonRight ) ) {
        describedBalloonPosition = new Vector2( balloonRight, this.balloonModel.getCenterY() ); 
      }
      else if ( this.balloonModel.onSweater() ) {
        describedBalloonPosition = this.balloonModel.getSweaterTouchingCenter();
      }
      else if ( this.balloonModel.nearWall() ) {
        describedBalloonPosition = new Vector2( this.wall.x, this.balloonModel.getCenterY() );
      }
      else {
        describedBalloonPosition = this.balloonModel.getCenter();
      }

      return describedBalloonPosition;
    },

    getTouchingWallDescription: function( balloon, dragging ) {

      var upperLowerString;
      var balloonLocationDescription;
      if ( balloon.inUpperHalfOfPlayArea() ) {
        upperLowerString = BASEA11yStrings.upperWallString;
      }
      else {
        upperLowerString = BASEA11yStrings.lowerWallString;
      }

      if ( balloon.chargeProperty.get() === 0 || dragging ) {
        balloonLocationDescription = StringUtils.format( BASEA11yStrings.touchingWallStringPattern, upperLowerString );
      }
      else {
        balloonLocationDescription = StringUtils.format( BASEA11yStrings.stickingToWallStringPattern, upperLowerString );
      }

      return balloonLocationDescription;
    },

    /**
     * Get an alert that indicates that the balloon has been grabbed for dragging. Will compose
     * a description containing charge information, location information, and help for how
     * to interact with balloon. Amount of charge information will depend on charge visibility
     * setting.
     * 
     * @return {string}
     */
    getDraggedAlert: function() {
      var alertString;
      var chargesShown = this.showChargesProperty.get();

      // attractive state and location is described for every charge view
      var stateAndLocation = this.getOnLocationDescription();

      var relativeChargeString;
      var chargeString;
      if ( chargesShown === 'all' ) {

        relativeChargeString = this.getRelativeChargeDescription();

        // format the relative charge descriptions
        chargeString = StringUtils.fillIn( balloonRelativeChargeAllPatternString, {
          charge: relativeChargeString
        } );

        alertString = StringUtils.fillIn( showAllGrabbedPatternString, {
          grabbed: grabbedString,
          location: stateAndLocation,
          charge: chargeString,
          help: interactionCueString
        } );
      }
      else if ( chargesShown === 'none' ) {
        alertString = StringUtils.fillIn( showNoneGrabbedPatternString, {
          grabbed: grabbedString,
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

        alertString = StringUtils.fillIn( showDifferencesGrabbedPatternString, {
          grabbed: grabbedString,
          location: stateAndLocation,
          relativeCharge: netAndRelativeString,
          help: interactionCueString
        } );
      }

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
      var toObjectString = this.getToObjectString( location, oldLocation );
      var directionString= this.getReleaseDirectionDescription( this.balloonModel.direction );

      var description = StringUtils.fillIn( movesToObjectPatternString, {
        balloonLabel: this.accessibleLabel,
        velocity: velocityString,
        toObject: toObjectString,
        direction: directionString
      } );

      return description;
    },

    /**
     * Get a description of continuous movement of the balloon after it has been released and is
     * still moving through the play area.  Will return something like
     * "Still moving towards sweater."
     * 
     * @param {Vector2} location   
     * @param {Vector2} oldLocation
     * @return
     */
    getContinuousReleaseDescription: function( location, oldLocation ) {
      var attractedObjectString;

      var deltaX = location.x - oldLocation.x;
      if ( deltaX > 0 ) {
        attractedObjectString = wallString;
      }
      else {
        attractedObjectString = sweaterString;
      }

      return StringUtils.fillIn( stillMovingPatternString, {
        toObject: attractedObjectString
      } );
    },

    /**
     * Produces an alert when there is no change in position.  Indicates that there is no change
     * and also reminds user where the balloon currently is.
     * 
     * @return {string}
     */
    getNoChangeReleaseDescription: function() {

      var noChangeString = StringUtils.fillIn( noChangeInPositionPatternString, {
        balloonLabel: this.accessibleLabel
      } );

      var attractiveStateAndLocationDescription = this.getAttractiveStateAndLocationDescription();

      return StringUtils.fillIn( noChangeAndLocationPatternString, {
        noChange: noChangeString,
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
     * Get a string that describes what the balloon is moving toward, one of "to wall" or "towards sweater"
     * 
     * @return {string}
     */
    getToObjectString: function( location, oldLocation ) {

      // if moving right, return moving to wall string, otherwise, moving to sweater
      return ( location.x - oldLocation.x > 0 ) ? toWallString : towardsSweaterString;
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
     * Get a description of wich boundary the balloon is touching.
     * 
     * @return {string}
     */
    getTouchingBoundaryDescription: function() {
      assert && assert ( this.balloonModel.isTouchingBoundary(), 'balloon is not touching a boundary' );

      var boundaryString;
      if ( this.balloonModel.isTouchingBottomBoundary() ) {
        boundaryString = atBottomString;
      }
      else if ( this.balloonModel.isTouchingLeftBoundary() ) {
        boundaryString = atLeftEdgeString;
      }
      else if ( this.balloonModel.isTouchingRightBoundary() ) {
        boundaryString = atRightEdgeString;
      }
      else if ( this.balloonModel.isTouchingTopBoundary() ) {
        boundaryString = atTopString;
      }

      assert && assert ( boundaryString, 'No boundary string found for balloon.' );
      return boundaryString;
    },

    getOnSweaterString: function( onSweater ) {
     return onSweater ? onSweaterString : offSweaterString;
    },

    /**
     * Get the dragging description while the balloon is moving through the play area being dragged.
     * 
     * @return {string}
     */
    getPlayAreaDragNewRegionDescription: function() {

      // if in a boundary location that touches the edge of the play area, considered "On",
      // otherwise considered "At" location
      var balloonCenter = this.balloonModel.getCenter();
      var nearSide = PlayAreaMap.COLUMN_RANGES.RIGHT_PLAY_AREA.contains( balloonCenter.x ) ||
                     PlayAreaMap.COLUMN_RANGES.LEFT_PLAY_AREA.contains( balloonCenter.x );

      var patternString = nearSide ? balloonOnLocationPatternString : balloonAtLocationPatternString;

      var wallVisible = this.model.wall.isVisibleProperty.get();
      var locationString = BalloonsAndStaticElectricityDescriber.getLocationDescription( balloonCenter, wallVisible );

      return StringUtils.fillIn( patternString, {
        location: locationString 
      } );
    },

    /**
     * Get a progress string toward the sweater, wall, top edge, bottom edge, or center of play area.
     * 
     * @return {string}
     */
    getPlayAreaDragProgressDescription: function() {
      var nearestObjectString;

      var centerPlayAreaX = PlayAreaMap.X_LOCATIONS.AT_CENTER_PLAY_AREA;
      var centerPlayAreaY = PlayAreaMap.Y_LOCATIONS.AT_CENTER_PLAY_AREA;
      var balloonCenterX = this.balloonModel.getCenterX();
      var balloonCenterY = this.balloonModel.getCenterY();
      var balloonDirection = this.balloonModel.direction;

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
      return StringUtils.fillIn( closerToObjectPatternString, {
        object: nearestObjectString
      } );
    },

    /**
     * Get a description of where the balloon jumped to.  Depending on where the balloon goes, there
     * could be an indication of where the balloon is in the play area, and potentially the state of
     * the induced charge in the wall.
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
          description = StringUtils.fillIn( singleStatementPatternString, {
            statement: locationDescription
          } );
        }
      }
      return description;
    },

    getSweaterRubbingDescription: function() {
      
    },

    /**
     * Get a description of the balloon rubbing on the wall, including a description for the
     * induced charge if there is any and depending on the charge view
     * @return {[type]} [description]
     */
    getWallRubbingDescription: function() {
      var descriptionString;

      // the location string is used for all charge views
      var locationString = this.getBalloonLocationDescription();
      var atLocationString = StringUtils.fillIn( balloonAtLocationPatternString, {
        location: locationString
      } );

      var shownCharges = this.showChargesProperty.get();
      if ( shownCharges === 'none' ) {
        descriptionString = atLocationString;
      }
      else if ( shownCharges === 'all' ) {
        var wallVisible = this.wall.isVisibleProperty.get();
        var inducedChargeString = WallDescriber.getInducedChargeDescription( this.balloonModel, this.accessibleLabel, wallVisible );
        var balloonChargeString = StringUtils.fillIn( balloonHasRelativeChargePatternString, {
          balloonLabel: this.accessibleLabel,
          relativeCharge: this.getRelativeChargeDescription()
        } );

        if ( this.balloonModel.isCharged() ) {
          descriptionString = StringUtils.fillIn( wallChargedRubbingAllPatternString, {
            location: atLocationString,
            transfer: wallNoTransferOfChargeString,
            inducedCharge: inducedChargeString,
            positiveCharges: wallPositiveChargesDoNotMoveString,
            balloonCharge: balloonChargeString,
            wallCharge: wallHasManyChargesString
          } );
        }
        else {
          descriptionString = StringUtils.fillIn( wallNeutralRubbingAllPatternString, {
            location: atLocationString,
            transfer: wallNoTransferOfChargeString,
            inducedCharge: inducedChargeString,
            balloonCharge: balloonChargeString,
            wallCharge: wallHasManyChargesString
          } );
        }
      }
      else {
        return 'Placeholder for wall rubbing with charge differences view';
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

      assert && assert( shownCharges !== 'none', 'there is no pickup alert for view "none"' );

      var newCharge = this.balloonModel.chargeProperty.get();
      var oldCharge = this.chargeOnPickupDescription;
      var newRange = BalloonsAndStaticElectricityDescriber.getDescribedChargeRange( newCharge );
      var oldRange = BalloonsAndStaticElectricityDescriber.getDescribedChargeRange( oldCharge );

      // if this is the first charge picked up after moving onto sweater, generate
      // a special description to announce that charges have been transfered
      if ( firstPickup ) {
        description = this.getInitialChargePickupDescription();
      }
      else if ( newRange.equals( oldRange ) ) {

        // both views start with this description, something like
        // 'Balloon picks up more negative charges.'
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
      }
      else {

        // if we have entered a new described range since the previous charge alert,
        // we will generate a special description that mentions the relative charges
        var sweaterCharge = this.model.sweater.chargeProperty.get();

        var relativeBalloonCharge = this.getRelativeChargeDescriptionWithLabel();
        var relativeSweaterCharge = SweaterDescriber.getRelativeChargeDescriptionWithLabel( sweaterCharge, shownCharges );

        description = StringUtils.fillIn( balloonSweaterRelativeChargesPatternString, {
          balloon: relativeBalloonCharge,
          sweater: relativeSweaterCharge
        } );
      }

      // update the charge for this generated description
      this.chargeOnPickupDescription = newCharge;

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
    }
  } );
} );