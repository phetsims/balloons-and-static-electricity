// Copyright 2015, University of Colorado Boulder

/**
 * Query parameters used in sim-specific code, specifically involving prototype accessibility work.
 *
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );

  var BalloonsAndStaticElectricityQueryParameters = QueryStringMachine.getAll( {

    // enables prototype screen reader
    reader: { type: 'flag' },

    // keyData - must be used with reader, shows key information instead of
    // reader output, useful for debugging
    keyData: { type: 'flag' },

    // showLiveOutput - shows expected output from a screen reader from aria-live
    // content.  Usefull for development and debugging without having to turn on a
    // screen reader
    showLiveOutput: { type: 'flag' },

    // template sonification to get a feel for how this might work
    // uses strategies very similar to john-travoltage
    sonification: { type: 'flag' },

    // hide the radio button group responsible for toggling visibility of
    // charges in the view
    hideChargeControls: { type: 'flag' }

  } );

  balloonsAndStaticElectricity.register( 'BalloonsAndStaticElectricityQueryParameters', BalloonsAndStaticElectricityQueryParameters );

  return BalloonsAndStaticElectricityQueryParameters;
} );
