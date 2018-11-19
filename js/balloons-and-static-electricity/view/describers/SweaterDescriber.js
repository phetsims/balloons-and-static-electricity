// Copyright 2017-2018, University of Colorado Boulder

/**
 * A view type that presents the accessibility descriptions for the Sweater.
 * 
 * @author Jesse Greenberg
 */

define( function( require ) {
  'use strict';

  // modules
  var BalloonDirectionEnum = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/BalloonDirectionEnum' );
  var BalloonModel = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/BalloonModel' );
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );
  var BASEA11yStrings = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/BASEA11yStrings' );
  var BASEConstants = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/BASEConstants' );
  var BASEDescriber = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/describers/BASEDescriber' );
  var inherit = require( 'PHET_CORE/inherit' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );

  // strings
  var sweaterLocationString = BASEA11yStrings.sweaterLocation.value;
  var zeroString = BASEA11yStrings.zero.value;
  var manyString = BASEA11yStrings.many.value;
  var allString = BASEA11yStrings.all.value;
  var positiveString = BASEA11yStrings.positive.value;
  var sweaterDescriptionPatternString = BASEA11yStrings.sweaterDescriptionPattern.value;
  var sweaterRelativeChargeAllPatternString = BASEA11yStrings.sweaterRelativeChargeAllPattern.value;
  var sweaterRelativeChargeDifferencesPatternString = BASEA11yStrings.sweaterRelativeChargeDifferencesPattern.value;
  var sweaterNoMoreChargesString = BASEA11yStrings.sweaterNoMoreCharges.value;
  var sweaterNetChargePatternString = BASEA11yStrings.sweaterNetChargePattern.value;
  var sweaterChargePatternString = BASEA11yStrings.sweaterChargePattern.value;
  var showingNoChargesString = BASEA11yStrings.showingNoCharges.value;
  var sweaterHasRelativeChargePatternString = BASEA11yStrings.sweaterHasRelativeChargePattern.value;
  var sweaterHasNetChargeShowingPatternString = BASEA11yStrings.sweaterHasNetChargeShowingPattern.value;
  var moreChargesPatternString = BASEA11yStrings.moreChargesPattern.value;
  var moreChargesFurtherPatternString = BASEA11yStrings.moreChargesFurtherPattern.value;
  var morePairsOfChargesString = BASEA11yStrings.morePairsOfCharges.value;
  var sweaterLabelString = BASEA11yStrings.sweaterLabel.value;
  var moreHiddenPairsOfChargesString = BASEA11yStrings.moreHiddenPairsOfCharges.value;
  var positiveNetChargeString = BASEA11yStrings.positiveNetCharge.value;
  var neutralNetChargeString = BASEA11yStrings.neutralNetCharge.value;
  var summaryObjectHasChargePatternString = BASEA11yStrings.summaryObjectHasChargePattern.value;
  var sweaterRelativeChargePatternString = BASEA11yStrings.sweaterRelativeChargePattern.value;
  var summaryObjectChargePatternString = BASEA11yStrings.summaryObjectChargePattern.value;
  var summaryNeutralChargesPatternString = BASEA11yStrings.summaryNeutralChargesPattern.value;
  var sweaterShowingPatternString = BASEA11yStrings.sweaterShowingPattern.value;
  var showingAllPositiveChargesString = BASEA11yStrings.showingAllPositiveCharges.value;
  var singleStatementPatternString = BASEA11yStrings.singleStatementPattern.value;

  /**
   * Manages all descriptions relating to the sweater.
   * 
   * @param {BASEModel} model
   * @param {Sweater} sweaterModel
   */
  function SweaterDescriber( model, sweaterModel ) {
    this.model = model;
    this.sweaterModel = sweaterModel;
  }

  balloonsAndStaticElectricity.register( 'SweaterDescriber', SweaterDescriber );

  return inherit( Object, SweaterDescriber, {

    /**
     * Get the descrition of the sweater, which includes its position in the play area, its net charge, and its
     * relative proportion of positive and negative charges.  Will be dependent on what charges are visible. 
     * "At left edge of Play Area. Has positive net charge, a few more positive charges than negative charges." or
     * "At left edge of Play Area. Has positive net charge, showing all positive charges." or
     * "At left edge of Play Area. Has positive net charge, no more negative charges, only positive charges." or
     * "At left edge of Play Area. Has positive net charge, several more positive charges than negative charges."
     *
     * @param {Property.<string>} showCharges
     * @return {string}
     */
    getSweaterDescription: function( showCharges ) {
      var description;

      // if we are not showing any charges, just return a description for the location
      if ( showCharges === 'none' ) {
        return sweaterLocationString;
      }

      // relative charge like "no" or "several"
      var sweaterCharge = this.sweaterModel.chargeProperty.get();
      var relativeChargeString = BASEDescriber.getRelativeChargeDescription( sweaterCharge );

      // assemble net charge string, like "Has zero net charge"
      var netChargeString = StringUtils.fillIn( sweaterNetChargePatternString, {
        netCharge: sweaterCharge > 0 ? positiveString : zeroString
      } );

      var chargeString;
      if ( showCharges === 'all' ) {

        // special case - if sweater is totally out of charges, say "no more negative charges, only positive charges""
        if ( sweaterCharge === BASEConstants.MAX_BALLOON_CHARGE ) {
          chargeString = sweaterNoMoreChargesString;
        }
        else {
          chargeString = StringUtils.fillIn( sweaterRelativeChargeAllPatternString, {
            charge: relativeChargeString
          } );
        }
      }
      else {

        if ( sweaterCharge === 0 ) {

          // special case - if sweater has neutral charge, just say "showing no charges"
          chargeString = showingNoChargesString;
        }
        else if ( sweaterCharge === BASEConstants.MAX_BALLOON_CHARGE ) {

          // special case - if sweater is out of  charges, say "showing all positive charges"
          chargeString = showingAllPositiveChargesString;
        }
        else {
          chargeString = StringUtils.fillIn( sweaterRelativeChargeDifferencesPatternString,  {
            charge: relativeChargeString
          } );
        }
      }

      // description for charge
      chargeString = StringUtils.fillIn( sweaterChargePatternString, {
        netCharge: netChargeString,
        relativeCharge: chargeString
      } );

      // full description,  without punctuation
      description = StringUtils.fillIn( sweaterDescriptionPatternString, {
        location: sweaterLocationString,
        charge: chargeString
      } );

      return StringUtils.fillIn( singleStatementPatternString, {
        statement: description
      } );
    }
  }, {

    /**
     * Get a description of the relative charge of the sweater, including the label. Dependent on
     * what charges are visible in the view. This will form a full sentence. Will produce something like
     *
     * "Sweater has several more positive charges than negative charges." or
     * "Sweater has positive net charge, showing several positive charges." or
     * "Sweater has no more negative charges, only positive charges."
     * 
     * @param  {number} charge
     * @param  {string} shownCharges
     * @return {string} 
     */
    getRelativeChargeDescriptionWithLabel: function( charge, shownCharges ) {
      var description;

      // the relative charge on the sweater, something like 'several' or 'many'
      var absCharge = Math.abs( charge );
      var relative = SweaterDescriber.getRelativeChargeDescription( absCharge );

      if ( shownCharges === 'all' ) {
        if ( absCharge === BASEConstants.MAX_BALLOON_CHARGE ) {

          // if no more charges remaining on sweater, special description like "no more negative charges, only positive"
          description = StringUtils.fillIn( sweaterHasRelativeChargePatternString, {
            relativeCharge: sweaterNoMoreChargesString
          } );
        }
        else {

          // else something like "Sweater has several more positive charges than negative charges"
          var relativeChargeString = StringUtils.fillIn( sweaterRelativeChargeAllPatternString, {
            charge: relative
          } );

          description = StringUtils.fillIn( sweaterHasRelativeChargePatternString, {
            relativeCharge: relativeChargeString
          } );
        }
      }
      else if ( shownCharges === 'diff' ) {
        var showingString = StringUtils.fillIn( sweaterRelativeChargeDifferencesPatternString, {
          charge: relative
        } );

        description = StringUtils.fillIn( sweaterHasNetChargeShowingPatternString, {
          showing: showingString
        } );
      }

      return description;
    },

    /**
     * Get the relative charge on the sweater.  Usually just returns the relative description
     * from BASEDescriber, but if all charges are gone, the sweater uses a special
     * word to indicate this.
     *
     * @param {number} charge
     * @return {string}
     */
    getRelativeChargeDescription: function( charge ) {

      if ( charge === BASEConstants.MAX_BALLOON_CHARGE ) {
        return allString;        
      }
      else {
        return BASEDescriber.getRelativeChargeDescription( charge );
      }
    },

    /**
     * Get an alert describing the sweater when it runs out of charges.  Dependent on the
     * charge visibility.
     * 
     * @param  {string} shownCharges
     * @return {string}
     */
    getNoMoreChargesAlert: function( charge, shownCharges ) {
      var alert;
      if ( shownCharges === 'all' ) {
        alert = StringUtils.fillIn( sweaterHasRelativeChargePatternString, {
          relativeCharge: sweaterNoMoreChargesString          
        } );
      }
      else if ( shownCharges === 'diff' ) {
        alert = SweaterDescriber.getRelativeChargeDescriptionWithLabel( charge, shownCharges );
      }

      return alert;
    },

    /**
     * Get a description of the net charge of the sweater, will return either
     * "Sweater has positive net charge." or
     * "Sweater has neutral net charge."
     *
     * @param {number} sweaterCharge
     * @return {string}
     */
    getNetChargeDescription: function( sweaterCharge )  {
      var relativeChargeString = ( sweaterCharge === 0 ) ? neutralNetChargeString : positiveNetChargeString;
      return StringUtils.fillIn( sweaterHasRelativeChargePatternString, {
        relativeCharge: relativeChargeString
      } );
    },

    /**
     * Get a description that includes information about where additional charges are on the sweater. This is
     * dependent on charge visibility setting. Will return something like
     * "More pairs of charges up and to the left". or
     * "More pairs of hidden charges down".
     * @public
     *
     * @param {BalloonModel} balloon
     * @param {string} shownCharges
     * @return {string}
     */
    getMoreChargesDescription: function( balloon, sweaterCharge, sweaterCharges, shownCharges ) {
      assert && assert( sweaterCharge < BASEConstants.MAX_BALLOON_CHARGE, 'no more charges on sweater' );
      assert && assert( shownCharges !== 'none', 'this description should not be used when no charges are shown' );

      // get the next charge to describe
      var charge;
      for ( var i = 0; i < sweaterCharges.length; i++ ) {
        charge = sweaterCharges[ i ];
        if ( !charge.movedProperty.get() ) {
          break;
        }
      }

      // get the description of the direction to the closest charge
      var direction = BalloonModel.getDirection( charge.location, balloon.getCenter() );
      var directionDescription = BASEDescriber.getDirectionDescription( direction );

      var patternString = BalloonDirectionEnum.isRelativeDirection( direction ) ? moreChargesFurtherPatternString : moreChargesPatternString;

      var moreChargesString;
      if ( shownCharges === 'all' ) {
        moreChargesString = morePairsOfChargesString;
      }
      else if ( shownCharges === 'diff' )  {
        moreChargesString = moreHiddenPairsOfChargesString;
      }

      return StringUtils.fillIn( patternString, {
        moreCharges:  moreChargesString,
        direction: directionDescription
      } );
    },

    /**
     * Get a description of the sweater's charge for the screen summary. Will return something like 
     * "Sweater has positive net charge, a few more positive charges than negative charges."
     * "Sweater has positive net charge, showing a few positive charges."
     * "Sweater has zero net charge, many pairs of positive and negative charges."
     * "Sweater has zero net charge, showing no charges."
     *
     * @return {string}
     */
    getSummaryChargeDescription: function( chargesShown, charge ) {

      // description of the sweater object, like "Sweater has zero net charge"
      var chargeSignString = charge > 0 ? positiveString : zeroString;
      var sweaterObjectString = StringUtils.fillIn( summaryObjectHasChargePatternString, {
        object: sweaterLabelString,
        charge: chargeSignString
      } );

      // description of the charges shown, like 'a few more positive charges than negative charges'
      var chargeString;
      var relativeChargeString = BASEDescriber.getRelativeChargeDescription( charge );
      if ( chargesShown === 'all' ) {
        chargeString = ( charge === 0 ) ?
          StringUtils.fillIn( summaryNeutralChargesPatternString, { amount: manyString } ) :
          StringUtils.fillIn( sweaterRelativeChargePatternString, { charge: relativeChargeString } );
      }
      else if ( chargesShown === 'diff' ) {
        chargeString = ( charge === 0 ) ?
          showingNoChargesString :
          chargeString = StringUtils.fillIn( sweaterShowingPatternString, { charge: relativeChargeString } );
      }

      return StringUtils.fillIn( summaryObjectChargePatternString, {
        object: sweaterObjectString,
        charge: chargeString
      } );
    }
  } );
} );
