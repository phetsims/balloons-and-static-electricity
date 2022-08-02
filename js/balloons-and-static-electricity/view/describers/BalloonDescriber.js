// Copyright 2016-2022, University of Colorado Boulder

/**
 * Manages accessibility descriptions for a balloon in this simulation. Is responsible for functions that
 * generate descriptions, as well as adding updating descriptive content and announcing alerts when model Properties
 * change.
 *
 * Some alerts require polling because they have to be announced after a lack of property change after some interaction.
 * For instance, after a balloon is released, if it doesn't move due to an applied force we need to alert that there
 * was no movement. So BalloonDecriber manages the before/after values necessary to accomplish this. Property observers
 * are used where possible, but for alerts that need to be timed around those that use polling, it is more
 * straight forward to have those use polling as well.
 *
 * This file is quite large. It distributes some logic into additional files (BalloonPositionDescriber,
 * BalloonChargeDescriber) that describe particular aspects of a balloon. Further abstraction doesn't feel helpful
 * as it all pertains to general balloon description, so I decided to keep the remaining functions in this file for
 * easy discoverability.
 *
 * @author Jesse Greenberg
 */

import Vector2 from '../../../../../dot/js/Vector2.js';
import merge from '../../../../../phet-core/js/merge.js';
import StringUtils from '../../../../../phetcommon/js/util/StringUtils.js';
import Alerter from '../../../../../scenery-phet/js/accessibility/describers/Alerter.js';
import AriaLiveAnnouncer from '../../../../../utterance-queue/js/AriaLiveAnnouncer.js';
import Utterance from '../../../../../utterance-queue/js/Utterance.js';
import balloonsAndStaticElectricity from '../../../balloonsAndStaticElectricity.js';
import BASEA11yStrings from '../../BASEA11yStrings.js';
import BASEConstants from '../../BASEConstants.js';
import PlayAreaMap from '../../model/PlayAreaMap.js';
import BalloonChargeDescriber from './BalloonChargeDescriber.js';
import BalloonPositionDescriber from './BalloonPositionDescriber.js';
import BASEDescriber from './BASEDescriber.js';
import SweaterDescriber from './SweaterDescriber.js';
import WallDescriber from './WallDescriber.js';

const balloonShowAllChargesPatternString = BASEA11yStrings.balloonShowAllChargesPattern.value;
const balloonAtPositionPatternString = BASEA11yStrings.balloonAtPositionPattern.value;
const singleStatementPatternString = BASEA11yStrings.singleStatementPattern.value;
const balloonPicksUpChargesPatternString = BASEA11yStrings.balloonPicksUpChargesPattern.value;
const balloonPicksUpMoreChargesPatternString = BASEA11yStrings.balloonPicksUpMoreChargesPattern.value;
const balloonPicksUpChargesDiffPatternString = BASEA11yStrings.balloonPicksUpChargesDiffPattern.value;
const balloonPicksUpMoreChargesDiffPatternString = BASEA11yStrings.balloonPicksUpMoreChargesDiffPattern.value;
const balloonSweaterRelativeChargesPatternString = BASEA11yStrings.balloonSweaterRelativeChargesPattern.value;
const lastChargePickedUpPatternString = BASEA11yStrings.lastChargePickedUpPattern.value;
const noChargePickupPatternString = BASEA11yStrings.noChargePickupPattern.value;
const noChangeInChargesString = BASEA11yStrings.noChangeInCharges.value;
const noChangeInNetChargeString = BASEA11yStrings.noChangeInNetCharge.value;
const noChargePickupHintPatternString = BASEA11yStrings.noChargePickupHintPattern.value;
const nochargePickupWithObjectChargeAndHint = BASEA11yStrings.nochargePickupWithObjectChargeAndHint.value;
const releaseHintString = BASEA11yStrings.releaseHint.value;
const balloonAddedPatternString = BASEA11yStrings.balloonAddedPattern.value;
const balloonRemovedPatternString = BASEA11yStrings.balloonRemovedPattern.value;
const balloonAddedWithPositionPatternString = BASEA11yStrings.balloonAddedWithPositionPattern.value;
const wallRubbingWithPairsPattern = BASEA11yStrings.wallRubbingWithPairsPattern.value;
const wallRubPatternString = BASEA11yStrings.wallRubPattern.value;
const wallRubAllPatternString = BASEA11yStrings.wallRubAllPattern.value;
const wallRubDiffPatternString = BASEA11yStrings.wallRubDiffPattern.value;

// constants
// in ms, delay before announcing an alert that describes independent movement, to give the model time to respond
const RELEASE_DESCRIPTION_TIME_DELAY = 50;

// in ms, limits frequency of charge pickup alerts
const CHARGE_DESCRIPTION_REFRESH_RATE = 2000;

// in ms, time between alerts that tell user balloon continues to move due to force
const RELEASE_DESCRIPTION_REFRESH_RATE = 5000;

