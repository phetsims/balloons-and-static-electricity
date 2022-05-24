// Copyright 2016-2022, University of Colorado Boulder

/**
 * screen summary for this sim.  The screen summary is composed of a dynamic list of descriptions
 * for parts of the play area and control panel.  This content will only ever be seen by a screen reader.
 * By breaking up the summary into a list of items, the user can find specific information about the
 * scene very quickly.
 *
 * @author Jesse Greenberg
 */

import Multilink from '../../../../axon/js/Multilink.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import { Node } from '../../../../scenery/js/imports.js';
import balloonsAndStaticElectricity from '../../balloonsAndStaticElectricity.js';
import BASEA11yStrings from '../BASEA11yStrings.js';
import BASEDescriber from './describers/BASEDescriber.js';
import SweaterDescriber from './describers/SweaterDescriber.js';
import WallDescriber from './describers/WallDescriber.js';

const grabBalloonToPlayString = BASEA11yStrings.grabBalloonToPlay.value;
const andARemovableWallString = BASEA11yStrings.andARemovableWall.value;
const aSweaterString = BASEA11yStrings.aSweater.value;
const andASweaterString = BASEA11yStrings.andASweater.value;
const roomObjectsPatternString = BASEA11yStrings.roomObjectsPattern.value;
const aYellowBalloonString = BASEA11yStrings.aYellowBalloon.value;
const aGreenBalloonString = BASEA11yStrings.aGreenBalloon.value;
const summaryBalloonChargePatternString = BASEA11yStrings.summaryBalloonChargePattern.value;
const summaryEachBalloonChargePatternString = BASEA11yStrings.summaryEachBalloonChargePattern.value;
const zeroString = BASEA11yStrings.zero.value;
const summaryObjectsHaveChargePatternString = BASEA11yStrings.summaryObjectsHaveChargePattern.value;
const summarySweaterAndWallString = BASEA11yStrings.summarySweaterAndWall.value;
const summarySweaterWallPatternString = BASEA11yStrings.summarySweaterWallPattern.value;
const summarySecondBalloonInducingChargePatternString = BASEA11yStrings.summarySecondBalloonInducingChargePattern.value;
const summaryBothBalloonsPatternString = BASEA11yStrings.summaryBothBalloonsPattern.value;
const summaryObjectEachHasPatternString = BASEA11yStrings.summaryObjectEachHasPattern.value;
const summaryObjectEachPatternString = BASEA11yStrings.summaryObjectEachPattern.value;
const singleStatementPatternString = BASEA11yStrings.singleStatementPattern.value;
const summaryYellowGreenSweaterWallPatternString = BASEA11yStrings.summaryYellowGreenSweaterWallPattern.value;
const summaryYellowGreenSweaterPatternString = BASEA11yStrings.summaryYellowGreenSweaterPattern.value;
const summaryYellowSweaterWallPatternString = BASEA11yStrings.summaryYellowSweaterWallPattern.value;
const summaryYellowSweaterPatternString = BASEA11yStrings.summaryYellowSweaterPattern.value;
const initialObjectPositionsString = BASEA11yStrings.initialObjectPositions.value;
const simOpeningString = BASEA11yStrings.simOpening.value;

class BASESummaryNode extends Node {

