// Copyright 2013-2020, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Screen from '../../joist/js/Screen.js';
import Sim from '../../joist/js/Sim.js';
import SimLauncher from '../../joist/js/SimLauncher.js';
import Tandem from '../../tandem/js/Tandem.js';
import vibrationManager from '../../tappi/js/vibrationManager.js';
import balloonsAndStaticElectricityStrings from './balloons-and-static-electricity-strings.js';
import BASEConstants from './balloons-and-static-electricity/BASEConstants.js';
import BASEModel from './balloons-and-static-electricity/model/BASEModel.js';
import BASEKeyboardHelpContent from './balloons-and-static-electricity/view/BASEKeyboardHelpContent.js';
import BASEView from './balloons-and-static-electricity/view/BASEView.js';

const balloonsAndStaticElectricityTitleString = balloonsAndStaticElectricityStrings[ 'balloons-and-static-electricity' ].title;

SimLauncher.launch( function() {

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
    accessibility: true,
    keyboardHelpNode: new BASEKeyboardHelpContent(),

    // prototype vibration in this sim - eventually, Sim may just create this
    vibrationManager: vibrationManager
  };

  const balloonsAndStaticElectricityScreenTandem = tandem.createTandem( 'balloonsAndStaticElectricityScreen' );

  //Create and start the sim
  new Sim( balloonsAndStaticElectricityTitleString, [
    new Screen(
      function() {
        return new BASEModel(
          768,
          504,
          balloonsAndStaticElectricityScreenTandem.createTandem( 'balloonsAndStaticElectricityModel' ) );
      },
      function( model ) {
        return new BASEView(
          model,
          balloonsAndStaticElectricityScreenTandem.createTandem( 'balloonsAndStaticElectricityView' )
        );
      },
      {
        backgroundColorProperty: BASEConstants.backgroundColorProperty,
        tandem: balloonsAndStaticElectricityScreenTandem
      }
    )
  ], simOptions ).start();
} );