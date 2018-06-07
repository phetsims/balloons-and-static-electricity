// Copyright 2017, University of Colorado Boulder

/**
 * Type Documentation
 * @author Jesse Greenberg
 */

define( function( require ) {
  'use strict';

  // modules
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );
  var BalloonDirectionEnum = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/BalloonDirectionEnum' );
  var BalloonLocationEnum = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/BalloonLocationEnum' );
  var BASEA11yStrings = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/BASEA11yStrings' );
  var BASEDescriber = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/describers/BASEDescriber' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PlayAreaMap = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/PlayAreaMap' );
  var Range = require( 'DOT/Range' );
  var WallDescriber = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/describers/WallDescriber' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );

  // a11y strings
  var atWallString = BASEA11yStrings.atWall.value;
  var balloonStickingToString = BASEA11yStrings.balloonStickingTo.value;
  var balloonOnString = BASEA11yStrings.balloonOn.value;
  var balloonAtString = BASEA11yStrings.balloonAt.value;
  var balloonLocationAttractiveStatePatternString = BASEA11yStrings.balloonLocationAttractiveStatePattern.value;
  var releasedString = BASEA11yStrings.released.value;
  var initialMovementPatternString = BASEA11yStrings.initialMovementPattern.value;
  var continuousMovementWithLabelPatternString = BASEA11yStrings.continuousMovementWithLabelPattern.value;
  var twoBalloonInitialMovementPatternString = BASEA11yStrings.twoBalloonInitialMovementPattern.value;
  var twoBalloonNoChangeAndLocationPatternString = BASEA11yStrings.twoBalloonNoChangeAndLocationPattern.value;
  var twoBalloonNowDirectionPatternString = BASEA11yStrings.twoBalloonNowDirectionPattern.value;
  var extremelySlowlyString  = BASEA11yStrings.extremelySlowly.value;
  var verySlowlyString = BASEA11yStrings.verySlowly.value;
  var slowlyString = BASEA11yStrings.slowly.value;
  var quicklyString = BASEA11yStrings.quickly.value;
  var veryQuicklyString = BASEA11yStrings.veryQuickly.value;
  var upDraggingString = BASEA11yStrings.upDragging.value;
  var leftDraggingString = BASEA11yStrings.leftDragging.value;
  var downDraggingString = BASEA11yStrings.downDragging.value;
  var rightDraggingString = BASEA11yStrings.rightDragging.value;
  var upAndToTheRightDraggingString = BASEA11yStrings.upAndToTheRightDragging.value;
  var upAndToTheLeftDraggingString = BASEA11yStrings.upAndToTheLeftDragging.value;
  var downAndToTheRightDraggingString = BASEA11yStrings.downAndToTheRightDragging.value;
  var downAndToTheLeftDraggingString = BASEA11yStrings.downAndToTheLeftDragging.value;
  var upString = BASEA11yStrings.up.value;
  var leftString = BASEA11yStrings.left.value;
  var downString = BASEA11yStrings.down.value;
  var rightString = BASEA11yStrings.right.value;
  var upAndToTheRightString = BASEA11yStrings.upAndToTheRight.value;
  var upAndToTheLeftString = BASEA11yStrings.upAndToTheLeft.value;
  var downAndToTheRightString = BASEA11yStrings.downAndToTheRight.value;
  var downAndToTheLeftString = BASEA11yStrings.downAndToTheLeft.value;
  var atLeftEdgeString = BASEA11yStrings.atLeftEdge.value;
  var atTopString = BASEA11yStrings.atTop.value;
  var atBottomString = BASEA11yStrings.atBottom.value;
  var atRightEdgeString = BASEA11yStrings.atRightEdge.value;
  var onSweaterString = BASEA11yStrings.onSweater.value;
  var offSweaterString = BASEA11yStrings.offSweater.value;
  var balloonNewRegionPatternString = BASEA11yStrings.balloonNewRegionPattern.value;
  var closerToObjectPatternString = BASEA11yStrings.closerToObjectPattern.value;
  var sweaterString = BASEA11yStrings.sweater.value;
  var wallString = BASEA11yStrings.wall.value;
  var centerOfPlayAreaString = BASEA11yStrings.centerOfPlayArea.value;
  var rightEdgeOfPlayAreaString = BASEA11yStrings.rightEdgeOfPlayArea.value;
  var topEdgeOfPlayAreaString = BASEA11yStrings.topEdgeOfPlayArea.value;
  var bottomEdgeOfPlayAreaString = BASEA11yStrings.bottomEdgeOfPlayArea.value;
  var noChangeAndLocationPatternString = BASEA11yStrings.noChangeAndLocationPattern.value;
  var nearSweaterString = BASEA11yStrings.nearSweater.value;
  var balloonNearString = BASEA11yStrings.balloonNear.value;
  var locationAndInducedChargePatternString = BASEA11yStrings.locationAndInducedChargePattern.value;
  var singleStatementPatternString = BASEA11yStrings.singleStatementPattern.value;
  var interactionCueString = BASEA11yStrings.interactionCue.value;
  var balloonLabelWithAttractiveStatePatternString = BASEA11yStrings.balloonLabelWithAttractiveStatePattern.value;
  var balloonVeryCloseToString = BASEA11yStrings.balloonVeryCloseTo.value;
  var continuousMovementPatternString = BASEA11yStrings.continuousMovementPattern.value;
  var continuousMovementWithLandmarkPatternString = BASEA11yStrings.continuousMovementWithLandmarkPattern.value;
  var nowDirectionPatternString = BASEA11yStrings.nowDirectionPattern.value;
  var balloonLocationNoChangePatternString = BASEA11yStrings.balloonLocationNoChangePattern.value;
  var noChangeWithInducedChargePatternString = BASEA11yStrings.noChangeWithInducedChargePattern.value;
  var balloonLocationNearOtherPatternString = BASEA11yStrings.balloonLocationNearOtherPattern.value;
  var grabbedNonePatternString = BASEA11yStrings.grabbedNonePattern.value;
  var grabbedChargePatternString = BASEA11yStrings.grabbedChargePattern.value;
  var grabbedWithOtherChargePatternString = BASEA11yStrings.grabbedWithOtherChargePattern.value;
  var grabbedWithHelpPatternString = BASEA11yStrings.grabbedWithHelpPattern.value;

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

  // maps magnitude of velocity to the description
  var BALLOON_VELOCITY_MAP = {
    EXTREMELY_SLOWLY_RANGE: {
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
  function BalloonLocationDescriber( balloonDescriber, model, balloonModel, accessibleName, otherAccessibleName ) {

    this.model = model;
    this.wall = model.wall;
    this.balloonModel = balloonModel;
    this.balloonDescriber = balloonDescriber;
    this.accessibleName = accessibleName;
    this.otherAccessibleName = otherAccessibleName;

    // @private - once the balloon has been picked up, we don't need to include certain information on grab until
    // it is reset again
    // TODO: Something like this is used elsewhere, isolate in model
    this.balloonPickedUp = false;
  }

  balloonsAndStaticElectricity.register( 'BalloonLocationDescriber', BalloonLocationDescriber );

  return inherit( Object, BalloonLocationDescriber, {

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
        balloonLabel: this.accessibleName,
        attractiveStateAndLocation: location
      } );

      return StringUtils.fillIn( singleStatementPatternString, {
        statement: alert
      } );
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
     * point where the objects are touching.  If the balloons are both visible and next to each other, a phrase like
     * "next to {{balloon label}}" is added. Will return someting like
     *
     * "center of play area" or
     * "upper wall", or 
     * "wall, next to Green Balloon", or 
     * "right arm of sweater, next to Yellow Balloon"
     * 
     * @return {[type]} [description]
     */
    getBalloonLocationDescription: function() {
      var description;

      var describedBalloonPosition = this.getDescribedPoint();
      var wallVisible = this.wall.isVisibleProperty.get();
      description = BASEDescriber.getLocationDescription( describedBalloonPosition, wallVisible );

      if ( this.model.getBalloonsAdjacent() ) {
        description = StringUtils.fillIn( balloonLocationNearOtherPatternString, {
          location: description,
          otherBalloon: this.otherAccessibleName
        } );
      }

      return description;
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

    /**
     * Get an alert that notifies balloon has entered or left the sweater. If balloon is adjacent to other balloon,
     * this information is included in the alert. Will return something like
     * "On Sweater."
     * "On sweater, next to green balloon"
     * "Off sweater"
     *
     * @param {boolean} onSweater
     * @return {string}
     */
    getOnSweaterString: function( onSweater ) {
      var description;

      if ( onSweater ) {
        description = onSweaterString;

        if ( this.model.getBalloonsAdjacent() ) {
          description = StringUtils.fillIn( balloonLocationNearOtherPatternString, {
            location: description,
            otherBalloon: this.otherAccessibleName
          } );
        }
        else {

          // add punctuation
          description = StringUtils.fillIn( singleStatementPatternString, {
            statement: description
          } );
        }
      }
      else {
        description = offSweaterString;
      }

      return description;
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
     * Generally announced right after the balloon as been released, this is read as an alert. Dependent on whether
     * both balloons are visible. If they are, the label of the released balloon is read prior to the rest of the
     * alert. Will generate something like
     * 
     * "Moves extremely slowly left." or 
     * "Yellow balloon, moves slowly left."
     *
     * @param {Vector2} location - the current location of the balloon
     * @param {Vector2} oldLocation - the previous location of the balloon
     * @return {string}
     */
    getInitialReleaseDescription: function( location, oldLocation ) {

      // the balloon is moving with some initial velocity, describe that
      var velocityString = this.getVelocityString();
      var directionString= this.getReleaseDirectionDescription( this.balloonModel.directionProperty.get() );

      var description;
      if ( this.model.bothBalloonsVisible() ) {
        description = StringUtils.fillIn( twoBalloonInitialMovementPatternString, {
          balloon: this.accessibleName,
          velocity: velocityString,
          direction: directionString
        } );
      }
      else {
        description = StringUtils.fillIn( initialMovementPatternString, {
          velocity: velocityString,
          direction: directionString
        } ); 
      }

      return description;
    },

    /**
     * Get a description of continuous movement of the balloon after it has been released and is
     * still moving through the play area. Label will be added for clarity if both balloons are visible.
     * Will return something like
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

      // describes movement and direction, including label if both balloons are visible
      if ( this.balloonModel.other.isVisibleProperty.get() ) {
        description = StringUtils.fillIn( continuousMovementWithLabelPatternString, {
          balloonLabel: this.accessibleName,
          direction: directionString
        } );
      }
      else {
        description = StringUtils.fillIn( continuousMovementPatternString, {
          direction: directionString
        } );
      }

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
     * and also reminds user where the balloon currently is. If balloon is touching wall and all charges
     * are visible, we include information about the induced charge in the wall. Will return something like
     * "No change in position. Yellow balloon, on left side of Play Area." or
     * "No change in position. Yellow Balloon, at wall. Negative charges in wall move away from yellow balloon a lot."
     * 
     * @return {string}
     */
    getNoChangeReleaseDescription: function() {
      var description;

      var attractiveStateAndLocationDescription = this.getAttractiveStateAndLocationDescriptionWithLabel();
      if ( this.model.bothBalloonsVisible() ) {
        description = StringUtils.fillIn( twoBalloonNoChangeAndLocationPatternString, {
          balloon: this.accessibleName,
          location: attractiveStateAndLocationDescription
        } );
      }
      else {
        description = StringUtils.fillIn( noChangeAndLocationPatternString, {
          location: attractiveStateAndLocationDescription
        } );
      }

      // if balloon touching wall and inducing charge, include induced charge information
      if ( this.balloonModel.touchingWall() && this.model.showChargesProperty.get() === 'all' ) {
        var wallVisible = this.model.wall.isVisibleProperty.get();

        var thisInducingAndVisible = this.balloonModel.inducingChargeAndVisible();
        var otherInducingAndVisible = this.balloonModel.other.inducingChargeAndVisible();

        var inducedChargeString;
        if ( thisInducingAndVisible && otherInducingAndVisible && this.model.getBalloonsAdjacent() ) {

          // if both inducing charge, combine induced charge description with "both balloons"
          inducedChargeString = WallDescriber.getCombinedInducedChargeDescription( this.balloonModel, wallVisible );
        }
        else {
          inducedChargeString = WallDescriber.getInducedChargeDescription( this.balloonModel, this.accessibleName, wallVisible );
        }

        inducedChargeString = WallDescriber.getInducedChargeDescription( this.balloonModel, this.accessibleName, wallVisible );
        inducedChargeString = StringUtils.fillIn( singleStatementPatternString, { statement: inducedChargeString } );

        description = StringUtils.fillIn( noChangeWithInducedChargePatternString, {
          noChange: description,
          inducedCharge: inducedChargeString
        } );
      }

      return description;
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

      return StringUtils.fillIn( singleStatementPatternString, {
        statement: alert
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
        if ( this.model.bothBalloonsVisible() )  {
          description = StringUtils.fillIn( twoBalloonNowDirectionPatternString, {
            balloon: this.accessibleName,
            direction: directionString
          } );
        }
        else {
          description = StringUtils.fillIn( nowDirectionPatternString, {
            direction: directionString
          } );
        }
      }

      return description;
    },

    /**
     * Get a description of the balloon when its independent movement stops. If charges are shown and the balloon is
     * inducing charge, will include induced charge information.
     * Will return something like
     *
     * "Green balloon, at upper wall. In upper wall, no change in charges." or
     * "Green balloon, at wall. Negative charges in wall move away from yellow balloon a little bit."
     * ''
     *
     * @return {string}
     */
    getMovementStopsDescription: function() {
      var descriptionString;

      // the location string is used for all charge views, used as a single sentence
      var locationString = this.getAttractiveStateAndLocationDescriptionWithLabel();

      var shownCharges = this.model.showChargesProperty.get();

      if ( shownCharges === 'all' && this.wall.isVisibleProperty.get() ) {
        var chargeLocationString = this.getBalloonLocationDescription();

        var chargeString;
        if ( this.balloonModel.inducingChargeProperty.get() ) {
          chargeString = WallDescriber.getInducedChargeDescription( this.balloonModel, this.accessibleName, this.wall.isVisibleProperty.get() );
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
     * Returns true if the balloon is moving slow enough to warrant continuous movement descriptions, but fast enough
     * for the movement to be observable. This is to prevent this alert from firing indefinitely if the balloon has
     * some arbitrary velocity.
     *
     * @return {boolean}
     */
    balloonMovingAtContinousDescriptionVelocity: function() {
      var velocityMagnitude = this.balloonModel.velocityProperty.get().magnitude();
      return velocityMagnitude < BALLOON_VELOCITY_MAP.QUICKLY_RANGE.range.max &&
             velocityMagnitude > 0.0005; // value chosen empirically, see #413
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
      var description;

      // charges visible in the view
      var chargesShown = this.model.showChargesProperty.get();

      // attractive state and location is described for every charge view, it is a single sentence in this use case
      var stateAndLocation = this.getOnLocationDescription();
      stateAndLocation = StringUtils.fillIn( singleStatementPatternString, {
        statement: stateAndLocation
      } );

      // get a description of the relative charge of the grabbed balloon, and possibly the other relative charge
      // of the other balloon if visible
      if ( chargesShown !== 'none' ) {
        var chargeDescription;

        if ( this.model.getBalloonsAdjacent() ) {
          chargeDescription = this.balloonDescriber.chargeDescriber.getCombinedRelativeChargeDescription();
        }
        else {
          chargeDescription = this.balloonDescriber.chargeDescriber.getHasRelativeChargeDescription();
        }

        chargeDescription = StringUtils.fillIn( singleStatementPatternString,  {
          statement: chargeDescription
        } );

        // if the balloon is inducing charge, or touching the sweater or wall we include a description for this
        var inducingChargeOrTouchingWall = this.balloonModel.inducingChargeProperty.get() || this.balloonModel.touchingWall();
        var onSweater = this.balloonModel.onSweater();
        if ( inducingChargeOrTouchingWall || onSweater && ( chargesShown !== 'none' ) ) {
          var otherObjectCharge = this.balloonDescriber.chargeDescriber.getOtherObjectChargeDescription();
          chargeDescription = StringUtils.fillIn( grabbedWithOtherChargePatternString, {
            balloonCharge: chargeDescription,
            otherObjectCharge: otherObjectCharge
          } );
        }

        description = StringUtils.fillIn( grabbedChargePatternString, {
          location: stateAndLocation,
          charge: chargeDescription
        } );
      }
      else {

        // no charges shown, just include information about location
        description = StringUtils.fillIn( grabbedNonePatternString, {
          location: stateAndLocation
        } );
      }

      // if this is the first time picking up the balloon, include help content
      if ( !this.balloonPickedUp ) {
        description = StringUtils.fillIn( grabbedWithHelpPatternString, {
          grabbedAlert: description,
          help: interactionCueString
        } );
      }

      // signify that the balloon has been picked up, don't include help conteent again
      this.balloonPickedUp = true;

      return description;
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
        var inducingCharge = this.balloonModel.inducingChargeProperty.get();
        var showCharges = this.model.showChargesProperty.get();

        // if jumping to wall, describe as if balloon is rubbing along the wall for the first time
        if ( this.balloonModel.touchingWallProperty.get() && showCharges !== 'none') {
          if ( showCharges === 'all' ) {

            // describer pairs of charges in the wall if they are visible
            description = this.balloonDescriber.getWallRubbingDescriptionWithChargePairs();
          }
          else {
            description = this.balloonDescriber.getWallRubbingDescription();
          }
        }
        else if ( wallVisible && inducingCharge && showCharges === 'all' ) {
          
          // if there is an induced charge and the charges are visible, describe induced charge summary
          var inducedChargeDescription = WallDescriber.getInducedChargeDescriptionWithNoAmount( this.balloonModel, this.accessibleName, wallVisible );
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

      // after jumping, reset induced charge description flags
      this.inducedChargeDisplacementOnEnd = false;
      return description;
    },

    /**
     * Reset the flag that indicates whether or not the balloon has been successfully picked up.
     * @public
     */
    reset: function() {
      this.balloonPickedUp = false;
    }
  } );
} );
