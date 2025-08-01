// Copyright 2017-2021, University of Colorado Boulder

/**
 * A view type that presents the accessibility descriptions for the Sweater.
 *
 * @author Jesse Greenberg
 */

import StringUtils from '../../../../../phetcommon/js/util/StringUtils.js';
import balloonsAndStaticElectricity from '../../../balloonsAndStaticElectricity.js';
import BASEA11yStrings from '../../BASEA11yStrings.js';
import BASEConstants from '../../BASEConstants.js';
import BalloonDirectionEnum from '../../model/BalloonDirectionEnum.js';
import BalloonModel from '../../model/BalloonModel.js';
import BASEDescriber from './BASEDescriber.js';

// strings
const sweaterPositionString = BASEA11yStrings.sweaterPosition.value;
const zeroString = BASEA11yStrings.zero.value;
const manyString = BASEA11yStrings.many.value;
const allString = BASEA11yStrings.all.value;
const positiveString = BASEA11yStrings.positive.value;
const sweaterDescriptionPatternString = BASEA11yStrings.sweaterDescriptionPattern.value;
const sweaterRelativeChargeAllPatternString = BASEA11yStrings.sweaterRelativeChargeAllPattern.value;
const sweaterRelativeChargeDifferencesPatternString = BASEA11yStrings.sweaterRelativeChargeDifferencesPattern.value;
const sweaterNoMoreChargesString = BASEA11yStrings.sweaterNoMoreCharges.value;
const sweaterNetChargePatternString = BASEA11yStrings.sweaterNetChargePattern.value;
const sweaterChargePatternString = BASEA11yStrings.sweaterChargePattern.value;
const showingNoChargesString = BASEA11yStrings.showingNoCharges.value;
const sweaterHasRelativeChargePatternString = BASEA11yStrings.sweaterHasRelativeChargePattern.value;
const sweaterHasNetChargeShowingPatternString = BASEA11yStrings.sweaterHasNetChargeShowingPattern.value;
const moreChargesPatternString = BASEA11yStrings.moreChargesPattern.value;
const moreChargesFurtherPatternString = BASEA11yStrings.moreChargesFurtherPattern.value;
const morePairsOfChargesString = BASEA11yStrings.morePairsOfCharges.value;
const sweaterLabelString = BASEA11yStrings.sweaterLabel.value;
const moreHiddenPairsOfChargesString = BASEA11yStrings.moreHiddenPairsOfCharges.value;
const positiveNetChargeString = BASEA11yStrings.positiveNetCharge.value;
const neutralNetChargeString = BASEA11yStrings.neutralNetCharge.value;
const summaryObjectHasChargePatternString = BASEA11yStrings.summaryObjectHasChargePattern.value;
const sweaterRelativeChargePatternString = BASEA11yStrings.sweaterRelativeChargePattern.value;
const summaryObjectChargePatternString = BASEA11yStrings.summaryObjectChargePattern.value;
const summaryNeutralChargesPatternString = BASEA11yStrings.summaryNeutralChargesPattern.value;
const sweaterShowingPatternString = BASEA11yStrings.sweaterShowingPattern.value;
const showingAllPositiveChargesString = BASEA11yStrings.showingAllPositiveCharges.value;
const singleStatementPatternString = BASEA11yStrings.singleStatementPattern.value;

class SweaterDescriber {
  /**
   * Manages all descriptions relating to the sweater.
   *
   * @param {BASEModel} model
   * @param {Sweater} sweaterModel
   */
  constructor( model, sweaterModel ) {
    this.model = model;
    this.sweaterModel = sweaterModel;
  }