  /**
   * @param {BASEModel} model
   * @param yellowBalloonNode
   * @param greenBalloonNode
   * @param wallNode
   * @param {Tandem} tandem
   */
  constructor( model, yellowBalloonNode, greenBalloonNode, wallNode, tandem ) {


    super( {
      tandem: tandem
    } );

    // pull out model elements for readability
    this.yellowBalloon = model.yellowBalloon;
    this.greenBalloon = model.greenBalloon;

    this.yellowBalloonDescriber = yellowBalloonNode.describer;
    this.greenBalloonDescriber = greenBalloonNode.describer;

    // @private
    this.model = model;
    this.wall = model.wall;

    // opening paragraph for the simulation
    const openingSummaryNode = new Node( { tagName: 'p', innerContent: simOpeningString } );
    this.addChild( openingSummaryNode );

    // list of dynamic description content that will update with the state of the simulation
    const listNode = new Node( { tagName: 'ul' } );
    const roomObjectsNode = new Node( { tagName: 'li' } );
    const objectPositionsNode = new Node( { tagName: 'li', innerContent: initialObjectPositionsString } );
    const balloonChargeNode = new Node( { tagName: 'li' } );
    const sweaterWallChargeNode = new Node( { tagName: 'li' } );
    const inducedChargeNode = new Node( { tagName: 'li' } );

    // structure the accessible content
    this.addChild( listNode );
    listNode.addChild( roomObjectsNode );
    listNode.addChild( objectPositionsNode );
    listNode.addChild( balloonChargeNode );
    listNode.addChild( sweaterWallChargeNode );
    listNode.addChild( inducedChargeNode );
    this.addChild( new Node( { tagName: 'p', innerContent: grabBalloonToPlayString } ) );

    // update the description that covers the visible objects in the play area
    Multilink.multilink( [ this.greenBalloon.isVisibleProperty, this.wall.isVisibleProperty ], ( balloonVisible, wallVisible ) => {
      roomObjectsNode.innerContent = BASESummaryNode.getVisibleObjectsDescription( balloonVisible, wallVisible );
    } );

    const chargeProperties = [ this.yellowBalloon.chargeProperty, this.greenBalloon.chargeProperty, this.greenBalloon.isVisibleProperty, model.showChargesProperty, model.wall.isVisibleProperty, model.sweater.chargeProperty ];
    Multilink.multilink( chargeProperties, ( yellowBalloonCharge, greenBalloonCharge, greenBalloonVisible, showCharges, wallVisible, sweaterCharge ) => {
      const chargesVisible = showCharges !== 'none';
      balloonChargeNode.pdomVisible = chargesVisible;
      sweaterWallChargeNode.pdomVisible = chargesVisible;

      // update labels if charges are shown
      if ( chargesVisible ) {
        balloonChargeNode.innerContent = this.getBalloonChargeDescription();
        sweaterWallChargeNode.innerContent = this.getSweaterAndWallChargeDescription();
      }
    } );

    const inducedChargeProperties = [ this.yellowBalloon.positionProperty, this.greenBalloon.positionProperty, this.greenBalloon.isVisibleProperty, model.showChargesProperty, model.wall.isVisibleProperty ];
    Multilink.multilink( inducedChargeProperties, ( yellowPosition, greenPosition, greenVisible, showCharges, wallVisible ) => {

      // the induced charge item is only available if one balloon is visible, inducing charge, and showCharges setting is set to 'all'
      const inducingCharge = this.yellowBalloon.inducingChargeAndVisible() || this.greenBalloon.inducingChargeAndVisible();
      const showInducingItem = inducingCharge && wallVisible && showCharges === 'all';
      inducedChargeNode.pdomVisible = showInducingItem;

      if ( showInducingItem ) {
        inducedChargeNode.innerContent = this.getInducedChargeDescription();
      }
    } );

    // If all of the simulation objects are at their initial state, include the position summary phrase that lets the
    // user know where objects are, see https://github.com/phetsims/balloons-and-static-electricity/issues/393
    Multilink.multilink(
      [ this.yellowBalloon.positionProperty,
        this.greenBalloon.positionProperty,
        this.greenBalloon.isVisibleProperty,
        model.wall.isVisibleProperty
      ], ( yellowPosition, greenPosition, greenVisible, wallVisible ) => {
        const initialValues = this.yellowBalloon.positionProperty.initialValue === yellowPosition &&
                              this.greenBalloon.positionProperty.initialValue === greenPosition &&
                              this.greenBalloon.isVisibleProperty.initialValue === greenVisible &&
                              model.wall.isVisibleProperty.initialValue === wallVisible;

        objectPositionsNode.pdomVisible = initialValues;
      }
    );
  }