class BalloonDescriber extends Alerter {
  /**
   * @param {BASEModel} model
   * @param {WallModel} wall
   * @param {BalloonModel} balloon
   * @param {string} accessibleLabel - accessible name for the balloon being described
   * @param {string} otherAccessibleLabel - accessible name for the other balloon being described
   * @param {Node} nodeToAlertWith - need a connected Node to alert to a description UtteranceQueue
   */
  constructor( model, wall, balloon, accessibleLabel, otherAccessibleLabel, nodeToAlertWith ) {

    super( {
      descriptionAlertNode: nodeToAlertWith
    } );
    // @private
    this.model = model;
    this.wall = wall;
    this.balloonModel = balloon;
    this.accessibleName = accessibleLabel;
    this.otherAccessibleName = otherAccessibleLabel;
    this.showChargesProperty = model.showChargesProperty;
    this.nodeToAlertWith = nodeToAlertWith;

    // @private - manages descriptions about the balloon related to charge
    this.chargeDescriber = new BalloonChargeDescriber( model, balloon, accessibleLabel, otherAccessibleLabel );

    // @private - manages descriptions about the  balloon related to balloon movement and position
    this.movementDescriber = new BalloonPositionDescriber( this, model, balloon, accessibleLabel, otherAccessibleLabel );

    // @private - used to track previous values after an interaction so that we can accurately describe how
    // the model has changed
    this.describedChargeRange = null;

    // @private (a11y) {boolean} - a flag that manages whether or not we should alert the first charge pickup of the
    // balloon, will be set to true every time the balloon enters or leaves the sweater so that in this case, we hear
    // "Balloon picks up negative charges from sweater"
    this.alertFirstPickup = false;

    // @private (a11y) {boolean} - a flag that manages how often we should announce a charge
    // pickup alert, every time interval of CHARGE_DESCRIPTION_REFRESH_RATE, this is set to true so we don't
    // alert every time the balloon picks up a charges.
    this.alertNextPickup = false;

    // @private - variables tracking state and how it changes between description steps, see step() below
    this.describedVelocity = balloon.velocityProperty.get();
    this.describedDragVelocity = balloon.dragVelocityProperty.get();
    this.describedPosition = balloon.positionProperty.get();
    this.describedVisible = balloon.isVisibleProperty.get();
    this.describedTouchingWall = balloon.touchingWallProperty.get();
    this.describedIsDragged = balloon.isDraggedProperty.get();
    this.describedWallVisible = wall.isVisibleProperty.get();
    this.describedDirection = null;
    this.describedCharge = 0;

    // @private {Utterance} - utterances to be sent to the queue, with a bit of a delay they won't spam
    // the user if they hit the queue to frequently
    const utteranceOptions = { alertStableDelay: 500 };
    this.directionUtterance = new Utterance();
    this.movementUtterance = new Utterance( merge( utteranceOptions, {

      // trying to make movement alerts assertive to reduce pile up of alerts while dragging the balloon, see
      // https://github.com/phetsims/balloons-and-static-electricity/issues/491
      announcerOptions: {
        ariaLivePriority: AriaLiveAnnouncer.AriaLive.ASSERTIVE
      }
    } ) );
    this.inducedChargeChangeUtterance = new Utterance( utteranceOptions );
    this.noChargePickupUtterance = new Utterance( utteranceOptions );
    this.chargePickupUtterance = new Utterance( utteranceOptions );

    // @private {Utterance} utterances for specific events that let us make things assertive/polite
    this.grabReleaseUtterance = new Utterance( {

      // grab/release alerts are assertive, see https://github.com/phetsims/balloons-and-static-electricity/issues/491
      announcerOptions: {
        ariaLivePriority: AriaLiveAnnouncer.AriaLive.ASSERTIVE
      }
    } );

    // @private - used to determine change in position during a single drag movement, copied to avoid reference issues
    this.oldDragPosition = balloon.positionProperty.get().copy();

    // @private - monitors position delta in a single drag
    this.dragDelta = new Vector2( 0, 0 );

    // @private - used to watch how much charge is picked up in a single drag action
    this.chargeOnStartDrag = balloon.chargeProperty.get();

    // @private - used to determine how much charge is picked up in a single drag action
    this.chargeOnEndDrag = balloon.chargeProperty.get();

    // @private - time since an alert related to charge pickup has been announced
    this.timeSinceChargeAlert = 0;

    // @private {boolean} - every time we drag, mark this as true so we know to describe a lack of charge pick up
    // on the sweater. Once this rub has been described, set to false
    this.rubAlertDirty = false;

    // @private {boolean} - whether or not we describe direction changes. After certain interactions we do not want
    // to describe the direction, or the direction is included implicitly in another alert
    this.describeDirection = true;

    // @private {boolean} - flag that indicates that user actions have lead to it being time for a "wall rub" to be
    // described
    this.describeWallRub = false;

    // @private {boolean} - a flag that tracks if the initial movement of the balloon after release has
    // been described. Gets reset whenever the balloon is picked up, and when the wall is removed while
    // the balloon is sticking to the wall. True so we get non alert on start up
    this.initialMovementDescribed = true;

    // @private {boolean} - timer tracking amount of time between release alerts, used to space out alerts describing
    // continuous independent movement like "Moving left...Moving left...Moving left...", and so on
    this.timeSinceReleaseAlert = 0;

    // @private {boolean} - flag that will prevent the firing of the "no movement" alert, set to true with toggling
    // balloon visibility as a special case so we don't trigger this alert when added to the play area
    this.preventNoMovementAlert = false;

    // when visibility changes, generate the alert and be sure to describe initial movement the next time the
    // balloon is released or added to the play area
    balloon.isVisibleProperty.lazyLink( isVisible => {
      this.alertDescriptionUtterance( this.getVisibilityChangedDescription() );
      this.initialMovementDescribed = false;
      this.preventNoMovementAlert = true;
    } );

    // pdom - if we enter/leave the sweater announce that immediately
    balloon.onSweaterProperty.link( onSweater => {
      if ( balloon.isDraggedProperty.get() ) {
        this.alertDescriptionUtterance( this.movementDescriber.getOnSweaterString( onSweater ) );
      }

      // entering sweater, indicate that we need to alert the next charge pickup
      this.alertFirstPickup = true;
    } );

    // @private {number} distance the balloon has moved since we last sent an alert to the utteranceQueue. After a
    // successful alert we don't send any alerts to the utterance queue until we have substantial balloon movement
    // to avoid a pile-up of alerts.
    this.distanceSinceDirectionAlert = 0;

    // @private {Vector2} the position of the balloon when we send an alert to the utteranceQueue. After a successful
    // alert, we don't alert again until there is sufficient movement to avoid a pile-up of alerts
    this.positionOnAlert = this.balloonModel.positionProperty.get();

    this.balloonModel.positionProperty.link( position => {
      this.distanceSinceDirectionAlert = position.minus( this.positionOnAlert ).magnitude;
    } );

    // when drag velocity starts from zero, or hits zero, update charge counts on start/end drag so we can determine
    // how much charge has been picked up in a single interaction
    this.balloonModel.dragVelocityProperty.link( ( velocity, oldVelocity ) => {
      if ( oldVelocity ) {
        if ( oldVelocity.equals( Vector2.ZERO ) ) {

          // we just started dragging
          this.chargeOnStartDrag = balloon.chargeProperty.get();
        }
        else if ( velocity.equals( Vector2.ZERO ) ) {

          // we just finished a drag interaction
          this.chargeOnEndDrag = balloon.chargeProperty.get();
        }
      }
    } );
  }


