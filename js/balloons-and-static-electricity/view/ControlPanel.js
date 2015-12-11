// Copyright 2002-2013, University of Colorado Boulder

/**
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
  var VerticalAquaRadioButtonGroup = require( 'SUN/VerticalAquaRadioButtonGroup' );
  var MultiLineText = require( 'SCENERY_PHET/MultiLineText' );
  var ToggleNode = require( 'SUN/ToggleNode' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  var AccessiblePeer = require( 'SCENERY/accessibility/AccessiblePeer' );    
  var AccessibleHeadingNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/accessibility/AccessibleHeadingNode' );
  var AccessibleRadioButtonGroupContent = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/accessibility/AccessibleRadioButtonGroupContent' );
  var AccessibleLegendNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/accessibility/AccessibleLegendNode' );

  // images 
  var balloonGreen = require( 'image!BALLOONS_AND_STATIC_ELECTRICITY/balloon-green.png' );
  var balloonYellow = require( 'image!BALLOONS_AND_STATIC_ELECTRICITY/balloon-yellow.png' );
  
  // strings
  var addWallString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/addWall' );
  var removeWallString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/removeWall' );
  var balloonAppletShowAllChargesString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/BalloonApplet.ShowAllCharges' );
  var balloonAppletShowNoChargesString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/BalloonApplet.ShowNoCharges' );
  var balloonAppletShowChargeDifferencesString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/BalloonApplet.ShowChargeDifferences' );
  var resetBalloonString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/resetBalloon' );
  var resetBalloonsString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/resetBalloons' );
  var removeBalloonLabelString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/removeBalloon.label' );
  var addBalloonLabelString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/addBalloon.label' );
  var controlPanelLabelString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/controlPanel.label' );
  var wallButtonDescriptionString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/wallButton.description' );
  var chargeSettingsLabelString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/chargeSettings.label' );
  var chargeSettingsDescriptionString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/chargeSettings.description' );
  var balloonSettingsDescriptionString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/balloonSettings.description' );
  var balloonSettingsLabelString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/balloonSettings.label' );
  var resetBalloonsDescriptionString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/resetBalloons.description' );

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
    var wallButton = new RectangularPushButton( {
        content: wallToggleNode,
        accessibleLabel: removeWallString,
        accessibleDescription: wallButtonDescriptionString,
        baseColor: 'rgb( 255, 200, 0 )',
        listener: function() { model.wall.isVisible = !model.wall.isVisible; }
      }
    );

    // Radio buttons related to charges
    var radioButtonFont = new PhetFont( 15 );
    var showChargesRadioButtonGroup = new VerticalAquaRadioButtonGroup( [
      {
        node: new Text( balloonAppletShowAllChargesString, { font: radioButtonFont } ),
        property: model.showChargesProperty,
        value: 'all',
        accessibleLabel: balloonAppletShowAllChargesString
      },
      {
        node: new Text( balloonAppletShowNoChargesString, { font: radioButtonFont } ),
        property: model.showChargesProperty,
        value: 'none',
        accessibleLabel: balloonAppletShowNoChargesString
      },
      {
        node: new Text( balloonAppletShowChargeDifferencesString, { font: radioButtonFont } ),
        property: model.showChargesProperty,
        value: 'diff',
        accessibleLabel: balloonAppletShowChargeDifferencesString
      }
    ], {
      accessibleDescription: chargeSettingsDescriptionString,
      accessibleLabel: chargeSettingsLabelString
    } );

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

    var showBalloonsChoice = new RadioButtonGroup( model.balloons[ 1 ].isVisibleProperty, [
      { value: false, node: oneBalloonIcon, accessibleLabel: removeBalloonLabelString },
      { value: true, node: twoBalloonIcon, accessibleLabel: addBalloonLabelString }
    ], {
      orientation: 'horizontal',
      baseColor: 'white',
      spacing: 5,
      accessibleDescription: balloonSettingsDescriptionString,
      accessibleLabel: balloonSettingsLabelString
    } );

    // 'Reset Balloons' button
    var resetBalloonToggleNode = new ToggleNode(
      new Text( resetBalloonsString, { font: new PhetFont( 15 ) } ),
      new Text( resetBalloonString, { font: new PhetFont( 15 ) } ),
      model.balloons[ 1 ].isVisibleProperty
    );
    var resetBalloonButton = new RectangularPushButton( {
      content: resetBalloonToggleNode,
      buttonValue: resetBalloonString,
      baseColor: 'rgb( 255, 200, 0 )',
      listener: function() {
        model.sweater.reset();
        model.balloons.forEach( function( entry ) {
          entry.reset( true );
        } );
      },
      accessibleDescription: resetBalloonsDescriptionString,
      accessibleLabel: resetBalloonsString
    } );

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
      children: [ new Panel( showChargesRadioButtonGroup ), balloonsPanel ],
      align: 'bottom',
      left: 70,
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
        domElement.setAttribute( 'aria-labelledby', accessibleHeadingNode.accessibleId );

        return new AccessiblePeer( accessibleInstance, domElement );

      }
    };

    // create a scenery node to contain and structure the legend as as the first child of the showChargesRadioButtonGroup
    var chargesLegendContainerNode = new AccessibleLegendNode( chargeSettingsLabelString );
    showChargesRadioButtonGroup.addChild( chargesLegendContainerNode );

    // create accessible content for the charges radio button group, and make sure that the legend comes first.
    showChargesRadioButtonGroup.accessibleContent = AccessibleRadioButtonGroupContent.createAccessibleContent( chargeSettingsDescriptionString );
    showChargesRadioButtonGroup.accessibleOrder = [ chargesLegendContainerNode ];

    // create a scenery node to contain and structure the legend as the first child of the showBalloonsChoice radio button group
    var balloonsLegendContainerNode = new AccessibleLegendNode( balloonSettingsLabelString );
    showBalloonsChoice.addChild( balloonsLegendContainerNode );

    // create accessible content for the balloons radio button group, making sure the legend comes first
    showBalloonsChoice.accessibleContent = AccessibleRadioButtonGroupContent.createAccessibleContent( balloonSettingsDescriptionString );
    showBalloonsChoice.accessibleOrder = [ balloonsLegendContainerNode ];

    // define the navigation order for accessible content in the control panel.
    this.accessibleOrder = [ accessibleHeadingNode, wallButton, showChargesRadioButtonGroup, showBalloonsChoice, resetBalloonButton, resetAllButton ];

  }

  inherit( Node, ControlPanel );

  return ControlPanel;
} );