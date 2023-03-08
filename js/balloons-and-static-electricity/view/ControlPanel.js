// Copyright 2013-2023, University of Colorado Boulder

/**
 * All buttons and control elements for Balloons and Static Electricity.
 *
 * buttons and model control elements
 * @author Vasily Shakhov (Mlearner)
 */

import merge from '../../../../phet-core/js/merge.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { HBox, Image, Node, RichText, Text, VBox } from '../../../../scenery/js/imports.js';
import BooleanToggleNode from '../../../../sun/js/BooleanToggleNode.js';
import BooleanRectangularToggleButton from '../../../../sun/js/buttons/BooleanRectangularToggleButton.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import Panel from '../../../../sun/js/Panel.js';
import VerticalAquaRadioButtonGroup from '../../../../sun/js/VerticalAquaRadioButtonGroup.js';
import balloonGreen_png from '../../../images/balloonGreen_png.js';
import balloonYellow_png from '../../../images/balloonYellow_png.js';
import balloonsAndStaticElectricity from '../../balloonsAndStaticElectricity.js';
import BalloonsAndStaticElectricityStrings from '../../BalloonsAndStaticElectricityStrings.js';
import BASEA11yStrings from '../BASEA11yStrings.js';
import BASEConstants from '../BASEConstants.js';
import BASEQueryParameters from '../BASEQueryParameters.js';
import TwoSceneSelectionNode from './TwoSceneSelectionNode.js';

const addWallString = BalloonsAndStaticElectricityStrings.addWall;
const balloonAppletShowAllChargesString = BalloonsAndStaticElectricityStrings.BalloonApplet.ShowAllCharges;
const balloonAppletShowChargeDifferencesString = BalloonsAndStaticElectricityStrings.BalloonApplet.ShowChargeDifferences;
const balloonAppletShowNoChargesString = BalloonsAndStaticElectricityStrings.BalloonApplet.ShowNoCharges;
const removeWallString = BalloonsAndStaticElectricityStrings.removeWall;
const resetBalloonsString = BalloonsAndStaticElectricityStrings.resetBalloons;
const resetBalloonString = BalloonsAndStaticElectricityStrings.resetBalloon;

const twoBalloonExperimentLabelString = BASEA11yStrings.twoBalloonExperimentLabel.value;
const chargeSettingsLabelString = BASEA11yStrings.chargeSettingsLabel.value;
const chargeSettingsDescriptionString = BASEA11yStrings.chargeSettingsDescription.value;
const showAllChargesAlertString = BASEA11yStrings.showAllChargesAlert.value;
const shoNoChargesAlertString = BASEA11yStrings.shoNoChargesAlert.value;
const showChargeDifferencesAlertString = BASEA11yStrings.showChargeDifferencesAlert.value;
const removeWallDescriptionString = BASEA11yStrings.removeWallDescription.value;
const twoBalloonExperimentDescriptionString = BASEA11yStrings.twoBalloonExperimentDescription.value;
const resetBalloonsAlertPatternString = BASEA11yStrings.resetBalloonsAlertPattern.value;
const balloonString = BASEA11yStrings.balloon.value;
const balloonsString = BASEA11yStrings.balloons.value;
const wallAddedString = BASEA11yStrings.wallAdded.value;
const wallRemovedString = BASEA11yStrings.wallRemoved.value;
const positionsString = BASEA11yStrings.positions.value;
const positionString = BASEA11yStrings.position.value;
const balloonSettingsLabelString = BASEA11yStrings.balloonSettingsLabel.value;
const resetBalloonsDescriptionPatternString = BASEA11yStrings.resetBalloonsDescriptionPattern.value;

// constants
const BOTTOM_CONTROL_SPACING = 10;
const CONTROLS_FONT = new PhetFont( 15 );

class ControlPanel extends Node {

