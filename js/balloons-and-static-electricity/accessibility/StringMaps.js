// Copyright 2016, University of Colorado Boulder

/**
 *
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );

  // strings
  // TODO: bring in from translatable strings file once we are happy with results

  // strings for direction map
  var upString = 'up';
  var downString = 'down';
  var rightString = 'right';
  var leftString = 'left';
  var upAndRightString = 'up and to the right';
  var upAndLeftString = 'up and to the left';
  var downAndRightString = 'down and to the right';
  var downAndLeftString = 'down and to the left';

  var StringMaps = {

    DIRECTION_MAP: {
      UP: upString,
      DOWN: downString,
      LEFT: leftString,
      RIGHT: rightString,
      UP_RIGHT: upAndRightString,
      UP_LEFT: upAndLeftString,
      DOWN_RIGHT: downAndRightString,
      DOWN_LEFT: downAndLeftString
    }
  };

  balloonsAndStaticElectricity.register( 'StringMaps', StringMaps );

  return StringMaps;
} );