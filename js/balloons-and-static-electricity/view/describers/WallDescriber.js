// Copyright 2017, University of Colorado Boulder

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
  var wallDescriptionPatternString = BASEA11yStrings.wallDescriptionPatternString;
  var wallLocationString = BASEA11yStrings.wallLocationString;
  var wallNoNetChargeString = BASEA11yStrings.wallNoNetChargeString;
  var aLittleBitString = BASEA11yStrings.aLittleBitString;
  var aLotString = BASEA11yStrings.aLotString;
  var quiteALotString = BASEA11yStrings.quiteALotString;
  var inducedChargePatternString = BASEA11yStrings.inducedChargePatternString;
  var greenBalloonLabelString = BASEA11yStrings.greenBalloonLabelString;
  var yellowBalloonLabelString = BASEA11yStrings.yellowBalloonLabelString;
  var wallTwoBalloonInducedChargePatternString = BASEA11yStrings.wallTwoBalloonInducedChargePatternString;
  var wallChargeWithoutInducedPatternString = BASEA11yStrings.wallChargeWithoutInducedPatternString;
  var wallChargeWithInducedPatternString = BASEA11yStrings.wallChargeWithInducedPatternString;
  var showingNoChargesString = BASEA11yStrings.showingNoChargesString;
  var manyChargePairsString = BASEA11yStrings.manyChargePairsString;
  var singleStatementPatternString = BASEA11yStrings.singleStatementPatternString;
  var wallNoChangeInChargesPatternString = BASEA11yStrings.wallNoChangeInChargesPatternString;
  var inducedChargeNoAmountPatternString = BASEA11yStrings.inducedChargeNoAmountPatternString;
  var wallChargePatternStringWithLabel = BASEA11yStrings.wallChargePatternStringWithLabel;
  var summaryObjectHasChargePatternString = BASEA11yStrings.summaryObjectHasChargePatternString;
  var summaryObjectChargePatternString = BASEA11yStrings.summaryObjectChargePatternString;
  var wallLabelString = BASEA11yStrings.wallLabelString;
  var zeroString = BASEA11yStrings.zeroString;
  var bothBalloonsString = BASEA11yStrings.bothBalloonsString;

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
     * @return {string}
     */
    getWallDescription: function( yellowBalloon, greenBalloon ) {
      var  description;

      // if no charges are shown, the location is the only part of the description
      if ( this.showChargesProperty.get() === 'none' ) {
        description = StringUtils.fillIn( singleStatementPatternString, {
          statement: wallLocationString
        } );
      }
      else {
        var chargeDescription = WallDescriber.getWallChargeDescription( yellowBalloon, greenBalloon, this.wallModel.isVisibleProperty.get(), this.showChargesProperty.get() );

        // assemble the whole description
        description = StringUtils.fillIn( wallDescriptionPatternString, {
          location: wallLocationString, 
          charge: chargeDescription
        } ); 
      }

      return StringUtils.fillIn( singleStatementPatternString, { statement: description } );
    }
  }, {

    /**
     * Get the described charge in the wall, dependent on charge visibility, whether or not there is induced charge,
     * and which balloons are visible. This portion of the description does not include any wall position information.
     *
     * @return {string}
     */
    getWallChargeDescription: function( yellowBalloon, greenBalloon, wallVisible, chargesShown )  {

      var inducedChargeString;
      var yellowBalloonInducedChargeString;
      var greenBalloonInducedChargeString;

      if ( wallVisible && chargesShown === 'all' ) {
        if ( yellowBalloon.inducingChargeProperty.get() ) {
          yellowBalloonInducedChargeString = WallDescriber.getInducedChargeDescription( yellowBalloon, yellowBalloonLabelString, wallVisible, true );
          inducedChargeString = yellowBalloonInducedChargeString;
        }
        if ( greenBalloon.inducingChargeProperty.get() && greenBalloon.isVisibleProperty.get() ) {
          greenBalloonInducedChargeString = WallDescriber.getInducedChargeDescription( greenBalloon, greenBalloonLabelString, wallVisible, true );
        }
      }

      // assemble the induced charge description depending on if one or both balloons are inducing charge
      if ( yellowBalloonInducedChargeString && greenBalloonInducedChargeString ) {
        inducedChargeString = StringUtils.fillIn( wallTwoBalloonInducedChargePatternString, {
          yellowBalloon: yellowBalloonInducedChargeString,
          greenBalloon: greenBalloonInducedChargeString
        } );
      }
      else if ( yellowBalloonInducedChargeString ) {
        inducedChargeString = yellowBalloonInducedChargeString;
      }
      else if ( greenBalloonInducedChargeString ) {
        inducedChargeString = greenBalloonInducedChargeString;
      }

      // get the description for what charges are currently shown
      var shownChargesString = ( chargesShown === 'diff' ) ? showingNoChargesString : manyChargePairsString;

      // if there is an induced charge, include it in the full charge description
      var wallChargeString;
      if ( inducedChargeString ) {
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

      return wallChargeString;
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
     * @return {string}
     */
    getWallChargeDescriptionWithLabel: function( yellowBalloon, greenBalloon, wallVisible, chargesShown ) {
      var description = WallDescriber.getWallChargeDescription( yellowBalloon, greenBalloon, wallVisible, chargesShown );
      description = description.toLowerCase();

      return StringUtils.fillIn( wallChargePatternStringWithLabel, {
        wallCharge: description
      } );
    },

    /**
     * Get the induced charge amount description for the balloon, describing whether the charges are
     * "a little bit" displaced and so on.
     * @param  {BalloonModel} balloon
     * @return {string}
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
     * @return {string}
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
     * @param {[type]} balloon [description]
     * @param {[type]} balloon [description]
     * @param {[type]} wallVisible [description]
     *
     * @return {[type]} [description]
     */
    getInducedChargeDescriptionWithNoAmount: function( balloon, balloonLabel, wallVisible ) {
      var descriptionString;

      var chargeLocationString = BASEDescriber.getLocationDescription( balloon.getCenter(), wallVisible );
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
     * "Negative charges in wall move away from yellow balloon a little bit."
     * 
     * @static
     * @public
     *
     * @param {BalloonModel} balloon
     * @param {string} balloonLabel
     * @param {boolean} wallVisible
     * @param {boolean} includeWallLocation - if false, induced charge will just be described relative to the "Wall"
     * @returns {string}
     */
    getInducedChargeDescription: function( balloon, balloonLabel, wallVisible, includeWallLocation ) {
      var descriptionString;
      var chargeLocationString = WallDescriber.getInducedChargeLocationDescription( balloon, wallVisible, includeWallLocation );

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

      return descriptionString;
    },

    /**
     * Get a description of both balloons. If the balloons are next to each other, this description should be used.
     *
     * @return {[type]} [description]
     */
    getCombinedInducedChargeDescription: function( balloon, wallVisible, includeWallLocation ) {
      var chargeLocationString = WallDescriber.getInducedChargeLocationDescription( balloon, wallVisible, includeWallLocation );

      var inducedChargeAmount = WallDescriber.getInducedChargeAmountDescription( balloon );

      return StringUtils.fillIn( inducedChargePatternString, {
        wallLocation: chargeLocationString,
        balloon: bothBalloonsString,  
        inductionAmount: inducedChargeAmount
      } ); 
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
     * @param {[type]} includeWallLocation [description]
     *
     * @return {[type]} [description]
     */
    getInducedChargeLocationDescription: function( balloon, wallVisible, includeWallLocation ) {
      var chargeLocationX = PlayAreaMap.X_LOCATIONS.AT_WALL;
      var chargeLocationY = includeWallLocation ? balloon.getCenterY() : PlayAreaMap.ROW_RANGES.CENTER_PLAY_AREA.getCenter();
      var chargeLocation = new Vector2( chargeLocationX, chargeLocationY );
      return BASEDescriber.getLocationDescription( chargeLocation, wallVisible );
    },

    /**
     * Get a summary of charges in the wall, for the scene summary. The wall is always neutral, so only depends
     * on which charges are visible and number of pairs in the wall.
     *
     * @param {string} chargesShown - one of 'none'|'all'|'diff'
     * @return {string}
     */
    getSummaryChargeDescription: function( chargesShown, numberOfCharges ) {
      var chargeString = BASEDescriber.getNeutralChargesShownDescription( chargesShown, numberOfCharges );

      var wallObjectString = StringUtils.fillIn( summaryObjectHasChargePatternString, {
        object: wallLabelString,
        charge: zeroString,
      } );

      return StringUtils.fillIn( summaryObjectChargePatternString, {
        object: wallObjectString,
        charge: chargeString
      } );
    }
  } );
} );