  /**
   * Reset the describer, resetting flags that are required to manipulate provided descriptions.
   * @public
   */
  reset() {
    this.chargeDescriber.reset();
    this.describedChargeRange = null;

    this.alertFirstPickup = false;
    this.alertNextPickup = false;

    // reset all variables tracking previous descriptions
    this.describedVelocity = this.balloonModel.velocityProperty.get();
    this.describedDragVelocity = this.balloonModel.dragVelocityProperty.get();
    this.describedPosition = this.balloonModel.positionProperty.get();
    this.describedVisible = this.balloonModel.isVisibleProperty.get();
    this.describedTouchingWall = this.balloonModel.touchingWallProperty.get();
    this.describedIsDragged = this.balloonModel.isDraggedProperty.get();
    this.describedWallVisible = this.wall.isVisibleProperty.get();
    this.describedDirection = null;
    this.describedCharge = 0;

    this.oldDragPosition = this.balloonModel.positionProperty.get().copy();
    this.dragDelta = new Vector2( 0, 0 );
    this.chargeOnStartDrag = this.balloonModel.chargeProperty.get();
    this.chargeOnEndDrag = this.balloonModel.chargeProperty.get();
    this.timeSinceChargeAlert = 0;
    this.rubAlertDirty = false;
    this.describeDirection = true;
    this.describeWallRub = false;
    this.initialMovementDescribed = true;
    this.timeSinceReleaseAlert = 0;
    this.preventNoMovementAlert = false;

    this.distanceSinceDirectionAlert = 0;
    this.positionOnAlert = this.balloonModel.positionProperty.get();
  }

  /**
   * Send an alert to the utteranceQueue, but save the position when we do so to track
   *
   * @public
   *
   * @param {TAlertable} alertable
   */
  sendAlert( alertable ) {
    this.alertDescriptionUtterance( alertable );
    this.positionOnAlert = this.balloonModel.positionProperty.get();
  }

  /**
   * Returns true if the balloon is being dragged with a pointer, but the movement is too small to describe.
   * @private
   */
  shortMovementFromPointer() {
    return this.balloonModel.draggingWithPointer && ( this.distanceSinceDirectionAlert < 25 );
  }

