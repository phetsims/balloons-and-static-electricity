// Copyright 2017, University of Colorado Boulder

/**
 * Unit tests for balloons-and-static-electricity.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  require( 'SCENERY/util/Trail' ); // TODO: Trail not added to scenery namespace for these tests??
  require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/SceneSummaryNodeTests' );
  require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/describers/WallDescriberTests' );
  require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/describers/SweaterDescriberTests' );
  require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/describers/BalloonDescriberTests' );

  // Since our tests are loaded asynchronously, we must direct QUnit to begin the tests
  QUnit.start();
} );