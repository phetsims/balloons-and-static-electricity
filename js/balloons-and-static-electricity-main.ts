// Copyright 2013-2022, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Screen from '../../joist/js/Screen.js';
import Sim from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import Tandem from '../../tandem/js/Tandem.js';
import BASEConstants from './balloons-and-static-electricity/BASEConstants.js';
import BASEModel from './balloons-and-static-electricity/model/BASEModel.js';
import BASEKeyboardHelpContent from './balloons-and-static-electricity/view/BASEKeyboardHelpContent.js';
import BASEView from './balloons-and-static-electricity/view/BASEView.js';
import BalloonsAndStaticElectricityStrings from './BalloonsAndStaticElectricityStrings.js';

// constants
const balloonsAndStaticElectricityTitleStringProperty = BalloonsAndStaticElectricityStrings[ 'balloons-and-static-electricity' ].titleStringProperty;

simLauncher.launch( () => {

  const tandem = Tandem.ROOT;

  const simOptions = {
    credits: {
      leadDesign: 'Noah Podolefsky & Sam Reid',
      softwareDevelopment: 'Sam Reid, John Blanco',
      team: 'Wendy Adams, Jesse Greenberg, Trish Loeblein, Emily B. Moore, Ariel Paul,<br>Kathy Perkins, Taliesin Smith',
      qualityAssurance: 'Logan Bray, Steele Dalton, Bryce Griebenow, Ethan Johnson,<br>' +
                        'Emily Miller, Elise Morgan, Liam Mulhall, Oliver Orejola, Benjamin Roberts, Jacob Romero,<br>' +
                        'Nancy Salpepi, Kathryn Woessner, Bryan Yoelin',
      graphicArts: 'Sharon Siman-Tov',
      soundDesign: 'Ashton Morris',
      thanks: 'Thanks to Mobile Learner Labs for working with the PhET development team to convert this simulation to HTML5.'
    }
  };

  const balloonsAndStaticElectricityScreenTandem = tandem.createTandem( 'balloonsAndStaticElectricityScreen' );

  //Create and start the sim
  new Sim( balloonsAndStaticElectricityTitleStringProperty, [
    new Screen(
      () => new BASEModel(
        768,
        504,
        balloonsAndStaticElectricityScreenTandem.createTandem( 'model' ) ),
      model => new BASEView(
        model,
        balloonsAndStaticElectricityScreenTandem.createTandem( 'view' )
      ),
      {
        backgroundColorProperty: BASEConstants.backgroundColorProperty,
        tandem: balloonsAndStaticElectricityScreenTandem,
        createKeyboardHelpNode: () => new BASEKeyboardHelpContent()
      }
    )
  ], simOptions ).start();
} );