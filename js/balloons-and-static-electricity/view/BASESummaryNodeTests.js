// Copyright 2018-2020, University of Colorado Boulder

/**
 * Tests for summary descriptions for balloons-and-static-electricity. These descriptions are invisible, but
 * available for screen reader users.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import UtteranceQueue from '../../../../utterance-queue/js/UtteranceQueue.js';
import BASEModel from '../model/BASEModel.js';
import PlayAreaMap from '../model/PlayAreaMap.js';
import BASESummaryNode from './BASESummaryNode.js';
import BASEView from './BASEView.js';
import WallNode from './WallNode.js';

QUnit.module( 'BASESummaryNode', {
  before: () => {

    // BASESummaryNode uses many calls to utteranceQueue. This is to support testing
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

QUnit.test( 'Summary tests', function( assert ) {

  // Move these to once everything has been imported and constructed
  // create model and view for testing
  const model = new BASEModel( 768, 504, Tandem.ROOT.createTandem( 'model' ) );
  const view = new BASEView( model, Tandem.ROOT.createTandem( 'view' ) );

  // create a wallNode for testing
  const wallNode = new WallNode( model, view.layoutBounds, Tandem.ROOT.createTandem( 'wallNode' ) );


  const summaryNode = new BASESummaryNode( model, view.yellowBalloonNode, view.greenBalloonNode, wallNode, Tandem.ROOT.createTandem( 'summaryNode' ) );

  // verify first item in summary, description of items in the room
  model.reset();

  // on load, yellow balloon, sweater, and removable wall
  let expectedFirstItem = 'Currently, room has a yellow balloon, a sweater, and a removable wall.';
  let actualFirstItem = BASESummaryNode.getVisibleObjectsDescription( model.greenBalloon.isVisibleProperty.get(), model.wall.isVisibleProperty.get() );
  assert.equal( actualFirstItem, expectedFirstItem, 'first summary item incorrect on load' );

  // yellow balloon and sweater
  model.wall.isVisibleProperty.set( false );
  expectedFirstItem = 'Currently, room has a yellow balloon, and a sweater.';
  actualFirstItem = BASESummaryNode.getVisibleObjectsDescription( model.greenBalloon.isVisibleProperty.get(), model.wall.isVisibleProperty.get() );
  assert.equal( actualFirstItem, expectedFirstItem );

  // everything visible
  model.wall.isVisibleProperty.set( true );
  model.greenBalloon.isVisibleProperty.set( true );
  expectedFirstItem = 'Currently, room has a yellow balloon, a green balloon, a sweater, and a removable wall.';
  actualFirstItem = BASESummaryNode.getVisibleObjectsDescription( model.greenBalloon.isVisibleProperty.get(), model.wall.isVisibleProperty.get() );
  assert.equal( actualFirstItem, expectedFirstItem );

  // yellow balloon, green balloon, and sweater
  model.wall.isVisibleProperty.set( false );
  expectedFirstItem = 'Currently, room has a yellow balloon, a green balloon, and a sweater.';
  actualFirstItem = BASESummaryNode.getVisibleObjectsDescription( model.greenBalloon.isVisibleProperty.get(), model.wall.isVisibleProperty.get() );
  assert.equal( actualFirstItem, expectedFirstItem );

  // second item in summary, balloon charge information
  model.reset();

  // on load
  let expectedSecondItem = 'Yellow Balloon has zero net charge, a few pairs of negative and positive charges.';
  let actualSecondItem = summaryNode.getBalloonChargeDescription();
  assert.equal( actualSecondItem, expectedSecondItem );

  // when both balloons are visible
  model.greenBalloon.isVisibleProperty.set( true );
  expectedSecondItem = 'Each balloon has zero net charge, a few pairs of negative and positive charges.';
  actualSecondItem = summaryNode.getBalloonChargeDescription();
  assert.equal( actualSecondItem, expectedSecondItem );

  // when both balloons visible, showing charge differences, charge difference shown
  model.showChargesProperty.set( 'diff' );
  expectedSecondItem = 'Each balloon has zero net charge, showing no charges.';
  actualSecondItem = summaryNode.getBalloonChargeDescription();
  assert.equal( actualSecondItem, expectedSecondItem );

  // when both balloons visible, showing charge differences, all charges showns
  model.greenBalloon.isVisibleProperty.set( false );
  expectedSecondItem = 'Yellow Balloon has zero net charge, showing no charges.';
  actualSecondItem = summaryNode.getBalloonChargeDescription();
  assert.equal( actualSecondItem, expectedSecondItem );

  // each balloon present, and they have similar amounts of charge
  model.showChargesProperty.set( 'all' );
  model.greenBalloon.isVisibleProperty.set( true );
  model.yellowBalloon.chargeProperty.set( -5 );
  model.greenBalloon.chargeProperty.set( -5 );

  expectedSecondItem = 'Each balloon has negative net charge, a few more negative charges than positive charges.';
  actualSecondItem = summaryNode.getBalloonChargeDescription();
  assert.equal( actualSecondItem, expectedSecondItem );

  model.showChargesProperty.set( 'diff' );
  expectedSecondItem = 'Each balloon has negative net charge, showing a few negative charges.';
  actualSecondItem = summaryNode.getBalloonChargeDescription();
  assert.equal( actualSecondItem, expectedSecondItem );

  // each balloon visible, with different amounts of charge
  model.showChargesProperty.set( 'all' );
  model.yellowBalloon.chargeProperty.set( -30 );
  model.greenBalloon.chargeProperty.set( -0 );
  expectedSecondItem = 'Yellow Balloon has negative net charge, several more negative charges than positive charges. ' +
                       'Green Balloon has zero net charge, a few pairs of negative and positive charges.';
  actualSecondItem = summaryNode.getBalloonChargeDescription();
  assert.equal( actualSecondItem, expectedSecondItem );

  // verify third item in summary, with sweater and wall charge informations
  model.reset();

  // on load
  let expectedThirdItem = 'Sweater and wall have zero net charge, each has many pairs of negative and positive charges.';
  let actualThirdItem = summaryNode.getSweaterAndWallChargeDescription();
  assert.equal( actualThirdItem, expectedThirdItem );

  // when wall is invisible
  model.wall.isVisibleProperty.set( false );
  expectedThirdItem = 'Sweater has zero net charge, many pairs of negative and positive charges.';
  actualThirdItem = summaryNode.getSweaterAndWallChargeDescription();
  assert.equal( actualThirdItem, expectedThirdItem );

  // when showing charge differences
  model.showChargesProperty.set( 'diff' );
  expectedThirdItem = 'Sweater has zero net charge, showing no charges.';
  actualThirdItem = summaryNode.getSweaterAndWallChargeDescription();
  assert.equal( actualThirdItem, expectedThirdItem );

  // when the sweater has charge
  model.showChargesProperty.set( 'all' );
  model.wall.isVisibleProperty.set( true );
  model.sweater.chargeProperty.set( 30 );
  expectedThirdItem = 'Sweater has positive net charge, several more positive charges than negative charges. ' +
                      'Wall has zero net charge, many pairs of negative and positive charges.';
  actualThirdItem = summaryNode.getSweaterAndWallChargeDescription();
  assert.equal( actualThirdItem, expectedThirdItem );

  // sweater has charge, while showing charge differences
  model.showChargesProperty.set( 'diff' );
  expectedThirdItem = 'Sweater has positive net charge, showing several positive charges. ' +
                      'Wall has zero net charge, showing no charges.';
  actualThirdItem = summaryNode.getSweaterAndWallChargeDescription();
  assert.equal( actualThirdItem, expectedThirdItem );

  // the last summary item, verify induced charge
  model.reset();
  model.yellowBalloon.chargeProperty.set( -20 );
  model.yellowBalloon.setCenter( new Vector2( PlayAreaMap.X_POSITIONS.AT_WALL, model.yellowBalloon.getCenter().y ) );
  let expectedFourthItem = 'Negative charges in wall move away from Yellow Balloon a lot. Positive charges do not move.';
  let actualFourthItem = summaryNode.getInducedChargeDescription();
  assert.equal( actualFourthItem, expectedFourthItem );

  // test both balloons when they are adjacent 
  model.yellowBalloon.chargeProperty.set( -10 );
  model.greenBalloon.chargeProperty.set( -10 );
  model.greenBalloon.isVisibleProperty.set( true );
  model.greenBalloon.setCenter( model.yellowBalloon.getCenter() );
  expectedFourthItem = 'Negative charges in wall move away from balloons a lot. Positive charges do not move.';
  actualFourthItem = summaryNode.getInducedChargeDescription();
  assert.equal( actualFourthItem, expectedFourthItem );

  // test both when balloons are not adjacent and have different charge
  model.yellowBalloon.chargeProperty.set( -10 );
  model.greenBalloon.chargeProperty.set( -20 );
  model.yellowBalloon.setCenter( new Vector2( model.yellowBalloon.getCenter().x, PlayAreaMap.Y_BOUNDARY_POSITIONS.AT_TOP ) );
  model.greenBalloon.setCenter( new Vector2( model.greenBalloon.getCenter().x, PlayAreaMap.Y_BOUNDARY_POSITIONS.AT_BOTTOM ) );
  expectedFourthItem = 'Negative charges in wall move away from Yellow Balloon a little bit, from Green Balloon a lot. Positive charges do not move.';
  actualFourthItem = summaryNode.getInducedChargeDescription();
  assert.equal( actualFourthItem, expectedFourthItem );
} );