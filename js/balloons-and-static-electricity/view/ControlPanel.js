// Copyright 2002-2013, University of Colorado Boulder

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
  var AccessiblePeer = require( 'SCENERY/accessibility/AccessiblePeer' );    
  var AccessibleHeadingNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/accessibility/AccessibleHeadingNode' );
  // var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var AccessibleABSwitchNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/accessibility/AccessibleABSwitchNode' );
  var Dimension2 = require( 'DOT/Dimension2' );  

  // images 
  var balloonGreen = require( 'image!BALLOONS_AND_STATIC_ELECTRICITY/balloon-green.png' );
  var balloonYellow = require( 'image!BALLOONS_AND_STATIC_ELECTRICITY/balloon-yellow.png' );
  
  // strings
  var addWallString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/addWall' );
  var removeWallString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/removeWall' );
  var resetBalloonString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/resetBalloon' );
  var resetBalloonsString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/resetBalloons' );
  var singleBalloonExperimentLabelString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/singleBalloonExperiment.label' );
  var twoBalloonExperimentLabelString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/twoBalloonExperiment.label' );
  var controlPanelLabelString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/controlPanel.label' );
  // var resetBalloonsDescriptionPatternString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/resetBalloons.descriptionPattern' );
  var addWallLabelString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/addWall.label' );
  var removeWallLabelString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/removeWall.label' );
  var greenBalloonRemovedString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/greenBalloonRemoved' );
  var greenBalloonAddedString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/greenBalloonAdded' );

  function ControlPanel( model, layoutBounds ) {

    // super constructor
    Node.call( this );

    // create an accesible heading element for the parallel DOM
    var accessibleHeadingNode = new AccessibleHeadingNode( 'h2', controlPanelLabelString );
    this.addChild( accessibleHeadingNode );

    // Add/Remove wall button.
    var addRemoveFont = new PhetFont( 18 );
    var addWallText = new MultiLineText( addWallString, { font: addRemoveFont } );
    var removeWallText = new MultiLineText( removeWallString, { font: addRemoveFont, center: addWallText.center } );
    var wallToggleNode = new ToggleNode( removeWallText, addWallText, model.wall.isVisibleProperty );
    var wallButtonListener = function() { model.wall.isVisible = !model.wall.isVisible; };
    var wallButton = new RectangularPushButton( {
        content: wallToggleNode,
        baseColor: 'rgb( 255, 200, 0 )',
        listener: wallButtonListener
      }
    );

    // accessible content for the wallButton
    wallButton.accessibleContent = {
      createPeer: function( accessibleInstance ) {

        // generate the 'supertype peer' for the push button in the parallel DOM.
        // NOTE: For now, we are removing the description string for the wallButton, see 
        // https://github.com/phetsims/balloons-and-static-electricity/issues/120
        var accessiblePeer = RectangularPushButton.RectangularPushButtonAccessiblePeer( 
          accessibleInstance, removeWallLabelString, wallButtonListener );

        // when the button is pressed, the button value needs to toggle to match the text on screen
        model.wall.isVisibleProperty.link( function( wallVisible ) {
          var updatedLabel = wallVisible ? removeWallLabelString : addWallLabelString;
          accessiblePeer.domElement.setAttribute( 'aria-label', updatedLabel );
        } );

        return accessiblePeer;
      }
    };

    // Radio buttons related to charges
    // NOTE: We are removing the radios for charge visibility for now, see
    // https://github.com/phetsims/balloons-and-static-electricity/issues/120
    // `r radioButtonFont = new PhetFont( 15 );
    // var showChargesRadioButtonGroup = new VerticalAquaRadioButtonGroup( [
    //   {
    //     node: new Text( balloonAppletShowAllChargesString, { font: radioButtonFont } ),
    //     property: model.showChargesProperty,
    //     value: 'all',
    //     accessibleLabel: balloonAppletShowAllChargesString
    //   },
    //   {
    //     node: new Text( balloonAppletShowNoChargesString, { font: radioButtonFont } ),
    //     property: model.showChargesProperty,
    //     value: 'none',
    //     accessibleLabel: balloonAppletShowNoChargesString
    //   },
    //   {
    //     node: new Text( balloonAppletShowChargeDifferencesString, { font: radioButtonFont } ),
    //     property: model.showChargesProperty,
    //     value: 'diff',
    //     accessibleLabel: balloonAppletShowChargeDifferencesString
    //   }
    // ], {
    //   accessibleDescription: chargeSettingsDescriptionString,
    //   accessibleLabelA: chargeSettingsLabelString
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
      new AccessibleABSwitchNode( model.balloons[1].isVisibleProperty, false, oneBalloonIcon, true, twoBalloonIcon,
        { switchSize: new Dimension2( 32, 16 ),
          accessibleLabelA: twoBalloonExperimentLabelString,
          accessibleLabelB: singleBalloonExperimentLabelString,
          accessibleDescriptionA: greenBalloonRemovedString,
          accessibleDescriptionB: greenBalloonAddedString
        }
      ), { fill: 'rgb( 240, 240, 240 )', cornerRadius: 5 }
    );

    // 'Reset Balloons' button
    var resetBalloonToggleNode = new ToggleNode(
      new Text( resetBalloonsString, { font: new PhetFont( 15 ) } ),
      new Text( resetBalloonString, { font: new PhetFont( 15 ) } ),
      model.balloons[ 1 ].isVisibleProperty
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
      listener: resetBalloonButtonListener
    } );

    // accessible content for the resetBalloonButton
    resetBalloonButton.accessibleContent = {
      createPeer: function( accessibleInstance ) {

        // var balloonVisibleProperty = model.balloons[1].isVisibleProperty;

        // generate the correct description string for the button
        // var generateDescriptionString = function( balloonVisible ) {
        //   var resetString = balloonVisible ? resetBalloonsString : resetBalloonString;
        //   return StringUtils.format( resetBalloonsDescriptionPatternString, resetString );
        // };

        // generate the 'supertype peer' for the push button in the parallel DOM.
        var accessiblePeer = RectangularPushButton.RectangularPushButtonAccessiblePeer( accessibleInstance,
          resetBalloonString, resetBalloonButtonListener );

        // when the button is pressed, the button value needs to toggle to match the text on screen
        model.balloons[1].isVisibleProperty.link( function( balloonVisible ) {
          var updatedLabel = balloonVisible ? resetBalloonsString : resetBalloonString;
          accessiblePeer.domElement.setAttribute( 'aria-label', updatedLabel );
          // accessiblePeer.updateDescription( generateDescriptionString( balloonVisible ) );
        } );

        return accessiblePeer;
      }
    };

    var balloonsPanel = new VBox( { spacing: 2, children: [ showBalloonsChoice, resetBalloonButton ] } );

    //Add the controls at the right, with the reset all button and the wall button
    var resetAllButton = new ResetAllButton( { listener: model.reset.bind( model ), scale: 0.96 } );
    var controls = new HBox( {
      spacing: 16,
      align: 'bottom',
      children: [ resetAllButton, wallButton ]
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

    // the control panel itself has accessible content.  Even though there is no 'control panel' in the view, 
    // containing the elements inside of a section makes sense as a thematic structure for accessibility.
    this.accessibleContent = {
      createPeer: function( accessibleInstance ) {
        var trail = accessibleInstance.trail;
        var uniqueId = trail.getUniqueId();

        //  the control panel should be represented by the following in the parallel DOM:
        //  <section id="control-panel">
        //    <h2 id="cp-label">Control Panel</h2>

        // create the section tag
        var domElement = document.createElement( 'section' );
        domElement.id = 'control-panel-' + uniqueId;
        domElement.setAttribute( 'aria-labelledby', 'heading-node-' + accessibleHeadingNode.id );

        return new AccessiblePeer( accessibleInstance, domElement );

      }
    };

    // NOTE: We are removing the radio button group for charges for now, see
    // https://github.com/phetsims/balloons-and-static-electricity/issues/120

    // create a scenery node to contain and structure the legend as as the first child of the showChargesRadioButtonGroup
    // var chargesLegendContainerNode = new AccessibleLegendNode( chargeSettingsLabelString );
    // showChargesRadioButtonGroup.addChild( chargesLegendContainerNode );

    // create accessible content for the charges radio button group, and make sure that the legend comes first.
    // showChargesRadioButtonGroup.accessibleContent = AccessibleRadioButtonGroupContent.createAccessibleContent( chargeSettingsDescriptionString );
    // showChargesRadioButtonGroup.accessibleOrder = [ chargesLegendContainerNode ];

    // define the navigation order for accessible content in the control panel.
    // this.accessibleOrder = [ accessibleHeadingNode, wallButton, showBalloonsChoice, resetBalloonButton, showChargesRadioButtonGroup, resetAllButton ];
    this.accessibleOrder = [ accessibleHeadingNode, wallButton, showBalloonsChoice, resetBalloonButton, resetAllButton ];


  }

  inherit( Node, ControlPanel );

  return ControlPanel;
} );