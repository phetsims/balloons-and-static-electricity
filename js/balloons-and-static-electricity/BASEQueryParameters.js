// Copyright 2016-2021, University of Colorado Boulder

/**
 * query parameters used in this sim
 *
 * @author Jesse Greenberg
 * @author John Blanco
 */

import balloonsAndStaticElectricity from '../balloonsAndStaticElectricity.js';

const BASEQueryParameters = QueryStringMachine.getAll( {

  // keyData - must be used with reader, shows key information instead of reader output, useful for debugging
  keyData: { type: 'flag' },

  // showGrid - show the description grid, the grid that breaks up the play area into regions for position descriptions
  showGrid: { type: 'flag' },

  // hide the radio button group responsible for toggling visibility of charges in the view
  hideChargeControls: { type: 'flag' },

  // hide the scene selection button that adds a second balloon the to the play area
  hideBalloonSwitch: { type: 'flag' },

  // show charged area on sweater
  showSweaterChargedArea: { type: 'flag' },

  // debugging - show positions of center of balloon and center of balloon charges
  showBalloonChargeCenter: { type: 'flag' }
} );

balloonsAndStaticElectricity.register( 'BASEQueryParameters', BASEQueryParameters );

export default BASEQueryParameters;