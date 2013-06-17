define( function( require ) {
  "use strict";
  var ControlPanel = require( 'view/ControlPanel' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Strings = require( 'Strings' );
  var TabView = require( 'JOIST/TabView' );
  var SweaterNode = require( 'view/SweaterNode' );
  var WallNode = require( 'view/WallNode' );
  var BalloonNode = require( 'view/BalloonNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var balloonAndStaticElectricityImages = require( 'balloons-and-static-electricity-images' );
  var Node = require( 'SCENERY/nodes/Node' );

  function BalloonsAndStaticElectricityPlayArea( model ) {
    TabView.call( this );

    this.addChild( new SweaterNode( model ) );

    var wall = new WallNode( model );
    this.addChild( wall );

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

  inherit( TabView, BalloonsAndStaticElectricityPlayArea );
  return BalloonsAndStaticElectricityPlayArea;
} );