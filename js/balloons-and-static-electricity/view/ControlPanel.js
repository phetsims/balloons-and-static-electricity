// Copyright 2013-2017, University of Colorado Boulder

/**
 * All buttons and control elements for Balloons and Static Electricity.
 *
 * buttons and model control elements
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var AccessibleSectionNode = require( 'SCENERY_PHET/accessibility/AccessibleSectionNode' );
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );
  var BASEA11yStrings = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/BASEA11yStrings' );
  var BASEConstants = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/BASEConstants' );
  var BASEQueryParameters = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/BASEQueryParameters' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var JoistA11yStrings = require( 'JOIST/JoistA11yStrings' );
  var MultiLineText = require( 'SCENERY_PHET/MultiLineText' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var BooleanToggleNode = require( 'SUN/BooleanToggleNode' );
  var TwoSceneSelectionNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/TwoSceneSelectionNode' );
  var utteranceQueue = require( 'SCENERY_PHET/accessibility/utteranceQueue' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var VerticalAquaRadioButtonGroup = require( 'SUN/VerticalAquaRadioButtonGroup' );

  // images
  var balloonGreen = require( 'image!BALLOONS_AND_STATIC_ELECTRICITY/balloon-green.png' );
  var balloonYellow = require( 'image!BALLOONS_AND_STATIC_ELECTRICITY/balloon-yellow.png' );

  // strings
  var addWallString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/addWall' );
  var balloonAppletShowAllChargesString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/BalloonApplet.ShowAllCharges' );
  var balloonAppletShowChargeDifferencesString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/BalloonApplet.ShowChargeDifferences' );
  var balloonAppletShowNoChargesString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/BalloonApplet.ShowNoCharges' );
  var removeWallString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/removeWall' );
  var resetBalloonsString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/resetBalloons' );
  var resetBalloonString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/resetBalloon' );

  // a11y strings
  var twoBalloonExperimentLabelString = BASEA11yStrings.twoBalloonExperimentLabel.value;
  var controlPanelString = JoistA11yStrings.controlPanel.value;
  var chargeSettingsLabelString = BASEA11yStrings.chargeSettingsLabel.value;
  var chargeSettingsDescriptionString = BASEA11yStrings.chargeSettingsDescription.value;
  var showAllChargesAlertString = BASEA11yStrings.showAllChargesAlert.value;
  var shoNoChargesAlertString = BASEA11yStrings.shoNoChargesAlert.value;
  var showChargeDifferencesAlertString = BASEA11yStrings.showChargeDifferencesAlert.value;
  var removeWallDescriptionString = BASEA11yStrings.removeWallDescription.value;
  var twoBalloonExperimentDescriptionString = BASEA11yStrings.twoBalloonExperimentDescription.value;
  var resetBalloonsAlertPatternString = BASEA11yStrings.resetBalloonsAlertPattern.value;
  var balloonString = BASEA11yStrings.balloon.value;
  var balloonsString = BASEA11yStrings.balloons.value;
  var wallAddedString = BASEA11yStrings.wallAdded.value;
  var wallRemovedString = BASEA11yStrings.wallRemoved.value;
  var positionsString = BASEA11yStrings.positions.value;
  var positionString = BASEA11yStrings.position.value;
  var resetBalloonsDescriptionPatternString = BASEA11yStrings.resetBalloonsDescriptionPattern.value;

  /**
   * @constructor
   * @param {BASEModel} model
   * @param {Bounds2} layoutBounds
   * @param {Tandem} tandem
   */
  function ControlPanel( model, layoutBounds, tandem ) {

    // super constructor
    AccessibleSectionNode.call( this, controlPanelString );
    var self = this;

    // Add/Remove wall button.
    var addRemoveFont = new PhetFont( 18 );
    var addWallText = new MultiLineText( addWallString, {
      font: addRemoveFont,
      tandem: tandem.createTandem( 'addWallText' )
    } );
    var removeWallText = new MultiLineText( removeWallString, {
      font: addRemoveFont,
      center: addWallText.center,
      tandem: tandem.createTandem( 'removeWallText' )
    } );
    var wallToggleNode = new BooleanToggleNode( removeWallText, addWallText, model.wall.isVisibleProperty, {
      maxWidth: 120,
      tandem: tandem.createTandem( 'wallToggleNode' )
    } );

    // @private
    this.wallButton = new RectangularPushButton( {
      content: wallToggleNode,
      baseColor: 'rgb( 255, 200, 0 )',
      listener: function() {
        model.wall.isVisibleProperty.set( !model.wall.isVisibleProperty.get() );
      },
      tandem: tandem.createTandem( 'wallButton' ),

      // a11y
      descriptionContent: removeWallDescriptionString,
      innerContent: removeWallString,
      containerTagName: 'div',
      appendDescription: true
    } );
    this.wallButton.touchArea = this.wallButton.bounds.eroded( 25 );
    this.wallButton.mouseArea = this.wallButton.bounds.eroded( 25 );

    // when the wall toggles visibility, make an alert that this has happened and update the button text content
    model.wall.isVisibleProperty.lazyLink( function( wallVisible ) {
      self.wallButton.innerContent = model.wall.isVisibleProperty.get() ? removeWallString : addWallString;

      var alertDescription = wallVisible ? wallAddedString : wallRemovedString;
        utteranceQueue.addToBack( alertDescription );
    } );

    // Radio buttons related to charges
    var radioButtonFont = new PhetFont( { size: 15, tandem: tandem.createTandem( 'radioButtonFont' ) } );
    var RADIO_BUTTON_TEXT_OPTIONS = {
      font: radioButtonFont,
      maxWidth: 200
    };
    var showChargesRadioButtonGroup = new VerticalAquaRadioButtonGroup( [ {
      node: new Text(
        balloonAppletShowAllChargesString,
        _.extend( { tandem: tandem.createTandem( 'allCharges' ) }, RADIO_BUTTON_TEXT_OPTIONS )
      ),
      property: model.showChargesProperty,
      value: 'all',
      tandemName: 'showAllChargesRadioButton',
      labelContent: balloonAppletShowAllChargesString
    }, {
      node: new Text(
        balloonAppletShowNoChargesString,
        _.extend( { tandem: tandem.createTandem( 'noCharges' ) }, RADIO_BUTTON_TEXT_OPTIONS )
      ),
      property: model.showChargesProperty,
      value: 'none',
      tandemName: 'showNoChargesRadioButton',
      labelContent: balloonAppletShowNoChargesString
    }, {
      node: new Text(
        balloonAppletShowChargeDifferencesString,
        _.extend( { tandem: tandem.createTandem( 'differentialCharges' ) }, RADIO_BUTTON_TEXT_OPTIONS )
      ),
      property: model.showChargesProperty,
      value: 'diff',
      tandemName: 'showChargeDifferencesRadioButton',
      labelContent: balloonAppletShowChargeDifferencesString
    } ], {
      radius: 7,
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
      var alertString;
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
      utteranceQueue.addToBack( alertString );
    } );

    // Radio buttons for selecting 1 vs 2 balloons
    var scale = 0.14;
    var yellowBalloonImage = new Image( balloonYellow, { tandem: tandem.createTandem( 'yellowBalloonImage' ) } );
    var twoBalloonIconTandem = tandem.createTandem( 'twoBalloonIcon' );
    var twoBalloonIcon = new Node( {
      children: [
        new Image( balloonGreen, { x: 160, tandem: twoBalloonIconTandem.createTandem( 'greenBalloonImage' ) } ),
        yellowBalloonImage
      ],
      scale: scale,
      tandem: twoBalloonIconTandem
    } );

    var oneBalloonIconTandem = tandem.createTandem( 'oneBalloonIcon' );
    var oneBalloonIcon = new Node( {
      children: [
        new Image( balloonYellow, {
          x: twoBalloonIcon.width / scale / 2 - yellowBalloonImage.width / 2,
          tandem: oneBalloonIconTandem.createTandem( 'yellowBalloonImage' )
        } )
      ],
      scale: scale,
      tandem: oneBalloonIconTandem
    } );

    var showSecondBalloonSelector = new TwoSceneSelectionNode(
      model.greenBalloon.isVisibleProperty,
      false,
      true,
      oneBalloonIcon,
      twoBalloonIcon,
      {
        // TODO: (phet-io event stream) The 'fired' event for this tandem doesn't make sense with a 'value' of boolean in the parameters.
        tandem: tandem.createTandem( 'showSecondBalloonSelector' ),
        maskFill: BASEConstants.backgroundColorProperty,
        ariaLabel: twoBalloonExperimentLabelString,
        containerTagName: 'div',
        descriptionContent: twoBalloonExperimentDescriptionString
      }
    );

    // 'Reset Balloons' button
    var resetBalloonToggleNode = new BooleanToggleNode(
      new Text( resetBalloonsString, {
        font: new PhetFont( 15 ),
        tandem: tandem.createTandem( 'resetBalloonsText' )
      } ),
      new Text( resetBalloonString, {
        font: new PhetFont( 15 ),
        tandem: tandem.createTandem( 'resetBalloonText' )
      } ),
      model.greenBalloon.isVisibleProperty,
      { maxWidth: 140, tandem: tandem.createTandem( 'resetBalloonToggleNode' ) }
    );
    var resetBalloonButtonListener = function() {

      // disable other alerts until after we are finished resetting the balloons
      utteranceQueue.enabled = false;
      
      model.sweater.reset();
      model.balloons.forEach( function( balloon ) {
        balloon.reset( true );
      } );

      utteranceQueue.enabled = true;

      // alert to assistive technology
      utteranceQueue.addToBack( StringUtils.fillIn( resetBalloonsAlertPatternString, {
        balloons: model.greenBalloon.isVisibleProperty.get() ? balloonsString : balloonString
      } ) );
    };
    var resetBalloonButton = new RectangularPushButton( {
      content: resetBalloonToggleNode,
      baseColor: 'rgb( 255, 200, 0 )',
      listener: resetBalloonButtonListener,
      tandem: tandem.createTandem( 'resetBalloonButton' ),

      // a11y
      containerTagName: 'div',
      appendDescription: true
    } );

    // create the accessible description for the reset balloon button
    var generateDescriptionString = function( balloonVisible ) {
      var balloonDescriptionString = balloonVisible ? balloonsString : balloonString;
      var positionDescriptionString = balloonVisible ? positionsString : positionString;
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

    var balloonsPanel = new VBox( {
      spacing: 2,
      children: [ showSecondBalloonSelector, resetBalloonButton ],

      // a11y
      tagName: 'div',
      labelTagName: 'h3',
      labelContent: 'Balloon Settings'
    } );

    //Add the controls at the right, with the reset all button and the wall button
    var resetAllButton = new ResetAllButton( {
      listener: model.reset.bind( model ),
      scale: 0.96,
      tandem: tandem.createTandem( 'resetAllButton' )
    } );

    var controls = new HBox( {
      spacing: 16,
      align: 'bottom',
      children: [ resetAllButton, this.wallButton ]
    } );

    controls.right = layoutBounds.maxX - 2;
    controls.bottom = layoutBounds.maxY - 4;

    var visibilityControls;
    var controlsLeft;
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
      bottom: layoutBounds.maxY - 4
    } ) );
    this.addChild( controls );

    this.accessibleOrder = [ this.wallButton, balloonsPanel, showChargesRadioButtonGroup, resetAllButton ];

  }

  balloonsAndStaticElectricity.register( 'ControlPanel', ControlPanel );

  inherit( AccessibleSectionNode, ControlPanel );

  return ControlPanel;
} );
