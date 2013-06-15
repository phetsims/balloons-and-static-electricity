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
  var inherit = require( 'PHET_CORE/inherit' );
  var ResetAllButton = require( 'SCENERY_PHET/ResetAllButton' );
  var Button = require( 'SUN/Button' );
  var PushButton = require( 'SUN/PushButton' );
  var PanelNode = require( 'SUN/PanelNode' );
  var VerticalCheckBoxGroup = require( 'SUN/VerticalCheckBoxGroup' );
  var MultiLineTextWorkaround = require( 'SCENERY_PHET/MultiLineTextWorkaround' );
  var Property = require( 'AXON/Property' );
  var ToggleNode = require( 'SUN/ToggleNode' );

  function ControlPanel( strings, model, layoutBounds ) {

    var fontSize = 18;

    // super constructor
    Node.call( this );

    var addWallButton = new Button( new MultiLineTextWorkaround( strings["BalloonApplet.addWall"], {fontSize: 18} ), function() {model.wall.isVisible = true;} );
    var removeWallButton = new Button( new MultiLineTextWorkaround( strings["BalloonApplet.removeWall"], {fontSize: 18} ), function() {model.wall.isVisible = false;} );
    var wallButton = new ToggleNode( addWallButton, removeWallButton, model.wall.isVisibleProperty );

    //Wrap properties to use in check boxes to simulate radio buttons.
    function createChargeProperty( type ) {
      var p = new Property( model.showCharges === type );
      model.showChargesProperty.link( function( showCharges ) { p.value = showCharges === type; } );
      p.link( function( value ) {if ( value ) {model.showCharges = type;}} );
      return p;
    }

    //show charges radioGroup
    var showChargesRadioButtonGroup = new VerticalCheckBoxGroup( [
      { content: new Text( strings["BalloonApplet.ShowAllCharges"], {fontSize: fontSize} ), property: createChargeProperty( 'all' ) },
      { content: new Text( strings["BalloonApplet.ShowNoCharges"], {fontSize: fontSize} ), property: createChargeProperty( 'none' ) },
      { content: new Text( strings["BalloonApplet.ShowChargeDifferences"], {fontSize: fontSize} ), property: createChargeProperty( 'diff' ) }
    ] );
    this.addChild( new PanelNode( showChargesRadioButtonGroup, {left: 10, bottom: layoutBounds.maxY - 2} ) );

    var showBalloonsChoice = new HBox( {children: [
      new PushButton( new Text( 'one' ), model.balloons[1].isVisibleProperty.not() ),
      new PushButton( new Text( 'two' ), model.balloons[1].isVisibleProperty )]} );

    var balloonsPanel = new VBox( {children: [showBalloonsChoice, new Button( new Text( strings["BalloonApplet.resetBalloon"], {fontSize: fontSize} ), function() {
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