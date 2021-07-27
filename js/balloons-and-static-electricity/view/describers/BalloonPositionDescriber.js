// Copyright 2016-2021, University of Colorado Boulder

/**
 * Manages all descriptions related to the balloon's position. This file is quite large, but further separation felt
 * forced so I decided to keep all in this file. Used by BalloonDescriber, which manages descriptions from the other
 * describers.
 *
 * @author Jesse Greenberg
 */

import Range from '../../../../../dot/js/Range.js';
import StringUtils from '../../../../../phetcommon/js/util/StringUtils.js';
import balloonsAndStaticElectricity from '../../../balloonsAndStaticElectricity.js';
import BASEA11yStrings from '../../BASEA11yStrings.js';
import BalloonDirectionEnum from '../../model/BalloonDirectionEnum.js';
import PlayAreaMap from '../../model/PlayAreaMap.js';
import BASEDescriber from './BASEDescriber.js';
import WallDescriber from './WallDescriber.js';

const atWallString = BASEA11yStrings.atWall.value;
const balloonStickingToString = BASEA11yStrings.balloonStickingTo.value;
const balloonOnString = BASEA11yStrings.balloonOn.value;
const balloonAtString = BASEA11yStrings.balloonAt.value;
const balloonPositionAttractiveStatePatternString = BASEA11yStrings.balloonPositionAttractiveStatePattern.value;
const initialMovementPatternString = BASEA11yStrings.initialMovementPattern.value;
const continuousMovementWithLabelPatternString = BASEA11yStrings.continuousMovementWithLabelPattern.value;
const twoBalloonInitialMovementPatternString = BASEA11yStrings.twoBalloonInitialMovementPattern.value;
const twoBalloonNoChangeAndPositionPatternString = BASEA11yStrings.twoBalloonNoChangeAndPositionPattern.value;
const twoBalloonNowDirectionPatternString = BASEA11yStrings.twoBalloonNowDirectionPattern.value;
const extremelySlowlyString = BASEA11yStrings.extremelySlowly.value;
const verySlowlyString = BASEA11yStrings.verySlowly.value;
const slowlyString = BASEA11yStrings.slowly.value;
const quicklyString = BASEA11yStrings.quickly.value;
const veryQuicklyString = BASEA11yStrings.veryQuickly.value;
const upDraggingString = BASEA11yStrings.upDragging.value;
const leftDraggingString = BASEA11yStrings.leftDragging.value;
const downDraggingString = BASEA11yStrings.downDragging.value;
const rightDraggingString = BASEA11yStrings.rightDragging.value;
const upAndToTheRightDraggingString = BASEA11yStrings.upAndToTheRightDragging.value;
const upAndToTheLeftDraggingString = BASEA11yStrings.upAndToTheLeftDragging.value;
const downAndToTheRightDraggingString = BASEA11yStrings.downAndToTheRightDragging.value;
const downAndToTheLeftDraggingString = BASEA11yStrings.downAndToTheLeftDragging.value;
const upString = BASEA11yStrings.up.value;
const leftString = BASEA11yStrings.left.value;
const downString = BASEA11yStrings.down.value;
const rightString = BASEA11yStrings.right.value;
const upAndToTheRightString = BASEA11yStrings.upAndToTheRight.value;
const upAndToTheLeftString = BASEA11yStrings.upAndToTheLeft.value;
const downAndToTheRightString = BASEA11yStrings.downAndToTheRight.value;
const downAndToTheLeftString = BASEA11yStrings.downAndToTheLeft.value;
const atLeftEdgeString = BASEA11yStrings.atLeftEdge.value;
const atTopString = BASEA11yStrings.atTop.value;
const atBottomString = BASEA11yStrings.atBottom.value;
const atRightEdgeString = BASEA11yStrings.atRightEdge.value;
const onSweaterString = BASEA11yStrings.onSweater.value;
const offSweaterString = BASEA11yStrings.offSweater.value;
const balloonNewRegionPatternString = BASEA11yStrings.balloonNewRegionPattern.value;
const closerToObjectPatternString = BASEA11yStrings.closerToObjectPattern.value;
const sweaterString = BASEA11yStrings.sweater.value;
const wallString = BASEA11yStrings.wall.value;
const centerOfPlayAreaString = BASEA11yStrings.centerOfPlayArea.value;
const rightEdgeOfPlayAreaString = BASEA11yStrings.rightEdgeOfPlayArea.value;
const topEdgeOfPlayAreaString = BASEA11yStrings.topEdgeOfPlayArea.value;
const bottomEdgeOfPlayAreaString = BASEA11yStrings.bottomEdgeOfPlayArea.value;
const noChangeAndPositionPatternString = BASEA11yStrings.noChangeAndPositionPattern.value;
const nearSweaterString = BASEA11yStrings.nearSweater.value;
const balloonNearString = BASEA11yStrings.balloonNear.value;
const positionAndInducedChargePatternString = BASEA11yStrings.positionAndInducedChargePattern.value;
const singleStatementPatternString = BASEA11yStrings.singleStatementPattern.value;
const keyboardInteractionCueString = BASEA11yStrings.keyboardInteractionCue.value;
const touchInteractionCueString = BASEA11yStrings.touchInteractionCue.value;
const balloonLabelWithAttractiveStatePatternString = BASEA11yStrings.balloonLabelWithAttractiveStatePattern.value;
const balloonVeryCloseToString = BASEA11yStrings.balloonVeryCloseTo.value;
const continuousMovementPatternString = BASEA11yStrings.continuousMovementPattern.value;
const continuousMovementWithLandmarkPatternString = BASEA11yStrings.continuousMovementWithLandmarkPattern.value;
const nowDirectionPatternString = BASEA11yStrings.nowDirectionPattern.value;
const balloonPositionNoChangePatternString = BASEA11yStrings.balloonPositionNoChangePattern.value;
const noChangeWithInducedChargePatternString = BASEA11yStrings.noChangeWithInducedChargePattern.value;
const balloonPositionNearOtherPatternString = BASEA11yStrings.balloonPositionNearOtherPattern.value;
const grabbedNonePatternString = BASEA11yStrings.grabbedNonePattern.value;
const grabbedChargePatternString = BASEA11yStrings.grabbedChargePattern.value;
const grabbedWithOtherChargePatternString = BASEA11yStrings.grabbedWithOtherChargePattern.value;
const grabbedWithHelpPatternString = BASEA11yStrings.grabbedWithHelpPattern.value;

