define( function( require ) {
  "use strict";
  var PlayArea = require( 'JOIST/PlayArea' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var inherit = require( 'PHET_CORE/inherit' );

  function BalloonsAndStaticElectricityPlayArea( model ) {
    this.model = model;
    PlayArea.call( this );
    this.addChild( new Rectangle( 0, 0, 50, 50, {fill: 'green'} ) );
  }

  inherit( BalloonsAndStaticElectricityPlayArea, PlayArea );
  return BalloonsAndStaticElectricityPlayArea;
} );
