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
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var Panel = require( 'SUN/Panel' );
  var MultiLineText = require( 'SCENERY_PHET/MultiLineText' );
  var ToggleNode = require( 'SUN/ToggleNode' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var AccessibleABSwitchNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/accessibility/AccessibleABSwitchNode' );
  var AccessibleNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/accessibility/AccessibleNode' );
  var Dimension2 = require( 'DOT/Dimension2' );
  // var RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );
  var AriaHerald = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/accessibility/AriaHerald' );

  // images
  var balloonGreen = require( 'image!BALLOONS_AND_STATIC_ELECTRICITY/balloon-green.png' );
  var balloonYellow = require( 'image!BALLOONS_AND_STATIC_ELECTRICITY/balloon-yellow.png' );

  // strings
  var balloonString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/balloon' );
  var balloonsString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/balloons' );
  var addWallString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/addWall' );
  var removeWallString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/removeWall' );

  // var balloonAppletShowAllChargesString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/BalloonApplet.ShowAllCharges' );
  // var balloonAppletShowNoChargesString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/BalloonApplet.ShowNoCharges' );
  // var balloonAppletShowChargeDifferencesString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/BalloonApplet.ShowChargeDifferences' );

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
   */
  function ControlPanel( model, layoutBounds ) {

    // super constructor
    AccessibleNode.call( this, layoutBounds, {
      tagName: 'section', // this is a separate section of elements
      childContainerTagName: 'div', // all children contained in a div under the section
      label: controlPanelLabelString,
      labelTagName: 'h2'
    } );

    // Add/Remove wall button.
    var addRemoveFont = new PhetFont( 18 );
    var addWallText = new MultiLineText( addWallString, { font: addRemoveFont } );
    var removeWallText = new MultiLineText( removeWallString, { font: addRemoveFont, center: addWallText.center } );
    var wallToggleNode = new ToggleNode( removeWallText, addWallText, model.wall.isVisibleProperty, {
      maxWidth: 120
    } );
    var wallButtonListener = function() { model.wall.isVisible = !model.wall.isVisible; };

    // @private
    this.wallButton = new RectangularPushButton( {
        content: wallToggleNode,
        baseColor: 'rgb( 255, 200, 0 )',
        listener: wallButtonListener,
        accessibleContent: null // for now, accessble content implemented below
      }
    );

    // create a herald to announce when the interface changges as a result of interaction
    var ariaHerald = new AriaHerald();

    // acccessible node containing the wall button
    // TODO: Once accessibility common components are integrated into scenery, this container will not
    // be necessary, and RectangularPushButton can do this directly
    this.accessibleWallButton = new AccessibleNode( this.wallButton.bounds, {
      parentContainerTagName: 'div',
      tagName: 'button',
      label: removeWallLabelString,
      description: wallDescriptionString,
      events: [
        {
          eventName: 'click',
          eventFunction: function( event ) {
            model.wall.isVisibleProperty.set( !model.wall.isVisibleProperty.get() );
          }
        }
      ]
    } );
    this.accessibleWallButton.addChild( this.wallButton );

    // when the wall toggles visibility, make an alert that this has happened and
    // update the button text content
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
    // TODO: hidden for accessibility, reintroduce and hide behind a query param
    // see https://github.com/phetsims/balloons-and-static-electricity/issues/194
    // var radioButtonFont = new PhetFont( 15 );
    // var RADIO_BUTTON_TEXT_OPTIONS = {
    //   font: radioButtonFont,
    //   maxWidth: 200
    // };
    // var showChargesRadioButtonGroup = new VerticalAquaRadioButtonGroup( [
    //   {
    //     node: new Text( balloonAppletShowAllChargesString, RADIO_BUTTON_TEXT_OPTIONS ),
    //     property: model.showChargesProperty,
    //     value: 'all'
    //   },
    //   {
    //     node: new Text( balloonAppletShowNoChargesString, RADIO_BUTTON_TEXT_OPTIONS ),
    //     property: model.showChargesProperty,
    //     value: 'none'
    //   },
    //   {
    //     node: new Text( balloonAppletShowChargeDifferencesString, RADIO_BUTTON_TEXT_OPTIONS ),
    //     property: model.showChargesProperty,
    //     value: 'diff'
    //   }
    // ], {
    //   touchAreaXDilation: 5
    // } );

    // Radio buttons for selecting 1 vs 2 balloons
    var scale = 0.14;
    var yellowBalloonImage = new Image( balloonYellow );
    var twoBalloonIcon = new Node( {
      children: [
        new Image( balloonGreen, { x: 160 } ),
        yellowBalloonImage
      ], scale: scale
    } );

    var oneBalloonIcon = new Node( {
      children: [
        new Image( balloonYellow, { x: twoBalloonIcon.width / scale / 2 - yellowBalloonImage.width / 2 } ),
        new Rectangle( 0, 0, twoBalloonIcon.width / scale, twoBalloonIcon.height / scale, {
          fill: 'black',
          visible: false
        } )
      ], scale: scale
    } );

    // ABSwitch inside of a panel to control the number of balloons on screen
    var showBalloonsChoice = new Panel(
      new AccessibleABSwitchNode( model.balloons[ 1 ].isVisibleProperty, false, oneBalloonIcon, true, twoBalloonIcon, {
        switchSize: new Dimension2( 32, 16 ),
        label: twoBalloonExperimentLabelString,
        description: abSwitchDescriptionString
      } ),
      { fill: 'rgb( 240, 240, 240 )', cornerRadius: 5 }
    );

    // 'Reset Balloons' button
    var resetBalloonToggleNode = new ToggleNode(
      new Text( resetBalloonsString, { font: new PhetFont( 15 ) } ),
      new Text( resetBalloonString, { font: new PhetFont( 15 ) } ),
      model.balloons[ 1 ].isVisibleProperty, {
        maxWidth: 140
      }
    );
    var resetBalloonButtonListener = function() {
      model.sweater.reset();
      model.balloons.forEach( function( entry ) {
        entry.reset( true );
      } );
    };
    var resetBalloonButton = new RectangularPushButton( {
      content: resetBalloonToggleNode,
      buttonValue: resetBalloonString,
      baseColor: 'rgb( 255, 200, 0 )',
      listener: resetBalloonButtonListener,
      accessibleContent: null // temporary - disable content here, implemented below
    } );

    // create the accessible description for the reset balloon button
    var generateDescriptionString = function( balloonVisible ) {
      var balloonDescriptionString = balloonVisible ? balloonsString : balloonString;
      var positionDescriptionString = balloonVisible ? positionsString : positionString;
      return StringUtils.format( resetBalloonsDescriptionPatternString, balloonDescriptionString, positionDescriptionString );
    };

    var accessibleResetBalloonButton = new AccessibleNode( resetBalloonButton.bounds, {
      parentContainerTagName: 'div',
      tagName: 'button',
      label: resetBalloonString,
      description: generateDescriptionString( model.balloons[ 1 ].isVisibleProperty ),
      events: [
        {
          eventName: 'click',
          eventFunction: function( event ) {
            resetBalloonButtonListener();

            var balloonString;
            var bothBalloonString; 
            if ( model.balloons[ 1 ].isVisibleProperty.get() ) {
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
      ]
    } );
    accessibleResetBalloonButton.addChild( resetBalloonButton );

    model.balloons[ 1 ].isVisibleProperty.link( function( balloonVisible ) {
      var newLabel = balloonVisible ? resetBalloonsString : resetBalloonString;
      accessibleResetBalloonButton.setLabel( newLabel );
      accessibleResetBalloonButton.setDescription( generateDescriptionString( balloonVisible ) );
    } );

    var balloonsPanel = new VBox( { spacing: 2, children: [ showBalloonsChoice, accessibleResetBalloonButton ] } );

    //Add the controls at the right, with the reset all button and the wall button
    var resetAllButton = new ResetAllButton( { listener: model.reset.bind( model ), scale: 0.96 } );
    resetAllButton.accessibleContent = null; // temporary for testing, perhaps this will move to commmon code
    var accessibleResetAllButton = new AccessibleNode( null, {
      children: [ resetAllButton ],

      // a11y options
      focusHighlight: new Shape().circle( 0, 0, 28 ),
      tagName: 'button',
      parentContainerTagName: 'div',
      label: resetAllString,
      events: [
        {
          eventName: 'click',
          eventFunction: function( event ) {

            // hide the aria live elements so that alerts are not anounced until after simulation
            // is fully reset
            // TODO: This should be in the main model reset function
            ariaHerald.hidden = true;

            // reset the model
            model.reset();

            // unhide the herald now that properties are reset
            ariaHerald.hidden = false;

            // announce that the sim has been reset
            ariaHerald.announceAssertive( resetAlertString );
          }
        }
      ]
    } );

    var controls = new HBox( {
      spacing: 16,
      align: 'bottom',
      children: [ accessibleResetAllButton, this.accessibleWallButton ]
    } );

    controls.right = layoutBounds.maxX - 2;
    controls.bottom = layoutBounds.maxY - 4;

    this.addChild( new HBox( {
      spacing: 35,
      children: [ balloonsPanel ],
      // children: [ new Panel( showChargesRadioButtonGroup ), balloonsPanel ],
      align: 'bottom',
      left: 768 / 2 - balloonsPanel.width / 2, // layoutBounds.x / 2 - panelWidth / 2
      bottom: layoutBounds.maxY - 4
    } ) );
    this.addChild( controls );

    // NOTE: We are removing the radio button group for charges for now, see
    // https://github.com/phetsims/balloons-and-static-electricity/issues/120
    // TODO: Add back in once https://github.com/phetsims/balloons-and-static-electricity/issues/194
    // is complete

    // create a scenery node to contain and structure the legend as as the first child of the showChargesRadioButtonGroup
    // var chargesLegendContainerNode = new AccessibleLegendNode( chargeSettingsLabelString );
    // showChargesRadioButtonGroup.addChild( chargesLegendContainerNode );

    // create accessible content for the charges radio button group, and make sure that the legend comes first.
    // showChargesRadioButtonGroup.accessibleContent = AccessibleRadioButtonGroupContent.createAccessibleContent( chargeSettingsDescriptionString );
    // showChargesRadioButtonGroup.accessibleOrder = [ chargesLegendContainerNode ];

    // define the navigation order for accessible content in the control panel.
    // this.accessibleOrder = [ wallButton, showBalloonsChoice, resetBalloonButton, showChargesRadioButtonGroup, resetAllButton ];
    this.accessibleOrder = [ this.accessibleWallButton, showBalloonsChoice, accessibleResetBalloonButton, resetAllButton ];

  }

  balloonsAndStaticElectricity.register( 'ControlPanel', ControlPanel );

  inherit( AccessibleNode, ControlPanel );

  return ControlPanel;
} );