// constants
// maps balloon direction to a description string while the balloon is being dragged
const BALLOON_DIRECTION_DRAGGING_MAP = {
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
const BALLOON_DIRECTION_RELEASE_MAP = {
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
const MAXIMUM_VELOCITY_ON_RELEASE = 0.4;

// speed of the balloon to be considered moving slowly, determined empirically so that descriptions sound nice
const SLOW_BALLOON_SPEED = 0.09;

// maps magnitude of velocity to the description
const BALLOON_VELOCITY_MAP = {
  EXTREMELY_SLOWLY_RANGE: {
    range: new Range( 0, MAXIMUM_VELOCITY_ON_RELEASE / 200 ),
    description: extremelySlowlyString
  },
  VERY_SLOWLY_RANGE: {
    range: new Range( MAXIMUM_VELOCITY_ON_RELEASE / 200, MAXIMUM_VELOCITY_ON_RELEASE / 100 ),
    description: verySlowlyString
  },
  SLOWLY_RANGE: {
    range: new Range( MAXIMUM_VELOCITY_ON_RELEASE / 100, MAXIMUM_VELOCITY_ON_RELEASE / 50 ),
    description: slowlyString
  },
  QUICKLY_RANGE: {
    range: new Range( MAXIMUM_VELOCITY_ON_RELEASE / 50, MAXIMUM_VELOCITY_ON_RELEASE / 4 ),
    description: quicklyString
  },
  VERY_QUICKLY_RANGE: {
    range: new Range( MAXIMUM_VELOCITY_ON_RELEASE / 4, Number.MAX_VALUE ),
    description: veryQuicklyString
  }
};

class BalloonPositionDescriber {

  /**
   * @param {BalloonDescriber} balloonDescriber - manages all balloon descriptions
   * @param {BASEModel} model
   * @param {BalloonModel} balloonModel
   * @param {string} accessibleName - accessible name for this balloon being described
   * @param {string} otherAccessibleName - reference to the other balloon being described
   */
  constructor( balloonDescriber, model, balloonModel, accessibleName, otherAccessibleName ) {

    // @private - for use in instance functions
    this.model = model;
    this.wall = model.wall;
    this.balloonModel = balloonModel;
    this.balloonDescriber = balloonDescriber;
    this.accessibleName = accessibleName;
    this.otherAccessibleName = otherAccessibleName;
  }


  /**
   * Get a description that describes the attractive state or proximity of the balloon, such as
   * "On...", "sticking to...", "Near..." and so on.
   * @private
   *
   * @returns {string}
   */
  getAttractiveStateOrProximityDescription() {
    let string = '';

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
  }

  /**
   * Get the 'near' or 'on' or 'At' description for the balloon, depending on where the balloon is.
   * This is used as part of the balloon position description, and changes depending on interaction
   * or position of balloon.
   *
   * NOTE: This function is undoubtedly horrible for i18n.
   * @private
   *
   * @returns {string}
   */
  getPreposition() {
    let string = '';

    const wallVisible = this.wall.isVisibleProperty.get();

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
    else if ( this.balloonModel.touchingWall() || this.balloonModel.inCenterPlayArea() || this.balloonModel.atLeftEdge() ) {
      string = balloonAtString;
    }
    else {
      string = balloonOnString;
    }

    return string;
  }

  /**
   * Returns a string that combines the balloon's attractive state and position descriptions. Something
   * like "On center of play area" or "Sticking to wall". This fragment is used in a number of different
   * contexts, so it doesn't include punctuation at the end.
   * @public
   *
   * @returns {string}
   */
  getAttractiveStateAndPositionDescription() {
    const positionDescriptionString = this.getBalloonPositionDescription();

    const attractiveStateDescriptionString = this.getAttractiveStateOrProximityDescription();
    const attractiveStateAndPositionString = StringUtils.fillIn( balloonPositionAttractiveStatePatternString, {
      attractiveState: attractiveStateDescriptionString,
      position: positionDescriptionString
    } );

    return attractiveStateAndPositionString;
  }

  /**
   * Get a description about how the balloon is sticking to an object with a label. This will form a full sentence.
   * Returns something like:
   * Yellow balloon, sticking to right arm of sweater.
   * @public
   *
   * @returns {string}
   */
  getAttractiveStateAndPositionDescriptionWithLabel() {

    // to lower case since it is used elsewhere in the string
    const position = this.getAttractiveStateAndPositionDescription().toLowerCase();
    const alert = StringUtils.fillIn( balloonLabelWithAttractiveStatePatternString, {
      balloonLabel: this.accessibleName,
      attractiveStateAndPosition: position
    } );

    return StringUtils.fillIn( singleStatementPatternString, {
      statement: alert
    } );
  }

  /**
   * Get a description of the balloon being "on" an item in the play area. Instead of getting
   * the attractive state of the balloon (like 'touching' or 'sticking' or 'near'), simply say
   * 'on' wherever the balloon is.
   * @public
   *
   * @returns {string}
   */
  getOnPositionDescription() {

    const positionDescription = this.getBalloonPositionDescription();

    return StringUtils.fillIn( balloonPositionAttractiveStatePatternString, {
      attractiveState: this.getPreposition(),
      position: positionDescription
    } );
  }

  /**
   * Return a phrase describing the position of the balloon in the play area.  This is usually described relative
   * to the center of the balloon, unless the balloon is touching an object, in which case it will be relative to the
   * point where the objects are touching.  If the balloons are both visible and next to each other, a phrase like
   * "next to {{balloon label}}" is added. Will return someting like
   *
   * "center of play area" or
   * "upper wall", or
   * "wall, next to Green Balloon", or
   * "right arm of sweater, next to Yellow Balloon"
   * @public
   *
   * @returns {string}
   */
  getBalloonPositionDescription() {
    let description = this.getPositionDescriptionWithoutOverlap();

    // include information about how balloons are adjacent if necessary
    if ( this.model.getBalloonsAdjacent() ) {
      description = StringUtils.fillIn( balloonPositionNearOtherPatternString, {
        position: description,
        otherBalloon: this.otherAccessibleName
      } );
    }

    return description;
  }

  /**
   * Get the description for the position of the balloon, without the extra phrase "next to {{other}} balloon" in
   * the case that the two balloons are adjacent/overlap. Will return something like
   * "center of play area" or
   * "upper wall" or
   *
   * any of the other position descriptions for the PlayAreaMap.
   *
   * @private
   *
   * @returns {string}
   */
  getPositionDescriptionWithoutOverlap() {
    const describedBalloonPosition = this.getDescribedPoint();
    const wallVisible = this.wall.isVisibleProperty.get();
    return BASEDescriber.getPositionDescription( describedBalloonPosition, wallVisible );
  }

  /**
   * Get the point on the balloon that should be described. Generally, this is the balloon center.  If the balloon
   * is touching the sweater or the wall, the point of touching should be described.  If near the wall, the described
   * point is the edge of the wall to accomplish a description like "Yellow balloon, Near upper wall".
   *
   * @private
   *
   * @returns {Vector2}
   */
  getDescribedPoint() {
    let describedBalloonPosition;

    if ( this.balloonModel.onSweater() ) {
      describedBalloonPosition = this.balloonModel.getSweaterTouchingCenter();
    }
    else {
      describedBalloonPosition = this.balloonModel.getCenter();
    }

    return describedBalloonPosition;
  }


  /**
   * Get a short description of the balloon's position at a boundary when there is an attempted drag beyond
   * the boundary.  Will return something like "At bottom" or "At top".
   *
   * @public
   *
   * @returns {string}
   */
  getTouchingBoundaryDescription( attemptedDirection ) {
    assert && assert( this.balloonModel.isTouchingBoundary(), 'balloon is not touching a boundary' );

    let boundaryString;
    if ( this.balloonModel.isTouchingBottomBoundary() && attemptedDirection === BalloonDirectionEnum.DOWN ) {
      boundaryString = atBottomString;
    }
    else if ( this.balloonModel.isTouchingLeftBoundary() && attemptedDirection === BalloonDirectionEnum.LEFT ) {
      boundaryString = atLeftEdgeString;
    }
    else if ( this.balloonModel.touchingWall() && attemptedDirection === BalloonDirectionEnum.RIGHT ) {
      boundaryString = atWallString;
    }
    else if ( this.balloonModel.isTouchingRightEdge() && attemptedDirection === BalloonDirectionEnum.RIGHT ) {
      boundaryString = atRightEdgeString;
    }
    else if ( this.balloonModel.isTouchingTopBoundary() && attemptedDirection === BalloonDirectionEnum.UP ) {
      boundaryString = atTopString;
    }

    assert && assert( boundaryString, 'No boundary string found for balloon.' );
    return boundaryString;
  }

  /**
   * Get an alert that notifies balloon has entered or left the sweater. If balloon is adjacent to other balloon,
   * this information is included in the alert. Will return something like
   * "On Sweater."
   * "On sweater, next to green balloon"
   * "Off sweater"
   *
   * @public
   *
   * @param {boolean} onSweater
   * @returns {string}
   */
  getOnSweaterString( onSweater ) {
    let description;

    if ( onSweater ) {
      description = onSweaterString;

      if ( this.model.getBalloonsAdjacent() ) {
        description = StringUtils.fillIn( balloonPositionNearOtherPatternString, {
          position: description,
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
  }

  /**
   * Get a description of the balloon's dragging movement when it enters a landmark. Dependent on balloon velocity,
   * drag velocity, and movement direction. Depending on these variables, we might not announce this alert, so
   * this function can return null.
   * @public
   *
   * @returns {string|null}
   */
  getLandmarkDragDescription() {
    const playAreaLandmark = this.balloonModel.playAreaLandmarkProperty.get();
    const dragSpeed = this.balloonModel.dragVelocityProperty.get().magnitude;
    let alert = this.getAttractiveStateAndPositionDescription();

    // wrap as a single statement with punctuation
    alert = StringUtils.fillIn( singleStatementPatternString, { statement: alert } );

    // cases where we do not want to announce the alert
    if ( this.balloonModel.movingRight() && playAreaLandmark === 'AT_NEAR_SWEATER' ) {

      // if moving to the right and we enter the 'near sweater' landmark, ignore
      alert = null;
    }
    else if ( playAreaLandmark === 'AT_VERY_CLOSE_TO_WALL' || playAreaLandmark === 'AT_VERY_CLOSE_TO_RIGHT_EDGE' ) {

      // only announce that we are very close to the wall when moving slowly and when the wall is visible
      if ( dragSpeed > SLOW_BALLOON_SPEED ) {
        alert = null;
      }
    }

    return alert;
  }

  /**
   * Get an alert that describes progress of balloon movement through a single cell in the play area. This information
   * will only be provided to a keyboard user.
   *
   * Will  be something like:
   * "At center of play area." or
   * "Closer to sweater."
   *
   * @public
   *
   * @returns {string}
   */
  getKeyboardMovementAlert() {
    let alert;

    // percent of progress through the region
    const progressThroughCell = this.balloonModel.getProgressThroughRegion();
    const dragVelocity = this.balloonModel.dragVelocityProperty.get().magnitude;
    const movingDiagonally = this.balloonModel.movingDiagonally();

    if ( dragVelocity > SLOW_BALLOON_SPEED && progressThroughCell >= 0.66 && !movingDiagonally ) {

      // if drag velocity fast and progress through the cell is greater than 60%, announce progress towards destination
      alert = this.getPlayAreaDragProgressDescription();
    }
    else if ( dragVelocity < SLOW_BALLOON_SPEED && progressThroughCell >= 0.5 && !movingDiagonally ) {

      // when drag velocity slow and progress through cell greater than 0.5, announce progress towards destination
      alert = this.getPlayAreaDragProgressDescription();
    }
    else {

      // just announce the current position in the play area
      alert = this.getAttractiveStateAndPositionDescription();
      alert = StringUtils.fillIn( singleStatementPatternString, { statement: alert } );
    }
    return alert;
  }

  /**
   * Generally announced right after the balloon as been released, this is read as an alert. Dependent on whether
   * both balloons are visible. If they are, the label of the released balloon is read prior to the rest of the
   * alert. Will generate something like
   *
   * "Moves extremely slowly left." or
   * "Yellow balloon, moves slowly left."
   *
   * @public
   *
   * @param {Vector2} position - the current position of the balloon
   * @param {Vector2} oldPosition - the previous position of the balloon
   * @returns {string}
   */
  getInitialReleaseDescription( position, oldPosition ) {

    // the balloon is moving with some initial velocity, describe that
    const velocityString = this.getVelocityString();
    const directionString = this.getReleaseDirectionDescription( this.balloonModel.directionProperty.get() );

    let description;
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
  }

  /**
   * Get a description of continuous movement of the balloon after it has been released and is
   * still moving through the play area. Label will be added for clarity if both balloons are visible.
   * Will return something like
   * "Moving Left." or
   * "Moving Left. Near wall."
   *
   * @public
   *
   * @returns {string}
   */
  getContinuousReleaseDescription() {
    let description;
    const directionString = this.getReleaseDirectionDescription( this.balloonModel.directionProperty.get() );

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
        landmark: this.getOnPositionDescription()
      } );
    }

    return description;
  }

  /**
   * Produces an alert when there is no change in position.  Indicates that there is no change
   * and also reminds user where the balloon currently is. If balloon is touching wall and all charges
   * are visible, we include information about the induced charge in the wall. Will return something like
   * "No change in position. Yellow balloon, on left side of Play Area." or
   * "No change in position. Yellow Balloon, at wall. Negative charges in wall move away from yellow balloon a lot."
   *
   * @public
   *
   * @returns {string}
   */
  getNoChangeReleaseDescription() {
    let description;

    const attractiveStateAndPositionDescription = this.getAttractiveStateAndPositionDescriptionWithLabel();
    if ( this.model.bothBalloonsVisible() ) {
      description = StringUtils.fillIn( twoBalloonNoChangeAndPositionPatternString, {
        balloon: this.accessibleName,
        position: attractiveStateAndPositionDescription
      } );
    }
    else {
      description = StringUtils.fillIn( noChangeAndPositionPatternString, {
        position: attractiveStateAndPositionDescription
      } );
    }

    // if balloon touching wall and inducing charge, include induced charge information
    if ( this.balloonModel.touchingWall() && this.model.showChargesProperty.get() === 'all' ) {
      const wallVisible = this.model.wall.isVisibleProperty.get();

      const thisInducingAndVisible = this.balloonModel.inducingChargeAndVisible();
      const otherInducingAndVisible = this.balloonModel.other.inducingChargeAndVisible();

      let inducedChargeString;
      if ( thisInducingAndVisible && otherInducingAndVisible && this.model.getBalloonsAdjacent() ) {

        // if both inducing charge, combine induced charge description with "both balloons"
        inducedChargeString = WallDescriber.getCombinedInducedChargeDescription( this.balloonModel, wallVisible );
      }
      else {
        inducedChargeString = WallDescriber.getInducedChargeDescription( this.balloonModel, this.accessibleName, wallVisible );
      }

      inducedChargeString = StringUtils.fillIn( singleStatementPatternString, { statement: inducedChargeString } );

      description = StringUtils.fillIn( noChangeWithInducedChargePatternString, {
        noChange: description,
        inducedCharge: inducedChargeString
      } );
    }

    return description;
  }

  /**
   * Get a description of velocity for this balloon, one of "very slowly", "slowly", "quickly", "very quickly"
   *
   * @private
   * @returns {string}
   */
  getVelocityString() {
    let velocityString;

    const balloonVelocity = this.balloonModel.velocityProperty.get();

    const keys = Object.keys( BALLOON_VELOCITY_MAP );
    for ( let i = 0; i < keys.length; i++ ) {
      const entry = BALLOON_VELOCITY_MAP[ keys[ i ] ];
      if ( entry.range.contains( balloonVelocity.magnitude ) ) {
        velocityString = entry.description;
        break;
      }
    }

    assert && assert( velocityString, 'no velocity description found' );

    return velocityString;
  }

  /**
   * Get a movement description from the movement direction tracked in the model.  The direction
   * is one of BalloonDirectionEnum.
   *
   * @private
   *
   * @param {string} direction - one of BalloonDirectionEnum
   * @returns {string}
   */
  getDraggingDirectionDescription( direction ) {
    const movementString = BALLOON_DIRECTION_DRAGGING_MAP[ direction ];

    assert && assert( movementString, `no direction description found for balloon moving direction ${direction}` );
    return movementString;
  }

  /**
   * Get a description of the balloon movement direction when the balloon is not currently
   * being dragged.
   *
   * @public
   *
   * @param  {string} direction - one of BalloonDirectionEnum
   */
  getReleaseDirectionDescription( direction ) {
    const movementString = BALLOON_DIRECTION_RELEASE_MAP[ direction ];

    assert && assert( movementString, `no direction description found for balloon moving direction ${direction}` );
    return movementString;
  }

  /**
   * Get the dragging description while the balloon is moving through the play area being dragged and enters
   * a new region in the play area.
   *
   * @public
   *
   * @returns {string}
   */
  getPlayAreaDragNewRegionDescription() {

    const nearOrAt = this.getPreposition();
    const balloonCenter = this.balloonModel.getCenter();

    const wallVisible = this.model.wall.isVisibleProperty.get();
    const positionString = BASEDescriber.getPositionDescription( balloonCenter, wallVisible );

    return StringUtils.fillIn( balloonNewRegionPatternString, {
      nearOrAt: nearOrAt,
      position: positionString
    } );
  }

  /**
   * Get a progress string toward the sweater, wall, top edge, bottom edge, or center of play area.
   *
   * @private
   *
   * @returns {string}
   */
  getPlayAreaDragProgressDescription() {
    let nearestObjectString;

    const centerPlayAreaX = PlayAreaMap.X_POSITIONS.AT_CENTER_PLAY_AREA;
    const centerPlayAreaY = PlayAreaMap.Y_POSITIONS.AT_CENTER_PLAY_AREA;
    const balloonCenterX = this.balloonModel.getCenterX();
    const balloonCenterY = this.balloonModel.getCenterY();
    const balloonDirection = this.balloonModel.directionProperty.get();

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

    assert && assert( nearestObjectString, `no nearest object found for movement direction: ${balloonDirection}` );
    const alert = StringUtils.fillIn( closerToObjectPatternString, {
      object: nearestObjectString
    } );

    return StringUtils.fillIn( singleStatementPatternString, {
      statement: alert
    } );
  }

  /**
   * Get a description about the change in direction. If the balloon is grabbed, only the direction will be in the
   * description. Otherwise, it will be an update to direction, so add "Now". Will return something like
   *
   * "Left." or
   * "Now Left."
   *
   * @public
   *
   * @returns {string}
   */
  getDirectionChangedDescription() {
    let description;

    const direction = this.balloonModel.directionProperty.get();
    if ( this.balloonModel.isDraggedProperty.get() ) {

      // when dragged, just the direction
      description = this.getDraggingDirectionDescription( direction );
    }
    else {

      // when not dragged, add 'Now' to direction
      const directionString = this.getReleaseDirectionDescription( direction );
      if ( this.model.bothBalloonsVisible() ) {
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
  }

  /**
   * Get a description of the balloon when its independent movement stops. If charges are shown and the balloon is
   * inducing charge, will include induced charge information.
   * Will return something like
   *
   * "Green balloon, at upper wall. In upper wall, no change in charges." or
   * "Green balloon, at wall. Negative charges in wall move away from yellow balloon a little bit."
   *
   * @public
   *
   * @returns {string}
   */
  getMovementStopsDescription() {
    let descriptionString;

    // the position string is used for all charge views, used as a single sentence
    const positionString = this.getAttractiveStateAndPositionDescriptionWithLabel();

    const shownCharges = this.model.showChargesProperty.get();

    if ( shownCharges === 'all' && this.wall.isVisibleProperty.get() ) {

      // don't include information about adjacency to other balloon in this position  description
      const chargePositionString = this.getPositionDescriptionWithoutOverlap();

      let chargeString;
      if ( this.balloonModel.inducingChargeProperty.get() ) {
        chargeString = WallDescriber.getInducedChargeDescription( this.balloonModel, this.accessibleName, this.wall.isVisibleProperty.get() );
      }
      else {
        chargeString = WallDescriber.getNoChangeInChargesDescription( chargePositionString );
      }
      descriptionString = StringUtils.fillIn( balloonPositionNoChangePatternString, {
        position: positionString,
        inducedCharge: chargeString
      } );
    }
    else {
      descriptionString = positionString;
    }

    return descriptionString;
  }

  /**
   * Returns true if the balloon is moving slow enough to warrant continuous movement descriptions, but fast enough
   * for the movement to be observable. This is to prevent this alert from firing indefinitely if the balloon has
   * some arbitrary velocity.
   *
   * @public
   *
   * @returns {boolean}
   */
  balloonMovingAtContinuousDescriptionVelocity() {
    const velocityMagnitude = this.balloonModel.velocityProperty.get().magnitude;
    return velocityMagnitude < BALLOON_VELOCITY_MAP.QUICKLY_RANGE.range.max &&
           velocityMagnitude > 0.0005; // value chosen empirically, see #413
  }

  /**
   * Get an alert that indicates that the balloon has been grabbed for dragging. Will compose
   * a description containing charge information, position information, and help for how
   * to interact with balloon. Amount of charge information will depend on charge visibility
   * setting. If the balloon is inducing charge, information about induced charge will be included.
   * If the balloon is on the sweater, will include information about the charges on the sweater. After the
   * balloon has been picked up once, we don't need to describe help information until reset.
   *
   * @public
   *
   * @returns {string}
   */
  getGrabbedAlert() {
    let description;

    // charges visible in the view
    const chargesShown = this.model.showChargesProperty.get();

    // attractive state and position is described for every charge view, it is a single sentence in this use case
    let stateAndPosition = this.getOnPositionDescription();
    stateAndPosition = StringUtils.fillIn( singleStatementPatternString, {
      statement: stateAndPosition
    } );

    // get a description of the relative charge of the grabbed balloon, and possibly the other relative charge
    // of the other balloon if visible
    if ( chargesShown !== 'none' ) {
      let chargeDescription;

      if ( this.model.getBalloonsAdjacent() ) {
        chargeDescription = this.balloonDescriber.chargeDescriber.getCombinedRelativeChargeDescription();
      }
      else {
        chargeDescription = this.balloonDescriber.chargeDescriber.getHasRelativeChargeDescription();
      }

      chargeDescription = StringUtils.fillIn( singleStatementPatternString, {
        statement: chargeDescription
      } );

      // if the balloon is inducing charge, or touching the sweater or wall we include a description for this
      const inducingChargeOrTouchingWall = this.balloonModel.inducingChargeProperty.get() || this.balloonModel.touchingWall();
      const onSweater = this.balloonModel.onSweater();
      if ( inducingChargeOrTouchingWall || onSweater && ( chargesShown !== 'none' ) ) {
        const otherObjectCharge = this.balloonDescriber.chargeDescriber.getOtherObjectChargeDescription();
        chargeDescription = StringUtils.fillIn( grabbedWithOtherChargePatternString, {
          balloonCharge: chargeDescription,
          otherObjectCharge: otherObjectCharge
        } );
      }

      description = StringUtils.fillIn( grabbedChargePatternString, {
        position: stateAndPosition,
        charge: chargeDescription
      } );
    }
    else {

      // no charges shown, just include information about position
      description = StringUtils.fillIn( grabbedNonePatternString, {
        position: stateAndPosition
      } );
    }

    // if this is the first time picking up the balloon, include help content
    if ( !this.balloonModel.successfulPickUp ) {
      description = StringUtils.fillIn( grabbedWithHelpPatternString, {
        grabbedAlert: description,
        help: phet.joist.sim.supportsGestureDescription ? touchInteractionCueString : keyboardInteractionCueString
      } );
    }

    this.balloonModel.successfulPickUp = true;

    return description;
  }

  /**
   * Get a description of where the balloon jumped to.  Depending on where the balloon goes, there
   * could be an indication of where the balloon is in the play area, and potentially the state of
   * the induced charge in the wall.
   *
   * @public
   * @param  {Vector2} center
   * @returns {string}
   */
  getJumpingDescription( center ) {
    let description = '';

    // all jumping is in the x direction
    const centerX = center.x;

    // determine which description we should use depending on the center position of the balloon
    if ( centerX === PlayAreaMap.X_POSITIONS.AT_NEAR_SWEATER ) {
      description = nearSweaterString;
    }
    else {

      // general position description for the balloon
      const positionDescription = this.getAttractiveStateAndPositionDescription();

      // state variables used to generate description content
      const wallVisible = this.wall.isVisibleProperty.get();
      const inducingCharge = this.balloonModel.inducingChargeProperty.get();
      const showCharges = this.model.showChargesProperty.get();

      // if jumping to wall, describe as if balloon is rubbing along the wall for the first time
      if ( this.balloonModel.touchingWallProperty.get() && showCharges !== 'none' ) {
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
        const inducedChargeDescription = WallDescriber.getInducedChargeDescriptionWithNoAmount( this.balloonModel, this.accessibleName, wallVisible );
        description = StringUtils.fillIn( positionAndInducedChargePatternString, {
          position: positionDescription,
          inducedCharge: inducedChargeDescription
        } );
      }
      else {

        // otherwise, only provide the position description
        description = StringUtils.fillIn( singleStatementPatternString, {
          statement: positionDescription
        } );
      }
    }

    // after jumping, reset induced charge description flags
    this.inducedChargeDisplacementOnEnd = false;
    return description;
  }
}

balloonsAndStaticElectricity.register( 'BalloonPositionDescriber', BalloonPositionDescriber );

export default BalloonPositionDescriber;