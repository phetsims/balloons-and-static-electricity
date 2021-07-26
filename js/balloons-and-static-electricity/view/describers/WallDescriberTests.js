// Copyright 2018-2021, University of Colorado Boulder

/**
 * Tests for screen summary descriptions for balloons-and-static-electricity. These descriptions are invisible, but
 * available for screen reader users.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Vector2 from '../../../../../dot/js/Vector2.js';
import PlayAreaMap from '../../model/PlayAreaMap.js';
import WallDescriber from './WallDescriber.js';

QUnit.module( 'WallDescriber', {
  beforeEach: () => {
    window.baseModel.reset();
  }
} );

QUnit.test( 'WallDescriber tests', assert => {
  window.baseModel.reset();

  const wallNode = window.baseView.wallNode;

  // on page load
  let actualDescription = wallNode.descriptionContent;
  let expectedDescription = 'At right edge of Play Area. Has zero net charge, many pairs of negative and positive charges.';
  assert.equal( actualDescription, expectedDescription );

  // yellow balloon neutral at wall, all charges shown
  window.baseModel.yellowBalloon.setCenter( new Vector2( PlayAreaMap.X_POSITIONS.AT_WALL, PlayAreaMap.Y_BOUNDARY_POSITIONS.AT_TOP ) );
  actualDescription = wallNode.descriptionContent;
  expectedDescription = 'At right edge of Play Area. Has zero net charge, many pairs of negative and positive charges.';
  assert.equal( actualDescription, expectedDescription );

  // yellow balloon inducing charge in upper wall, all charges shown
  window.baseModel.yellowBalloon.chargeProperty.set( -10 );
  window.baseModel.yellowBalloon.setCenter( new Vector2( PlayAreaMap.X_POSITIONS.AT_WALL, PlayAreaMap.Y_BOUNDARY_POSITIONS.AT_TOP + 1 ) );
  WallDescriber.getWallChargeDescription( window.baseModel.yellowBalloon, window.baseModel.greenBalloon, window.baseModel.balloonsAdjacentProperty.get(), window.baseModel.wall.isVisibleProperty.get(), 'all' );
  actualDescription = wallNode.descriptionContent;
  expectedDescription = 'At right edge of Play Area. Has zero net charge, many pairs of negative and positive charges. ' +
                        'Negative charges in upper wall move away from Yellow Balloon a little bit. Positive charges do not move.';
  assert.equal( actualDescription, expectedDescription );


  // both balloons inducing a charge in upper wall
  window.baseModel.greenBalloon.chargeProperty.set( -10 );
  window.baseModel.greenBalloon.isVisibleProperty.set( true );
  window.baseModel.greenBalloon.setCenter( window.baseModel.yellowBalloon.getCenter() );
  actualDescription = wallNode.descriptionContent;
  expectedDescription = 'At right edge of Play Area. Has zero net charge, many pairs of negative and positive charges. ' +
                        'Negative charges in upper wall move away from balloons a little bit. Positive charges do not move.';
  assert.equal( actualDescription, expectedDescription );

  // both balloons inducing charge in upper wall, no charges shown
  window.baseModel.showChargesProperty.set( 'none' );
  actualDescription = wallNode.descriptionContent;
  expectedDescription = 'At right edge of Play Area.';
  assert.equal( actualDescription, expectedDescription );

  // both balloons inducing charge in upper wall, charge differences shown
  window.baseModel.showChargesProperty.set( 'diff' );
  actualDescription = wallNode.descriptionContent;
  expectedDescription = 'At right edge of Play Area. Has zero net charge, showing no charges.';
  assert.equal( actualDescription, expectedDescription );
} );