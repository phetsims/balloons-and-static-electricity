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

    // enables developer-only features
    READER: getQueryParameter( 'reader' ) || false
  };

  return BalloonsAndStaticElectricityQueryParameters;
} );
