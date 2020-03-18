// Copyright 2018-2020, University of Colorado Boulder

/**
 * Tests for screen summary descriptions for balloons-and-static-electricity. These descriptions are invisible, but
 * available for screen reader users.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Vector2 from '../../../../../dot/js/Vector2.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import UtteranceQueue from '../../../../../utterance-queue/js/UtteranceQueue.js';
import BASEModel from '../../model/BASEModel.js';
import PlayAreaMap from '../../model/PlayAreaMap.js';
import BASEView from '../BASEView.js';
import WallNode from '../WallNode.js';
import WallDescriber from './WallDescriber.js';

QUnit.module( 'WallDescriber', {
  before: () => {

    // WallDescriber uses many calls to utteranceQueue. This is to support testing
    phet.joist = phet.joist || {};
    phet.joist.sim = phet.joist.sim || {};
    phet.joist.sim.utteranceQueue = new UtteranceQueue( true );
    phet.joist.sim.supportsGestureDescription = false;
  },
  after: () => {
    delete phet.joist.sim.utteranceQueue;
    delete phet.joist.sim.supportsGestureDescription;
  }
} );

QUnit.test( 'WallDescriber tests', function( assert ) {

  // create model and view for testing
  const model = new BASEModel( 768, 504, Tandem.ROOT.createTandem( 'model' ) );
  const view = new BASEView( model, Tandem.ROOT.createTandem( 'view' ) );

  // create a view
  const wallNode = new WallNode( model, view.layoutBounds, Tandem.ROOT.createTandem( 'wallNode' ) );

  // on page load
  let actualDescription = wallNode.descriptionContent;
  let expectedDescription = 'At right edge of Play Area. Has zero net charge, many pairs of negative and positive charges.';
  assert.equal( actualDescription, expectedDescription );

  // yellow balloon neutral at wall, all charges shown
  model.yellowBalloon.setCenter( new Vector2( PlayAreaMap.X_POSITIONS.AT_WALL, PlayAreaMap.Y_BOUNDARY_POSITIONS.AT_TOP ) );
  actualDescription = wallNode.descriptionContent;
  expectedDescription = 'At right edge of Play Area. Has zero net charge, many pairs of negative and positive charges.';
  assert.equal( actualDescription, expectedDescription );

  // yellow balloon inducing charge in upper wall, all charges shown
  model.yellowBalloon.chargeProperty.set( -10 );
  model.yellowBalloon.setCenter( new Vector2( PlayAreaMap.X_POSITIONS.AT_WALL, PlayAreaMap.Y_BOUNDARY_POSITIONS.AT_TOP + 1 ) );
  WallDescriber.getWallChargeDescription( model.yellowBalloon, model.greenBalloon, model.balloonsAdjacentProperty.get(), model.wall.isVisibleProperty.get(), 'all' );
  actualDescription = wallNode.descriptionContent;
  expectedDescription = 'At right edge of Play Area. Has zero net charge, many pairs of negative and positive charges. ' +
                        'Negative charges in upper wall move away from Yellow Balloon a little bit. Positive charges do not move.';
  assert.equal( actualDescription, expectedDescription );


  // both balloons inducing a charge in upper wall
  model.greenBalloon.chargeProperty.set( -10 );
  model.greenBalloon.isVisibleProperty.set( true );
  model.greenBalloon.setCenter( model.yellowBalloon.getCenter() );
  actualDescription = wallNode.descriptionContent;
  expectedDescription = 'At right edge of Play Area. Has zero net charge, many pairs of negative and positive charges. ' +
                        'Negative charges in upper wall move away from balloons a lot. Positive charges do not move.';
  assert.equal( actualDescription, expectedDescription );

  // both balloons inducing charge in upper wall, no charges shown
  model.showChargesProperty.set( 'none' );
  actualDescription = wallNode.descriptionContent;
  expectedDescription = 'At right edge of Play Area.';
  assert.equal( actualDescription, expectedDescription );

  // both balloons inducing charge in upper wall, charge differences shown
  model.showChargesProperty.set( 'diff' );
  actualDescription = wallNode.descriptionContent;
  expectedDescription = 'At right edge of Play Area. Has zero net charge, showing no charges.';
  assert.equal( actualDescription, expectedDescription );
} );