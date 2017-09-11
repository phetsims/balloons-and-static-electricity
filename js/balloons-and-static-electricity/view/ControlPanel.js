// Copyright 2013-2015, University of Colorado Boulder

/**
 * All buttons and control elements for Balloons and Static Electricity.
 *
 * buttons and model control elements
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var HBox = require( 'SCENERY/nodes/HBox' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var AccessibleSectionNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/AccessibleSectionNode' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var Panel = require( 'SUN/Panel' );
  var BASEConstants = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/BASEConstants' );
  var MultiLineText = require( 'SCENERY_PHET/MultiLineText' );
  var ToggleNode = require( 'SUN/ToggleNode' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var TwoSceneSelectionNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/TwoSceneSelectionNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var VerticalAquaRadioButtonGroup = require( 'SUN/VerticalAquaRadioButtonGroup' );
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );
  var UtteranceQueue = require( 'SCENERY_PHET/accessibility/UtteranceQueue' );
  var BASEA11yStrings = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/BASEA11yStrings' );
  var BalloonsAndStaticElectricityQueryParameters = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/BalloonsAndStaticElectricityQueryParameters' );

  // images
  var balloonGreen = require( 'image!BALLOONS_AND_STATIC_ELECTRICITY/balloon-green.png' );
  var balloonYellow = require( 'image!BALLOONS_AND_STATIC_ELECTRICITY/balloon-yellow.png' );

  // strings
  var balloonAppletShowAllChargesString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/BalloonApplet.ShowAllCharges' );
  var balloonAppletShowNoChargesString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/BalloonApplet.ShowNoCharges' );
  var balloonAppletShowChargeDifferencesString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/BalloonApplet.ShowChargeDifferences' );
  var addWallString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/addWall' );
  var removeWallString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/removeWall' );
  var resetBalloonString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/resetBalloon' );
  var resetBalloonsString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/resetBalloons' );
  var twoBalloonExperimentLabelString = BASEA11yStrings.twoBalloonExperimentLabelString;
  var controlPanelString = BASEA11yStrings.controlPanelString;
  var chargeSettingsLabelString = BASEA11yStrings.chargeSettingsLabelString;
  var chargeSettingsDescriptionString = BASEA11yStrings.chargeSettingsDescriptionString;
  var showAllChargesAlertString = BASEA11yStrings.showAllChargesAlertString;
  var shoNoChargesAlertString = BASEA11yStrings.shoNoChargesAlertString;
  var showChargeDifferencesAlertString = BASEA11yStrings.showChargeDifferencesAlertString;
  var removeWallDescriptionString = BASEA11yStrings.removeWallDescriptionString;
  var twoBalloonExperimentDescriptionString = BASEA11yStrings.twoBalloonExperimentDescriptionString;

  /**
   * @constructor
   * @param {BalloonsAndStaticElectricityModel} model
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
    var wallToggleNode = new ToggleNode( removeWallText, addWallText, model.wall.isVisibleProperty, {
      maxWidth: 120,
      tandem: tandem.createTandem( 'wallToggleNode' )
    } );

    // @private
    this.wallButton = new RectangularPushButton( {
      content: wallToggleNode,
      baseColor: 'rgb( 255, 200, 0 )',
      listener: function() {
        model.wall.isVisibleProperty.set( !model.wall.isVisibleProperty.get() );
        self.wallButton.accessibleLabel = model.wall.isVisibleProperty.get() ? removeWallString : addWallString;
      },
      tandem: tandem.createTandem( 'wallButton' ),

      // a11y
      accessibleDescription: removeWallDescriptionString,
      accessibleLabel: removeWallString,
      parentContainerTagName: 'div'
    } );
    this.wallButton.touchArea = this.wallButton.bounds.eroded( 25 );
    this.wallButton.mouseArea = this.wallButton.bounds.eroded( 25 );

    // when the wall toggles visibility, make an alert that this has happened and update the button text content
    model.wall.isVisibleProperty.lazyLink( function( wallVisible ) {
      // var updatedLabel = wallVisible ? BASEA11yStrings.removeWallLabelString : BASEA11yStrings.addWallLabelString;

      if ( !model.anyChargedBalloonTouchingWall() ) {
        var alertDescription = wallVisible ? BASEA11yStrings.wallAddedString : BASEA11yStrings.wallRemovedString;
        UtteranceQueue.addToFront( alertDescription );
      }
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
      accessibleLabel: balloonAppletShowAllChargesString
    }, {
      node: new Text(
        balloonAppletShowNoChargesString,
        _.extend( { tandem: tandem.createTandem( 'noCharges' ) }, RADIO_BUTTON_TEXT_OPTIONS )
      ),
      property: model.showChargesProperty,
      value: 'none',
      tandemName: 'showNoChargesRadioButton',
      accessibleLabel: balloonAppletShowNoChargesString
    }, {
      node: new Text(
        balloonAppletShowChargeDifferencesString,
        _.extend( { tandem: tandem.createTandem( 'differentialCharges' ) }, RADIO_BUTTON_TEXT_OPTIONS )
      ),
      property: model.showChargesProperty,
      value: 'diff',
      tandemName: 'showChargeDifferencesRadioButton',
      accessibleLabel: balloonAppletShowChargeDifferencesString
    } ], {
      radius: 7,
      touchAreaXDilation: 5,
      tandem: tandem.createTandem( 'showChargesRadioButtonGroup' ),

      // a11y
      labelTagName: 'h3',
      parentContainerTagName: 'div',
      prependLabels: true,
      accessibleLabel: chargeSettingsLabelString,
      accessibleDescription: chargeSettingsDescriptionString
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
      UtteranceQueue.addToBack( alertString );
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
        tandem: tandem.createTandem( 'showSecondBalloonSelector' ),
        maskFill: BASEConstants.backgroundColorProperty,
        accessibleLabel: twoBalloonExperimentLabelString,
        parentContainerTagName: 'div',
        accessibleDescription: twoBalloonExperimentDescriptionString
      }
    );

    model.greenBalloon.isVisibleProperty.lazyLink( function( isVisible ) {
      var alertDescription = isVisible ? BASEA11yStrings.greenBalloonAddedString : BASEA11yStrings.greenBalloonRemovedString;
      UtteranceQueue.addToBack( alertDescription );
    } );

    // 'Reset Balloons' button
    var resetBalloonToggleNode = new ToggleNode(
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
      model.sweater.reset();
      model.balloons.forEach( function( balloon ) {
        balloon.reset( true );
      } );
    };
    var resetBalloonButton = new RectangularPushButton( {
      content: resetBalloonToggleNode,
      baseColor: 'rgb( 255, 200, 0 )',
      listener: resetBalloonButtonListener,
      tandem: tandem.createTandem( 'resetBalloonButton' ),

      // a11y
      parentContainerTagName: 'div'
    } );

    // create the accessible description for the reset balloon button
    var generateDescriptionString = function( balloonVisible ) {
      var balloonDescriptionString = balloonVisible ? BASEA11yStrings.balloonsString : BASEA11yStrings.balloonString;
      var positionDescriptionString = balloonVisible ? BASEA11yStrings.positionsString : BASEA11yStrings.positionString;
      return StringUtils.format( BASEA11yStrings.resetBalloonsDescriptionPatternString, balloonDescriptionString, positionDescriptionString );
    };

    // update the button description when the green balloon is made visible
    model.greenBalloon.isVisibleProperty.link( function( isVisible ) {
      resetBalloonButton.accessibleDescription = generateDescriptionString( isVisible );
      resetBalloonButton.accessibleLabel = isVisible ? resetBalloonsString : resetBalloonString;
    } );

    // no need to dispose, button exists for life of sim
    resetBalloonButton.addAccessibleInputListener( {
      click: function( event ) {
        resetBalloonButtonListener();

        var balloonString;
        var bothBalloonString;
        if ( model.greenBalloon.isVisibleProperty.get() ) {
          balloonString = 'balloons';
          bothBalloonString = 'Both balloons';
        }
        else {
          balloonString = 'balloon';
          bothBalloonString = 'Balloon';
        }
        var resetDescription = StringUtils.format( BASEA11yStrings.resetBalloonsDescriptionPatternString, balloonString, bothBalloonString );
        UtteranceQueue.addToFront( resetDescription );
      }
    } );

    var balloonsPanel = new VBox( {
      spacing: 2,
      children: [ showSecondBalloonSelector, resetBalloonButton ],

      // a11y
      tagName: 'div',
      labelTagName: 'h3',
      accessibleLabel: 'Balloon Settings',
      prependLabels: true
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
    if ( BalloonsAndStaticElectricityQueryParameters.hideChargeControls ) {
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