  /**
   * Get the descrition of the sweater, which includes its position in the play area, its net charge, and its
   * relative proportion of positive and negative charges.  Will be dependent on what charges are visible.
   * "At left edge of Play Area. Has positive net charge, a few more positive charges than negative charges." or
   * "At left edge of Play Area. Has positive net charge, showing all positive charges." or
   * "At left edge of Play Area. Has positive net charge, no more negative charges, only positive charges." or
   * "At left edge of Play Area. Has positive net charge, several more positive charges than negative charges."
   * @public
   *
   * @param {Property.<string>} showCharges
   * @returns {string}
   */
  getSweaterDescription( showCharges ) {

    // if we are not showing any charges, just return a description for the position
    if ( showCharges === 'none' ) {
      return sweaterPositionString;
    }

    // relative charge like "no" or "several"
    const sweaterCharge = this.sweaterModel.chargeProperty.get();
    const relativeChargeString = BASEDescriber.getRelativeChargeDescription( sweaterCharge );

    // assemble net charge string, like "Has zero net charge"
    const netChargeString = StringUtils.fillIn( sweaterNetChargePatternString, {
      netCharge: sweaterCharge > 0 ? positiveString : zeroString
    } );

    let chargeString;
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
        chargeString = StringUtils.fillIn( sweaterRelativeChargeDifferencesPatternString, {
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
    const description = StringUtils.fillIn( sweaterDescriptionPatternString, {
      position: sweaterPositionString,
      charge: chargeString
    } );

    return StringUtils.fillIn( singleStatementPatternString, {
      statement: description
    } );
  }


  /**
   * Get a description of the relative charge of the sweater, including the label. Dependent on
   * what charges are visible in the view. This will form a full sentence. Will produce something like
   *
   * "Sweater has several more positive charges than negative charges." or
   * "Sweater has positive net charge, showing several positive charges." or
   * "Sweater has no more negative charges, only positive charges."
   * @public
   *
   * @param  {number} charge
   * @param  {string} shownCharges
   * @returns {string}
   */
  static getRelativeChargeDescriptionWithLabel( charge, shownCharges ) {
    let description;

    // the relative charge on the sweater, something like 'several' or 'many'
    const absCharge = Math.abs( charge );
    const relative = SweaterDescriber.getRelativeChargeDescription( absCharge );

    if ( shownCharges === 'all' ) {
      if ( absCharge === BASEConstants.MAX_BALLOON_CHARGE ) {

        // if no more charges remaining on sweater, special description like "no more negative charges, only positive"
        description = StringUtils.fillIn( sweaterHasRelativeChargePatternString, {
          relativeCharge: sweaterNoMoreChargesString
        } );
      }
      else {

        // else something like "Sweater has several more positive charges than negative charges"
        const relativeChargeString = StringUtils.fillIn( sweaterRelativeChargeAllPatternString, {
          charge: relative
        } );

        description = StringUtils.fillIn( sweaterHasRelativeChargePatternString, {
          relativeCharge: relativeChargeString
        } );
      }
    }
    else if ( shownCharges === 'diff' ) {
      const showingString = StringUtils.fillIn( sweaterRelativeChargeDifferencesPatternString, {
        charge: relative
      } );

      description = StringUtils.fillIn( sweaterHasNetChargeShowingPatternString, {
        showing: showingString
      } );
    }

    return description;
  }

  /**
   * Get the relative charge on the sweater.  Usually just returns the relative description
   * from BASEDescriber, but if all charges are gone, the sweater uses a special
   * word to indicate this.
   * @public
   *
   * @param {number} charge
   * @returns {string}
   */
  static getRelativeChargeDescription( charge ) {

    if ( charge === BASEConstants.MAX_BALLOON_CHARGE ) {
      return allString;
    }
    else {
      return BASEDescriber.getRelativeChargeDescription( charge );
    }
  }

  /**
   * Get an alert describing the sweater when it runs out of charges.  Dependent on the
   * charge visibility.
   * @public
   *
   * @param  {string} shownCharges
   * @returns {string}
   */
  static getNoMoreChargesAlert( charge, shownCharges ) {
    let alert;
    if ( shownCharges === 'all' ) {
      alert = StringUtils.fillIn( sweaterHasRelativeChargePatternString, {
        relativeCharge: sweaterNoMoreChargesString
      } );
    }
    else if ( shownCharges === 'diff' ) {
      alert = SweaterDescriber.getRelativeChargeDescriptionWithLabel( charge, shownCharges );
    }

    return alert;
  }

  /**
   * Get a description of the net charge of the sweater, will return either
   * "Sweater has positive net charge." or
   * "Sweater has neutral net charge."
   * @public
   *
   * @param {number} sweaterCharge
   * @returns {string}
   */
  static getNetChargeDescription( sweaterCharge ) {
    const relativeChargeString = ( sweaterCharge === 0 ) ? neutralNetChargeString : positiveNetChargeString;
    return StringUtils.fillIn( sweaterHasRelativeChargePatternString, {
      relativeCharge: relativeChargeString
    } );
  }

  /**
   * Get a description that includes information about where additional charges are on the sweater. This is
   * dependent on charge visibility setting. Will return something like
   * "More pairs of charges up and to the left". or
   * "More pairs of hidden charges down".
   * @public
   *
   * @param {BalloonModel} balloon
   * @param {string} shownCharges
   * @returns {string}
   */
  static getMoreChargesDescription( balloon, sweaterCharge, sweaterCharges, shownCharges ) {
    assert && assert( sweaterCharge < BASEConstants.MAX_BALLOON_CHARGE, 'no more charges on sweater' );
    assert && assert( shownCharges !== 'none', 'this description should not be used when no charges are shown' );

    // get the next charge to describe
    let charge;
    for ( let i = 0; i < sweaterCharges.length; i++ ) {
      charge = sweaterCharges[ i ];
      if ( !charge.movedProperty.get() ) {
        break;
      }
    }

    // get the description of the direction to the closest charge
    const direction = BalloonModel.getDirection( charge.position, balloon.getCenter() );
    const directionDescription = BASEDescriber.getDirectionDescription( direction );

    const patternString = BalloonDirectionEnum.isRelativeDirection( direction ) ? moreChargesFurtherPatternString : moreChargesPatternString;

    let moreChargesString;
    if ( shownCharges === 'all' ) {
      moreChargesString = morePairsOfChargesString;
    }
    else if ( shownCharges === 'diff' ) {
      moreChargesString = moreHiddenPairsOfChargesString;
    }

    return StringUtils.fillIn( patternString, {
      moreCharges: moreChargesString,
      direction: directionDescription
    } );
  }

  /**
   * Get a description of the sweater's charge for the screen summary. Will return something like
   * "Sweater has positive net charge, a few more positive charges than negative charges."
   * "Sweater has positive net charge, showing a few positive charges."
   * "Sweater has zero net charge, many pairs of positive and negative charges."
   * "Sweater has zero net charge, showing no charges."
   * @public
   *
   * @returns {string}
   */
  static getSummaryChargeDescription( chargesShown, charge ) {

    // description of the sweater object, like "Sweater has zero net charge"
    const chargeSignString = charge > 0 ? positiveString : zeroString;
    const sweaterObjectString = StringUtils.fillIn( summaryObjectHasChargePatternString, {
      object: sweaterLabelString,
      charge: chargeSignString
    } );

    // description of the charges shown, like 'a few more positive charges than negative charges'
    let chargeString;
    const relativeChargeString = BASEDescriber.getRelativeChargeDescription( charge );
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
}

balloonsAndStaticElectricity.register( 'SweaterDescriber', SweaterDescriber );

export default SweaterDescriber;