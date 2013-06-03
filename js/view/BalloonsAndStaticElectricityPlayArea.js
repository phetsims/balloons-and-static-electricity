define( function( require ) {
  "use strict";
  var ControlPanel = require( 'view/ControlPanel' );
  var Strings = require( 'Strings' );
  var TabView = require( 'JOIST/TabView' );
  var SweaterNode = require( 'view/SweaterNode' );
  var WallNode = require( 'view/WallNode' );
  var BalloonNode = require( 'view/BalloonNode' );
  var inherit = require( 'PHET_CORE/inherit' );

  function BalloonsAndStaticElectricityPlayArea( model ) {
    TabView.call( this );

    this.addChild( new SweaterNode( model ) );

    var wall = new WallNode( model );
    this.addChild( wall );

    this.addChild( new BalloonNode( 500, 200, model.balloons[1], "images/balloon-green.png", model ) );
    this.addChild( new BalloonNode( 400, 200, model.balloons[0], "images/balloon-yellow.png", model ) );

    this.addChild( new ControlPanel( Strings, model ) );
  }

  inherit( BalloonsAndStaticElectricityPlayArea, TabView );
  return BalloonsAndStaticElectricityPlayArea;
} );