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

  function BalloonsAndStaticElectricityPlayArea( model ) {
    TabView.call( this );

    this.addChild( new SweaterNode( model ) );

    var wall = new WallNode( model );
    this.addChild( wall );

    this.addChild( new BalloonNode( 500, 200, model.balloons[1], balloonAndStaticElectricityImages.getImage( "balloon-green.png" ), model ) );
    this.addChild( new BalloonNode( 400, 200, model.balloons[0], balloonAndStaticElectricityImages.getImage( "balloon-yellow.png" ), model ) );

    this.addChild( new ControlPanel( Strings, model, this.layoutBounds ) );

    //A black rectangle that vertically 'extends' the navbar from joist, see #54
    this.addChild( new Rectangle( 0, 0, 3000, this.layoutBounds.height, {fill: 'black', x: -1000, y: this.layoutBounds.height, pickable: false} ) );
  }

  inherit( TabView, BalloonsAndStaticElectricityPlayArea );
  return BalloonsAndStaticElectricityPlayArea;
} );