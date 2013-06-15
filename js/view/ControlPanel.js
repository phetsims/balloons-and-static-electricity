/**
 * Copyright 2002-2013, University of Colorado
 * buttons and model control elements
 * Author: Vasily Shakhov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var Node = require( 'SCENERY/nodes/Node' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ResetAllButton = require( 'SCENERY_PHET/ResetAllButton' );
  var Button = require( 'SUN/Button' );
  var PushButton = require( 'SUN/PushButton' );
  var PanelNode = require( 'SUN/PanelNode' );
  var VerticalRadioButtonGroup = require( 'SUN/VerticalRadioButtonGroup' );
  var MultiLineTextWorkaround = require( 'SCENERY_PHET/MultiLineTextWorkaround' );
  var Property = require( 'AXON/Property' );
  var ToggleNode = require( 'SUN/ToggleNode' );
  var balloonsAndStaticElectricityImages = require( 'balloons-and-static-electricity-images' );

  function ControlPanel( strings, model, layoutBounds ) {

    var fontSize = 18;

    // super constructor
    Node.call( this );

    var addWallButton = new Button( new MultiLineTextWorkaround( strings["BalloonApplet.addWall"], {fontSize: 18} ), function() {model.wall.isVisible = true;} );
    var removeWallButton = new Button( new MultiLineTextWorkaround( strings["BalloonApplet.removeWall"], {fontSize: 18} ), function() {model.wall.isVisible = false;} );
    var wallButton = new ToggleNode( addWallButton, removeWallButton, model.wall.isVisibleProperty );

    //show charges radioGroup
    var showChargesRadioButtonGroup = new VerticalRadioButtonGroup( [
      { node: new Text( strings["BalloonApplet.ShowAllCharges"], {fontSize: fontSize} ), property: model.showChargesProperty, value: 'all' },
      { node: new Text( strings["BalloonApplet.ShowNoCharges"], {fontSize: fontSize} ), property: model.showChargesProperty, value: 'none' },
      { node: new Text( strings["BalloonApplet.ShowChargeDifferences"], {fontSize: fontSize} ), property: model.showChargesProperty, value: 'diff' }
    ] );
    this.addChild( new PanelNode( showChargesRadioButtonGroup, {left: 10, bottom: layoutBounds.maxY - 2} ) );

    function createBalloonChoiceNode( bothVisible ) {
      return new Node( {children: [
        new Image( balloonsAndStaticElectricityImages.getImage( 'balloon-green.png' ), {x: 50, visible: bothVisible} ),
        new Image( balloonsAndStaticElectricityImages.getImage( 'balloon-yellow.png' ) )
      ], scale: 0.27} );
    }

    var showBalloonsChoice = new HBox( {children: [
      new PushButton( createBalloonChoiceNode( false ), model.balloons[1].isVisibleProperty.not() ),
      new PushButton( createBalloonChoiceNode( true ), model.balloons[1].isVisibleProperty )]} );

    var balloonsPanel = new VBox( {spacing: 2, children: [showBalloonsChoice, new Button( new Text( strings["BalloonApplet.resetBalloon"], {fontSize: fontSize} ), function() {
      model.sweater.reset();
      model.balloons.forEach( function( entry ) {
        entry.reset( true );
      } );
    } )]} );
    var controls = new HBox( {spacing: 10, align: 'bottom', children: [balloonsPanel, new ResetAllButton( model.reset.bind( model ) ), wallButton]} );

    controls.right = layoutBounds.maxX - 2;
    controls.bottom = layoutBounds.maxY - 2;

    this.addChild( controls );
  }

  inherit( Node, ControlPanel );

  return ControlPanel;
} );