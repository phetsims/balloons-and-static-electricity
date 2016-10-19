// Copyright 2002-2016, University of Colorado Boulder

/**
 * This type allows for determining descriptions for the balloon.  Describing the location of the balloon
 * is quite complicated so this distributes the description work so that BalloonNode does not become
 * a massive file.  Used for accessibility.
 *
 * !! The LocationEnum maps nicely to these descriptions, so this shouldn't be so bad!
 *
 * @author Jesse Greenberg
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Range = require( 'DOT/Range' );
  var StringMaps = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/accessibility/StringMaps' );
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );

  // constants
  var A_FEW_RANGE = new Range( 1, 15 );
  var SEVERAL_RANGE = new Range( 15, 40 );
  var MANY_RANGE = new Range( 40, 56 );
  var MAX_BALLOON_CHARGE = -57;

  var KEY_S = 83; // keycode for 's'
  var KEY_W = 87; // keyvode for 'w'
  var KEY_A = 65; // keycode for 'a'
  var KEY_D = 68; // keycode for 'd'

  // strings
  var balloonDescriptionPatternString = '{0} {1} {2}';
  var balloonDragDescriptionPatternString = '{0} {1} {2} {3}'; // direction, proximity, charge, 
  var grabButtonNavigationCueString = 'Look for grab button to play';
  // var dragNavigationCueString = 'Press W, A, S, or D key to drag balloon. Spacebar to let go. H key for hotkeys and help.'

  // location strings (organized by collumns in the play area)
  var balloonLocationStringPattern = 'In {0}.';
  var draggingLocationStringPattern = 'At {0}';

  var topLeftEdgeOfSweaterString = 'top left edge of sweater';
  var upperLeftEdgeOfSweaterString = 'upper left edge of sweater';
  var lowerLeftEdgeOfSweaterString = 'lower left edge of sweater';
  var bottomLeftEdgeOfSweaterString = 'bottom left edge of sweater';

  var topLeftArmString = 'top left arm';
  var upperLeftArmString = 'upper left arm';
  var lowerLeftArmString = 'lower left arm';
  var bottomLeftArmString = 'bottom left arm';

  var topLeftSideOfSweaterString = 'top left side of sweater';
  var upperLeftSideOfSweaterString = 'upper left side of sweater';
  var lowerLeftSideOfSweaterString = 'lower left side of sweater';
  var bottomLeftSideOfSweaterString = 'bottom left side of sweater';

  var topRightSideOfSweaterString = 'top right side of sweater';
  var upperRightSideOfSweaterString = 'upper right side of sweater';
  var lowerRightSideOfSweaterString = 'lower right side of sweater';
  var bottomRightSideOfSweaterString = 'bottom right side of sweater';

  var topRightArmString = 'top right arm';
  var upperRightArmString = 'upper right arm';
  var lowerRightArmString = 'lower right arm';
  var bottomRightArmString = 'bottom right arm';

  var topLeftSideOfPlayAreaString = 'top left side of play area';
  var upperLeftSideOfPlayAreaString = 'upper left side of play area';
  var lowerLeftSideOfPlayAreaString = 'lower left side of play area';
  var bottomLeftSideOfPlayAreaString = 'bottom left side of play area';

  var topCenterOfPlayAreaString = 'top center of play area';
  var upperCenterOfPlayAreaString = 'upper center of play area';
  var lowerCenterOfPlayAreaString = 'lower center of play area';
  var bottomCenterOfPlayAreaString = 'bottom center of play area';

  var topRightSideOfPlayAreaString = 'top right side of play area';
  var upperRightSideOfPlayAreaString = 'upper right side of play area';
  var lowerRightSideOfPlayAreaString = 'lower right side of play area';
  var bottomRightSideOfPlayAreaString = 'bottom right side of play area';

  var topRightEdgeOfPlayAreaString = 'top right edge of play area';
  var upperRightEdgeOfPlayAreaString = 'upper right edge of play area';
  var lowerRightEdgeOfPlayAreaString = 'lower right edge of play area';
  var bottomRightEdgeOfPlayAreaString = 'bottom right edge of play area';

  // location strings while touching another object
  var atWallPatternString = 'At {0} wall.';
  var touchingWallStringPattern = 'Touching {0} wall.';
  var stickintToWallStringPattern = 'Sticking to {0} wall.';
  var lowerWallString = 'lower';
  var upperWallString = 'upper';

  // charge descriptions
  var namedBalloonChargeDescriptionPatternString = '{0} has net {1} charge, {2} more negative charges than positive charges.';
  var balloonChargeStringPattern = 'Has net {0} charge, {1} more negative charges than positive charges.';
  var sweaterChargePatternString = 'Sweater has net {0} charge, {1} more positive charges than negative ones.';

  var neutralString = 'neutral';
  var negativeString = 'negative';
  var positiveString = 'positive';

  var noString = 'no';
  var aFewString = 'a few';
  var severalString = 'several';
  var manyString = 'many';

  // wall charge descriptions
  var atWallString = 'At wall.';
  var atWallTouchPointPatternString = 'At touch point, negative charges in wall move away from balloon {0}.';

  var noChangeInChargesString = 'No change in charges.';
  var aLittleBitString = 'a little bit';
  var aLotString = 'a lot';
  var quiteALotString = 'quite a lot';
  var noMoreChargesRemainingOnSweaterString = 'No change in charges. No more charges remaining on sweater.';

  var positiveChargesDoNotMoveString = 'Positive charges do not move.';
  var wallHasChargePairsString = 'Wall has many pairs of positive and negative charges';

  var balloonHasChargesPatternString = 'Balloon has {0} more negative charges than positive charges.';

  // release descriptions

  // interaction descriptions
  var upTowardsTopString = 'Up. Towards top.';
  var leftTowardsSweaterString = 'Left. Towards sweater';
  var downTowardsBottomString = 'Down. Towards bottom';
  var rightTowardsWallString = 'Right. Towards wall.';

  var closerToTopString = 'Up. Closer to top.';
  var closerToSweaterString = 'Left. Closer to sweater.';
  var closerToBottomString = 'Down. Closer to bottom.';
  var closerToWallString = 'Right. Closer to wall.';

  var upString = 'Up.';
  var leftString = 'Left.';
  var downString = 'Down.';
  var rightString = 'Right.';

  var morePairsOfChargesStringPattern = 'More pairs of charges {0}';

  // boundary strings
  var atTopOfPlayAreaString = 'At top of play area.';
  var atBottomOfPlayAreaString = 'At bottom of play area';

  var nearSweaterString = 'Near sweater';
  var onSweaterPatternStringString = 'On sweater. {0}';
  var picksUpNegativeChargesString = 'Picks up negative charges from sweater.';
  var nearWallString = 'Near wall.';
  var offSweaterString = 'Off sweater';

  var balloonPicksUpMoreChargesString = 'Balloon picks up more negative charges';
  var againMoreChargesString = 'Again, more negative ones.';

  // labels
  var greenBalloonString = 'Green balloon';
  var yellowBalloonString = 'Yellow balloon';

  /**
   * @param {BalloonsAndStaticElectricityModel} model
   * @param {WallModel} wall
   * @constructor
   */
  function BalloonDescriber( model, wall, balloon ) {

    // @private
    this.model = model;
    this.wall = wall;
    this.balloon = balloon;

    this.balloonLabelMap = {
      GREEN: greenBalloonString,
      YELLOW: yellowBalloonString
    };

    // @private
    this.locationDescriptionMap = {
      TOP_LEFT: topLeftEdgeOfSweaterString,
      UPPER_LEFT: upperLeftEdgeOfSweaterString,
      LOWER_LEFT: lowerLeftEdgeOfSweaterString,
      BOTTOM_LEFT: bottomLeftEdgeOfSweaterString,

      TOP_LEFT_ARM: topLeftArmString,
      UPPER_LEFT_ARM: upperLeftArmString,
      LOWER_LEFT_ARM: lowerLeftArmString,
      BOTTOM_LEFT_ARM: bottomLeftArmString,

      TOP_LEFT_SWEATER: topLeftSideOfSweaterString,
      UPPER_LEFT_SWEATER: upperLeftSideOfSweaterString,
      LOWER_LEFT_SWEATER: lowerLeftSideOfSweaterString,
      BOTTOM_LEFT_SWEATER: bottomLeftSideOfSweaterString,

      TOP_RIGHT_SWEATER: topRightSideOfSweaterString,
      UPPER_RIGHT_SWEATER: upperRightSideOfSweaterString,
      LOWER_RIGHT_SWEATER: lowerRightSideOfSweaterString,
      BOTTOM_RIGHT_SWEATER: bottomRightSideOfSweaterString,

      TOP_RIGHT_ARM: topRightArmString,
      UPPER_RIGHT_ARM: upperRightArmString,
      LOWER_RIGHT_ARM: lowerRightArmString,
      BOTTOM_RIGHT_ARM: bottomRightArmString,

      TOP_LEFT_PLAY_AREA: topLeftSideOfPlayAreaString,
      UPPER_LEFT_PLAY_AREA: upperLeftSideOfPlayAreaString,
      LOWER_LEFT_PLAY_AREA: lowerLeftSideOfPlayAreaString,
      BOTTOM_LEFT_PLAY_AREA: bottomLeftSideOfPlayAreaString,

      TOP_CENTER_PLAY_AREA: topCenterOfPlayAreaString,
      UPPER_CENTER_PLAY_AREA: upperCenterOfPlayAreaString,
      LOWER_CENTER_PLAY_AREA: lowerCenterOfPlayAreaString,
      BOTTOM_CENTER_PLAY_AREA: bottomCenterOfPlayAreaString,

      TOP_RIGHT_PLAY_AREA: topRightSideOfPlayAreaString,
      UPPER_RIGHT_PLAY_AREA: upperRightSideOfPlayAreaString,
      LOWER_RIGHT_PLAY_AREA: lowerRightSideOfPlayAreaString,
      BOTTOM_RIGHT_PLAY_AREA: bottomRightSideOfPlayAreaString,

      TOP_RIGHT: topRightEdgeOfPlayAreaString,
      UPPER_RIGHT: upperRightEdgeOfPlayAreaString,
      LOWER_RIGHT: lowerRightEdgeOfPlayAreaString,
      BOTTOM_RIGHT: bottomRightEdgeOfPlayAreaString,

    };

    // @private - track the number of times each of the W, A, S and D keys have been pressed in a single interaction
    this.aKeyPressedCount = 0;
    this.wKeyPressedCount = 0;
    this.sKeyPressedCount = 0;
    this.dKeyPressedCount = 0;

    // @private - track the current bounds and state of the balloon
    this.balloonBounds = this.model.playArea.getPointBounds( balloon.getCenter() );
    this.balloonOnSweater = balloon.onSweater();
    this.transitionedToNewArea = false; // true when balloon moves across sweater
    this.balloonCharge = balloon.chargeProperty.get();
    this.balloonChargeRange = A_FEW_RANGE;
    this.balloonInChargeRangeCount = 0; // if stays in one range while picking up many charges, this is incremented
  }

  balloonsAndStaticElectricity.register( 'BalloonDescriber', BalloonDescriber );

  return inherit( Object, BalloonDescriber, {

    /**
     * Get a description of the balloon location.
     *
     * @param  {Balloon} balloon
     * @return {string}
     */
    getBalloonLocationDescription: function( balloon, dragging ) {
      var balloonLocationDescription;

      // if dragging, we want to have a more active description, using 'at' instead of 'in'
      var locationStringPattern = dragging ? draggingLocationStringPattern : balloonLocationStringPattern;

      // if touching the wall (balloon has no charge)
      if ( this.model.playArea.atWall === balloon.getCenter().x ) {
        var upperLowerString;
        if ( balloon.inUpperHalfOfPlayArea() ) {
          upperLowerString = upperWallString;
        }
        else {
          upperLowerString = lowerWallString;
        }

        if ( balloon.chargeProperty.get() === 0 ) {
          balloonLocationDescription = StringUtils.format( touchingWallStringPattern, upperLowerString );
        }
        else {
          balloonLocationDescription = StringUtils.format( stickintToWallStringPattern, upperLowerString );
        }
      }
      else {
        var locationBounds = this.model.playArea.getPointBounds( balloon.getCenter() );
        var locationDescription = this.locationDescriptionMap[ locationBounds ];

        balloonLocationDescription = StringUtils.format( balloonLocationStringPattern, locationDescription );
      }

      assert && assert( balloonLocationDescription, 'no description found for balloon location' );
      return balloonLocationDescription;
    },

    /**
     * Get a description of the proximity of the balloon to other items in the play area.
     * @param  {BalloonModel} balloon
     * @return {string}
     */
    getBalloonProximityDescription: function( balloon ) {
      var proximityDescription;
      var balloonOnSweater = balloon.onSweater();
      if ( balloon.nearSweater() ) {
        proximityDescription = nearSweaterString;
      }
      else if ( balloonOnSweater !== this.balloonOnSweater ) {
        if ( balloonOnSweater ) {
          // only anounce on sweater the first time it hits the sweater
          // if the balloon picks up a charge as it touches the sweater, anounce this
          if ( balloon.chargeProperty.get() !== this.balloonCharge ) {
            proximityDescription = StringUtils.format( onSweaterPatternStringString, picksUpNegativeChargesString );
            this.balloonCharge = balloon.chargeProperty.get();
          }
          else {
            proximityDescription = StringUtils.format( onSweaterPatternStringString, '' );
          }
        }
        else {
          proximityDescription = offSweaterString;
        }
        this.balloonOnSweater = balloonOnSweater;
        this.transitionedToNewArea = true;
      }
      else if ( balloonOnSweater === this.balloonOnSweater ) {
        this.transitionedToNewArea = false;
      }

      return proximityDescription;
    },

    /**
     * Get a description of the balloon's charge.
     * TODO: This kind of method of getting descriptions based on numerical values in a range
     * could be generalized some how.
     * 
     * @param  {Baloon} balloon
     * @return {string}
     */
    getBalloonChargeDescription: function( balloon, dragging ) {
      var chargeString;
      var neutralityString;

      var balloonLabel = this.balloonLabelMap[ balloon.balloonLabel ];

      var charge = Math.abs( balloon.chargeProperty.value );
      if ( charge === 0 ) {
        chargeString = noString;
        neutralityString = neutralString;
      }
      else if ( A_FEW_RANGE.contains( charge ) ) {
        chargeString = aFewString;
        neutralityString = negativeString;
      }
      else if ( SEVERAL_RANGE.contains( charge ) ) {
        chargeString = severalString;
        neutralityString = negativeString;
      }
      else if ( MANY_RANGE.contains( charge ) ) {
        chargeString = manyString;
        neutralityString = negativeString;
      }

      assert && assert( chargeString, 'no description found for balloon with charge: ' + balloon.charge );

      if ( dragging ) {
        return StringUtils.format( namedBalloonChargeDescriptionPatternString, balloonLabel, neutralityString, chargeString );
      }
      else {
        return StringUtils.format( balloonChargeStringPattern, neutralityString, chargeString );
      }

    },

    getSweaterChargeDescription: function( balloon ) {
      var chargeString;
      var neutralityString;

      var charge = Math.abs( balloon.chargeProperty.value );
      if ( charge === 0 ) {
        chargeString = noString;
        neutralityString = neutralString;
      }
      else if ( A_FEW_RANGE.contains( charge ) ) {
        chargeString = aFewString;
        neutralityString = positiveString;
      }
      else if ( SEVERAL_RANGE.contains( charge ) ) {
        chargeString = severalString;
        neutralityString = positiveString;
      }
      else if ( MANY_RANGE.contains( charge ) ) {
        chargeString = manyString;
        neutralityString = positiveString;
      }

      assert && assert( chargeString, 'no description found for sweater with charge: ' + -balloon.charge );
      return StringUtils.format( sweaterChargePatternString, neutralityString, chargeString );
    },

    /**
     * Get a description of the balloon as it is dragging.  This should be called when the user completes 
     * a drag interaction (on key up, typically).
     *
     * @param  {Balloon} balloon
     * @return {string}        
     */
    getDraggingDescription: function( balloon, keyCode ) {
      var draggingDescription;

      var directionString;
      if ( keyCode === KEY_W ) {
        if ( balloon.onSweater() ) {
          directionString = upString;
        }
        else if ( this.wKeyPressedCount === 0 ) {
          directionString = upTowardsTopString;
        }
        else if ( this.wKeyPressedCount < 2 ) {
          directionString = closerToTopString;
        }
        else {
          directionString = upString;
        }
        this.wKeyPressedCount++;
      }
      else if ( keyCode === KEY_S ) {
        if ( balloon.onSweater() ) {
          directionString = downString;
        }
        else if ( this.sKeyPressedCount === 0 ) {
          directionString = downTowardsBottomString;
        }
        else if ( this.sKeyPressedCount < 2 ) {
          directionString = closerToBottomString;
        }
        else {
          directionString = downString;
        }
        this.sKeyPressedCount++;
      }
      else if ( keyCode === KEY_A ) {
        if ( balloon.onSweater() ) {
          directionString = leftString;
        }
        else if ( this.aKeyPressedCount === 0  ) {
          directionString = leftTowardsSweaterString;
        }
        else if ( this.aKeyPressedCount < 2 ) {
          directionString = closerToSweaterString;
        }
        else {
          directionString = leftString;
        }
        this.aKeyPressedCount++;
      }
      else if ( keyCode === KEY_D ) {
        if ( balloon.onSweater() ) {
          directionString = rightString;
        }
        else if ( this.dKeyPressedCount === 0 ) {
          directionString = rightTowardsWallString;
        }
        else if ( this.dKeyPressedCount < 2 ) {
          directionString = closerToWallString;
        }
        else {
          directionString = rightString;
        }
        this.dKeyPressedCount++;
      }

      // TODO: When do key counds need to be reset?
      if ( this.keyCoundsNeedToBeReset() ) {
        this.resetKeyCounts();
      }

      if ( this.balloonOnSweater ) {
        // this will be true on the first rub, after user hits sweater the first time
        var onSweaterDescription = this.getSweaterRubDescription( balloon );
      }

      var newBounds = this.model.playArea.getPointBounds( balloon.getCenter() );
      if ( newBounds !== this.balloonBounds ) {
        this.balloonBounds = newBounds;
        var locationString = this.getBalloonLocationDescription( balloon, true );
      }
      var proximityString = this.getBalloonProximityDescription( balloon );

      var string1 = '';
      var string2 = '';
      var string3 = '';
      var string4 = '';
      if ( directionString ) {
        string1 = directionString;
      }
      if ( onSweaterDescription ) {
        string2 = onSweaterDescription;
      }
      if ( proximityString ) {
        string3 = proximityString;
      }
      if ( locationString && !balloon.onSweater() ) {
        string4 = locationString;
      }

      draggingDescription = StringUtils.format( balloonDragDescriptionPatternString, string1, string2, string3, string4 );
      return draggingDescription;
    },

    /**
     * Get an alert for when the balloon rubs on the sweater.
     * @param  {BalloonModel} balloon
     * @return {string}
     */
    getSweaterRubDescription: function( balloon ) {
      var currentBalloonCharge = balloon.chargeProperty.get();
      var currentBalloonChargeRange = this.getCurrentChargeRange();

      var balloonChargeString;
      var sweaterChargeString;
      var balloonPicksUpChargesString;

      if ( currentBalloonCharge === MAX_BALLOON_CHARGE ) {
        return noMoreChargesRemainingOnSweaterString;
      }
      else if ( currentBalloonCharge !== this.balloonCharge ) {  
        // the balloon has picked at least one charge
        this.balloonCharge = balloon.chargeProperty.get();

        if ( this.balloonChargeRange !== currentBalloonChargeRange ) {
          // the balloon has picked up enough charges to remind the user that there is a difference in charges
          this.balloonInChargeRangeCount = 0;
          this.balloonChargeRange = currentBalloonChargeRange;
        }

        if ( this.balloonInChargeRangeCount === 0 ) {
          // this is the first time picking up a charge in this range
          balloonChargeString = this.getBalloonChargeDescription( balloon, true /*dragging*/ );
          sweaterChargeString = this.getSweaterChargeDescription( balloon );

        }
        else if ( this.balloonInChargeRangeCount === 1 ) {
          balloonPicksUpChargesString = balloonPicksUpMoreChargesString;
        }
        else {
          balloonPicksUpChargesString = againMoreChargesString;
        }

        this.balloonInChargeRangeCount++;
      }
      else {
        // no charge was picked up, so tell the user where they can find more
        var moreChargesString = this.getChargePositionCue();

        // Once we give this cue, the user needs more context when they pick up additional charges
        this.balloonInChargeRangeCount = 1;
        
        return moreChargesString;
      }

      if ( balloonPicksUpChargesString ) {
        return balloonPicksUpChargesString;
      }
      else {
        var stringPattern = '{0} {1}';
        return StringUtils.format( stringPattern, balloonChargeString, sweaterChargeString );
      }

    },

    /**
     * Get a description that tells the user where they can find more charges.
     * 
     * @return {string}
     */
    getChargePositionCue: function() {
      assert && assert( this.model.sweater.chargeProperty.get() < -MAX_BALLOON_CHARGE, 'trying to find more charges when none remain' );

        // get the closest charge that has not been picked up
      var closestCharge = this.balloon.getClosestCharge();
      var directionToCharge = this.balloon.getDirectionToCharge( closestCharge );

      var directionCueString = StringMaps.DIRECTION_MAP[ directionToCharge ];
      assert && assert( directionCueString, 'no direction found for nearest charge' );

      return StringUtils.format( morePairsOfChargesStringPattern, directionCueString );
    },

    /**
     * Return the range that contains the current charge value of the balloon.
     * @return {Range|null}
     */
    getCurrentChargeRange: function() {
      var charge = Math.abs( this.balloon.chargeProperty.get() );

      if ( charge === 0 ) {
        return;
      }
      else if ( A_FEW_RANGE.contains( charge ) ) {
        return A_FEW_RANGE;
      }
      else if ( SEVERAL_RANGE.contains( charge ) ) {
        return SEVERAL_RANGE;
      }
      else if ( MANY_RANGE.contains( charge ) ) {
        return MANY_RANGE;
      }
  
    },

    /**
     * Get a description for the balloon, including charge and location.
     * 
     * @param  {Balloon} balloon
     * @return {string}
     */
    getDescription: function( balloon ) {
      var locationDescription = this.getBalloonLocationDescription( balloon, false );
      var chargeDescription = this.getBalloonChargeDescription( balloon, false );
      return StringUtils.format( balloonDescriptionPatternString, locationDescription, chargeDescription, grabButtonNavigationCueString );
    },

    /**
     * Reset all key counters used for hysteresis when checking balloon
     */
    resetKeyCounts: function() {
      this.aKeyPressedCount = 0;
      this.wKeyPressedCount = 0;
      this.sKeyPressedCount = 0;
      this.dKeyPressedCount = 0;
    },

    /**
     * Reset all flags that monitor the balloon and define hysteresis for descriptions.
     * @public
     */
    reset: function() {
      this.aKeyPressedCount = 0;
      this.wKeyPressedCount = 0;
      this.sKeyPressedCount = 0;
      this.dKeyPressedCount = 0;

      this.balloonBounds = this.model.playArea.getPointBounds( this.balloon.getCenter() );
      this.balloonOnSweater = this.balloon.onSweater();
      this.transitionedToNewArea = false;
      this.balloonCharge = this.balloon.chargeProperty.get();
      this.balloonChargeRange = A_FEW_RANGE;
      this.balloonInChargeRangeCount = 0;
    },

    /**
     * Return true when it is time to reset the dragging descriptions.
     * @return {boolean}
     */
    keyCoundsNeedToBeReset: function() {
      var countsTooHigh =
        this.dKeyPressedCount > 5 || 
        this.sKeyPressedCount > 5 || 
        this.aKeyPressedCount > 5 || 
        this.wKeyPressedCount > 5;

      return countsTooHigh || this.transitionedToNewArea;
    }
  } );

} );
