// Copyright 2025-2026, University of Colorado Boulder

/**
 * Type definitions for PlayAreaMap regions to avoid repetition across files.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import DirectionEnum from '../../../../scenery-phet/js/accessibility/describers/DirectionEnum.js';

// Column type for play area regions
export type PlayAreaColumn = 'LEFT_ARM' | 'LEFT_SIDE_OF_SWEATER' | 'RIGHT_SIDE_OF_SWEATER' | 'RIGHT_ARM' | 'LEFT_PLAY_AREA' | 'CENTER_PLAY_AREA' | 'RIGHT_PLAY_AREA' | 'RIGHT_EDGE';

// Row type for play area regions  
export type PlayAreaRow = 'UPPER_PLAY_AREA' | 'CENTER_PLAY_AREA' | 'LOWER_PLAY_AREA';

// Direction type for balloon movement - includes all cardinal and diagonal directions
export type BalloonDirection = 'LEFT' | 'RIGHT' | 'UP' | 'DOWN' | 'UP_LEFT' | 'UP_RIGHT' | 'DOWN_LEFT' | 'DOWN_RIGHT';

type SharedDirectionEnum = typeof DirectionEnum & {
  isRelativeDirection: ( direction: object ) => boolean;
};

const sharedDirectionEnum = DirectionEnum as SharedDirectionEnum;

export const BALLOON_DIRECTION_VALUES = Object.fromEntries(
  sharedDirectionEnum.keys.map( direction => [ direction, direction ] )
) as Record<BalloonDirection, BalloonDirection>;

export const isRelativeBalloonDirection = ( direction: BalloonDirection ): boolean => {
  return sharedDirectionEnum.isRelativeDirection( sharedDirectionEnum.getValue( direction ) );
};
