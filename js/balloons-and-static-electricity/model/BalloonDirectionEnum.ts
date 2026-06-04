// Copyright 2016-2026, University of Colorado Boulder

/**
 * Possible directions for the balloon in Balloons and Static Electricity, balloon can move up, down, left, right,
 * and along the diagonals of these orientations.
 *
 * TODO: This file should be deleted and this repo should use DirectionEnum from scenery-phet instead, see https://github.com/phetsims/balloons-and-static-electricity/issues/601.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

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

export default BalloonDirectionEnum;