  /**
   * Get a description of the sweater and wall charge. Does not include induced charge. If the sweater has neutral
   * charge then the two objects can be described in a single statement for readability. Will return something like
   * "Sweater and wall have zero net charge, many pairs of negative and positive charges" or
   * "Sweater and wall have zero net charge, showing no charges" or
   * "Sweater has positive net charge, a few more positive charges than negative charges. Wall has zero net charge,
   *   many pairs of negative and positive charges." or
   * "Sweater has positive net charge, showing several positive charges. Wall has zero  net charge, showing several
   *   positive charges."
   *
   * @private
   *
   * @returns {string}
   */
  getSweaterAndWallChargeDescription() {
    let description;

    const chargesShown = this.model.showChargesProperty.get();
    const wallVisible = this.model.wall.isVisibleProperty.get();
    const numberOfWallCharges = this.model.wall.numX * this.model.wall.numY;
    const wallChargeString = BASEDescriber.getNeutralChargesShownDescription( chargesShown, numberOfWallCharges );

    // if sweater has neutral charge, describe the sweater and wall together
    if ( this.model.sweater.chargeProperty.get() === 0 && wallVisible ) {
      const chargedObjectsString = StringUtils.fillIn( summaryObjectsHaveChargePatternString, {
        objects: summarySweaterAndWallString,
        charge: zeroString
      } );

      const patternString = chargesShown === 'all' ? summaryObjectEachHasPatternString : summaryObjectEachPatternString;

      // both have same described charge, can be described with wallChargeString
      description = StringUtils.fillIn( patternString, {
        object: chargedObjectsString,
        charge: wallChargeString
      } );
    }
    else {
      const sweaterSummaryString = SweaterDescriber.getSummaryChargeDescription( chargesShown, this.model.sweater.chargeProperty.get() );

      // if the wall is visible, it also gets its own description
      if ( wallVisible ) {
        const wallSummaryString = WallDescriber.getSummaryChargeDescription( chargesShown, numberOfWallCharges );
        description = StringUtils.fillIn( summarySweaterWallPatternString, {
          sweater: sweaterSummaryString,
          wall: wallSummaryString
        } );
      }
      else {
        description = sweaterSummaryString;
      }
    }

    return description;
  }

  /**
   * Get a description which describes the charge of balloons in the simulation. Dependent on charge values, charge
   * visibility, and balloon visibility. Will return something like
   *
   * "Yellow balloon has negative net charge, a few more negative charges than positive charges." or
   * “Yellow balloon has negative net charge, several more negative charges than positive charges. Green balloon has negative net charge, a few more negative charges than positive charges. Yellow balloon has negative net charge, showing several negative charges. Green balloon has negative net charge, showing a few negative charges.”
   *
   * @private
   *
   * @returns {string}
   */
  getBalloonChargeDescription() {
    let description;

    const yellowChargeRange = BASEDescriber.getDescribedChargeRange( this.yellowBalloon.chargeProperty.get() );
    const greenChargeRange = BASEDescriber.getDescribedChargeRange( this.greenBalloon.chargeProperty.get() );

    const yellowRelativeCharge = this.yellowBalloonDescriber.chargeDescriber.getSummaryRelativeChargeDescription();
    const yellowNetCharge = this.yellowBalloonDescriber.chargeDescriber.getNetChargeDescriptionWithLabel();

    if ( !this.greenBalloon.isVisibleProperty.get() ) {
      description = StringUtils.fillIn( summaryBalloonChargePatternString, {
        balloonCharge: yellowNetCharge,
        showingCharge: yellowRelativeCharge
      } );
    }
    else if ( this.greenBalloon.isVisibleProperty.get() && yellowChargeRange.equals( greenChargeRange ) ) {

      // both balloons visible have the same charge, describe charge together
      const eachNetCharge = BASEDescriber.getNetChargeDescriptionWithLabel( this.yellowBalloon.chargeProperty.get() );

      description = StringUtils.fillIn( summaryBalloonChargePatternString, {
        balloonCharge: eachNetCharge,
        showingCharge: yellowRelativeCharge
      } );
    }
    else {

      // both balloons visible with different amounts of relative charge
      const greenRelativeCharge = this.greenBalloonDescriber.chargeDescriber.getSummaryRelativeChargeDescription();
      const greenNetCharge = this.greenBalloonDescriber.chargeDescriber.getNetChargeDescriptionWithLabel();

      const yellowBalloonDescription = StringUtils.fillIn( summaryBalloonChargePatternString, {
        balloonCharge: yellowNetCharge,
        showingCharge: yellowRelativeCharge
      } );
      const greenBalloonDescription = StringUtils.fillIn( summaryBalloonChargePatternString, {
        balloonCharge: greenNetCharge,
        showingCharge: greenRelativeCharge
      } );

      description = StringUtils.fillIn( summaryEachBalloonChargePatternString, {
        yellowBalloon: yellowBalloonDescription,
        greenBalloon: greenBalloonDescription
      } );
    }

    return description;
  }

