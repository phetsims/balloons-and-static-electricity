define( function ( require ) {
  "use strict";
  var ControlPanel = require( 'view/ControlPanel' );
  var strings = require( 'Strings' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var Vector2 = require( 'DOT/Vector2' );
  var PlayArea = require( 'JOIST/TabView' );
  var SweaterNode = require( 'view/SweaterNode' );
  var WallNode = require( 'view/WallNode' );
  var BalloonNode = require( 'view/BalloonNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Image = require( 'SCENERY/nodes/Image' );
  var PlusChargeNode = require( 'view/PlusChargeNode' );
  var MinusChargeNode = require( 'view/MinusChargeNode' );

  function BalloonsAndStaticElectricityPlayArea( model ) {
    var self = this;

    PlayArea.call( this );

    this.addChild( new SweaterNode( model ) );

    var wall = new WallNode( model );
    this.addChild( wall );


    this.addChild( new BalloonNode( 400, 200, model.balloons[0], "images/balloon-yellow.png", model ) );
    this.addChild( new BalloonNode( 500, 200, model.balloons[1], "images/balloon-green.png", model ) );

    this.addChild( new ControlPanel( strings, model ) );

  }

  inherit( BalloonsAndStaticElectricityPlayArea, PlayArea );
  return BalloonsAndStaticElectricityPlayArea;
} );
