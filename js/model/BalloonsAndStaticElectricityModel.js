define( function( require ) {
  "use strict";
  var Fort = require( 'FORT/Fort' );

  var BalloonsAndStaticElectricityModel = Fort.Model.extend(
      {
        step: function() {}
      } );

  return BalloonsAndStaticElectricityModel;
} );