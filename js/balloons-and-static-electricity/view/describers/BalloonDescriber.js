
// Copyright 2016-2017, University of Colorado Boulder

/**
 * This type allows for determining descriptions for the balloon.  Describing the location of the balloon
 * is quite complicated so this distributes the description work so that BalloonNode does not become
 * a massive file.  Used for accessibility.
 *
 * TODO: Bring up to standards, improve documentation, delete many functions which are now unused.
 * TODO: This file is massive. It should be substantially reduced in size.
 *
 * @author Jesse Greenberg
 */

define( function( require ) {
  'use strict';

  // modules
  var BalloonChargeDescriber = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/describers/BalloonChargeDescriber' );
  var BalloonLocationDescriber = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/describers/BalloonLocationDescriber' );
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );
  var BASEA11yStrings = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/BASEA11yStrings' );
  var BASEConstants = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/BASEConstants' );
  var BASEDescriber = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/describers/BASEDescriber' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PlayAreaMap = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/PlayAreaMap' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var SweaterDescriber = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/describers/SweaterDescriber' );
  var WallDescriber = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/describers/WallDescriber' );
  var Utterance = require( 'SCENERY_PHET/accessibility/Utterance' );
  var utteranceQueue = require( 'SCENERY_PHET/accessibility/utteranceQueue' );
  var Vector2 = require( 'DOT/Vector2' );

  // a11y strings
  var balloonShowAllChargesPatternString = BASEA11yStrings.balloonShowAllChargesPattern.value;
  var balloonAtLocationPatternString = BASEA11yStrings.balloonAtLocationPattern.value;
  var singleStatementPatternString = BASEA11yStrings.singleStatementPattern.value;
  var balloonPicksUpChargesPatternString = BASEA11yStrings.balloonPicksUpChargesPattern.value;
  var balloonPicksUpMoreChargesPatternString = BASEA11yStrings.balloonPicksUpMoreChargesPattern.value;
  var balloonPicksUpChargesDiffPatternString = BASEA11yStrings.balloonPicksUpChargesDiffPattern.value;
  var balloonPicksUpMoreChargesDiffPatternString = BASEA11yStrings.balloonPicksUpMoreChargesDiffPattern.value;
  var balloonSweaterRelativeChargesPatternString = BASEA11yStrings.balloonSweaterRelativeChargesPattern.value;
  var lastChargePickedUpPatternString = BASEA11yStrings.lastChargePickedUpPattern.value;
  var noChargePickupPatternString = BASEA11yStrings.noChargePickupPattern.value;
  var noChangeInChargesString = BASEA11yStrings.noChangeInCharges.value;
  var noChangeInNetChargeString = BASEA11yStrings.noChangeInNetCharge.value;
  var noChargePickupHintPatternString = BASEA11yStrings.noChargePickupHintPattern.value;
  var nochargePickupWithObjectChargeAndHint = BASEA11yStrings.nochargePickupWithObjectChargeAndHint.value;
  var releaseHintString = BASEA11yStrings.releaseHint.value;
  var balloonAddedPatternString = BASEA11yStrings.balloonAddedPattern.value;
  var balloonRemovedPatternString = BASEA11yStrings.balloonRemovedPattern.value;
  var balloonAddedWithLocationPatternString = BASEA11yStrings.balloonAddedWithLocationPattern.value;
  var wallRubbingWithPairsPattern = BASEA11yStrings.wallRubbingWithPairsPattern.value;
  var wallRubPatternString = BASEA11yStrings.wallRubPattern.value;
  var wallRubAllPatternString = BASEA11yStrings.wallRubAllPattern.value;
  var wallRubDiffPatternString = BASEA11yStrings.wallRubDiffPattern.value;

  // constants
  var CHARGE_DESCRIPTION_REFRESH_RATE = 2000; // in ms

  // in ms, delay before announcing an alert that describes independent movement, to give the model time to respond
  var RELEASE_DESCRIPTION_TIME_DELAY = 25; // in ms

  // in ms, time between alerts that tell user balloon continues to move due to force
  var RELEASE_DESCRIPTION_REFRESH_RATE = 5000;

  /**
   * @param {BASEModel} model
   * @param {WallModel} wall
   * @param {BalloonModel} balloon
   * @constructor
   */
  function BalloonDescriber( model, wall, balloon, accessibleLabel, otherAccessibleLabel ) {
    var self = this;

    // @private
    this.model = model;
    this.wall = wall;
    this.balloonModel = balloon;
    this.accessibleName = accessibleLabel;
    this.otherAccessibleName = otherAccessibleLabel;
    this.showChargesProperty = model.showChargesProperty;

    // @private - manages descriptions about the balloon related to charge
    this.chargeDescriber = new BalloonChargeDescriber( model, balloon, accessibleLabel, otherAccessibleLabel );

    // @private - manages descriptions about the  balloon related to balloon movement and location
    this.movementDescriber = new  BalloonLocationDescriber( this, model, balloon, accessibleLabel, otherAccessibleLabel );

    // @private - used to track previous values after an interaction so that we can accurately describe how 
    // the model has changed
    this.describedChargeRange = null;

    // @private (a11y) {boolean} - a flag that manages whether or not we should alert the first charge pickup of the
    // balloon, will be set to true every time the balloon enters or leaves the sweater
    this.alertFirstPickup = false;

    // @private (a11y) {boolean} - a flag that manages how often we should announce a charge
    // pickup alert, every time the balloon moves, this is reset (only want to anounce charges
    // when balloon moves)
    this.alertNextPickup = false;

    // @private - variables tracking state and how it changes between description steps
    this._describedVelocity = balloon.velocityProperty.get();
    this._describedDragVelocity = balloon.dragVelocityProperty.get();
    this._describedLocation = balloon.locationProperty.get();
    this._describedVisible = balloon.isVisibleProperty.get();
    this._describedTouchingWall = balloon.touchingWallProperty.get();
    this._describedIsDragged = balloon.isDraggedProperty.get();
    this._describedWallVisible = wall.isVisibleProperty.get();

    // @private - used to determine change in position during a single drag movement, copy so we can compare by value
    this._oldDragLocation = balloon.locationProperty.get().copy();

    // @private - monitors position delta in a single drag
    this._dragDelta = new Vector2( 0, 0 );

    // @private - used to watch how much charge is picked up in a single drag action
    this._chargeOnStartDrag = balloon.chargeProperty.get();

    // @private - used to determine how much charge is picked up in a single drag action
    this._chargeOnEndDrag = balloon.chargeProperty.get();

    // @private - time since an alert related to charge pickup has been announced
    this._timeSinceChargeAlert = 0;

    // @private {boolean} - every time we drag, mark this as true so we know to describe a lack of charge pick up
    // on the sweater. Once this rub has been described, set to false
    this._rubAlertDirty = false;

    // @private {boolean} - whether or not we describe direction changes. After certain interactions we do not want
    // to describe the direction, or the direction is implicit in another alert
    this._describeDirection = true;

    // @private {boolean} - flag that indicates that user actions have lead to it  being time for a "wall rub" to be
    // described
    this._describeWallRub = false;

    // @private {boolean} - a flag that tracks if the initial movement of the balloon after release has
    // been described. Gets reset whenever the balloon is picked up, and when the wall is removed while
    // the balloon is sticking to the wall. True so we get non alert on start up
    this._initialMovementDescribed = true;

    // @private {boolean} - timer tracking amount of time between release alerts, used to space out alerts describing
    // continuous independent movement like "Moving left...Moving left...Moving left...", and so on
    this._timeSinceReleaseAlert = 0;

    // @private {boolean} - flag that will prevent the firing of the "no movement" alert, set to true with toggling
    // balloon visibility as a special case;
    this._preventNoMovementAlert = false;

    // when the balloon hits the wall, reset some description flags
    this.balloonModel.touchingWallProperty.link( function( touchingWall ) {
      if ( touchingWall ) {
        self.previousDeltaNormalized = 0;
      }
    } );

    // if the balloon is no longer inducing charge, reset reference forces until balloon begins to induce charge again
    this.balloonModel.inducingChargeProperty.link( function( inducingCharge ) {
      if ( !inducingCharge ) {
        self.chargeDescriber.resetReferenceForces();
      }
    } );

    // announce alerts related to charge change
    balloon.chargeProperty.link( function updateCharge( chargeVal ) {
      var alert;

      // the first charge pickup and subsequent pickups (behind a refresh rate) should be announced
      if ( self.alertNextPickup || self.alertFirstPickup ) {
        alert = self.getChargePickupDescription( self.alertFirstPickup );
        utteranceQueue.addToBack( alert );
      }

      // announce pickup of last charge, as long as charges are visible
      if ( Math.abs( chargeVal ) === BASEConstants.MAX_BALLOON_CHARGE && self.showChargesProperty.get() !== 'none' ) {
        alert = self.getLastChargePickupDescription();
        utteranceQueue.addToBack( alert );
      }

      // reset flags
      self.alertFirstPickup = false;
      self.alertNextPickup = false;
    } );

    // when visibility changes, generate the alert and be sure to describe initial movement the next time the 
    // balloon is released or added to the play area
    balloon.isVisibleProperty.lazyLink( function( isVisible ) {
      utteranceQueue.addToBack( self.getVisibilityChangedDescription() );
      self._initialMovementDescribed = false;
      self._preventNoMovementAlert = true;
    } );

    // a11y - if we enter/leave the sweater announce that immediately
    balloon.onSweaterProperty.link( function( onSweater ) {
      if ( balloon.isDraggedProperty.get() ) {
        utteranceQueue.addToBack( self.movementDescriber.getOnSweaterString( onSweater ) );
      }

      // entering sweater, indicate that we need to alert the next charge pickup
      self.alertFirstPickup = true;
    } );

    // when the balloon is grabbed or released, reset reference forces for describing changes to induced charge
    // in the wall
    this.balloonModel.isDraggedProperty.link( function() {
      self.chargeDescriber.resetReferenceForces();
    } );

    // when the balloon changes directions during dragging, announce this immediately, unless we are "jumping" the
    // balloon to a new place in the play area.
    this.balloonModel.directionProperty.lazyLink( function( direction ) {
      if ( !self.balloonModel.jumping ) {
        if ( self._describeDirection ) {

          // assigned an ID so that user doesn't get flooded with direction changes when using a pointer type inputs
          var utterance = self.movementDescriber.getDirectionChangedDescription();
          utteranceQueue.addToBack( new Utterance( utterance, { typeId: 'direction' } ) );  
        }
      }
    } ); 
  }

  balloonsAndStaticElectricity.register( 'BalloonDescriber', BalloonDescriber );

  return inherit( Object, BalloonDescriber, {

    /**
     * Reset the describer, resetting flags that are required to manipulate provided descriptions.
     * @public
     */
    reset: function() {
      this.movementDescriber.reset();
      this.chargeDescriber.reset();
      this.describedChargeRange = null;

      // reset all variables tracking previous descriptions
      this._describedVelocity = this.balloonModel.velocityProperty.get();
      this._describedDragVelocity = this.balloonModel.dragVelocityProperty.get();
      this._describedLocation = this.balloonModel.locationProperty.get();
      this._describedVisible = this.balloonModel.isVisibleProperty.get();
      this._describedTouchingWall = this.balloonModel.touchingWallProperty.get();
      this._describedIsDragged = this.balloonModel.isDraggedProperty.get();
      this._describedWallVisible = this.wall.isVisibleProperty.get();

      this._oldDragLocation = this.balloonModel.locationProperty.get().copy();
      this._dragDelta = new Vector2( 0, 0 );
      this._chargeOnStartDrag = this.balloonModel.chargeProperty.get();
      this._chargeOnEndDrag = this.balloonModel.chargeProperty.get();
      this._timeSinceChargeAlert = 0;
      this._rubAlertDirty = false;
      this._describeDirection = true;
      this._describeWallRub = false;
      this._initialMovementDescribed = true;
      this._timeSinceReleaseAlert = 0;
    },

    /**
     * Get the description for the balloon, the content that can be read by an assistive device in the Parallel DOM.
     * Dependent on location, charge, and charge visibility. Will return something like:
     * "At center of play area. Has zero net charge, no more negative charge than positive charges." or
     * "At center of play area, next to green balloon."
     * 
     * @return {string}
     */
    getBalloonDescription: function() {
      var description;
      var showCharges = this.showChargesProperty.get();

      var attractiveStateAndLocationString = this.movementDescriber.getAttractiveStateAndLocationDescription();
      attractiveStateAndLocationString = StringUtils.fillIn( singleStatementPatternString, {
        statement: attractiveStateAndLocationString
      } );

      if ( showCharges === 'none' ) {
        description = attractiveStateAndLocationString;
      }
      else {

        // balloon net charge description
        var netChargeDescriptionString = this.chargeDescriber.getNetChargeDescription();

        // balloon relative charge string, dependent on charge visibility
        var relativeChargesString = BalloonChargeDescriber.getRelativeChargeDescription( this.balloonModel, showCharges );

        description = StringUtils.fillIn( balloonShowAllChargesPatternString, {
          stateAndLocation: attractiveStateAndLocationString,
          netCharge: netChargeDescriptionString,
          relativeCharge: relativeChargesString
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
        description = this.movementDescriber.getAttractiveStateAndLocationDescription();
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

        // relative charge of balloon, as a sentance
        var relativeBalloonCharge = BalloonChargeDescriber.getRelativeChargeDescriptionWithLabel( this.balloonModel, shownCharges, this.accessibleName );
        relativeBalloonCharge = StringUtils.fillIn( singleStatementPatternString, {
          statement: relativeBalloonCharge
        } );
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

      assert && assert( description, 'no charge pickup alert generated for charge view ' + shownCharges );
      return description;
    },

    /**
     * The first time the balloon picks up charges from the sweater after leaving the play
     * area, we get an initial alert like
     * "Yellow Balloon picks up negative charges from sweater."
     *
     * @return {string}
     */
    getInitialChargePickupDescription: function() {
      var description;
      var shownCharges = this.showChargesProperty.get();

      var picksUpCharges = StringUtils.fillIn( balloonPicksUpChargesPatternString, {
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
    },

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
     * @return {string}
     */
    getNoChargePickupDescription: function() {
      var alert;
      var chargesShown = this.showChargesProperty.get();
      
      var balloonLocationString = this.movementDescriber.getAttractiveStateAndLocationDescription();
      var sweaterCharge = this.model.sweater.chargeProperty.get();

      if ( chargesShown === 'none' ) {

        // if no charges are shown, just describe position of balloon as a complete sentence
        alert = StringUtils.fillIn( singleStatementPatternString, {
          statement: balloonLocationString
        } );
      }
      else if ( sweaterCharge < BASEConstants.MAX_BALLOON_CHARGE ) {

        // there are still charges on the sweater
        var sweaterCharges = this.model.sweater.minusCharges;
        var moreChargesString = SweaterDescriber.getMoreChargesDescription( this.balloonModel, sweaterCharge, sweaterCharges, chargesShown );
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
          var relativeBalloonCharge = this.chargeDescriber.getNetChargeDescriptionWithLabel();
          relativeBalloonCharge = StringUtils.fillIn( singleStatementPatternString, {  statement: relativeBalloonCharge } );

          alert = StringUtils.fillIn( nochargePickupWithObjectChargeAndHint, {
            noChange:  noChangeInChargesString,
            balloonLocation: balloonLocationString,
            sweaterCharge: relativeSweaterCharge,
            balloonCharge: relativeBalloonCharge,
            hint: releaseHintString
          } );
        }
        else if ( chargesShown === 'diff' ) {
          alert = StringUtils.fillIn( noChargePickupHintPatternString, {
            noChange: noChangeInNetChargeString,
            balloonLocation: balloonLocationString,
            hint: releaseHintString
          } );
        }
      }

      return alert;
    },

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
     * @return {string}
     */
    getWallRubbingDescription: function() {
      var descriptionString;
      var chargeString;

      // the location string is used for all charge views, used as a single sentence
      var locationString = this.movementDescriber.getBalloonLocationDescription();
      var atLocationString = StringUtils.fillIn( balloonAtLocationPatternString, {
        location: locationString
      } );
      atLocationString = StringUtils.fillIn( singleStatementPatternString, {
        statement: atLocationString
      } );

      var shownCharges = this.showChargesProperty.get();
      var wallVisible = this.wall.isVisibleProperty.get();
      if ( shownCharges === 'none' ) {
        descriptionString = atLocationString;
      }
      else {
        if ( shownCharges === 'all' ) {
          var inducedChargeString;

          // if balloons are adjacent, the resultant induced charge description is modified
          if ( this.model.getBalloonsAdjacent() ) {

            var thisInducingAndVisible = this.balloonModel.inducingChargeAndVisible();
            var otherInducingAndVisible = this.balloonModel.other.inducingChargeAndVisible();

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
              var inducingBalloon;
              var balloonLabel;
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
          var wallChargeString = WallDescriber.getWallChargeDescriptionWithLabel( this.model.yellowBalloon, this.model.greenBalloon, this.model.getBalloonsAdjacent(), wallVisible, shownCharges );
          var balloonChargeString = BalloonChargeDescriber.getRelativeChargeDescriptionWithLabel( this.balloonModel, shownCharges, this.accessibleName );

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

        // combine charge and location portions of the description for 'all' and 'diff' charge views
        descriptionString = StringUtils.fillIn( wallRubPatternString, {
          location: atLocationString,
          charge: chargeString
        } );
      }

      return descriptionString;
    },

    /**
     * Get an alert that describes the rubbing interaction, with a reminder that the wall has many pairs of charges.
     * Will return something like:
     * "At upper wall. No transfer of charge. In upper wall, no change in charges. Wall has many pairs of negative
     * and positive charges."
     *
     * @return {string}
     */
    getWallRubbingDescriptionWithChargePairs: function() {
      return StringUtils.fillIn( wallRubbingWithPairsPattern, {
        rubbingAlert: this.getWallRubbingDescription()
      } );
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
      var balloonChargeString = BalloonChargeDescriber.getRelativeChargeDescriptionWithLabel( this.balloonModel, shownCharges, this.accessibleName );

      return StringUtils.fillIn( lastChargePickedUpPatternString, {
        sweater: sweaterChargeString,
        balloon: balloonChargeString
      } );
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

        // if removed, simply notify removal
        description = StringUtils.fillIn( balloonRemovedPatternString, {
          balloonLabel: this.accessibleName
        } );
      }
      else {
        if ( locationProperty.get().equals( locationProperty.initialValue ) ) {

          // if add at initial location, generic string
          description = StringUtils.fillIn( balloonAddedPatternString, {
            balloonLabel: this.accessibleName
          } );
        }
        else {

          // if not at initial location, include attractive state and location
          description = StringUtils.fillIn( balloonAddedWithLocationPatternString, {
            balloonLabel: this.accessibleName,
            location: this.movementDescriber.getAttractiveStateAndLocationDescription()
          } );
        }
      }

      return description;
    },

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
    step: function( dt ) {

      // for readability
      var utterance = '';
      var model = this.balloonModel;

      // grab next values to describe
      var nextVelocity = model.velocityProperty.get();
      var nextDragVelocity = model.dragVelocityProperty.get();
      var nextLocation = model.locationProperty.get();
      var nextVisible = model.isVisibleProperty.get();
      var nextTouchingWall = model.touchingWallProperty.get();
      var nextIsDragged = model.isDraggedProperty.get();
      var nextWallVisible = this.wall.isVisibleProperty.get();

      // update timers that determine the next time certain alerts should be announced
      this._timeSinceChargeAlert += dt * 1000;
      if ( !model.isDraggedProperty.get() ) { this._timeSinceReleaseAlert += dt * 1000; }

      // alerts that might stem from changes to balloon velocity (independent movement)
      if ( !nextVelocity.equals( this._describedVelocity ) ) {
        if ( nextVelocity.equals( Vector2.ZERO ) ) {
          if ( model.isDraggedProperty.get() ) {
            if ( model.onSweater() || model.touchingWall() ) {

              // while dragging, just attractive state and location 
              utteranceQueue.addToBack( this.movementDescriber.getAttractiveStateAndLocationDescriptionWithLabel() );
            }    
          }
          else if ( model.onSweater() ) {

            // if we stop on the sweater, announce that we are sticking to it
            utteranceQueue.addToBack( this.movementDescriber.getAttractiveStateAndLocationDescriptionWithLabel() );
          }
          else {

            // if we stop along anywhere else in the play area, describe that movement has stopped
            // special case: if the balloon is touching the wall for the first time, don't describe this because
            // the section of this function observing that state will describe this
            if ( nextTouchingWall === this._describedTouchingWall ) {
              utteranceQueue.addToBack( this.movementDescriber.getMovementStopsDescription() );
            }
          }
        }
      }

      // alerts that might come from changes to balloon drag velocity
      if ( !nextDragVelocity.equals( this._describedDragVelocity ) ) {

        // if we start from zero, we are initiating a drag - update the charge on start for this case
        if ( this._describedDragVelocity.equals( Vector2.ZERO ) ) {
          this._chargeOnStartDrag = model.chargeProperty.get();
        }

        // if the drag velocity is zero, describe how the position has changed since the last drag - this is preferable
        // to alerting every position because 1) it reduces the number of alerts that occur and 2) it waits until
        // a user has finished interacting to make an announcement, and AT produce garbled/interrupted output if
        // user makes an interaction while a new alert is being announced
        if ( model.isDraggedProperty.get() && nextDragVelocity.equals( Vector2.ZERO ) ) {

          // ignore changes that occur while the user is "jumping" the balloon (using hotkeys to snap to a new location)
          if ( !model.jumping ) {

            // how much balloon has moved in a single drag
            var dragDelta = nextLocation.minus( this._oldDragLocation );

            // when we complete a keyboard drag, set timer to refresh rate so that we trigger a new description next
            // time we move the balloon
            this._timeSinceChargeAlert = CHARGE_DESCRIPTION_REFRESH_RATE;

            // if in the play area, information about movement through the play area
            var inLandmark = PlayAreaMap.inLandmarkColumn( model.getCenter() );
            var onSweater = model.onSweater();
            var touchingWall = model.touchingWall();
            if ( !inLandmark && !onSweater && !touchingWall ) {
              utterance = this.movementDescriber.getKeyboardMovementAlert();
            }
            else if ( inLandmark ) {

              // just announce landmark as we move through it
              utterance = this.movementDescriber.getLandmarkDragDescription();
            }
            else if ( model.touchingWall() && this._describeWallRub ) {
              utterance = this.getWallRubbingDescription();
            }

            if ( utterance ) {

              // assign an id so that we only announce the most recent alert in the utteranceQueue
              utteranceQueue.addToBack( new Utterance( utterance, { typeId: 'movementAlert' } ) );
            }

            // describe the change in induced charge due to balloon dragging
            if ( this.chargeDescriber.describeInducedChargeChange() ) {
              utterance = '';
              var wallVisible = this.wall.isVisibleProperty.get();

              // if there is purely vertical motion, do not include information about amount of charge displacement
              if ( dragDelta.x === 0 ) {
                utterance = WallDescriber.getInducedChargeDescriptionWithNoAmount( model, this.accessibleName, wallVisible );
              }
              else if ( !model.touchingWall() ) {
                utterance = this.chargeDescriber.getInducedChargeChangeDescription();
              }

              utteranceQueue.addToBack( new Utterance( utterance, { typeId: 'inducedChargeChange' } ) );
            }

            // update flags that indicate which alerts should come next
            this._chargeOnEndDrag = model.chargeProperty.get();
            this._rubAlertDirty = true;
          }

          // if velocity has just become zero after a jump, we just completed a jumping interaction
          if ( model.jumping ) {
            model.jumping = false;
          }

          // update the old dragging location for next time, copy so we can compare by value
          this._oldDragLocation = nextLocation.copy();
        }
      }

      // describe any updates that might come from the balloon touches or leaves the wall - don't describe if we are
      // currently touching the balloon since the jump will generate a unique alert
      if ( this._describedTouchingWall !== nextTouchingWall ) {
        if ( !model.jumping ) {
          if ( nextTouchingWall ) {
            if ( model.isDraggedProperty.get() && this.showChargesProperty.get() === 'all' ) {
              utteranceQueue.addToBack( this.getWallRubbingDescriptionWithChargePairs() );
              this._describeWallRub = false;
            }
            else {

              // generates a description of how the balloon interacts with the wall
              if ( nextVisible ) {
                utteranceQueue.addToBack( this.movementDescriber.getMovementStopsDescription() );
              }
            }
          }
        }
      }

      // any alerts that might be generated when the balloon is picked up and released
      if ( this._describedIsDragged !== nextIsDragged ) {
        utterance = '';

        if ( nextIsDragged ) {
          utterance = this.movementDescriber.getGrabbedAlert();

          // we have been picked up - start describing changes to direction
          this._describeDirection = true;
        }
        else {
          utterance = this.movementDescriber.getReleasedAlert();

          // don't describe direction until initial release description happens
          this._describeDirection = false;
        }

        utteranceQueue.addToBack( utterance );

        // reset flags that track description content
        this._initialMovementDescribed = false;
      }

      // any balloon specific alerts that might come from changes to wall visibility
      // TODO: Can this be moved into the 'touching' wall check?
      if ( this._describedWallVisible !== nextWallVisible ) {

        // if the wall is removed while a balloon is touching the wall, we will need to describe how the balloon
        // responds, just like a release
        if ( !nextWallVisible && this._describedTouchingWall ) {
          this._initialMovementDescribed = false;
        }
      }

      // any changes to location from independent balloon movement (not dragging)
      if ( nextVisible && !nextIsDragged ) {
        utterance = '';

        if ( !this._initialMovementDescribed ) {
          if ( model.timeSinceRelease > RELEASE_DESCRIPTION_TIME_DELAY ) {

            this._initialMovementDescribed = true;

            // get the initial alert describing balloon release
            if ( !nextVelocity.equals( Vector2.ZERO ) ) {

              utterance = this.movementDescriber.getInitialReleaseDescription();
              utteranceQueue.addToBack( utterance );

              // after describing initial movement, continue to describe direction changes
              this._describeDirection = true;
            }
            else if ( nextVelocity.equals( Vector2.ZERO ) ) {

              // describe that the balloon was released and there was no resulting movement - but don't describe this
              // when the balloon is first added to the play area
              if ( !this._preventNoMovementAlert ) {
                utterance = this.movementDescriber.getNoChangeReleaseDescription();
                utteranceQueue.addToBack( utterance );
              }
              this._preventNoMovementAlert = false;
            }

            // reset timer for release alert
            this._timeSinceReleaseAlert = 0;
          }
        }
        else if ( this._timeSinceReleaseAlert > RELEASE_DESCRIPTION_REFRESH_RATE ) {

          // if the balloon is moving slowly, alert a continuous movement description
          if ( this.movementDescriber.balloonMovingAtContinousDescriptionVelocity() ) {
            utterance = this.movementDescriber.getContinuousReleaseDescription();
            utteranceQueue.addToBack( utterance );

            // reset timer
            this._timeSinceReleaseAlert = 0;
          }
        }
      }

      // announce any alert related to charge pickup (or lack of charge pickup) of the balloon
      if ( this._timeSinceChargeAlert > CHARGE_DESCRIPTION_REFRESH_RATE ) {
        if ( this._chargeOnStartDrag === this._chargeOnEndDrag ) {
          if ( this._rubAlertDirty ) {
            if ( nextIsDragged &&  model.onSweater() ) {
              utterance = this.getNoChargePickupDescription();
              utteranceQueue.addToBack( new Utterance( utterance, { typeId: 'chargeAlert' } ) );
            }
          }
        }

        this.alertNextPickup = true;
        this._timeSinceChargeAlert = 0;
        this._rubAlertDirty = false;
      }

      // update variables tracking hysteresis
      this._describedVelocity = nextVelocity;
      this._describedDragVelocity = nextDragVelocity;
      this._describedLocation = nextLocation;
      this._describedVisible = nextVisible;
      this._describedTouchingWall = nextTouchingWall;
      this._describedIsDragged = nextIsDragged;
      this._describedWallVisible = nextWallVisible;
    }
  } );
} );