// Copyright 2016-2025, University of Colorado Boulder

/**
 * Possible directions for the balloon in Balloons and Static Electricity, balloon can move up, down, left, right,
 * and along the diagonals of these orientations.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import balloonsAndStaticElectricity from '../../balloonsAndStaticElectricity.js';

const BalloonDirectionEnum = {
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
   */
  isRelativeDirection( direction: string ): boolean {
    return direction === BalloonDirectionEnum.LEFT ||
           direction === BalloonDirectionEnum.RIGHT ||
           direction === BalloonDirectionEnum.UP ||
           direction === BalloonDirectionEnum.DOWN;
  }
} as const;

// verify that enum is immutable, without the runtime penalty in production code
if ( assert ) { Object.freeze( BalloonDirectionEnum ); }

balloonsAndStaticElectricity.register( 'BalloonDirectionEnum', BalloonDirectionEnum );

export default BalloonDirectionEnum;