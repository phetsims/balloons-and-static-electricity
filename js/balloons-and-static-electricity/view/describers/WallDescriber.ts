// Copyright 2017-2026, University of Colorado Boulder

/**
 * A view type that observes the WallModel and builds descriptions which can be read by assistive technology.
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import StringUnionProperty from '../../../../../axon/js/StringUnionProperty.js';
import Range from '../../../../../dot/js/Range.js';
import Vector2 from '../../../../../dot/js/Vector2.js';
import optionize from '../../../../../phet-core/js/optionize.js';
import StringUtils from '../../../../../phetcommon/js/util/StringUtils.js';
import BalloonsAndStaticElectricityFluent from '../../../BalloonsAndStaticElectricityFluent.js';
import BalloonModel from '../../model/BalloonModel.js';
import BASEModel, { type ShowChargesValues } from '../../model/BASEModel.js';
import PlayAreaMap from '../../model/PlayAreaMap.js';
import WallModel from '../../model/WallModel.js';
import BASEDescriber from './BASEDescriber.js';

// strings
const wallDescriptionPatternString = BalloonsAndStaticElectricityFluent.a11y.wallDescriptionPatternStringProperty.value;
const wallPositionString = BalloonsAndStaticElectricityFluent.a11y.wallPositionStringProperty.value;
const wallNoNetChargeString = BalloonsAndStaticElectricityFluent.a11y.wallNoNetChargeStringProperty.value;
const aLittleBitString = BalloonsAndStaticElectricityFluent.a11y.aLittleBitStringProperty.value;
const aLotString = BalloonsAndStaticElectricityFluent.a11y.aLotStringProperty.value;
const quiteALotString = BalloonsAndStaticElectricityFluent.a11y.quiteALotStringProperty.value;
const inducedChargePatternString = BalloonsAndStaticElectricityFluent.a11y.inducedChargePatternStringProperty.value;
const greenBalloonLabelString = BalloonsAndStaticElectricityFluent.a11y.greenBalloonLabelStringProperty.value;
const yellowBalloonLabelString = BalloonsAndStaticElectricityFluent.a11y.yellowBalloonLabelStringProperty.value;
const wallTwoBalloonInducedChargePatternString = BalloonsAndStaticElectricityFluent.a11y.wallTwoBalloonInducedChargePatternStringProperty.value;
const wallChargeWithoutInducedPatternString = BalloonsAndStaticElectricityFluent.a11y.wallChargeWithoutInducedPatternStringProperty.value;
const wallChargeWithInducedPatternString = BalloonsAndStaticElectricityFluent.a11y.wallChargeWithInducedPatternStringProperty.value;
const showingNoChargesString = BalloonsAndStaticElectricityFluent.a11y.showingNoChargesStringProperty.value;
const manyChargePairsString = BalloonsAndStaticElectricityFluent.a11y.manyChargePairsStringProperty.value;
const singleStatementPatternString = BalloonsAndStaticElectricityFluent.a11y.singleStatementPatternStringProperty.value;
const wallNoChangeInChargesPatternString = BalloonsAndStaticElectricityFluent.a11y.wallNoChangeInChargesPatternStringProperty.value;
const inducedChargeNoAmountPatternString = BalloonsAndStaticElectricityFluent.a11y.inducedChargeNoAmountPatternStringProperty.value;
const wallChargePatternStringWithLabel = BalloonsAndStaticElectricityFluent.a11y.wallChargePatternStringWithLabelStringProperty.value;
const summaryObjectHasChargePatternString = BalloonsAndStaticElectricityFluent.a11y.summaryObjectHasChargePatternStringProperty.value;
const summaryObjectChargePatternString = BalloonsAndStaticElectricityFluent.a11y.summaryObjectChargePatternStringProperty.value;
const wallLabelString = BalloonsAndStaticElectricityFluent.a11y.wallLabelStringProperty.value;
const zeroString = BalloonsAndStaticElectricityFluent.a11y.zeroStringProperty.value;
const bothBalloonsString = BalloonsAndStaticElectricityFluent.a11y.bothBalloonsStringProperty.value;
const wallInducedChargeSummaryPatternString = BalloonsAndStaticElectricityFluent.a11y.wallInducedChargeSummaryPatternStringProperty.value;
const positiveChargesDoNotMoveString = BalloonsAndStaticElectricityFluent.a11y.positiveChargesDoNotMoveStringProperty.value;

type DescriptionOptions = { includeWallPosition?: boolean; includePositiveChargeInfo?: boolean };

// constants
const INDUCED_CHARGE_DESCRIPTION_MAP = {
  A_LITTLE_BIT: {
    range: new Range( 0, 20 ),
    description: aLittleBitString
  },
  A_LOT: {
    range: new Range( 20, 35 ),
    description: aLotString
  },
  QUITE_A_LOT: {
    range: new Range( 35, Number.MAX_VALUE ),
    description: quiteALotString
  }
};

export default class WallDescriber {

  private readonly wallModel: WallModel;
  private readonly showChargesProperty: StringUnionProperty<ShowChargesValues>;

  public constructor( model: BASEModel ) {
    this.wallModel = model.wall;
    this.showChargesProperty = model.showChargesProperty;
  }

  /**
   * Get the full description for the wall including its position, net charge, and induced charge.  This is used
   * as the general description for the wall which an AT user can read at any time with the virtual cursor.
   * The content is dependent on the view representation of charges (model.showChargesProperty).
   */
  public getWallDescription( yellowBalloon: BalloonModel, greenBalloon: BalloonModel, balloonsAdjacent: boolean ): string {
    let description;

    // if no charges are shown, the position is the only part of the description
    if ( this.showChargesProperty.get() === 'noCharges' ) {
      description = StringUtils.fillIn( singleStatementPatternString, {
        statement: wallPositionString
      } );
    }
    else {
      const chargeDescription = WallDescriber.getWallChargeDescription( yellowBalloon, greenBalloon, balloonsAdjacent, this.wallModel.isVisibleProperty.get(), this.showChargesProperty.get() );

      // assemble the whole description
      description = StringUtils.fillIn( wallDescriptionPatternString, {
        position: wallPositionString,
        charge: chargeDescription
      } );
    }

    return description;
  }


  /**
   * Get the described charge in the wall, dependent on charge visibility, whether there is induced charge,
   * and which balloons are visible. This portion of the description does not include any wall position information.
   */
  public static getWallChargeDescription( yellowBalloon: BalloonModel, greenBalloon: BalloonModel, balloonsAdjacent: boolean, wallVisible: boolean, chargesShown: string ): string {

    let inducedChargeString;
    let yellowBalloonInducedChargeString;
    let greenBalloonInducedChargeString;

    const yellowInducingAndVisible = yellowBalloon.inducingChargeAndVisible();
    const greenInducingAndVisible = greenBalloon.inducingChargeAndVisible();

    // if all charges are shown, and a balloon is inducing charge, generate the description for induced charge which
    // can change depending on whether balloons are adjacent or whether both balloons are inducing at the same time
    if ( wallVisible && chargesShown === 'allCharges' ) {
      if ( yellowInducingAndVisible ) {
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
      if ( yellowInducingAndVisible && greenInducingAndVisible ) {
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
      else if ( yellowInducingAndVisible || greenInducingAndVisible ) {
        if ( yellowInducingAndVisible ) {
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
    const shownChargesString = ( chargesShown === 'chargeDifferences' ) ? showingNoChargesString : manyChargePairsString;

    // if there is an induced charge, include it in the full charge description
    let wallChargeString;
    if ( ( yellowBalloon.inducingChargeProperty.get() || greenInducingAndVisible ) && chargesShown === 'allCharges' && wallVisible ) {
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

    return wallChargeString;
  }

  /**
   * Get a description of the wall charge that includes the label. Something like
   * "Wall has no net charge, showing..."
   */
  public static getWallChargeDescriptionWithLabel( yellowBalloon: BalloonModel, greenBalloon: BalloonModel, balloonsAdjacent: boolean, wallVisible: boolean, chargesShown: string ): string {
    let description = WallDescriber.getWallChargeDescription( yellowBalloon, greenBalloon, balloonsAdjacent, wallVisible, chargesShown );
    description = description.toLowerCase();

    return StringUtils.fillIn( wallChargePatternStringWithLabel, {
      wallCharge: description
    } );
  }

  /**
   * Get the induced charge amount description for the balloon, describing whether the charges are
   * "a little bit" displaced and so on.
   */
  public static getInducedChargeAmountDescription( balloon: BalloonModel ): string {

    let amountDescription = '';
    const descriptionKeys = Object.keys( INDUCED_CHARGE_DESCRIPTION_MAP );
    for ( let j = 0; j < descriptionKeys.length; j++ ) {
      const value = INDUCED_CHARGE_DESCRIPTION_MAP[ descriptionKeys[ j ] as keyof typeof INDUCED_CHARGE_DESCRIPTION_MAP ];
      if ( balloon.closestChargeInWall && value.range.contains( balloon.closestChargeInWall.getDisplacement() ) ) {
        amountDescription = value.description;
      }
    }
    return amountDescription;
  }

  /**
   * Get the description for induced charge when there is no induced charge. Something like
   * "In wall, no change in charges."
   */
  public static getNoChangeInChargesDescription( positionString: string ): string {
    return StringUtils.fillIn( wallNoChangeInChargesPatternString, {
      position: positionString
    } );
  }

  /**
   * Get the induced charge description without the amount of induced charge. Will return something like
   * "Negative charges in wall move away from yellow balloon."
   */
  public static getInducedChargeDescriptionWithNoAmount( balloon: BalloonModel, balloonLabel: string, wallVisible: boolean ): string {
    let descriptionString;

    const chargePositionString = WallDescriber.getInducedChargePositionDescription( balloon, wallVisible, true );
    if ( balloon.inducingChargeProperty.get() ) {
      descriptionString = StringUtils.fillIn( inducedChargeNoAmountPatternString, {
        wallPosition: chargePositionString,
        balloon: balloonLabel
      } );
    }
    else {
      descriptionString = WallDescriber.getNoChangeInChargesDescription( chargePositionString );
    }

    return descriptionString;
  }

  /**
   * Get an induced charge amount description for a balloon, based on the positions of charges in the wall.  We find the
   * closest charge to the balloon, and determine how far it has been displaced from its initial position. Will
   * return something like:
   *
   * "Negative charges in wall move away from yellow balloon a little bit." or
   * "Negative charges in wall move away from yellow balloon a little bit. Positive charges do not move."
   */
  public static getInducedChargeDescription( balloon: BalloonModel, balloonLabel: string, wallVisible: boolean, providedOptions?: DescriptionOptions ): string {

    const options = optionize<DescriptionOptions>()( {
      includeWallPosition: true, // include position in the wall?
      includePositiveChargeInfo: true // include information about positive charges how positive charges do not move?
    }, providedOptions );

    let descriptionString;
    const chargePositionString = WallDescriber.getInducedChargePositionDescription( balloon, wallVisible, options.includeWallPosition );

    if ( balloon.inducingChargeProperty.get() ) {
      const inducedChargeAmount = WallDescriber.getInducedChargeAmountDescription( balloon );

      descriptionString = StringUtils.fillIn( inducedChargePatternString, {
        wallPosition: chargePositionString,
        balloon: balloonLabel,
        inductionAmount: inducedChargeAmount
      } );
    }
    else {
      descriptionString = WallDescriber.getNoChangeInChargesDescription( chargePositionString );
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
  }

  /**
   * Get a description of both balloons. Will return something like
   *
   * "Negative charges in wall move away from balloons quite a lot. Positive charges do not move." or
   * "Negative charges in lower wall move away from balloons quite a lot. Positive charges do not move."
   */
  public static getCombinedInducedChargeDescription( balloon: BalloonModel, wallVisible: boolean, providedOptions?: DescriptionOptions ): string {

    const options = optionize<DescriptionOptions>()( {
      includeWallPosition: true,
      includePositiveChargeInfo: true
    }, providedOptions );
    let descriptionString;
    const chargePositionString = WallDescriber.getInducedChargePositionDescription( balloon, wallVisible, options.includeWallPosition );

    const inducedChargeAmount = WallDescriber.getInducedChargeAmountDescription( balloon );

    descriptionString = StringUtils.fillIn( inducedChargePatternString, {
      wallPosition: chargePositionString,
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
  }

  /**
   * Gets a description of where the induced charge is located in the wall. With includeWallPosition boolean, it
   * is possible to exclude vertical position of description and just use "Wall" generally. Will return one of
   *
   * "wall"
   * "upper wall"
   * "lower wall"
   */
  public static getInducedChargePositionDescription( balloon: BalloonModel, wallVisible: boolean, includeWallPosition: boolean ): string {
    const chargePositionX = PlayAreaMap.X_POSITIONS.AT_WALL;
    const chargePositionY = includeWallPosition ? balloon.getCenterY() : PlayAreaMap.ROW_RANGES.CENTER_PLAY_AREA.getCenter();
    const chargePosition = new Vector2( chargePositionX, chargePositionY );
    return BASEDescriber.getPositionDescription( chargePosition, wallVisible );
  }

  /**
   * Get a summary of charges in the wall, for the screen summary. The wall is always neutral, so only depends
   * on which charges are visible and number of pairs in the wall.
   */
  public static getSummaryChargeDescription( chargesShown: string, numberOfCharges: number ): string {
    const chargeString = BASEDescriber.getNeutralChargesShownDescription( chargesShown, numberOfCharges );

    const wallObjectString = StringUtils.fillIn( summaryObjectHasChargePatternString, {
      object: wallLabelString,
      charge: zeroString
    } );

    return StringUtils.fillIn( summaryObjectChargePatternString, {
      object: wallObjectString,
      charge: chargeString
    } );
  }
}
