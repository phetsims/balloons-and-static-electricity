// Copyright 2018-2024, University of Colorado Boulder

/**
 * Unit tests for balloons-and-static-electricity.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import qunitStart from '../../chipper/js/browser/sim-tests/qunitStart.js';
import '../../scenery/js/util/Trail.js'; // Why is Trail not added to scenery namespace for these tests??
import './balloons-and-static-electricity/view/BASESummaryNodeTests.js';
import './balloons-and-static-electricity/view/describers/BalloonDescriberTests.js';
import './balloons-and-static-electricity/view/describers/SweaterDescriberTests.js';
import './balloons-and-static-electricity/view/describers/WallDescriberTests.js';

const iframe = document.createElement( 'iframe' );
iframe.id = 'testFrame';

/**
 * @param event
 * @param resolve - resolve function for the Promise this is passed to
 */
const loadListener = ( event: MessageEvent<string>, resolve: () => void ) => {
  if ( !event ) {
    return;
  }
  const data = JSON.parse( event.data );

  if ( data.type === 'load' ) {
    // @ts-expect-error
    window.removeEventListener( 'message', loadListener );
    // @ts-expect-error
    window.baseModel = iframe.contentWindow.phet.joist.sim.screens[ 0 ].model;
    // @ts-expect-error
    window.baseView = iframe.contentWindow.phet.joist.sim.screens[ 0 ].view;

    // no animation or input for tests, all Properties are controlled directly through access to the model
    // @ts-expect-error
    iframe.contentWindow.phet.joist.sim.activeProperty.set( false );

    resolve();
  }
};

iframe.src = '../balloons-and-static-electricity/balloons-and-static-electricity_en.html?brand=phet&ea&postMessageOnLoad';

qunitStart();

// load the sim to test on the begin event, returning a Promise so that we wait to begin any tests until we
// receive the 'load' message from the sim, indicating that model and view are fully constructed and usable in tests
QUnit.begin( () => {
  return new Promise( ( resolve, reject ) => {
    window.addEventListener( 'message', event => {
      loadListener( event, resolve );
    } );

    document.body.appendChild( iframe ); // triggers loading of the sim
  } );
} );

QUnit.done( () => {
  // @ts-expect-error
  delete window.baseModel;
  // @ts-expect-error
  delete window.baseView;

  // @ts-expect-error
  document.body.removeChild( document.getElementById( iframe.id ) );
} );