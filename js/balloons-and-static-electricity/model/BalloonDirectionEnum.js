// Copyright 2016, University of Colorado Boulder

/**
 * Possible locations of the balloon in Balloons and Static Electricity.  In addition, there are more values that
 * signify when the balloon is along a certain object or edge of the play area.
 *
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );

  var BalloonDirectionEnum = {
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
    UP: 'UP',
    DOWN: 'DOWN'

  };

  // verify that enum is immutable, without the runtime penalty in production code
  if ( assert ) { Object.freeze( BalloonDirectionEnum ); }

  balloonsAndStaticElectricity.register( 'BalloonDirectionEnum', BalloonDirectionEnum );

  return BalloonDirectionEnum;
} );
