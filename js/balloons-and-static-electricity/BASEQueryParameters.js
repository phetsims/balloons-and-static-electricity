// Copyright 2016-2019, University of Colorado Boulder

/**
 * query parameters used in this sim
 *
 * @author Jesse Greenberg
 * @author John Blanco
 */
define( require => {
  'use strict';

  // modules
  const balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );

  const BASEQueryParameters = QueryStringMachine.getAll( {

    // keyData - must be used with reader, shows key information instead of reader output, useful for debugging
    keyData: { type: 'flag' },

    // showGrid - show the description grid, the grid that breaks up the play area into regions for location descriptions
    showGrid: { type: 'flag' },

    // hide the radio button group responsible for toggling visibility of charges in the view
    hideChargeControls: { type: 'flag' },

    // show charged area on sweater
    showSweaterChargedArea: { type: 'flag' },

    // debugging - show locations of center of balloon and center of balloon charges
    showBalloonChargeCenter: { type: 'flag' },

    vibrationChart: { type: 'flag' }
  } );

  balloonsAndStaticElectricity.register( 'BASEQueryParameters', BASEQueryParameters );

  return BASEQueryParameters;
} );
