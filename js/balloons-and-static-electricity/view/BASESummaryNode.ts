// Copyright 2016-2026, University of Colorado Boulder

/**
 * screen summary for this sim.  The screen summary is composed of a dynamic list of descriptions
 * for parts of the play area and control panel.  This content will only ever be seen by a screen reader.
 * By breaking up the summary into a list of items, the user can find specific information about the
 * scene very quickly.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ScreenSummaryContent from '../../../../joist/js/ScreenSummaryContent.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import BalloonsAndStaticElectricityFluent from '../../BalloonsAndStaticElectricityFluent.js';
import BalloonModel from '../model/BalloonModel.js';
import BASEModel from '../model/BASEModel.js';
import WallModel from '../model/WallModel.js';
import BalloonNode from './BalloonNode.js';
import BalloonDescriber from './describers/BalloonDescriber.js';
import BASEDescriber from './describers/BASEDescriber.js';
import SweaterDescriber from './describers/SweaterDescriber.js';
import WallDescriber from './describers/WallDescriber.js';

const grabBalloonToPlayString = BalloonsAndStaticElectricityFluent.a11y.grabBalloonToPlayStringProperty.value;
const andARemovableWallString = BalloonsAndStaticElectricityFluent.a11y.andARemovableWallStringProperty.value;
const aSweaterString = BalloonsAndStaticElectricityFluent.a11y.aSweaterStringProperty.value;
const andASweaterString = BalloonsAndStaticElectricityFluent.a11y.andASweaterStringProperty.value;
const roomObjectsPatternString = BalloonsAndStaticElectricityFluent.a11y.roomObjectsPatternStringProperty.value;
const aYellowBalloonString = BalloonsAndStaticElectricityFluent.a11y.aYellowBalloonStringProperty.value;
const aGreenBalloonString = BalloonsAndStaticElectricityFluent.a11y.aGreenBalloonStringProperty.value;
const summaryBalloonChargePatternString = BalloonsAndStaticElectricityFluent.a11y.summaryBalloonChargePatternStringProperty.value;
const summaryEachBalloonChargePatternString = BalloonsAndStaticElectricityFluent.a11y.summaryEachBalloonChargePatternStringProperty.value;
const zeroString = BalloonsAndStaticElectricityFluent.a11y.zeroStringProperty.value;
const summaryObjectsHaveChargePatternString = BalloonsAndStaticElectricityFluent.a11y.summaryObjectsHaveChargePatternStringProperty.value;
const summarySweaterAndWallString = BalloonsAndStaticElectricityFluent.a11y.summarySweaterAndWallStringProperty.value;
const summarySweaterWallPatternString = BalloonsAndStaticElectricityFluent.a11y.summarySweaterWallPatternStringProperty.value;
const summarySecondBalloonInducingChargePatternString = BalloonsAndStaticElectricityFluent.a11y.summarySecondBalloonInducingChargePatternStringProperty.value;
const summaryBothBalloonsPatternString = BalloonsAndStaticElectricityFluent.a11y.summaryBothBalloonsPatternStringProperty.value;
const summaryObjectEachHasPatternString = BalloonsAndStaticElectricityFluent.a11y.summaryObjectEachHasPatternStringProperty.value;
const summaryObjectEachPatternString = BalloonsAndStaticElectricityFluent.a11y.summaryObjectEachPatternStringProperty.value;
const singleStatementPatternString = BalloonsAndStaticElectricityFluent.a11y.singleStatementPatternStringProperty.value;
const summaryYellowGreenSweaterWallPatternString = BalloonsAndStaticElectricityFluent.a11y.summaryYellowGreenSweaterWallPatternStringProperty.value;
const summaryYellowGreenSweaterPatternString = BalloonsAndStaticElectricityFluent.a11y.summaryYellowGreenSweaterPatternStringProperty.value;
const summaryYellowSweaterWallPatternString = BalloonsAndStaticElectricityFluent.a11y.summaryYellowSweaterWallPatternStringProperty.value;
const summaryYellowSweaterPatternString = BalloonsAndStaticElectricityFluent.a11y.summaryYellowSweaterPatternStringProperty.value;
const initialObjectPositionsString = BalloonsAndStaticElectricityFluent.a11y.initialObjectPositionsStringProperty.value;
const simOpeningString = BalloonsAndStaticElectricityFluent.a11y.simOpeningStringProperty.value;

export default class BASESummaryNode extends ScreenSummaryContent {

  private readonly yellowBalloon: BalloonModel;
  private readonly greenBalloon: BalloonModel;
  private readonly yellowBalloonDescriber: BalloonDescriber;
  private readonly greenBalloonDescriber: BalloonDescriber;
  private readonly model: BASEModel;
  private readonly wall: WallModel;

  public constructor( model: BASEModel, yellowBalloonNode: BalloonNode, greenBalloonNode: BalloonNode ) {

    super();

    // pull out model elements for readability
    this.yellowBalloon = model.yellowBalloon;
    this.greenBalloon = model.greenBalloon;

    this.yellowBalloonDescriber = yellowBalloonNode.describer;
    this.greenBalloonDescriber = greenBalloonNode.describer;

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

    Multilink.multilink( [ this.yellowBalloon.chargeProperty, this.greenBalloon.chargeProperty, this.greenBalloon.isVisibleProperty, model.showChargesProperty, model.wall.isVisibleProperty, model.sweater.chargeProperty ],
      ( yellowBalloonCharge, greenBalloonCharge, greenBalloonVisible, showCharges ) => {
        const chargesVisible = showCharges !== 'noCharges';
        balloonChargeNode.accessibleVisible = chargesVisible;
        sweaterWallChargeNode.accessibleVisible = chargesVisible;

        // update labels if charges are shown
        if ( chargesVisible ) {
          balloonChargeNode.innerContent = this.getBalloonChargeDescription();
          sweaterWallChargeNode.innerContent = this.getSweaterAndWallChargeDescription();
        }
      } );

    Multilink.multilink( [ this.yellowBalloon.positionProperty, this.greenBalloon.positionProperty, this.greenBalloon.isVisibleProperty, model.showChargesProperty, model.wall.isVisibleProperty ], ( yellowPosition, greenPosition, greenVisible, showCharges, wallVisible ) => {

      // the induced charge item is only available if one balloon is visible, inducing charge, and showCharges setting is set to 'allCharges'
      const inducingCharge = this.yellowBalloon.inducingChargeAndVisible() || this.greenBalloon.inducingChargeAndVisible();
      const showInducingItem = inducingCharge && wallVisible && showCharges === 'allCharges';
      inducedChargeNode.accessibleVisible = showInducingItem;

      if ( showInducingItem ) {
        inducedChargeNode.innerContent = this.getInducedChargeDescription();
      }
    } );

    // If all the simulation objects are at their initial state, include the position summary phrase that lets the
    // user know where objects are, see https://github.com/phetsims/balloons-and-static-electricity/issues/393
    Multilink.multilink(
      [ this.yellowBalloon.positionProperty,
        this.greenBalloon.positionProperty,
        this.greenBalloon.isVisibleProperty,
        model.wall.isVisibleProperty
      ], ( yellowPosition: Vector2, greenPosition: Vector2, greenVisible: boolean, wallVisible: boolean ) => {
        const initialValues = this.yellowBalloon.positionProperty.initialValue === yellowPosition &&
                              this.greenBalloon.positionProperty.initialValue === greenPosition &&
                              this.greenBalloon.isVisibleProperty.initialValue === greenVisible &&
                              model.wall.isVisibleProperty.initialValue === wallVisible;

        objectPositionsNode.accessibleVisible = initialValues;
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
   */
  private getSweaterAndWallChargeDescription(): string {
    let description: string;

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

      const patternString = chargesShown === 'allCharges' ? summaryObjectEachHasPatternString : summaryObjectEachPatternString;

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
   */
  private getBalloonChargeDescription(): string {
    let description: string;

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
   */
  private getInducedChargeDescription(): string {
    let description = '';

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
   */
  public static getVisibleObjectsDescription( balloonVisible: boolean, wallVisible: boolean ): string {
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