  /**
   * Get the description for induced charge of a balloon/balloons on the wall. Will return something like
   *
   * "Negative charges in wall move away from Yellow Balloon a lot. Positive charges do not move." or
   * "Negative charges in wall move away from balloons quite a lot. Positive charges do not move." or
   * "Negative charges in wall move away from Green Balloon a little bit. Positive charges do not move."
   *
   * @private
   *
   * @returns {string}
   */
  getInducedChargeDescription() {
    let description;

    const yellowBalloon = this.yellowBalloon;
    const yellowBalloonDescriber = this.yellowBalloonDescriber;
    const yellowBalloonLabel = yellowBalloonDescriber.accessibleName;

    const greenBalloon = this.greenBalloon;
    const greenBalloonDescriber = this.greenBalloonDescriber;
    const greenBalloonLabel = greenBalloonDescriber.accessibleName;

    const greenInducingChargeAndVisilbe = greenBalloon.inducingChargeAndVisible();
    const yellowInducingChargeAndVisible = yellowBalloon.inducingChargeAndVisible();
    assert && assert( greenInducingChargeAndVisilbe || yellowInducingChargeAndVisible );

    const wallVisible = this.model.wall.isVisibleProperty.get();

    if ( greenInducingChargeAndVisilbe && yellowInducingChargeAndVisible ) {

      if ( this.model.balloonsAdjacentProperty.get() ) {
        description = WallDescriber.getCombinedInducedChargeDescription( yellowBalloon, wallVisible, {
          includeWallPosition: false
        } );

        // add punctuation, a period at  the end of the phrase
        description = StringUtils.fillIn( singleStatementPatternString, {
          statement: description
        } );
      }
      else {

        // full description for yellow balloon
        const yellowBalloonDescription = WallDescriber.getInducedChargeDescription( yellowBalloon, yellowBalloonLabel, wallVisible, {
          includeWallPosition: false,
          includePositiveChargeInfo: false
        } );

        // short summary for green balloon
        const inducedChargeAmount = WallDescriber.getInducedChargeAmountDescription( greenBalloon );
        const greenBalloonDescription = StringUtils.fillIn( summarySecondBalloonInducingChargePatternString, {
          amount: inducedChargeAmount
        } );

        description = StringUtils.fillIn( summaryBothBalloonsPatternString, {
          yellowBalloon: yellowBalloonDescription,
          greenBalloon: greenBalloonDescription
        } );
      }
    }
    else {
      if ( greenInducingChargeAndVisilbe ) {
        description = WallDescriber.getInducedChargeDescription( greenBalloon, greenBalloonLabel, wallVisible, {
          includeWallPosition: false
        } );
      }
      else if ( yellowInducingChargeAndVisible ) {
        description = WallDescriber.getInducedChargeDescription( yellowBalloon, yellowBalloonLabel, wallVisible, {
          includeWallPosition: false
        } );
      }

      // add necessary punctuation
      description = StringUtils.fillIn( singleStatementPatternString, {
        statement: description
      } );
    }

    return description;
  }


  /**
   * Get a description of the objects that are currently visible in the sim.
   *
   * @private
   * @param  {Property.<boolean>} balloonVisible
   * @param  {Property.<boolean>} wallVisible
   * @returns {string}
   */
  static getVisibleObjectsDescription( balloonVisible, wallVisible ) {
    let patternString;
    if ( wallVisible ) {
      patternString = balloonVisible ? summaryYellowGreenSweaterWallPatternString : summaryYellowSweaterWallPatternString;
    }
    else {
      patternString = balloonVisible ? summaryYellowGreenSweaterPatternString : summaryYellowSweaterPatternString;
    }

    const sweaterString = wallVisible ? aSweaterString : andASweaterString;
    const descriptionString = StringUtils.fillIn( patternString, {
      yellowBalloon: aYellowBalloonString,
      greenBalloon: aGreenBalloonString,
      sweater: sweaterString,
      wall: andARemovableWallString
    } );

    return StringUtils.fillIn( roomObjectsPatternString, {
      description: descriptionString
    } );
  }
}

balloonsAndStaticElectricity.register( 'BASESummaryNode', BASESummaryNode );

export default BASESummaryNode;