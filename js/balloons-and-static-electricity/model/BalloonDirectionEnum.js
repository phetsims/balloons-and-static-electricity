// Copyright 2016-2019, University of Colorado Boulder

/**
 * Possible directions for the balloon in Balloons and Static Electricity, balloon can move up, down, left, right,
 * and along the diagonals of these orientations.
 *
 * @author Jesse Greenberg
 */
define( require => {
  'use strict';

  // modules
  const balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );

  var BalloonDirectionEnum = {
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
    UP: 'UP',
    DOWN: 'DOWN',
    UP_LEFT: 'UP_LEFT',
    UP_RIGHT: 'UP_RIGHT',
    DOWN_LEFT: 'DOWN_LEFT',
    DOWN_RIGHT: 'DOWN_RIGHT',

    /**
     * Returns true if direction is one of the primary relative directions "up", "down", "left", "right".
     *
     * @param {string} direction - one of BalloonDirectionEnum
     * @returns {Boolean}
     */
    isRelativeDirection: function( direction ) {
      return direction === BalloonDirectionEnum.LEFT ||
             direction === BalloonDirectionEnum.RIGHT ||
             direction === BalloonDirectionEnum.UP ||
             direction === BalloonDirectionEnum.DOWN;
    }    
  };

  // verify that enum is immutable, without the runtime penalty in production code
  if ( assert ) { Object.freeze( BalloonDirectionEnum ); }

  balloonsAndStaticElectricity.register( 'BalloonDirectionEnum', BalloonDirectionEnum );

  return BalloonDirectionEnum;
} );
