// Copyright 2017, University of Colorado Boulder

/**
 * A view type that presents the accessibility descriptions for the Sweater.
 * 
 * @author Jesse Greenberg
 */

define( function( require ) {
  'use strict';

  // modules
  var BalloonModel = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/BalloonModel' );
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );
  var BASEA11yStrings = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/BASEA11yStrings' );
  var BASEConstants = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/BASEConstants' );
  var BASEDescriber = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/describers/BASEDescriber' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Range = require( 'DOT/Range' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );

  // strings
  var sweaterLocationString = BASEA11yStrings.sweaterLocationString;
  var zeroString = BASEA11yStrings.zeroString;
  var noString = BASEA11yStrings.noString;
  var aFewString = BASEA11yStrings.aFewString;
  var severalString = BASEA11yStrings.severalString;
  var manyString = BASEA11yStrings.manyString;
  var allString = BASEA11yStrings.allString;
  var positiveString = BASEA11yStrings.positiveString;
  var sweaterDescriptionPatternString = BASEA11yStrings.sweaterDescriptionPatternString;
  var sweaterRelativeChargeAllPatternString = BASEA11yStrings.sweaterRelativeChargeAllPatternString;
  var sweaterRelativeChargeDifferencesPatternString = BASEA11yStrings.sweaterRelativeChargeDifferencesPatternString;
  var sweaterNoMoreChargesString = BASEA11yStrings.sweaterNoMoreChargesString;
  var sweaterNetChargePatternString = BASEA11yStrings.sweaterNetChargePatternString;
  var sweaterChargePatternString = BASEA11yStrings.sweaterChargePatternString;
  var showingNoChargesString = BASEA11yStrings.showingNoChargesString;
  var sweaterHasRelativeChargePatternString = BASEA11yStrings.sweaterHasRelativeChargePatternString;
  var sweaterHasNetChargeShowingPatternString = BASEA11yStrings.sweaterHasNetChargeShowingPatternString;
  var moreChargesPatternString = BASEA11yStrings.moreChargesPatternString;
  var morePairsOfChargesString = BASEA11yStrings.morePairsOfChargesString;
  var moreHiddenPairsOfChargesString = BASEA11yStrings.moreHiddenPairsOfChargesString;
  var positiveNetChargeString = BASEA11yStrings.positiveNetChargeString;
  var neutralNetChargeString = BASEA11yStrings.neutralNetChargeString;


  // constants - ranges to describe charges in the sweater
  var SWEATER_DESCRIPTION_MAP = {
    NO_MORE_RANGE: {
      range: new Range( 0, 0 ),
      description: noString
    },
    A_FEW_RANGE: {
      range: new Range( 1, 15 ),
      description: aFewString
    },
    SEVERAL_RANGE: {
      range: new Range( 15, 40 ),
      description: severalString
    },
    MANY_RANGE: {
      range: new Range( 40, 56 ),
      description: manyString
    },
    MAX_RANGE: {
      range: new Range( 57, 57 ),
      description: allString
    } 
  };
  
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
     * "At left edge of Play Area. Has positive net charge, a few more positive charges than negative charges."
     *
     * @param {Property.<string>} showCharges
     * @return {string}
     */
    getSweaterDescription: function( showCharges ) {

      // if we are not showing any charges, just return the location descrption
      if ( showCharges === 'none' ) {
        return sweaterLocationString;
      }

      var relativeChargeString; // description of relative positive/negative charges
      var chargeAmountString; // short description of amount of charge like "a few"
      var netChargeString;
      var chargeString; // full description of charge
      var visualChargePatternString; // pattern dependent on which charges are shown

      // get the description for the amount of charge
      var sweaterCharge = this.sweaterModel.chargeProperty.get();
      var descriptionKeys = Object.keys( SWEATER_DESCRIPTION_MAP );
      for ( var i = 0; i < descriptionKeys.length; i++ ) {
        var descriptionContent = SWEATER_DESCRIPTION_MAP[ descriptionKeys[ i ] ];
        if ( descriptionContent.range.contains( sweaterCharge ) ) {
          chargeAmountString = descriptionContent.description;
        }
      }

      // get the pattern string to describe all charges or just charge differences
      if ( showCharges === 'all' ) {
        visualChargePatternString = sweaterRelativeChargeAllPatternString;
      }
      else {
        visualChargePatternString = sweaterRelativeChargeDifferencesPatternString;
      }

      // assemble net charge string
      netChargeString = StringUtils.fillIn( sweaterNetChargePatternString, {
        netCharge: sweaterCharge > 0 ? positiveString : zeroString
      } );

      // assemble the relative charge string, special cases if we are showing charge differences
      // and charge is zero, and when there are no more charges remaining
      if ( showCharges === 'diff' && sweaterCharge === 0 ) {
        relativeChargeString = showingNoChargesString;
      }
      else if ( SWEATER_DESCRIPTION_MAP.MAX_RANGE.range.contains( sweaterCharge ) ) {
        relativeChargeString = sweaterNoMoreChargesString;
      }
      else {
        relativeChargeString = StringUtils.fillIn( visualChargePatternString, {
          charge: chargeAmountString
        } );
      }

      // assemble the full description of charge
      chargeString = StringUtils.fillIn( sweaterChargePatternString, {
        netCharge: netChargeString,
        relativeCharge: relativeChargeString
      } );

      // assemble the description to be returned
      return StringUtils.fillIn( sweaterDescriptionPatternString, {
        location: sweaterLocationString,
        charge: chargeString
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

      return BASEA11yStrings.fragmentToSentence( description );
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

      var moreChargesString;
      if ( shownCharges === 'all' ) {
        moreChargesString = morePairsOfChargesString;
      }
      else if ( shownCharges === 'diff' )  {
        moreChargesString = moreHiddenPairsOfChargesString;
      }

      return StringUtils.fillIn( moreChargesPatternString, {
        moreCharges:  moreChargesString,
        direction: directionDescription
      } );
    }
  } );
} );
