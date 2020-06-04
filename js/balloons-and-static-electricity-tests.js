// Copyright 2018-2020, University of Colorado Boulder

/**
 * Unit tests for balloons-and-static-electricity.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import qunitStart from '../../chipper/js/sim-tests/qunitStart.js';
import '../../scenery/js/util/Trail.js'; // Why is Trail not added to scenery namespace for these tests??
import './balloons-and-static-electricity/view/BASESummaryNodeTests.js';
import './balloons-and-static-electricity/view/describers/BalloonDescriberTests.js';
import './balloons-and-static-electricity/view/describers/SweaterDescriberTests.js';
import './balloons-and-static-electricity/view/describers/WallDescriberTests.js';

const iframe = document.createElement( 'iframe' );
iframe.id = 'testFrame';

const loadListener = event => {
  if ( !event ) {
    return;
  }
  const data = JSON.parse( event.data );

  if ( data.type === 'load' ) {
    window.removeEventListener( 'message', loadListener );
    window.baseModel = iframe.contentWindow.phet.joist.sim.screens[ 0 ].model;
    window.baseView = iframe.contentWindow.phet.joist.sim.screens[ 0 ].view;

    qunitStart();
  }
};

window.addEventListener( 'message', loadListener );

iframe.src = '../balloons-and-static-electricity/balloons-and-static-electricity_en.html?brand=phet&ea&postMessageOnLoad';
document.body.appendChild( iframe ); // triggers loading of the sim

QUnit.done( () => {
  delete window.baseModel;
  delete window.baseView;

  document.body.removeChild( document.getElementById( iframe.id ) );
} );