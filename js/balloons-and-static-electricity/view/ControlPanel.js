// Copyright 2013-2019, University of Colorado Boulder

/**
 * All buttons and control elements for Balloons and Static Electricity.
 *
 * buttons and model control elements
 * @author Vasily Shakhov (Mlearner)
 */
define( require => {
  'use strict';

  // modules
  const balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );
  const BASEA11yStrings = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/BASEA11yStrings' );
  const BASEConstants = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/BASEConstants' );
  const BASEQueryParameters = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/BASEQueryParameters' );
  const BooleanRectangularToggleButton = require( 'SUN/buttons/BooleanRectangularToggleButton' );
  const BooleanToggleNode = require( 'SUN/BooleanToggleNode' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const Image = require( 'SCENERY/nodes/Image' );
  const inherit = require( 'PHET_CORE/inherit' );
  const merge = require( 'PHET_CORE/merge' );
  const MultiLineText = require( 'SCENERY_PHET/MultiLineText' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Panel = require( 'SUN/Panel' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Text = require( 'SCENERY/nodes/Text' );
  const TwoSceneSelectionNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/TwoSceneSelectionNode' );
const VBox = require( 'SCENERY/nodes/VBox' );
  const VerticalAquaRadioButtonGroup = require( 'SUN/VerticalAquaRadioButtonGroup' );

  // images
  const balloonGreen = require( 'image!BALLOONS_AND_STATIC_ELECTRICITY/balloon-green.png' );
  const balloonYellow = require( 'image!BALLOONS_AND_STATIC_ELECTRICITY/balloon-yellow.png' );

  // strings
  const addWallString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/addWall' );
  const balloonAppletShowAllChargesString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/BalloonApplet.ShowAllCharges' );
  const balloonAppletShowChargeDifferencesString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/BalloonApplet.ShowChargeDifferences' );
  const balloonAppletShowNoChargesString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/BalloonApplet.ShowNoCharges' );
  const removeWallString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/removeWall' );
  const resetBalloonsString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/resetBalloons' );
  const resetBalloonString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/resetBalloon' );

  // a11y strings
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
  const resetBalloonsDescriptionPatternString = BASEA11yStrings.resetBalloonsDescriptionPattern.value;

  // constants
  const BOTTOM_CONTROL_SPACING = 10;
  const CONTROLS_FONT = new PhetFont( 15 );

  /**
   * @constructor
   * @param {BASEModel} model
   * @param {Bounds2} layoutBounds
   * @param {Tandem} tandem
   */
  function ControlPanel( model, layoutBounds, tandem ) {

    // super constructor
    Node.call( this );
    const self = this;

    // content for Add/Remove wall button.
    const addWallText = new MultiLineText( addWallString, {
      font: CONTROLS_FONT,
      tandem: tandem.createTandem( 'addWallText' )
    } );
    const removeWallText = new MultiLineText( removeWallString, {
      font: CONTROLS_FONT,
      center: addWallText.center,
      tandem: tandem.createTandem( 'removeWallText' )
    } );

    // @private
    this.wallButton = new BooleanRectangularToggleButton( removeWallText, addWallText, model.wall.isVisibleProperty, {
      baseColor: 'rgb( 255, 200, 0 )',
      listener: function() {
        model.wall.isVisibleProperty.set( !model.wall.isVisibleProperty.get() );
      },
      tandem: tandem.createTandem( 'wallButton' ),

      // a11y
      descriptionContent: removeWallDescriptionString,
      innerContent: removeWallString,
      appendDescription: true
    } );

    // when the wall toggles visibility, make an alert that this has happened and update the button text content
    model.wall.isVisibleProperty.lazyLink( function( wallVisible ) {
      self.wallButton.innerContent = model.wall.isVisibleProperty.get() ? removeWallString : addWallString;

      const alertDescription = wallVisible ? wallAddedString : wallRemovedString;
        phet.joist.sim.display.utteranceQueue.addToBack( alertDescription );
    } );

    // Radio buttons related to charges
    const RADIO_BUTTON_TEXT_OPTIONS = {
      font: CONTROLS_FONT,
      maxWidth: 200
    };
    const showChargesRadioButtonGroup = new VerticalAquaRadioButtonGroup( model.showChargesProperty, [ {
      node: new Text(
        balloonAppletShowAllChargesString,
        merge( { tandem: tandem.createTandem( 'allCharges' ) }, RADIO_BUTTON_TEXT_OPTIONS )
      ),
      value: 'all',
      tandemName: 'showAllChargesRadioButton',
      labelContent: balloonAppletShowAllChargesString
    }, {
      node: new Text(
        balloonAppletShowNoChargesString,
        merge( { tandem: tandem.createTandem( 'noCharges' ) }, RADIO_BUTTON_TEXT_OPTIONS )
      ),
      value: 'none',
      tandemName: 'showNoChargesRadioButton',
      labelContent: balloonAppletShowNoChargesString
    }, {
      node: new Text(
        balloonAppletShowChargeDifferencesString,
        merge( { tandem: tandem.createTandem( 'differentialCharges' ) }, RADIO_BUTTON_TEXT_OPTIONS )
      ),
      value: 'diff',
      tandemName: 'showChargeDifferencesRadioButton',
      labelContent: balloonAppletShowChargeDifferencesString
    } ], {
      touchAreaXDilation: 5,
      tandem: tandem.createTandem( 'showChargesRadioButtonGroup' ),

      // a11y
      labelTagName: 'h3',
      containerTagName: 'div',
      labelContent: chargeSettingsLabelString,
      descriptionContent: chargeSettingsDescriptionString
    } );

    // a11y - announce an alert that describes the state of charge visibility, linked lazily
    // so that we don't get any alerts on sim startup
    model.showChargesProperty.lazyLink( function( value ) {
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

      assert && assert( alertString, 'no interactive alert for showChargesProperty value ' + value );
      phet.joist.sim.display.utteranceQueue.addToBack( alertString );
    } );

    // Radio buttons for selecting 1 vs 2 balloons
    const scale = 0.14;
    const yellowBalloonImage = new Image( balloonYellow, { tandem: tandem.createTandem( 'yellowBalloonImage' ) } );
    const twoBalloonIconTandem = tandem.createTandem( 'twoBalloonIcon' );
    const twoBalloonIcon = new Node( {
      children: [
        new Image( balloonGreen, { x: 160, tandem: twoBalloonIconTandem.createTandem( 'greenBalloonImage' ) } ),
        yellowBalloonImage
      ],
      scale: scale,
      tandem: twoBalloonIconTandem
    } );

    const oneBalloonIconTandem = tandem.createTandem( 'oneBalloonIcon' );
    const oneBalloonIcon = new Node( {
      children: [
        new Image( balloonYellow, {
          x: twoBalloonIcon.width / scale / 2 - yellowBalloonImage.width / 2,
          tandem: oneBalloonIconTandem.createTandem( 'yellowBalloonImage' )
        } )
      ],
      scale: scale,
      tandem: oneBalloonIconTandem
    } );

    const showSecondBalloonSelector = new TwoSceneSelectionNode(
      model.greenBalloon.isVisibleProperty,
      false,
      true,
      oneBalloonIcon,
      twoBalloonIcon,
      {
        // TODO: (phet-io data stream) The 'fired' event for this tandem doesn't make sense with a 'value' of boolean in the parameters.
        tandem: tandem.createTandem( 'showSecondBalloonSelector' ),
        maskFill: BASEConstants.backgroundColorProperty,
        ariaLabel: twoBalloonExperimentLabelString,
        containerTagName: 'div',
        descriptionContent: twoBalloonExperimentDescriptionString
      }
    );

    // 'Reset Balloons' button
    const resetBalloonToggleNode = new BooleanToggleNode(
      new Text( resetBalloonsString, {
        font: CONTROLS_FONT,
        tandem: tandem.createTandem( 'resetBalloonsText' )
      } ),
      new Text( resetBalloonString, {
        font: CONTROLS_FONT,
        tandem: tandem.createTandem( 'resetBalloonText' )
      } ),
      model.greenBalloon.isVisibleProperty,
      { maxWidth: 140, tandem: tandem.createTandem( 'resetBalloonToggleNode' ) }
    );
    const resetBalloonButtonListener = function() {

      // disable other alerts until after we are finished resetting the balloons
      phet.joist.sim.display.utteranceQueue.enabled = false;

      model.sweater.reset();
      model.balloons.forEach( function( balloon ) {
        balloon.reset( true );
      } );

      phet.joist.sim.display.utteranceQueue.enabled = true;

      // alert to assistive technology
      phet.joist.sim.display.utteranceQueue.addToBack( StringUtils.fillIn( resetBalloonsAlertPatternString, {
        balloons: model.greenBalloon.isVisibleProperty.get() ? balloonsString : balloonString
      } ) );
    };
    const resetBalloonButton = new RectangularPushButton( {
      content: resetBalloonToggleNode,
      baseColor: 'rgb( 255, 200, 0 )',
      listener: resetBalloonButtonListener,
      tandem: tandem.createTandem( 'resetBalloonButton' ),

      // a11y
      containerTagName: 'div',
      appendDescription: true
    } );

    // create the accessible description for the reset balloon button
    const generateDescriptionString = function( balloonVisible ) {
      const balloonDescriptionString = balloonVisible ? balloonsString : balloonString;
      const positionDescriptionString = balloonVisible ? positionsString : positionString;
      return StringUtils.fillIn( resetBalloonsDescriptionPatternString, {
        balloons: balloonDescriptionString,
        positions: positionDescriptionString
      } );
    };

    // update the button description when the green balloon is made visible
    model.greenBalloon.isVisibleProperty.link( function( isVisible ) {
      resetBalloonButton.descriptionContent = generateDescriptionString( isVisible );
      resetBalloonButton.innerContent = isVisible ? resetBalloonsString : resetBalloonString;
    } );

    const balloonsPanel = new VBox( {
      spacing: 2,
      children: [ showSecondBalloonSelector, resetBalloonButton ],

      // a11y
      tagName: 'div',
      labelTagName: 'h3',
      labelContent: 'Balloon Settings'
    } );

    //Add the controls at the right, with the reset all button and the wall button
    const resetAllButton = new ResetAllButton( {
      listener: model.reset.bind( model ),
      scale: 0.96,
      tandem: tandem.createTandem( 'resetAllButton' )
    } );

    const controls = new HBox( {
      spacing: 14,
      align: 'bottom',
      children: [ resetAllButton, this.wallButton ]
    } );

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

    this.accessibleOrder = [ this.wallButton, balloonsPanel, showChargesRadioButtonGroup, resetAllButton ];

  }

  balloonsAndStaticElectricity.register( 'ControlPanel', ControlPanel );

  inherit( Node, ControlPanel );

  return ControlPanel;
} );
