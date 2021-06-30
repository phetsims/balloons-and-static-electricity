// Copyright 2013-2021, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import PreferencesConfiguration from '../../joist/js/preferences/PreferencesConfiguration.js';
import Screen from '../../joist/js/Screen.js';
import Sim from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import Tandem from '../../tandem/js/Tandem.js';
import BASEConstants from './balloons-and-static-electricity/BASEConstants.js';
import BASEModel from './balloons-and-static-electricity/model/BASEModel.js';
import BASEKeyboardHelpContent from './balloons-and-static-electricity/view/BASEKeyboardHelpContent.js';
import BASEView from './balloons-and-static-electricity/view/BASEView.js';
import balloonsAndStaticElectricityStrings from './balloonsAndStaticElectricityStrings.js';

// constants
const balloonsAndStaticElectricityTitleString = balloonsAndStaticElectricityStrings[ 'balloons-and-static-electricity' ].title;

simLauncher.launch( () => {

  const tandem = Tandem.ROOT;

  const simOptions = {
    credits: {
      leadDesign: 'Noah Podolefsky & Sam Reid',
      softwareDevelopment: 'Sam Reid, John Blanco',
      team: 'Wendy Adams, Jesse Greenberg, Trish Loeblein, Emily B. Moore, Ariel Paul,<br>Kathy Perkins, Taliesin Smith',
      qualityAssurance: 'Steele Dalton, Bryce Griebenow, Ethan Johnson, Elise Morgan,<br>Liam Mulhall, Oliver Orejola, ' +
                        'Benjamin Roberts, Jacob Romero, Bryan Yoelin',
      graphicArts: 'Sharon Siman-Tov',
      thanks: 'Thanks to Mobile Learner Labs for working with the PhET development team to convert this simulation to HTML5.'
    },
    hasKeyboardHelpContent: true,

    // preferences with defaults specified in package.json
    preferencesConfiguration: new PreferencesConfiguration()
  };

  const balloonsAndStaticElectricityScreenTandem = tandem.createTandem( 'balloonsAndStaticElectricityScreen' );

  //Create and start the sim
  new Sim( balloonsAndStaticElectricityTitleString, [
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
        keyboardHelpNode: new BASEKeyboardHelpContent()
      }
    )
  ], simOptions ).start();
} );