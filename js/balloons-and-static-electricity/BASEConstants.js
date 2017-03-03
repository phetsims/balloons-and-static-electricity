// Copyright 2017, University of Colorado Boulder

/**
 * Constants used throughout the simulation.
 * 
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );
  var Property = require( 'AXON/Property' );

  var BASEConstants = {
    backgroundColorProperty: new Property( '#9ddcf8' ),
  };

  balloonsAndStaticElectricity.register( 'BASEConstants', BASEConstants );

  return BASEConstants;
} );