  /**
   * @param {BASEModel} model
   * @param {BASEView} view
   * @param {Tandem} tandem
   */
  constructor( model, view, tandem ) {

    // super constructor
    super();

    // options for text in the wall toggle button
    const textOptions = {
      font: CONTROLS_FONT,
      maxWidth: 100
    };

    // content for Add/Remove wall button.
    const addWallText = new RichText( addWallString, merge( {
      replaceNewlines: true,
      align: 'center',
      tandem: tandem.createTandem( 'addWallText' )
    }, textOptions ) );
    const removeWallText = new RichText( removeWallString, merge( {
      replaceNewlines: true,
      align: 'center',
      center: addWallText.center,
      tandem: tandem.createTandem( 'removeWallText' )
    }, textOptions ) );

    // @private
    this.wallButton = new BooleanRectangularToggleButton( model.wall.isVisibleProperty, removeWallText, addWallText, {
      baseColor: 'rgb( 255, 200, 0 )',
      tandem: tandem.createTandem( 'wallButton' ),

      // pdom
      descriptionContent: removeWallDescriptionString,
      innerContent: removeWallString,
      appendDescription: true
    } );

    // when the wall toggles visibility, make an alert that this has happened and update the button text content
    model.wall.isVisibleProperty.lazyLink( wallVisible => {
      this.wallButton.innerContent = model.wall.isVisibleProperty.get() ? removeWallString : addWallString;

      const alertDescription = wallVisible ? wallAddedString : wallRemovedString;
      this.alertDescriptionUtterance( alertDescription );
    } );

    // Radio buttons related to charges
    const RADIO_BUTTON_TEXT_OPTIONS = {
      font: CONTROLS_FONT,
      maxWidth: 200
    };
    const showChargesRadioButtonGroup = new VerticalAquaRadioButtonGroup( model.showChargesProperty, [ {
      createNode: tandem => new Text(
        balloonAppletShowAllChargesString,
        merge( { tandem: tandem.createTandem( 'allChargesText' ) }, RADIO_BUTTON_TEXT_OPTIONS )
      ),
      value: 'all',
      tandemName: 'showAllChargesRadioButton',
      labelContent: balloonAppletShowAllChargesString
    }, {
      createNode: tandem => new Text(
        balloonAppletShowNoChargesString,
        merge( { tandem: tandem.createTandem( 'noChargesText' ) }, RADIO_BUTTON_TEXT_OPTIONS )
      ),
      value: 'none',
      tandemName: 'showNoChargesRadioButton',
      labelContent: balloonAppletShowNoChargesString
    }, {
      createNode: tandem => new Text(
        balloonAppletShowChargeDifferencesString,
        merge( { tandem: tandem.createTandem( 'differentialChargesText' ) }, RADIO_BUTTON_TEXT_OPTIONS )
      ),
      value: 'diff',
      tandemName: 'showChargeDifferencesRadioButton',
      labelContent: balloonAppletShowChargeDifferencesString
    } ], {
      touchAreaXDilation: 5,
      tandem: tandem.createTandem( 'showChargesRadioButtonGroup' ),

      // pdom
      containerTagName: 'div',
      labelContent: chargeSettingsLabelString,
      descriptionContent: chargeSettingsDescriptionString
    } );

    // pdom - announce an alert that describes the state of charge visibility, linked lazily
    // so that we don't get any alerts on sim startup
    model.showChargesProperty.lazyLink( value => {
      let alertString;
      if ( value === 'all' ) {
        alertString = showAllChargesAlertString;
      }
      else if ( value === 'none' ) {
        alertString = shoNoChargesAlertString;
      }
      else if ( value === 'diff' ) {
        alertString = showChargeDifferencesAlertString;
      }

      assert && assert( alertString, `no interactive alert for showChargesProperty value ${value}` );
      this.alertDescriptionUtterance( alertString );
    } );

    // Radio buttons for selecting 1 vs 2 balloons
    const scale = 0.14;
    const yellowBalloonImage = new Image( balloonYellow_png, { tandem: tandem.createTandem( 'yellowBalloonImage' ) } );
    const twoBalloonIconTandem = tandem.createTandem( 'twoBalloonIcon' );
    const twoBalloonIcon = new Node( {
      children: [
        new Image( balloonGreen_png, { x: 160, tandem: twoBalloonIconTandem.createTandem( 'greenBalloonImage' ) } ),
        yellowBalloonImage
      ],
      scale: scale,
      tandem: twoBalloonIconTandem
    } );

    const oneBalloonIconTandem = tandem.createTandem( 'oneBalloonIcon' );
    const oneBalloonIcon = new Node( {
      children: [
        new Image( balloonYellow_png, {
          x: twoBalloonIcon.width / scale / 2 - yellowBalloonImage.width / 2,
          tandem: oneBalloonIconTandem.createTandem( 'yellowBalloonImage' )
        } )
      ],
      scale: scale,
      tandem: oneBalloonIconTandem
    } );

    let showSecondBalloonSelector = null;
    if ( !BASEQueryParameters.hideBalloonSwitch ) {
      showSecondBalloonSelector = new TwoSceneSelectionNode(
        model.greenBalloon.isVisibleProperty,
        false,
        true,
        oneBalloonIcon,
        twoBalloonIcon, {
          tandem: tandem.createTandem( 'showSecondBalloonSelector' ),
          maskFill: BASEConstants.backgroundColorProperty,
          ariaLabel: twoBalloonExperimentLabelString,
          containerTagName: 'div',
          descriptionContent: twoBalloonExperimentDescriptionString
        }
      );
    }

    // 'Reset Balloons' button
    const resetBalloonToggleNode = new BooleanToggleNode( model.greenBalloon.isVisibleProperty,
      new Text( resetBalloonsString, {
        font: CONTROLS_FONT,
        tandem: tandem.createTandem( 'resetBalloonsText' )
      } ),
      new Text( resetBalloonString, {
        font: CONTROLS_FONT,
        tandem: tandem.createTandem( 'resetBalloonText' )
      } ), { maxWidth: 140, tandem: tandem.createTandem( 'resetBalloonToggleNode' ) } );
    const resetBalloonButtonListener = () => {

      // disable other alerts until after we are finished resetting the balloons
      this.forEachUtteranceQueue( utteranceQueue => { utteranceQueue.enabled = false; } );

      model.sweater.reset();
      model.balloons.forEach( balloon => {
        balloon.reset( true );
      } );

      // Make sure the balloons are correctly layered in the view.
      view.setDefaultBalloonZOrder();

      this.forEachUtteranceQueue( utteranceQueue => { utteranceQueue.enabled = true; } );

      // alert to assistive technology
      this.alertDescriptionUtterance( StringUtils.fillIn( resetBalloonsAlertPatternString, {
        balloons: model.greenBalloon.isVisibleProperty.get() ? balloonsString : balloonString
      } ) );
    };
    const resetBalloonButton = new RectangularPushButton( {
      content: resetBalloonToggleNode,
      baseColor: 'rgb( 255, 200, 0 )',
      listener: resetBalloonButtonListener,
      tandem: tandem.createTandem( 'resetBalloonButton' ),

      // pdom
      containerTagName: 'div',
      appendDescription: true
    } );

    // create the accessible description for the reset balloon button
    const generateDescriptionString = balloonVisible => {
      const balloonDescriptionString = balloonVisible ? balloonsString : balloonString;
      const positionDescriptionString = balloonVisible ? positionsString : positionString;
      return StringUtils.fillIn( resetBalloonsDescriptionPatternString, {
        balloons: balloonDescriptionString,
        positions: positionDescriptionString
      } );
    };

    // update the button description when the green balloon is made visible
    model.greenBalloon.isVisibleProperty.link( isVisible => {
      resetBalloonButton.descriptionContent = generateDescriptionString( isVisible );
      resetBalloonButton.innerContent = isVisible ? resetBalloonsString : resetBalloonString;
    } );

    const balloonsPanel = new VBox( {
      spacing: 2,
      children: showSecondBalloonSelector ? [ showSecondBalloonSelector, resetBalloonButton ] : [ resetBalloonButton ],

      // pdom
      tagName: 'div',
      labelTagName: 'h3',
      labelContent: balloonSettingsLabelString
    } );

    //Add the controls at the right, with the reset all button and the wall button
    const resetAllButton = new ResetAllButton( {
      listener: () => {
        model.reset();
        view.setDefaultBalloonZOrder();
      },
      scale: 0.96,
      tandem: tandem.createTandem( 'resetAllButton' )
    } );

    const controls = new HBox( {
      spacing: 14,
      align: 'bottom',
      children: [ resetAllButton, this.wallButton ]
    } );

    const layoutBounds = view.layoutBounds;

    // more than other controls so the reset button touch area doesn't overlap the nav bar
    controls.bottom = layoutBounds.maxY - BOTTOM_CONTROL_SPACING;
    controls.right = layoutBounds.maxX - 4.5;// so "Remove Wall" button looks centered with wall

    let visibilityControls;
    let controlsLeft;
    if ( BASEQueryParameters.hideChargeControls ) {
      visibilityControls = [ balloonsPanel ];
      controlsLeft = layoutBounds.width / 2 - balloonsPanel.width / 2;
    }
    else {
      visibilityControls = [
        new Panel( showChargesRadioButtonGroup, { tandem: tandem.createTandem( 'visibilityPanel' ) } ),
        balloonsPanel
      ];
      controlsLeft = 70;
    }

    this.addChild( new HBox( {
      spacing: 50,
      children: visibilityControls,
      align: 'bottom',
      left: controlsLeft,
      bottom: layoutBounds.maxY - BOTTOM_CONTROL_SPACING
    } ) );
    this.addChild( controls );

    this.pdomOrder = [ this.wallButton, balloonsPanel, showChargesRadioButtonGroup, resetAllButton ];

  }
}

balloonsAndStaticElectricity.register( 'ControlPanel', ControlPanel );

export default ControlPanel;