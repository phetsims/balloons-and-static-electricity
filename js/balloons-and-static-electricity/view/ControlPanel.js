// Copyright 2013-2015, University of Colorado Boulder

/**
 * All buttons and control elements for Balloons and Static Electricity.
 *
 * Note: All code related to the charge radio buttons is commented out until descriptions are designed
 * for the state of the radio button group.  Strings are removed from strings json file as well.
 * See https://github.com/phetsims/balloons-and-static-electricity/issues/120.
 *
 * buttons and model control elements
 * Author: Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var TandemNode = require( 'TANDEM/scenery/nodes/TandemNode' );
  var TandemRectangle = require( 'TANDEM/scenery/nodes/TandemRectangle' );
  var Shape = require( 'KITE/Shape' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  var TandemText = require( 'TANDEM/scenery/nodes/TandemText' );
  var TandemImage = require( 'TANDEM/scenery/nodes/TandemImage' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var Panel = require( 'SUN/Panel' );
  var MultiLineText = require( 'SCENERY_PHET/MultiLineText' );
  var ToggleNode = require( 'SUN/ToggleNode' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var AccessibleNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/accessibility/AccessibleNode' );
  var VerticalAquaRadioButtonGroup = require( 'SUN/VerticalAquaRadioButtonGroup' );
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );
  var AriaHerald = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/accessibility/AriaHerald' );
  var BalloonsAndStaticElectricityQueryParameters = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/BalloonsAndStaticElectricityQueryParameters' );

  // images
  var balloonGreen = require( 'image!BALLOONS_AND_STATIC_ELECTRICITY/balloon-green.png' );
  var balloonYellow = require( 'image!BALLOONS_AND_STATIC_ELECTRICITY/balloon-yellow.png' );

  // strings
  var balloonString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/balloon' );
  var balloonsString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/balloons' );
  var addWallString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/addWall' );
  var removeWallString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/removeWall' );

  var balloonAppletShowAllChargesString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/BalloonApplet.ShowAllCharges' );
  var balloonAppletShowNoChargesString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/BalloonApplet.ShowNoCharges' );
  var balloonAppletShowChargeDifferencesString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/BalloonApplet.ShowChargeDifferences' );

  var wallDescriptionString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/wall.description' );
  var resetBalloonString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/resetBalloon' );
  var resetBalloonsString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/resetBalloons' );
  var twoBalloonExperimentLabelString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/twoBalloonExperiment.label' );
  var controlPanelLabelString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/controlPanel.label' );
  var addWallLabelString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/addWall.label' );
  var removeWallLabelString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/removeWall.label' );
  var wallAddedString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/wallAdded' );
  var wallRemovedString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/wallRemoved' );

  var resetBalloonsDescriptionPatternString = 'Reset {0} to start {1} and an uncharged state.';
  var positionString = 'position';
  var positionsString = 'positions';

  var resetAllString = 'Reset All';
  var resetAlertString = 'Sim screen restarted.  Everything reset.';

  var resetBalloonAlertDescriptionPatternString = 'Sweater and {0} reset to net neutral charge. {1} in center of play area.';
  var abSwitchDescriptionString = 'Play with two balloons or just one.';

  /**
   * @constructor
   * @param {BalloonsAndStaticElectricityModel} model
   * @param {Bounds2} layoutBounds
   * @param {Tandem} tandem
   */
  function ControlPanel( model, layoutBounds, tandem ) {

    // super constructor
    AccessibleNode.call( this, {
      tagName: 'section', // this is a separate section of elements
      childContainerTagName: 'div', // all children contained in a div under the section
      label: controlPanelLabelString,
      labelTagName: 'h2'
    } );

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
    var wallButtonListener = function() { model.wall.isVisibleProperty.set( !model.wall.isVisibleProperty.get() ); };

    // @private
    this.wallButton = new RectangularPushButton( {
      content: wallToggleNode,
      baseColor: 'rgb( 255, 200, 0 )',
      listener: wallButtonListener,
      accessibleContent: null, // for now, accessible content implemented below
      tandem: tandem.createTandem( 'wallButton' )
    } );

    // create a herald to announce when the interface changges as a result of interaction
    var ariaHerald = new AriaHerald();

    // accessible node containing the wall button
    // TODO: Once accessibility common components are integrated into scenery, this container will not
    // be necessary, and RectangularPushButton can do this directly
    this.accessibleWallButton = new AccessibleNode( {
      parentContainerTagName: 'div',
      tagName: 'button',
      focusable: true,
      label: removeWallLabelString,
      description: wallDescriptionString,
      descriptionTagName: 'p',
      events: {
        click: function( event ) {
          model.wall.isVisibleProperty.set( !model.wall.isVisibleProperty.get() );
        }
      }
    } );
    this.accessibleWallButton.addChild( this.wallButton );

    // when the wall toggles visibility, make an alert that this has happened and update the button text content
    var self = this;
    model.wall.isVisibleProperty.lazyLink( function( wallVisible ) {
      var updatedLabel = wallVisible ? removeWallLabelString : addWallLabelString;
      self.accessibleWallButton.setLabel( updatedLabel );

      if ( !model.anyChargedBalloonTouchingWall() ) {
        var alertDescription = wallVisible ? wallAddedString : wallRemovedString;
        ariaHerald.announceAssertive( alertDescription );
      }

    } );

    // Radio buttons related to charges
    var radioButtonFont = new PhetFont( 15 );
    var RADIO_BUTTON_TEXT_OPTIONS = {
      font: radioButtonFont,
      maxWidth: 200
    };
    var showChargesRadioButtonGroup = new VerticalAquaRadioButtonGroup( [
      {
        node: new TandemText(
          balloonAppletShowAllChargesString,
          _.extend( { tandem: tandem.createTandem( 'allCharges', RADIO_BUTTON_TEXT_OPTIONS ) } )
        ),
        property: model.showChargesProperty,
        value: 'all'
      },
      {
        node: new TandemText(
          balloonAppletShowNoChargesString,
          _.extend( { tandem: tandem.createTandem( 'noCharges', RADIO_BUTTON_TEXT_OPTIONS ) } )
        ),
        property: model.showChargesProperty,
        value: 'none',
        tandem: tandem.createTandem( 'noCharges' )
      },
      {
        node: new TandemText(
          balloonAppletShowChargeDifferencesString,
          _.extend( { tandem: tandem.createTandem( 'differentialCharges', RADIO_BUTTON_TEXT_OPTIONS ) } )
        ),
        property: model.showChargesProperty,
        value: 'diff',
        tandem: tandem.createTandem( 'differentialCharges' )
      }
    ], {
      radius: 7,
      touchAreaXDilation: 5,
      radioButtonOptions: {
        accessibleContent: null
      },
      tandem: tandem.createTandem( 'showChargesRadioButtonGroup' )
    } );

    // the charge radio buttons should not be accessible for now, see
    // https://github.com/phetsims/balloons-and-static-electricity/issues/194
    showChargesRadioButtonGroup.accessibleContent = null;
    showChargesRadioButtonGroup.children.forEach( function( child ) {
      child.accessibleContent = null;
    } );

    // Radio buttons for selecting 1 vs 2 balloons
    var scale = 0.14;
    var yellowBalloonImage = new TandemImage( balloonYellow, { tandem: tandem.createTandem( 'yellowBalloonImage' ) } );
    var twoBalloonIconTandem = tandem.createTandem( 'twoBalloonIcon' );
    var twoBalloonIcon = new TandemNode( {
      children: [
        new TandemImage( balloonGreen, { x: 160, tandem: twoBalloonIconTandem.createTandem( 'greenBalloonImage' ) } ),
        yellowBalloonImage
      ],
      scale: scale,
      tandem: twoBalloonIconTandem
    } );

    var oneBalloonIconTandem = tandem.createTandem( 'oneBalloonIcon' );
    var oneBalloonIcon = new TandemNode( {
      children: [
        new TandemImage( balloonYellow, {
          x: twoBalloonIcon.width / scale / 2 - yellowBalloonImage.width / 2,
          tandem: oneBalloonIconTandem.createTandem( 'yellowBalloonImage' )
        } ),
        new TandemRectangle( 0, 0, twoBalloonIcon.width / scale, twoBalloonIcon.height / scale, {
          fill: 'black',
          visible: false,
          tandem: tandem.createTandem( 'blackRectangle' )
        } )
      ],
      scale: scale,
      tandem: oneBalloonIconTandem
    } );

    // ABSwitch inside of a panel to control the number of balloons on screen
    var showBalloonsChoice = new RadioButtonGroup( model.greenBalloon.isVisibleProperty,
      [
        {
          value: false,
          node: oneBalloonIcon,
          tandemName: 'oneBalloonRadioButton'
        },
        {
          value: true,
          node: twoBalloonIcon,
          tandemName: 'twoBalloonRadioButton'
        }
      ],
      {
        orientation: 'horizontal',
        baseColor: 'white',
        spacing: 5,
        tandem: tandem.createTandem( 'radioButtonGroup' )
      }
    );

    // the balloon radio buttons need unique representation in the DOM for now, see
    showBalloonsChoice.accessibleContent = null;
    showBalloonsChoice.children.forEach( function( child ) {
      child.accessibleContent = null;
    } );
    showBalloonsChoice.accessibleContent = null;

    var accessibleShowBalloonsChoice = new AccessibleNode( {
      tagName: 'input',
      inputType: 'checkbox',
      useAriaLabel: true,
      focusable: true,
      parentContainerTagName: 'div',
      ariaRole: 'switch',
      ariaAttributes: [
        { attribute: 'aria-checked', value: false }
      ],
      label: twoBalloonExperimentLabelString,
      description: abSwitchDescriptionString,
      descriptionTagName: 'p',
      events: {
        click: function( event ) {

          var newState = !model.greenBalloon.isVisibleProperty.get();

          // toggle the value on click event
          model.greenBalloon.isVisibleProperty.set( !model.greenBalloon.isVisibleProperty.get() );

          // toggle the aria-checked value, checked when valueB selected
          this.setAttribute( 'aria-checked', newState );
        }
      }
    } );

    // the input element must have at least this width for Safari to recognize
    accessibleShowBalloonsChoice.domElement.style.width = '1px';

    accessibleShowBalloonsChoice.addChild( showBalloonsChoice );

    // 'Reset Balloons' button
    var resetBalloonToggleNode = new ToggleNode(
      new TandemText( resetBalloonString, {
        font: new PhetFont( 15 ),
        tandem: tandem.createTandem( 'resetBalloonText' )
      } ),
      new TandemText( resetBalloonsString, {
        font: new PhetFont( 15 ),
        tandem: tandem.createTandem( 'resetBalloonsText' )
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
      buttonValue: resetBalloonString,
      baseColor: 'rgb( 255, 200, 0 )',
      listener: resetBalloonButtonListener,
      accessibleContent: null, // temporary - disable content here, implemented below
      tandem: tandem.createTandem( 'resetBalloonButton' )
    } );

    // create the accessible description for the reset balloon button
    var generateDescriptionString = function( balloonVisible ) {
      var balloonDescriptionString = balloonVisible ? balloonsString : balloonString;
      var positionDescriptionString = balloonVisible ? positionsString : positionString;
      return StringUtils.format( resetBalloonsDescriptionPatternString, balloonDescriptionString, positionDescriptionString );
    };

    var accessibleResetBalloonButton = new AccessibleNode( {
      focusable: true,
      parentContainerTagName: 'div',
      tagName: 'button',
      label: resetBalloonString,
      descriptionTagName: 'p',
      description: generateDescriptionString( model.greenBalloon.isVisibleProperty ),
      events: {
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
          var resetDescription = StringUtils.format( resetBalloonAlertDescriptionPatternString, balloonString, bothBalloonString );
          ariaHerald.announceAssertive( resetDescription );
        }
      }
    } );
    accessibleResetBalloonButton.addChild( resetBalloonButton );

    model.greenBalloon.isVisibleProperty.link( function( balloonVisible ) {
      var newLabel = balloonVisible ? resetBalloonsString : resetBalloonString;
      accessibleResetBalloonButton.setLabel( newLabel );
      accessibleResetBalloonButton.setDescription( generateDescriptionString( balloonVisible ) );
    } );

    var balloonsPanel = new VBox( {
      spacing: 2,
      children: [ accessibleShowBalloonsChoice, accessibleResetBalloonButton ]
    } );

    //Add the controls at the right, with the reset all button and the wall button
    var resetAllButton = new ResetAllButton( {
      listener: model.reset.bind( model ),
      scale: 0.96,
      tandem: tandem.createTandem( 'resetAllButton' )
    } );
    resetAllButton.accessibleContent = null; // temporary for testing, perhaps this will move to common code
    var accessibleResetAllButton = new AccessibleNode( {
      children: [ resetAllButton ],
      focusable: true,

      // a11y options
      focusHighlight: new Shape().circle( 0, 0, 28 ),
      tagName: 'button',
      parentContainerTagName: 'div',
      label: resetAllString,
      events: {
        click: function( event ) {

          // hide the aria live elements so that alerts are not anounced until after simulation
          // is fully reset
          // TODO: This should be in the main model reset function
          ariaHerald.hidden = true;

          // reset the model
          model.reset();

          // unhide the alert elements now that properties are reset
          ariaHerald.hidden = false;

          // announce that the sim has been reset
          ariaHerald.announceAssertive( resetAlertString );
        }
      }
    } );

    var controls = new HBox( {
      spacing: 16,
      align: 'bottom',
      children: [ accessibleResetAllButton, this.accessibleWallButton ]
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
      spacing: 35,
      children: visibilityControls,
      align: 'bottom',
      left: controlsLeft,
      bottom: layoutBounds.maxY - 4
    } ) );
    this.addChild( controls );

    this.accessibleOrder = [ this.accessibleWallButton, accessibleShowBalloonsChoice, accessibleResetBalloonButton, resetAllButton ];

  }

  balloonsAndStaticElectricity.register( 'ControlPanel', ControlPanel );

  inherit( AccessibleNode, ControlPanel );

  return ControlPanel;
} );
