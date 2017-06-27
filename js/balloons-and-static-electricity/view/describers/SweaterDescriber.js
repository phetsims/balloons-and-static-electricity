// Copyright 2017, University of Colorado Boulder

/**
 * A view type that presents the accessibility descriptions for the Sweater.
 * 
 * @author Jesse Greenberg
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );

  function SweaterDescriber() {}

  balloonsAndStaticElectricity.register( 'SweaterDescriber', SweaterDescriber );

  return inherit( Object, SweaterDescriber, {} );
} );
