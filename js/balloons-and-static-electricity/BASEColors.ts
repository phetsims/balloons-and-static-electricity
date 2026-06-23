// Copyright 2026, University of Colorado Boulder

/**
 * Defines the colors for this sim.
 *
 * All simulations should have a Colors.js file, see https://github.com/phetsims/scenery-phet/issues/642.
 *
 * For dynamic colors that can be controlled via colorProfileProperty.js, add instances of ProfileColorProperty here,
 * each of which is required to have a default color. Note that dynamic colors can be edited by running the sim from
 * phetmarks using the "Color Editor" mode.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import ProfileColorProperty from '../../../scenery/js/util/ProfileColorProperty.js';
import balloonsAndStaticElectricity from '../balloonsAndStaticElectricity.js';

const BASEColors = {

  // Background color for the screen.
  backgroundColorProperty: new ProfileColorProperty( balloonsAndStaticElectricity, 'background', {
    default: '#97d0ff'
  } ),

  controlButtonBaseColorProperty: new ProfileColorProperty( balloonsAndStaticElectricity, 'controlButtonBaseColor', {
    default: 'rgb( 255, 200, 0 )'
  } )
};

export default BASEColors;
