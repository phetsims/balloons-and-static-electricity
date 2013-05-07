define( function ( require ) {
  "use strict";
  var ControlPanel = require( 'view/ControlPanel' );
  var strings = require( 'Strings' );
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
    var self = this;

    PlayArea.call( this );

    this.addChild( new Sweater( model.sweater ) );

    var wall = new Wall( model.wall );
    this.addChild( wall );


    this.addChild( new Balloon( 400, 200, model.balloons[0], "images/balloon-yellow.png", model ) );
    this.addChild( new Balloon( 500, 200, model.balloons[1], "images/balloon-green.png", model ) );

    this.addChild( new ControlPanel( strings, model ) );

    var handleResize = function () {
      if ( self._bounds.maxX === Number.NEGATIVE_INFINITY ) {
        setTimeout( handleResize, 100 );
      }
      else {
        //TODO
        //model.wall.x = self.bounds.maxX - model.wall.width;
      }
    };

    $( window ).resize( handleResize );
    handleResize();

  }

  inherit( BalloonsAndStaticElectricityPlayArea, PlayArea );
  return BalloonsAndStaticElectricityPlayArea;
} );
