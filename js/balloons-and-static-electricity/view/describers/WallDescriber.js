// Copyright 2017-2018, University of Colorado Boulder

/**
 * A view type that observes the WallModel and builds descriptions which can be read by assistive technology.
 * @author Jesse Greenberg
 */

define( function( require ) {
  'use strict';

  // modules
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );
  var BASEA11yStrings = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/BASEA11yStrings' );
  var BASEDescriber = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/describers/BASEDescriber' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PlayAreaMap = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/PlayAreaMap' );
  var Range = require( 'DOT/Range' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Vector2 = require( 'DOT/Vector2' );

  // strings
  var wallDescriptionPatternString = BASEA11yStrings.wallDescriptionPattern.value;
  var wallLocationString = BASEA11yStrings.wallLocation.value;
  var wallNoNetChargeString = BASEA11yStrings.wallNoNetCharge.value;
  var aLittleBitString = BASEA11yStrings.aLittleBit.value;
  var aLotString = BASEA11yStrings.aLot.value;
  var quiteALotString = BASEA11yStrings.quiteALot.value;
  var inducedChargePatternString = BASEA11yStrings.inducedChargePattern.value;
  var greenBalloonLabelString = BASEA11yStrings.greenBalloonLabel.value;
  var yellowBalloonLabelString = BASEA11yStrings.yellowBalloonLabel.value;
  var wallTwoBalloonInducedChargePatternString = BASEA11yStrings.wallTwoBalloonInducedChargePattern.value;
  var wallChargeWithoutInducedPatternString = BASEA11yStrings.wallChargeWithoutInducedPattern.value;
  var wallChargeWithInducedPatternString = BASEA11yStrings.wallChargeWithInducedPattern.value;
  var showingNoChargesString = BASEA11yStrings.showingNoCharges.value;
  var manyChargePairsString = BASEA11yStrings.manyChargePairs.value;
  var singleStatementPatternString = BASEA11yStrings.singleStatementPattern.value;
  var wallNoChangeInChargesPatternString = BASEA11yStrings.wallNoChangeInChargesPattern.value;
  var inducedChargeNoAmountPatternString = BASEA11yStrings.inducedChargeNoAmountPattern.value;
  var wallChargePatternStringWithLabel = BASEA11yStrings.wallChargePatternStringWithLabel.value;
  var summaryObjectHasChargePatternString = BASEA11yStrings.summaryObjectHasChargePattern.value;
  var summaryObjectChargePatternString = BASEA11yStrings.summaryObjectChargePattern.value;
  var wallLabelString = BASEA11yStrings.wallLabel.value;
  var zeroString = BASEA11yStrings.zero.value;
  var bothBalloonsString = BASEA11yStrings.bothBalloons.value;
  var wallInducedChargeSummaryPatternString = BASEA11yStrings.wallInducedChargeSummaryPattern.value;
  var positiveChargesDoNotMoveString = BASEA11yStrings.positiveChargesDoNotMove.value;

  // constants
  var INDUCED_CHARGE_DESCRIPTION_MAP = {
    A_LITTLE_BIT: {
      range: new Range( 0, 10 ),
      description: aLittleBitString
    },
    A_LOT: {
      range: new Range( 10, 20 ),
      description: aLotString
    },
    QUITE_A_LOT: {
      range: new Range( 20, Number.MAX_VALUE ),
      description: quiteALotString
    }
  };

  /**
   * @constructor
   *
   * @param {BASEmodel} model
   */
  function WallDescriber( model ) {

    // @private {WallModel}
    this.wallModel = model.wall;

    // @private {BalloonModel}
    this.yellowBalloon = model.greenBalloon;

    // @private {BalloonModel}
    this.greenBalloon = model.greenBalloon;

    // @private showChargesProperty
    this.showChargesProperty = model.showChargesProperty;
  }

  balloonsAndStaticElectricity.register( 'WallDescriber', WallDescriber );

  return inherit( Object, WallDescriber, {

    /**
     * Get the full description for the wall including its location, net charge, and induced charge.  This is used
     * as the general description for the wall which an AT user can read at any time with the virtual cursor.
     * The content is dependent on the view representation of charges (model.showchargesProperty).
     * 
     * @public
     * @param  {BalloonModel} yellowBalloon
     * @param  {BalloonModel} greenBalloon
     * @returns {string}
     */
    getWallDescription: function( yellowBalloon, greenBalloon, balloonsAdjacent ) {
      var  description;

      // if no charges are shown, the location is the only part of the description
      if ( this.showChargesProperty.get() === 'none' ) {
        description = StringUtils.fillIn( singleStatementPatternString, {
          statement: wallLocationString
        } );
      }
      else {
        var chargeDescription = WallDescriber.getWallChargeDescription( yellowBalloon, greenBalloon, balloonsAdjacent, this.wallModel.isVisibleProperty.get(), this.showChargesProperty.get() );

        // assemble the whole description
        description = StringUtils.fillIn( wallDescriptionPatternString, {
          location: wallLocationString, 
          charge: chargeDescription
        } ); 
      }

      return description;
    }
  }, {

    /**
     * Get the described charge in the wall, dependent on charge visibility, whether or not there is induced charge,
     * and which balloons are visible. This portion of the description does not include any wall position information.
     *
     * @returns {string}
     */
    getWallChargeDescription: function( yellowBalloon, greenBalloon, balloonsAdjacent, wallVisible, chargesShown )  {
      var descriptionString;

      var inducedChargeString;
      var yellowBalloonInducedChargeString;
      var greenBalloonInducedChargeString;

      var yellowInducingAndvisible = yellowBalloon.inducingChargeAndVisible();
      var greenInducingAndVisible = greenBalloon.inducingChargeAndVisible();

      // if all charges are shown, and a balloon is inducing charge, generate the description for induced charge which
      // can change depending on whether balloons are adjacent or whether both balloons are inducing at the same time
      if ( wallVisible && chargesShown === 'all' ) {
        if ( yellowInducingAndvisible ) {
          yellowBalloonInducedChargeString = WallDescriber.getInducedChargeDescription( yellowBalloon, yellowBalloonLabelString, wallVisible, {
            includePositiveChargeInfo: false
          } );
          inducedChargeString = yellowBalloonInducedChargeString;
        }
        if ( greenInducingAndVisible ) {
          greenBalloonInducedChargeString = WallDescriber.getInducedChargeDescription( greenBalloon, greenBalloonLabelString, wallVisible, {
            includePositiveChargeInfo: false
          } );
        }

        // if both are adjacent and visible, we can combine the induced charge description into a single
        // statement to reduce verbosity
        if ( yellowInducingAndvisible && greenInducingAndVisible ) {
          if ( balloonsAdjacent ) {
            inducedChargeString = WallDescriber.getCombinedInducedChargeDescription( yellowBalloon, wallVisible, {
              includePositiveChargeInfo: false
            } );
          }
          else {
            inducedChargeString = StringUtils.fillIn( wallTwoBalloonInducedChargePatternString, {
              yellowBalloon: yellowBalloonInducedChargeString,
              greenBalloon: greenBalloonInducedChargeString
            } );
          }
        }
        else if ( yellowInducingAndvisible || greenInducingAndVisible ) {
          if ( yellowInducingAndvisible ) {
            inducedChargeString = yellowBalloonInducedChargeString;
          }
          else if ( greenInducingAndVisible ) {
            inducedChargeString = greenBalloonInducedChargeString;
          }

          // wrap with punctuation
          inducedChargeString = StringUtils.fillIn( singleStatementPatternString, {
            statement: inducedChargeString
          } );
        }
      }

      // get the description for what charges are currently shown
      var shownChargesString = ( chargesShown === 'diff' ) ? showingNoChargesString : manyChargePairsString;

      // if there is an induced charge, include it in the full charge description
      var wallChargeString;
      if ( ( yellowBalloon.inducingChargeProperty.get() || greenInducingAndVisible ) && chargesShown === 'all' && wallVisible ) {
        inducedChargeString = StringUtils.fillIn( wallInducedChargeSummaryPatternString, {
          inducedCharge: inducedChargeString,
          positiveCharges: positiveChargesDoNotMoveString
        } );

        wallChargeString = StringUtils.fillIn( wallChargeWithInducedPatternString, {
          netCharge: wallNoNetChargeString,
          shownCharges: shownChargesString,
          inducedCharge: inducedChargeString
        } );
      }
      else {
        wallChargeString = StringUtils.fillIn( wallChargeWithoutInducedPatternString, {
          netCharge: wallNoNetChargeString,
          shownCharges: shownChargesString
        } );
      }

      descriptionString = wallChargeString;
      return descriptionString;
    },


    /**
     * Get a description of the wall charge that includes the label. Something like
     * "Wall has no net charge, showing..."
     *
     * @param {BalloonModel} yellowBalloon
     * @param {BalloonModel} greenBalloon
     * @param {boolean} wallVisible
     * @param {string} chargesShown
     *
     * @returns {string}
     */
    getWallChargeDescriptionWithLabel: function( yellowBalloon, greenBalloon, balloonsAdjacent, wallVisible, chargesShown ) {
      var description = WallDescriber.getWallChargeDescription( yellowBalloon, greenBalloon, balloonsAdjacent, wallVisible, chargesShown );
      description = description.toLowerCase();

      return StringUtils.fillIn( wallChargePatternStringWithLabel, {
        wallCharge: description
      } );
    },

    /**
     * Get the induced charge amount description for the balloon, describing whether the charges are
     * "a little bit" displaced and so on.
     * @param  {BalloonModel} balloon
     * @returns {string}
     */
    getInducedChargeAmountDescription: function( balloon ) {

      var amountDescription;
      var descriptionKeys = Object.keys( INDUCED_CHARGE_DESCRIPTION_MAP );
      for ( var j = 0; j < descriptionKeys.length; j++ ) {
        var value = INDUCED_CHARGE_DESCRIPTION_MAP[ descriptionKeys[ j ] ];
        if ( value.range.contains( balloon.closestChargeInWall.getDisplacement() ) ) {
          amountDescription = value.description;
        }
      }
      return amountDescription;
    },

    /**
     * Get the description for induced charge when there is no induced charge. Something like
     * "In wall, no change in charges."
     *
     * @param {string} locationString
     * @returns {string}
     */
    getNoChangeInChargesDescription: function( locationString ) {
      return StringUtils.fillIn( wallNoChangeInChargesPatternString, {
        location: locationString
      } );
    },

    /**
     * Get the induced charge description without the amount of induced charge. Will return something like
     * "Negative charges in wall move away from yellow balloon."
     *
     * @param {BalloonModel} balloon
     * @param {string} balloonLabel
     * @param {boolean} wallVisible
     * @returns {string}
     */
    getInducedChargeDescriptionWithNoAmount: function( balloon, balloonLabel, wallVisible ) {
      var descriptionString;

      var chargeLocationString = WallDescriber.getInducedChargeLocationDescription( balloon, wallVisible, true );
      if ( balloon.inducingChargeProperty.get() ) {
        descriptionString = StringUtils.fillIn( inducedChargeNoAmountPatternString, {
          wallLocation: chargeLocationString,
          balloon: balloonLabel
        } ); 
      }
      else {
        descriptionString = WallDescriber.getNoChangeInChargesDescription( chargeLocationString );
      }

      return descriptionString;
    },

    /**
     * Get an induced charge amount description for a balloon, based on the positions of charges in the wall.  We find the
     * closest charge to the balloon, and determine how far it has been displaced from its initial position. Will
     * return something like:
     *
     * "Negative charges in wall move away from yellow balloon a little bit." or
     * "Negative charges in wall move away from yellow balloon a little bit. Positive charges do not move."
     * 
     * @static
     * @public
     *
     * @param {BalloonModel} balloon
     * @param {string} balloonLabel
     * @param {boolean} wallVisible
     * @param {object} [options]
     * @returns {string}
     */
    getInducedChargeDescription: function( balloon, balloonLabel, wallVisible, options ) {
      options = _.extend( {
        includeWallLocation: true, // include location in the wall?
        includePositiveChargeInfo: true // include information about positive charges how positive charges do not move?
      }, options );

      var descriptionString;
      var chargeLocationString = WallDescriber.getInducedChargeLocationDescription( balloon, wallVisible, options.includeWallLocation );

      if ( balloon.inducingChargeProperty.get() ) {
        var inducedChargeAmount = WallDescriber.getInducedChargeAmountDescription( balloon );

        descriptionString = StringUtils.fillIn( inducedChargePatternString, {
          wallLocation: chargeLocationString,
          balloon: balloonLabel,  
          inductionAmount: inducedChargeAmount
        } ); 
      }
      else {
        descriptionString = WallDescriber.getNoChangeInChargesDescription( chargeLocationString );
      }

      // if all charges are shown, include information about how positive charges do not move
      if ( options.includePositiveChargeInfo && balloon.inducingChargeProperty.get() ) {

        // wrap induced charge with punctuation
        descriptionString = StringUtils.fillIn( singleStatementPatternString, {
          statement: descriptionString
        } );

        descriptionString = StringUtils.fillIn( wallInducedChargeSummaryPatternString, {
          inducedCharge: descriptionString,
          positiveCharges: positiveChargesDoNotMoveString
        } );
      }

      return descriptionString;
    },

    /**
     * Get a description of both balloons. Will return something like 
     * 
     * "Negative charges in wall move away from balloons quite a lot. Positive charges do not move." or
     * "Negative charges in lower wall move away from balloons quite a lot. Positive charges do not move."
     *
     * @returns {string}
     */
    getCombinedInducedChargeDescription: function( balloon, wallVisible, options ) {

      options = _.extend( {
        includeWallLocation: true,
        includePositiveChargeInfo: true
      }, options );
      var descriptionString;
      var chargeLocationString = WallDescriber.getInducedChargeLocationDescription( balloon, wallVisible, options.includeWallLocation );

      var inducedChargeAmount = WallDescriber.getInducedChargeAmountDescription( balloon );

      descriptionString = StringUtils.fillIn( inducedChargePatternString, {
        wallLocation: chargeLocationString,
        balloon: bothBalloonsString,  
        inductionAmount: inducedChargeAmount
      } );

      // wrap induced charge fragment with punctuation
      descriptionString = StringUtils.fillIn( singleStatementPatternString, {
        statement: descriptionString
      } );

      if ( balloon.inducingChargeProperty.get() && options.includePositiveChargeInfo ) {
        descriptionString = StringUtils.fillIn( wallInducedChargeSummaryPatternString, {
          inducedCharge: descriptionString,
          positiveCharges: positiveChargesDoNotMoveString
        } );
      }

      return descriptionString;
    },

    /**
     * Gets a description of where the induced charge is located in the wall. With includeWallLocation boolean, it
     * is possible to exclude vertical location of description and just use "Wall" generally. Will return one of
     *
     * "wall"
     * "upper wall"
     * "lower wall"
     *
     * @param {[type]} balloon [description]
     * @param wallVisible
     * @param {[type]} includeWallLocation [description]
     *
     * @returns {[type]} [description]
     */
    getInducedChargeLocationDescription: function( balloon, wallVisible, includeWallLocation ) {
      var chargeLocationX = PlayAreaMap.X_LOCATIONS.AT_WALL;
      var chargeLocationY = includeWallLocation ? balloon.getCenterY() : PlayAreaMap.ROW_RANGES.CENTER_PLAY_AREA.getCenter();
      var chargeLocation = new Vector2( chargeLocationX, chargeLocationY );
      return BASEDescriber.getLocationDescription( chargeLocation, wallVisible );
    },

    /**
     * Get a summary of charges in the wall, for the screen summary. The wall is always neutral, so only depends
     * on which charges are visible and number of pairs in the wall.
     *
     * @param {string} chargesShown - one of 'none'|'all'|'diff'
     * @param numberOfCharges
     * @returns {string}
     */
    getSummaryChargeDescription: function( chargesShown, numberOfCharges ) {
      var chargeString = BASEDescriber.getNeutralChargesShownDescription( chargesShown, numberOfCharges );

      var wallObjectString = StringUtils.fillIn( summaryObjectHasChargePatternString, {
        object: wallLabelString,
        charge: zeroString
      } );

      return StringUtils.fillIn( summaryObjectChargePatternString, {
        object: wallObjectString,
        charge: chargeString
      } );
    }
  } );
} );
