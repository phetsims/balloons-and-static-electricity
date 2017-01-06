// Copyright 2016, University of Colorado Boulder

/**
 * Maps for strings to make it easy to find correct descriptions and labels
 * based on interaction or state.
 * 
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );
  var BASEA11yStrings = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/BASEA11yStrings' );

  var StringMaps = {
    DIRECTION_MAP: {
      UP: BASEA11yStrings.upString,
      DOWN: BASEA11yStrings.downString,
      LEFT: BASEA11yStrings.leftString,
      RIGHT: BASEA11yStrings.rightString,
      UP_RIGHT: BASEA11yStrings.upAndRightString,
      UP_LEFT: BASEA11yStrings.upAndLeftString,
      DOWN_RIGHT: BASEA11yStrings.downAndRightString,
      DOWN_LEFT: BASEA11yStrings.downAndLeftString
    }
  };

  balloonsAndStaticElectricity.register( 'StringMaps', StringMaps );

  return StringMaps;
} );