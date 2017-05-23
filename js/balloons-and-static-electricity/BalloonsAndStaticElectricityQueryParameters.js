// Copyright 2015, University of Colorado Boulder

/**
 * query parameters used in this sim
 *
 * @author Jesse Greenberg
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );

  var BalloonsAndStaticElectricityQueryParameters = QueryStringMachine.getAll( {

    // enables prototype screen reader
    reader: { type: 'flag' },

    // keyData - must be used with reader, shows key information instead of reader output, useful for debugging
    keyData: { type: 'flag' },

    // showGrid - show the description grid, the grid that breaks up the play area into regions for location descriptions
    showGrid: { type: 'flag' },

    // mockup - show a mockup of the description grid - TODO: remove soon, this should not be part of the deployed sim
    mockup: { type: 'flag' },

    // template sonification to get a feel for how this might work uses strategies very similar to john-travoltage
    sonification: { type: 'flag' },

    // hide the radio button group responsible for toggling visibility of charges in the view
    hideChargeControls: { type: 'flag' },

    // show charged area on sweater
    showSweaterChargedArea: { type: 'flag' }

  } );

  balloonsAndStaticElectricity.register( 'BalloonsAndStaticElectricityQueryParameters', BalloonsAndStaticElectricityQueryParameters );

  return BalloonsAndStaticElectricityQueryParameters;
} );
