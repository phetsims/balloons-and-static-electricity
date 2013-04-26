define( function ( require ) {
  "use strict";
  var ModelViewTransform2D = require( 'PHETCOMMON/view/ModelViewTransform2D' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var Vector2 = require( 'DOT/Vector2' );
  var PlayArea = require( 'JOIST/TabView' );
  var Sweater = require( 'view/SweaterNode' );
  var Wall = require( 'view/WallNode' );
  var Balloon = require( 'view/Balloon' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Image = require( 'SCENERY/nodes/Image' );
  var PlusCharge = require( 'view/PlusCharge' );
  var MinusCharge = require( 'view/MinusCharge' );

  function BalloonsAndStaticElectricityPlayArea( model ) {
    PlayArea.call( this );

    this.addChild( new Sweater( model.sweater ) );
    this.addChild( new Wall( model.wall ) );

    this.addChild( new Balloon( 400, 200, model.balloons[0], "images/balloon-green.png", model ) );
    this.addChild( new Balloon( 500, 200, model.balloons[1], "images/balloon-yellow.png", model) );
  }

  inherit( BalloonsAndStaticElectricityPlayArea, PlayArea );
  return BalloonsAndStaticElectricityPlayArea;
} );