  /**
   * Get the description for the balloon, the content that can be read by an assistive device in the Parallel DOM.
   * Dependent on position, charge, and charge visibility. Will return something like:
   * "At center of play area. Has zero net charge, no more negative charge than positive charges." or
   * "At center of play area, next to green balloon."
   *
   * @public
   *
   * @returns {string}
   */
  getBalloonDescription() {
    let description;
    const showCharges = this.showChargesProperty.get();

    let attractiveStateAndPositionString = this.movementDescriber.getAttractiveStateAndPositionDescription();
    attractiveStateAndPositionString = StringUtils.fillIn( singleStatementPatternString, {
      statement: attractiveStateAndPositionString
    } );

    if ( showCharges === 'none' ) {
      description = attractiveStateAndPositionString;
    }
    else {

      // balloon net charge description
      const netChargeDescriptionString = this.chargeDescriber.getNetChargeDescription();

      // balloon relative charge string, dependent on charge visibility
      const relativeChargesString = BalloonChargeDescriber.getRelativeChargeDescription( this.balloonModel, showCharges );

      description = StringUtils.fillIn( balloonShowAllChargesPatternString, {
        stateAndPosition: attractiveStateAndPositionString,
        netCharge: netChargeDescriptionString,
        relativeCharge: relativeChargesString
      } );
    }

    return description;
  }

