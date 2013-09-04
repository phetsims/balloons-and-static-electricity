// Copyright 2002-2013, University of Colorado Boulder

define( function( require ) {
  "use strict";
  var ControlPanel = require( 'BALLOONS_AND_STATIC_ELECTRICITY/view/ControlPanel' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Strings = require( 'BALLOONS_AND_STATIC_ELECTRICITY/Strings' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var SweaterNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/view/SweaterNode' );
  var WallNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/view/WallNode' );
  var BalloonNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/view/BalloonNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var balloonAndStaticElectricityImages = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity-images' );
  var Node = require( 'SCENERY/nodes/Node' );

  function BalloonsAndStaticElectricityView( model ) {
    ScreenView.call( this );

    this.addChild( new SweaterNode( model ) );

    var wall = new WallNode( model );
    this.addChild( wall );

    //Show black to the right side of the wall so it doesn't look like empty space over there
    this.addChild( new Rectangle( model.wall.x + wall.wallImage.width, 0, 1000, 1000, {fill: 'black'} ) );

    //Add black to the left of the screen to match the black region to the right of the wall
    var maxX = this.layoutBounds.maxX - model.wall.x - wall.wallImage.width;
    this.addChild( new Rectangle( maxX - 1000, 0, 1000, 1000, {fill: 'black'} ) );

    var balloonsNode = new Node();
    var greenBalloon = new BalloonNode( 500, 200, model.balloons[1], balloonAndStaticElectricityImages.getImage( "balloon-green.png" ), model );
    var yellowBalloon = new BalloonNode( 400, 200, model.balloons[0], balloonAndStaticElectricityImages.getImage( "balloon-yellow.png" ), model );
    this.addChild( balloonsNode );

    //Only show the selected balloon(s)
    //It would be faster to do this with setting visibility flags, but there is currently a problem the visibility flag is not respected on startup when using SVG renderer
    //TODO: When scenery fixes the initial SVG visibility problem, switch to using visible flags
    model.balloons[1].isVisibleProperty.link( function updateVisibility( isVisible ) {
      balloonsNode.children = isVisible ? [greenBalloon, yellowBalloon] : [yellowBalloon];
    } );

    this.addChild( new ControlPanel( Strings, model, this.layoutBounds ) );

    //A black rectangle that vertically 'extends' the navbar from joist, see #54
    this.addChild( new Rectangle( 0, 0, 3000, this.layoutBounds.height, {fill: 'black', x: -1000, y: this.layoutBounds.height, pickable: false} ) );
  }

  inherit( ScreenView, BalloonsAndStaticElectricityView );
  return BalloonsAndStaticElectricityView;
} );