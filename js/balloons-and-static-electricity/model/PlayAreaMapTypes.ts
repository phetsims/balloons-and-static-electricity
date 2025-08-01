// Copyright 2025, University of Colorado Boulder

/**
 * Type definitions for PlayAreaMap regions to avoid repetition across files.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

// Column type for play area regions
export type PlayAreaColumn = 'LEFT_ARM' | 'LEFT_SIDE_OF_SWEATER' | 'RIGHT_SIDE_OF_SWEATER' | 'RIGHT_ARM' | 'LEFT_PLAY_AREA' | 'CENTER_PLAY_AREA' | 'RIGHT_PLAY_AREA' | 'RIGHT_EDGE';

// Row type for play area regions  
export type PlayAreaRow = 'UPPER_PLAY_AREA' | 'CENTER_PLAY_AREA' | 'LOWER_PLAY_AREA';

// Direction type for balloon movement - includes all cardinal and diagonal directions
export type BalloonDirection = 'LEFT' | 'RIGHT' | 'UP' | 'DOWN' | 'UP_LEFT' | 'UP_RIGHT' | 'DOWN_LEFT' | 'DOWN_RIGHT';