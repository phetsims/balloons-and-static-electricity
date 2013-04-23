define( function( require ) {
  "use strict";
  var PlayArea = require( 'JOIST/TabView' );
  var Sweater = require( 'view/SweaterNode' );
  var Wall = require( 'view/WallNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Image = require( 'SCENERY/nodes/Image' );

  function BalloonsAndStaticElectricityPlayArea( model ) {
    PlayArea.call( this );

    this.addChild(new Sweater(0,0));
    this.addChild(new Wall(this.layoutBounds.maxX,this.layoutBounds.maxY));
  }

  inherit( BalloonsAndStaticElectricityPlayArea, PlayArea );
  return BalloonsAndStaticElectricityPlayArea;
} );
