// Copyright 2002-2013, University of Colorado Boulder

/**
 * Copyright 2002-2013, University of Colorado
 * buttons and model control elements
 * Author: Vasily Shakhov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ResetAllButton = require( 'SCENERY_PHET/ResetAllButton' );
  var RectanglePushButtonDeprecated = require( 'SUN/RectanglePushButtonDeprecated' );
  var InOutRadioButton = require( 'SUN/InOutRadioButton' );
  var Panel = require( 'SUN/Panel' );
  var VerticalAquaRadioButtonGroup = require( 'SUN/VerticalAquaRadioButtonGroup' );
  var MultiLineText = require( 'SCENERY_PHET/MultiLineText' );
  var ToggleNode = require( 'SUN/ToggleNode' );
  var balloonGreen = require( 'image!BALLOONS_AND_STATIC_ELECTRICITY/balloon-green.png' );
  var balloonYellow = require( 'image!BALLOONS_AND_STATIC_ELECTRICITY/balloon-yellow.png' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );

  var addWallString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/addWall' );
  var removeWallString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/removeWall' );
  var showAllChargesString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/BalloonApplet.ShowAllCharges' );
  var showNoChargesString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/BalloonApplet.ShowNoCharges' );
  var showChargeDifferencesString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/BalloonApplet.ShowChargeDifferences' );
  var resetBalloonString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/resetBalloon' );
  var resetBalloonsString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/resetBalloons' );

  function ControlPanel( model, layoutBounds ) {

    // super constructor
    Node.call( this, {renderer: 'svg'} );

    // Add/Remove wall button.
    var addRemoveFont = new PhetFont( 18 );
    var addWallText = new MultiLineText( addWallString, {font: addRemoveFont} );
    var removeWallText = new MultiLineText( removeWallString, {font: addRemoveFont, center: addWallText.center} );
    var toggleNode = new ToggleNode( removeWallText, addWallText, model.wall.isVisibleProperty );
    var wallButton = new Panel( toggleNode, {fill: '#eec227', cursor: 'pointer'} );
    wallButton.addInputListener( {down: function() {model.wall.isVisible = !model.wall.isVisible;}} );

    //show charges radioGroup
    var radioButtonFont = new PhetFont( 15 );
    var showChargesRadioButtonGroup = new VerticalAquaRadioButtonGroup( [
      { node: new Text( showAllChargesString, {font: radioButtonFont} ), property: model.showChargesProperty, value: 'all' },
      { node: new Text( showNoChargesString, {font: radioButtonFont} ), property: model.showChargesProperty, value: 'none' },
      { node: new Text( showChargeDifferencesString, {font: radioButtonFont} ), property: model.showChargesProperty, value: 'diff' }
    ] );

    var scale = 0.14;
    var yellowBalloonImage = new Image( balloonYellow );
    var twoBalloonIcon = new Node( {children: [
      new Image( balloonGreen, {x: 160} ),
      yellowBalloonImage
    ], scale: scale} );

    var oneBalloonIcon = new Node( {children: [
      new Image( balloonYellow, {x: twoBalloonIcon.width / scale / 2 - yellowBalloonImage.width / 2 } ),
      new Rectangle( 0, 0, twoBalloonIcon.width / scale, twoBalloonIcon.height / scale, {fill: 'black', visible: false} )
    ], scale: scale} );

    var showBalloonsChoice = new HBox( {children: [
      new InOutRadioButton( model.balloons[1].isVisibleProperty, false, oneBalloonIcon ),
      new InOutRadioButton( model.balloons[1].isVisibleProperty, true, twoBalloonIcon )]} );

    var resetBalloonText = new Text( resetBalloonsString, {font: new PhetFont( 15 )} );
    var resetBalloonButton = new RectanglePushButtonDeprecated( resetBalloonText, {
      listener: function() {
        model.sweater.reset();
        model.balloons.forEach( function( entry ) {
          entry.reset( true );
        } );
      }
    } );

    var balloonsPanel = new VBox( {spacing: 2, children: [showBalloonsChoice, resetBalloonButton]} );

    //Link plural vs singular afterwards so the button layout will accommodate both
    model.balloons[1].isVisibleProperty.link( function( both ) {
      resetBalloonText.text = both ? resetBalloonsString : resetBalloonString;
    } );

    //Add the controls at the right, with the reset all button and the wall button
    var controls = new HBox( {spacing: 16, align: 'bottom', children: [new ResetAllButton( { listener: model.reset.bind( model ), scale: 0.96 } ), wallButton]} );

    controls.right = layoutBounds.maxX - 2;
    controls.bottom = layoutBounds.maxY - 4;

    this.addChild( new HBox( {spacing: 35, children: [new Panel( showChargesRadioButtonGroup ), balloonsPanel], align: 'bottom', left: 70, bottom: layoutBounds.maxY - 4} ) );
    this.addChild( controls );
  }

  inherit( Node, ControlPanel );

  return ControlPanel;
} );