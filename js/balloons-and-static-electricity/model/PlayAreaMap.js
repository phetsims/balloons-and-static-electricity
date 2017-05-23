// Copyright 2017, University of Colorado Boulder

/**
 * A map of the 2D play area for this simulation.  The play area includes anywhere that the Balloons can move about, so it
 * contains the entire bounds of the model.  This map is used for accessibility to generate descriptions about where
 * the balloons are as they move about the play area.
 * 
 * @author Jesse Greenberg
 */

define( function( require ) {
  'use strict';

  // modules
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );
  var Range = require( 'DOT/Range' );

  // constants
  // critical x locations for the balloon (relative to the balloon's center)
  var X_LOCATIONS = {
    AT_LEFT_EDGE: 67,
    AT_NEAR_SWEATER: 393,
    AT_CENTER_PLAY_AREA: 507,
    AT_NEAR_WALL: 596,
    AT_WALL: 621,
    AT_RIGHT_EDGE: 710
  };

  // critical y locations for the balloon (relative to the balloon's center)
  var Y_LOCATIONS = {
    AT_TOP: 111,
    AT_BOTTOM: 393
  };

  // column ranges
  var COLUMN_RANGES = {
    LEFT_ARM: new Range( 0, 138 ),
    LEFT_SIDE_OF_SWEATER: new Range( 138, 203 ),
    RIGHT_SIDE_OF_SWEATER: new Range( 203, 270 ),
    RIGHT_ARM: new Range( 270, 335 ),
    LEFT_PLAY_AREA: new Range( 335, 467 ),
    CENTER_PLAY_AREA: new Range( 467, 544 ),
    RIGHT_PLAY_AREA: new Range( 544, 676 ),
    RIGHT_EDGE: new Range( 676, 768 )
  };

  var ROW_RANGES = {
    UPPER_PLAY_AREA: new Range( 0, 172 ),
    CENTER_PLAY_AREA: new Range( 172, 326 ),
    LOWER_PLAY_AREA: new Range( 326, 504 )
  };

  var PlayAreaMap = {
    X_LOCATIONS: X_LOCATIONS,
    Y_LOCATIONS: Y_LOCATIONS,

    COLUMN_RANGES: COLUMN_RANGES,
    ROW_RANGES: ROW_RANGES,

    WIDTH: 768,
    HEIGHT: 504
  };

  balloonsAndStaticElectricity.register( 'PlayAreaMap', PlayAreaMap );

  return PlayAreaMap;
} );
