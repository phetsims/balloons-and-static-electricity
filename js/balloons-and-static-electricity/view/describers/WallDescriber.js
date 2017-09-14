// Copyright 2017, University of Colorado Boulder

/**
 * A view type that observes the WallModel and builds descriptions which can be read by assistive technology.
 * @author Jesse Greenberg
 */

define( function( require ) {
  'use strict';

  // modules
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );
  var BalloonsAndStaticElectricityDescriber = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/describers/BalloonsAndStaticElectricityDescriber' );
  var BASEA11yStrings = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/BASEA11yStrings' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Range = require( 'DOT/Range' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );

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


  // constants
  function WallDescriber( model, showChargesProperty ) {

    // @private {WallModel}
    this.model = model;

    // @private showChargesProperty
    this.showChargesProperty = showChargesProperty;
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

      var wallVisible = this.model.isVisibleProperty.get();

      // if no charges are shown, the location is the only part of the description
      if ( this.showChargesProperty.get() === 'none' ) {
        return StringUtils.fillIn( singleStatementPatternString, {
          statement: wallLocationString
        } );
      }
      else {
        // get the description for induced charge from each balloon, only added to description if all charges shown
        var inducedChargeString;
        var yellowBalloonInducedChargeString;
        var greenBalloonInducedChargeString;
        if ( wallVisible && this.showChargesProperty.get() === 'all' ) {
          if ( yellowBalloon.inducingCharge ) {
            yellowBalloonInducedChargeString = WallDescriber.getInducedChargeDescription( yellowBalloon, yellowBalloonLabelString, wallVisible );
            inducedChargeString = yellowBalloonInducedChargeString;
          }
          if ( greenBalloon.inducingCharge && greenBalloon.isVisibleProperty.get() ) {
            greenBalloonInducedChargeString = WallDescriber.getInducedChargeDescription( greenBalloon, greenBalloonLabelString, wallVisible );
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
        var shownChargesString = ( this.showChargesProperty.get() === 'diff' ) ? showingNoChargesString : manyChargePairsString;

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

        // assemble the whole description
        return StringUtils.fillIn( wallDescriptionPatternString, {
          location: wallLocationString, 
          charge: wallChargeString
        } );  
      }    
    },
  }, {

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
     * Get an induced charge amount description for a balloon, based on the positions of charges in the wall.  We find the
     * closest charge to the balloon, and determine how far it has been displaced from its initial position.
     * @static
     * @public
     *
     * @param  {Balloon} balloon
     * @param {string} balloonLabel
     * @param {boolean} wallVisible
     * @returns {string}
     */
    getInducedChargeDescription: function( balloon, balloonLabel, wallVisible ) {
      var descriptionString;

      var location = balloon.getCenter();
      var chargeLocationString = BalloonsAndStaticElectricityDescriber.getLocationDescription( location, wallVisible );

      if ( balloon.inducingCharge ) {
        chargeLocationString = BalloonsAndStaticElectricityDescriber.getLocationDescription( location, wallVisible );
        var inducedChargeAmount = WallDescriber.getInducedChargeAmountDescription( balloon );

        descriptionString = StringUtils.fillIn( inducedChargePatternString, {
          wallLocation: chargeLocationString,
          balloon: balloonLabel,  
          inductionAmount: inducedChargeAmount
        } ); 
      }
      else {
        descriptionString = StringUtils.fillIn( wallNoChangeInChargesPatternString, {
          location: chargeLocationString
        } );
      }

      return descriptionString;
    }
  } );
} );
