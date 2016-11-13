// Copyright 2016, University of Colorado Boulder

/**
 * Enumerable for possible balloon colors.  Useful so we can designate a balloon in the model without
 * using a translatable label to declare a balloon as 'Green' ore 'Yellow'.
 *
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );

  var BalloonColorsEnum = {
    YELLOW: 'YELLOW',
    GREEN: 'GREEN'
  };

  // verify that enum is immutable, without the runtime penalty in production code
  if ( assert ) { Object.freeze( BalloonColorsEnum ); }

  balloonsAndStaticElectricity.register( 'BalloonColorsEnum', BalloonColorsEnum );

  return BalloonColorsEnum;
} );