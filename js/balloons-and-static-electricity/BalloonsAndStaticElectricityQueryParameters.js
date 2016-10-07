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

  var getQueryParameter = phet.chipper.getQueryParameter;

  var BalloonsAndStaticElectricityQueryParameters = {

    // enables prototype screen reader
    READER: getQueryParameter( 'reader' ) || false,

    // keyData - must be used with reader, shows key information instead of
    // reader output, useful for debugging
    KEY_DATA: getQueryParameter( 'keyData' ) || false,

    // dev - eneables developer only features
    DEV: getQueryParameter( 'dev' ) || false,

    // showLiveOutput - shows expected output from a screen reader from aria-live
    // content.  Usefull for development and debugging without having to turn on a
    // screen reader
    SHOW_LIVE_OUTPUT: getQueryParameter( 'showLiveOutput' ) || false,

    // template sonification to get a feel for how this might work
    // uses strategies very similar to john-travoltage
    SONIFICATION: getQueryParameter( 'sonification' ) || false

  };

  balloonsAndStaticElectricity.register( 'BalloonsAndStaticElectricityQueryParameters', BalloonsAndStaticElectricityQueryParameters );

  return BalloonsAndStaticElectricityQueryParameters;
} );