  /**
   * Get the alert description for when a charge is picked up off of the sweater. Dependent
   * on charge view, whether the balloon has picked up charges already since moving on to the
   * sweater, and the number of charges that the balloon has picked up.
   *
   * @public
   *
   * @param  {boolean} firstPickup - special behavior if the first charge pickup since landing on sweater
   * @returns {string}
   */
  getChargePickupDescription( firstPickup ) {
    let description;
    const shownCharges = this.showChargesProperty.get();

    const newCharge = this.balloonModel.chargeProperty.get();
    const newRange = BASEDescriber.getDescribedChargeRange( newCharge );

    if ( shownCharges === 'none' ) {
      description = this.movementDescriber.getAttractiveStateAndPositionDescription();
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
      const sweaterCharge = this.model.sweater.chargeProperty.get();

      // relative charge of balloon, as a sentance
      let relativeBalloonCharge = BalloonChargeDescriber.getRelativeChargeDescriptionWithLabel( this.balloonModel, shownCharges, this.accessibleName );
      relativeBalloonCharge = StringUtils.fillIn( singleStatementPatternString, {
        statement: relativeBalloonCharge
      } );
      const relativeSweaterCharge = SweaterDescriber.getRelativeChargeDescriptionWithLabel( sweaterCharge, shownCharges );

      description = StringUtils.fillIn( balloonSweaterRelativeChargesPatternString, {
        balloon: relativeBalloonCharge,
        sweater: relativeSweaterCharge
      } );

      this.describedChargeRange = BASEDescriber.getDescribedChargeRange( newCharge );
    }
    else {

      // in same described range of charges, describe how balloon picks up more charges
      const picksUpCharges = StringUtils.fillIn( balloonPicksUpMoreChargesPatternString, {
        balloon: this.accessibleName
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

    assert && assert( description, `no charge pickup alert generated for charge view ${shownCharges}` );
    return description;
  }

  /**
   * The first time the balloon picks up charges from the sweater after leaving the play
   * area, we get an initial alert like
   * "Yellow Balloon picks up negative charges from sweater."
   *
   * @public
   *
   * @returns {string}
   */
  getInitialChargePickupDescription() {
    let description;
    const shownCharges = this.showChargesProperty.get();

    const picksUpCharges = StringUtils.fillIn( balloonPicksUpChargesPatternString, {
      balloon: this.accessibleName
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
  }

  /**
   * Get an alert that describes that no charges were picked up during the drag interaction. This alert is dependent
   * on which charges are visible. Will return a string like
   *
   * "No change in charges. On left side of sweater. More pairs of charges down and to the right." or
   * "No change in net charge. On left side of sweater. More hidden pairs of charges down and to the right." or
   * "On left side of sweater". or
   * "No change in charges. On right side of sweater. Sweater has positive net charge. Yellow Balloon has negative
   * net charge. Press space to release."
   *
   * @public
   *
   * @returns {string}
   */
  getNoChargePickupDescription() {
    let alert;
    const chargesShown = this.showChargesProperty.get();

    const balloonPositionString = this.movementDescriber.getAttractiveStateAndPositionDescription();
    const sweaterCharge = this.model.sweater.chargeProperty.get();

    if ( chargesShown === 'none' ) {

      // if no charges are shown, just describe position of balloon as a complete sentence
      alert = StringUtils.fillIn( singleStatementPatternString, {
        statement: balloonPositionString
      } );
    }
    else if ( sweaterCharge < BASEConstants.MAX_BALLOON_CHARGE ) {

      // there are still charges on the sweater
      const sweaterCharges = this.model.sweater.minusCharges;
      const moreChargesString = SweaterDescriber.getMoreChargesDescription( this.balloonModel, sweaterCharge, sweaterCharges, chargesShown );
      if ( chargesShown === 'all' ) {
        alert = StringUtils.fillIn( noChargePickupPatternString, {
          noChange: noChangeInChargesString,
          balloonPosition: balloonPositionString,
          moreChargesPosition: moreChargesString
        } );
      }
      else if ( chargesShown === 'diff' ) {
        alert = StringUtils.fillIn( noChargePickupPatternString, {
          noChange: noChangeInNetChargeString,
          balloonPosition: balloonPositionString,
          moreChargesPosition: moreChargesString
        } );
      }
    }
    else {

      // there are no more charges remaining on the sweater
      if ( chargesShown === 'all' ) {
        const relativeSweaterCharge = SweaterDescriber.getNetChargeDescription( sweaterCharge );
        let relativeBalloonCharge = this.chargeDescriber.getNetChargeDescriptionWithLabel();
        relativeBalloonCharge = StringUtils.fillIn( singleStatementPatternString, { statement: relativeBalloonCharge } );

        alert = StringUtils.fillIn( nochargePickupWithObjectChargeAndHint, {
          noChange: noChangeInChargesString,
          balloonPosition: balloonPositionString,
          sweaterCharge: relativeSweaterCharge,
          balloonCharge: relativeBalloonCharge,
          hint: releaseHintString
        } );
      }
      else if ( chargesShown === 'diff' ) {
        alert = StringUtils.fillIn( noChargePickupHintPatternString, {
          noChange: noChangeInNetChargeString,
          balloonPosition: balloonPositionString,
          hint: releaseHintString
        } );
      }
    }

    return alert;
  }

  /**
   * Get a description of the balloon rubbing on the wall, including a description for the
   * induced charge if there is any and depending on the charge view. Will return something like
   *
   * "At wall. No transfer of charge. In wall, no change in charges." or
   * "At upper wall. No transfer of charge. Negative charges in upper wall move away from yellow balloon a lot.
   * Positive charges do not move." or
   * "At upper wall." or
   * "At lower wall. Yellow balloon has negative net charge, showing several more negative charges than positive charges."
   *
   * @public
   *
   * @returns {string}
   */
  getWallRubbingDescription() {
    let descriptionString;
    let chargeString;

    // the position string is used for all charge views, used as a single sentence
    const positionString = this.movementDescriber.getBalloonPositionDescription();
    let atPositionString = StringUtils.fillIn( balloonAtPositionPatternString, {
      position: positionString
    } );
    atPositionString = StringUtils.fillIn( singleStatementPatternString, {
      statement: atPositionString
    } );

    const shownCharges = this.showChargesProperty.get();
    const wallVisible = this.wall.isVisibleProperty.get();
    if ( shownCharges === 'none' ) {
      descriptionString = atPositionString;
    }
    else {
      if ( shownCharges === 'all' ) {
        let inducedChargeString;

        // if balloons are adjacent, the resultant induced charge description is modified
        if ( this.model.getBalloonsAdjacent() ) {

          const thisInducingAndVisible = this.balloonModel.inducingChargeAndVisible();
          const otherInducingAndVisible = this.balloonModel.other.inducingChargeAndVisible();

          if ( thisInducingAndVisible && otherInducingAndVisible ) {

            // if both inducing charge, combine induced charge description with "both balloons"
            inducedChargeString = WallDescriber.getCombinedInducedChargeDescription( this.balloonModel, wallVisible );
          }
          else if ( !thisInducingAndVisible && !otherInducingAndVisible ) {

            // neither balloon is inducing charge, just use normal induced charge description
            inducedChargeString = WallDescriber.getInducedChargeDescription( this.balloonModel, this.accessibleName, wallVisible );
          }
          else {
            assert && assert( this.balloonModel.inducingChargeAndVisible() !== this.balloonModel.other.inducingChargeAndVisible() );

            // only one balloon is inducing charge, describe whichever one is currently inducing charge
            let inducingBalloon;
            let balloonLabel;
            if ( this.balloonModel.inducingChargeAndVisible() ) {
              inducingBalloon = this.balloonModel;
              balloonLabel = this.accessibleName;
            }
            else {
              inducingBalloon = this.balloonModel.other;
              balloonLabel = this.otherAccessibleName;
            }

            inducedChargeString = WallDescriber.getInducedChargeDescription( inducingBalloon, balloonLabel, wallVisible );
          }
        }
        else {
          inducedChargeString = WallDescriber.getInducedChargeDescription( this.balloonModel, this.accessibleName, wallVisible );
        }

        // wrap induced charge string with punctuation
        inducedChargeString = StringUtils.fillIn( singleStatementPatternString, { statement: inducedChargeString } );

        chargeString = StringUtils.fillIn( wallRubAllPatternString, {
          inducedCharge: inducedChargeString
        } );
      }
      else {
        let wallChargeString = WallDescriber.getWallChargeDescriptionWithLabel( this.model.yellowBalloon, this.model.greenBalloon, this.model.getBalloonsAdjacent(), wallVisible, shownCharges );
        let balloonChargeString = BalloonChargeDescriber.getRelativeChargeDescriptionWithLabel( this.balloonModel, shownCharges, this.accessibleName );

        // balloon charge doesn't include punctuation
        balloonChargeString = StringUtils.fillIn( singleStatementPatternString, {
          statement: balloonChargeString
        } );

        wallChargeString = StringUtils.fillIn( singleStatementPatternString, {
          statement: wallChargeString
        } );

        // if balloons are adjacent, the relative charge description for both balloons must be included
        if ( this.model.getBalloonsAdjacent() ) {
          balloonChargeString = this.chargeDescriber.getCombinedRelativeChargeDescription();
          balloonChargeString = StringUtils.fillIn( singleStatementPatternString, { statement: balloonChargeString } );

          chargeString = StringUtils.fillIn( wallRubDiffPatternString, {
            balloonCharge: balloonChargeString,
            wallCharge: wallChargeString
          } );
        }
        else {
          chargeString = StringUtils.fillIn( wallRubDiffPatternString, {
            balloonCharge: balloonChargeString,
            wallCharge: wallChargeString
          } );
        }
      }

      // combine charge and position portions of the description for 'all' and 'diff' charge views
      descriptionString = StringUtils.fillIn( wallRubPatternString, {
        position: atPositionString,
        charge: chargeString
      } );
    }

    return descriptionString;
  }

  /**
   * Get an alert that describes the rubbing interaction, with a reminder that the wall has many pairs of charges.
   * Will return something like:
   * "At upper wall. No transfer of charge. In upper wall, no change in charges. Wall has many pairs of negative
   * and positive charges."
   *
   * @public
   *
   * @returns {string}
   */
  getWallRubbingDescriptionWithChargePairs() {
    return StringUtils.fillIn( wallRubbingWithPairsPattern, {
      rubbingAlert: this.getWallRubbingDescription()
    } );
  }

  /**
   * Get the description when the balloon has picked up the last charge on the sweater.
   * Dependent on the charge view.
   *
   * @public
   *
   * @returns {string}
   */
  getLastChargePickupDescription() {
    const shownCharges = this.showChargesProperty.get();
    const charge = this.balloonModel.chargeProperty.get();

    const sweaterChargeString = SweaterDescriber.getNoMoreChargesAlert( charge, shownCharges );
    const balloonChargeString = BalloonChargeDescriber.getRelativeChargeDescriptionWithLabel( this.balloonModel, shownCharges, this.accessibleName );

    return StringUtils.fillIn( lastChargePickedUpPatternString, {
      sweater: sweaterChargeString,
      balloon: balloonChargeString
    } );
  }

  /**
   * Get a description for when a balloon is added to the play area. Will change depending on whether balloon has been
   * successfully moved and whether the two balloons are adjacent to each other. Will return something like
   * "Green balloon added to play area" or
   * "Green balloon added. Sticking to left shoulder of sweater." or
   * "Green balloon added. On left side of play area, next to yellow balloon."
   *
   * @public
   *
   * @returns {string}
   */
  getVisibilityChangedDescription() {
    let description;
    const positionProperty = this.balloonModel.positionProperty;
    const visible = this.balloonModel.isVisibleProperty.get();

    if ( !visible ) {

      // if removed, simply notify removal
      description = StringUtils.fillIn( balloonRemovedPatternString, {
        balloonLabel: this.accessibleName
      } );
    }
    else {
      if ( positionProperty.get().equals( positionProperty.initialValue ) ) {

        // if add at initial position, generic string
        description = StringUtils.fillIn( balloonAddedPatternString, {
          balloonLabel: this.accessibleName
        } );
      }
      else {

        // if not at initial position, include attractive state and position
        description = StringUtils.fillIn( balloonAddedWithPositionPatternString, {
          balloonLabel: this.accessibleName,
          position: this.movementDescriber.getAttractiveStateAndPositionDescription()
        } );
      }
    }

    return description;
  }

  /**
   * Step the describer, driving all alerts that describe interactions with the balloon and its independent
   * movement. It also describes lack of movement or interaction, which requires polling. Rather than implement
   * portions of this with polling and other portions with Property observers, it was more straight forward
   * to implement everything in this step function. The alternative distributed the implementation across several
   * functions, it is easier to manage here. The sacrifice is that we have to track values we care about before and
   * after each step.
   *
   * Adding each of these in the step function also lets us directly control the order of these alerts. This is
   * better than having Property listeners that might get called in an undesirable order.
   *
   * @public
   */
  step( dt ) {

    // for readability
    let utterance = '';
    const model = this.balloonModel;

    // grab next values to describe
    const nextVelocity = model.velocityProperty.get();
    const nextDragVelocity = model.dragVelocityProperty.get();
    const nextPosition = model.positionProperty.get();
    const nextVisible = model.isVisibleProperty.get();
    const nextTouchingWall = model.touchingWallProperty.get();
    const nextIsDragged = model.isDraggedProperty.get();
    const nextWallVisible = this.wall.isVisibleProperty.get();
    const nextCharge = model.chargeProperty.get();

    // update timers that determine the next time certain alerts should be announced
    this.timeSinceChargeAlert += dt * 1000;
    if ( !model.isDraggedProperty.get() ) { this.timeSinceReleaseAlert += dt * 1000; }

    if ( !this.shortMovementFromPointer() ) {

      // alerts related to balloon direction
      if ( this.describeDirection &&
           this.balloonModel.directionProperty.get() &&
           this.describedDirection !== this.balloonModel.directionProperty.get() ) {

        if ( this.balloonModel.isDraggedProperty.get() || model.timeSinceRelease > RELEASE_DESCRIPTION_TIME_DELAY ) {
          this.directionUtterance.alert = this.movementDescriber.getDirectionChangedDescription();

          this.sendAlert( this.directionUtterance );
          this.describedDirection = this.balloonModel.directionProperty.get();
        }
      }

      // announce an alert that describes lack of charge pickup whil rubbing on sweater
      if ( this.timeSinceChargeAlert > CHARGE_DESCRIPTION_REFRESH_RATE ) {
        if ( this.chargeOnStartDrag === this.chargeOnEndDrag ) {
          if ( this.rubAlertDirty ) {
            if ( nextIsDragged && model.onSweater() ) {
              this.noChargePickupUtterance.alert = this.getNoChargePickupDescription();
              this.sendAlert( this.noChargePickupUtterance );
            }
          }
        }

        this.alertNextPickup = true;
        this.timeSinceChargeAlert = 0;
        this.rubAlertDirty = false;
      }
    }

    // alerts related to balloon charge
    if ( this.describedCharge !== nextCharge ) {
      let alert;

      // the first charge pickup and subsequent pickups (behind a refresh rate) should be announced
      if ( this.alertNextPickup || this.alertFirstPickup ) {
        alert = this.getChargePickupDescription( this.alertFirstPickup );
        this.chargePickupUtterance.alert = alert;
        this.sendAlert( this.chargePickupUtterance );
      }

      // announce pickup of last charge, as long as charges are visible
      if ( Math.abs( nextCharge ) === BASEConstants.MAX_BALLOON_CHARGE && this.showChargesProperty.get() !== 'none' ) {
        alert = this.getLastChargePickupDescription();
        this.chargePickupUtterance.alert = alert;
        this.sendAlert( this.chargePickupUtterance );
      }

      // reset flags
      this.alertFirstPickup = false;
      this.alertNextPickup = false;
    }

    // alerts that might stem from changes to balloon velocity (independent movement)
    if ( !nextVelocity.equals( this.describedVelocity ) ) {
      if ( nextVelocity.equals( Vector2.ZERO ) ) {
        if ( model.isDraggedProperty.get() ) {
          if ( model.onSweater() || model.touchingWall() ) {

            // while dragging, just attractive state and position
            this.sendAlert( this.movementDescriber.getAttractiveStateAndPositionDescriptionWithLabel() );
          }
        }
        else if ( model.onSweater() ) {

          // if we stop on the sweater, announce that we are sticking to it
          this.sendAlert( this.movementDescriber.getAttractiveStateAndPositionDescriptionWithLabel() );
        }
        else {

          // if we stop along anywhere else in the play area, describe that movement has stopped
          // special case: if the balloon is touching the wall for the first time, don't describe this because
          // the section of this function observing that state will describe this
          if ( nextTouchingWall === this.describedTouchingWall ) {
            this.sendAlert( this.movementDescriber.getMovementStopsDescription() );
          }
        }
      }
    }

    // alerts that might come from changes to balloon drag velocity
    if ( !nextDragVelocity.equals( this.describedDragVelocity ) ) {

      // if we start from zero, we are initiating a drag - update the charge on start for this case and start
      // describing wall rubs
      if ( this.describedDragVelocity.equals( Vector2.ZERO ) ) {
        this.describeWallRub = true;
      }

      // if the drag velocity is zero, describe how the position has changed since the last drag - this is preferable
      // to alerting every position because 1) it reduces the number of alerts that occur and 2) it waits until
      // a user has finished interacting to make an announcement, and AT produce garbled/interrupted output if
      // user makes an interaction while a new alert is being announced
      if ( model.isDraggedProperty.get() && nextDragVelocity.equals( Vector2.ZERO ) && !this.shortMovementFromPointer() ) {

        // ignore changes that occur while the user is "jumping" the balloon (using hotkeys to snap to a new position)
        if ( !model.jumping ) {

          // how much balloon has moved in a single drag
          const dragDelta = nextPosition.minus( this.oldDragPosition );

          // when we complete a keyboard drag, set timer to refresh rate so that we trigger a new description next
          // time we move the balloon
          this.timeSinceChargeAlert = CHARGE_DESCRIPTION_REFRESH_RATE;

          // if in the play area, information about movement through the play area
          const inLandmark = PlayAreaMap.inLandmarkColumn( model.getCenter() );
          const onSweater = model.onSweater();
          const touchingWall = model.touchingWall();
          if ( !inLandmark && !onSweater && !touchingWall ) {
            utterance = this.movementDescriber.getKeyboardMovementAlert();
          }
          else if ( inLandmark ) {

            // just announce landmark as we move through it
            utterance = this.movementDescriber.getLandmarkDragDescription();
          }
          else if ( model.touchingWall() && this.describeWallRub ) {
            utterance = this.getWallRubbingDescription();
          }

          if ( utterance ) {

            // assign an id so that we only announce the most recent alert in the utteranceQueue
            this.movementUtterance.alert = utterance;
            this.sendAlert( this.movementUtterance );
          }

          // describe the change in induced charge due to balloon dragging
          if ( this.chargeDescriber.describeInducedChargeChange() ) {
            utterance = '';
            const wallVisible = this.wall.isVisibleProperty.get();

            assert && assert( this.balloonModel.isCharged(), 'balloon should be charged to describe induced charge' );

            // if there is purely vertical motion, do not include information about amount of charge displacement
            if ( dragDelta.x === 0 ) {
              utterance = WallDescriber.getInducedChargeDescriptionWithNoAmount( model, this.accessibleName, wallVisible );
            }
            else {
              utterance = this.chargeDescriber.getInducedChargeChangeDescription();
            }

            this.inducedChargeChangeUtterance.alert = utterance;
            this.sendAlert( this.inducedChargeChangeUtterance );
          }

          // update flags that indicate which alerts should come next
          this.rubAlertDirty = true;
        }

        // if velocity has just become zero after a jump, we just completed a jumping interaction
        if ( model.jumping ) {
          model.jumping = false;
        }

        // update the old dragging position for next time, copy so we can compare by value
        this.oldDragPosition = nextPosition.copy();
      }
    }

    // describe any updates that might come from the balloon touches or leaves the wall - don't describe if we are
    // currently touching the balloon since the jump will generate a unique alert
    if ( this.describedTouchingWall !== nextTouchingWall ) {
      if ( !model.jumping ) {
        if ( nextTouchingWall ) {
          if ( model.isDraggedProperty.get() && this.showChargesProperty.get() === 'all' ) {
            this.sendAlert( this.getWallRubbingDescriptionWithChargePairs() );
            this.describeWallRub = false;
          }
          else {

            // generates a description of how the balloon interacts with the wall
            if ( nextVisible ) {
              this.sendAlert( this.movementDescriber.getMovementStopsDescription() );
            }
          }
        }
      }
    }

    // any alerts that might be generated when the balloon is picked up and released
    if ( this.describedIsDragged !== nextIsDragged ) {
      utterance = '';

      if ( nextIsDragged ) {
        utterance = this.movementDescriber.getGrabbedAlert();
        this.grabReleaseUtterance.alert = utterance;
        this.sendAlert( this.grabReleaseUtterance );

        // we have been picked up successfully, start describing direction
        this.describeDirection = true;
      }
      else {

        // don't describe direction until initial release description happens
        this.describeDirection = false;
      }

      // reset flags that track description content
      this.initialMovementDescribed = false;
    }

    // any balloon specific alerts that might come from changes to wall visibility
    if ( this.describedWallVisible !== nextWallVisible ) {

      // if the wall is removed while a balloon is touching the wall, we will need to describe how the balloon
      // responds, just like a release
      if ( !nextWallVisible && this.describedTouchingWall ) {
        this.initialMovementDescribed = false;
      }
    }

    // any changes to position from independent balloon movement (not dragging)
    if ( nextVisible && !nextIsDragged ) {
      utterance = '';

      if ( !this.initialMovementDescribed ) {
        if ( model.timeSinceRelease > RELEASE_DESCRIPTION_TIME_DELAY ) {

          this.initialMovementDescribed = true;

          // get the initial alert describing balloon release
          if ( !nextVelocity.equals( Vector2.ZERO ) ) {

            utterance = this.movementDescriber.getInitialReleaseDescription();
            this.sendAlert( utterance );
            this.describedDirection = this.balloonModel.directionProperty.get();

            // after describing initial movement, continue to describe direction changes
            this.describeDirection = true;
          }
          else if ( nextVelocity.equals( Vector2.ZERO ) ) {

            // describe that the balloon was released and there was no resulting movement - but don't describe this
            // when the balloon is first added to the play area
            if ( !this.preventNoMovementAlert ) {
              utterance = this.movementDescriber.getNoChangeReleaseDescription();
              this.sendAlert( utterance );
            }
            this.preventNoMovementAlert = false;
          }

          // reset timer for release alert
          this.timeSinceReleaseAlert = 0;
        }
      }
      else if ( this.timeSinceReleaseAlert > RELEASE_DESCRIPTION_REFRESH_RATE ) {

        // if the balloon is moving slowly, alert a continuous movement description
        if ( this.movementDescriber.balloonMovingAtContinuousDescriptionVelocity() ) {
          utterance = this.movementDescriber.getContinuousReleaseDescription();
          this.sendAlert( utterance );

          // reset timer
          this.timeSinceReleaseAlert = 0;
        }
      }
    }

    // update variables for next step
    this.describedVelocity = nextVelocity;
    this.describedDragVelocity = nextDragVelocity;
    this.describedPosition = nextPosition;
    this.describedVisible = nextVisible;
    this.describedTouchingWall = nextTouchingWall;
    this.describedIsDragged = nextIsDragged;
    this.describedWallVisible = nextWallVisible;
    this.describedCharge = nextCharge;
  }
}

balloonsAndStaticElectricity.register( 'BalloonDescriber', BalloonDescriber );

export default BalloonDescriber;