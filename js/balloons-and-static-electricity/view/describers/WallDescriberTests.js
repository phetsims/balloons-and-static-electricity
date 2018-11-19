// Copyright 2018, University of Colorado Boulder

/**
 * Tests for screen summary descriptions for balloons-and-static-electricity. These descriptions are invisible, but
 * available for screen reader users.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var BASEModel = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/BASEModel' );
  var BASEView = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/BASEView' );
  var PlayAreaMap = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/PlayAreaMap' );
  var Tandem = require( 'TANDEM/Tandem' );
  var Vector2 = require( 'DOT/Vector2' );
  var WallDescriber = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/describers/WallDescriber' );
  var WallNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/WallNode' );

  QUnit.module( 'WallDescriberTests' );

  // create model and view for testing
  var model = new BASEModel( 768, 504, new Tandem() );
  var view = new BASEView( model, new Tandem() );

  QUnit.test( 'WallDescriber tests', function( assert ) {

    // create a view
    var wallNode = new WallNode( model, view.layoutBounds, new Tandem() );

    // on page load
    var actualDescription = wallNode.descriptionContent;
    var expectedDescription = 'At right edge of Play Area. Has zero net charge, many pairs of negative and positive charges.';
    assert.equal( actualDescription, expectedDescription );

    // yellow balloon neutral at wall, all charges shown
    model.yellowBalloon.setCenter( new Vector2( PlayAreaMap.X_LOCATIONS.AT_WALL, PlayAreaMap.X_BOUNDARY_LOCATIONS.AT_TOP ) );
    actualDescription = wallNode.descriptionContent;
    expectedDescription = 'At right edge of Play Area. Has zero net charge, many pairs of negative and positive charges.';
    assert.equal( actualDescription, expectedDescription );

    // yellow balloon inducing charge in upper wall, all charges shown
    model.yellowBalloon.chargeProperty.set( -10 );
    model.yellowBalloon.setCenter( new Vector2( PlayAreaMap.X_LOCATIONS.AT_WALL, PlayAreaMap.Y_BOUNDARY_LOCATIONS.AT_TOP + 1 ) );
    WallDescriber.getWallChargeDescription( model.yellowBalloon, model.greenBalloon, model.balloonsAdjacentProperty.get(), model.wall.isVisibleProperty.get(), 'all' );
    actualDescription = wallNode.descriptionContent;
    expectedDescription = 'At right edge of Play Area. Has zero net charge, many pairs of negative and positive charges. '  +
                          'Negative charges in upper wall move away from Yellow Balloon a little bit. Positive charges do not move.';
    assert.equal( actualDescription, expectedDescription );


    // both balloons inducing a charge in upper wall
    model.greenBalloon.chargeProperty.set( -10 );
    model.greenBalloon.isVisibleProperty.set( true );
    model.greenBalloon.setCenter( model.yellowBalloon.getCenter() );
    actualDescription = wallNode.descriptionContent;
    expectedDescription = 'At right edge of Play Area. Has zero net charge, many pairs of negative and positive charges. '  +
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
} );