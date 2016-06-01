// Copyright 2015, University of Colorado Boulder

/**
 * Query parameters used in sim-specific code, specifically involving prototype accessibility work.
 *
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  var getQueryParameter = phet.chipper.getQueryParameter;

  var BalloonsAndStaticElectricityQueryParameters = {

    // enables prototype screen reader
    READER: getQueryParameter( 'reader' ) || false,

    // keyData - must be used with reader, shows key information instead of 
    // reader output, useful for debugging
    KEY_DATA: getQueryParameter( 'keyData' ) || false,

    // dev - eneables developer only features
    DEV: getQueryParameter( 'dev' ) || false
    
  };

  return BalloonsAndStaticElectricityQueryParameters;
} );
