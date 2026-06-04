// Copyright 2013-2026, University of Colorado Boulder

/**
 * Charge positions for balloons and the sweater.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Vector2 from '../../../../dot/js/Vector2.js';

// Collection of charge positions on the balloon, relative to the upper-left corner of the balloon image.
export const BALLOON_COLLECTED_MINUS_CHARGE_POSITIONS = [
  [ 14, 70 ],
  [ 18, 60 ],
  [ 14, 90 ],
  [ 24, 130 ],
  [ 22, 120 ],
  [ 14, 79 ],
  [ 25, 140 ],
  [ 18, 108 ],
  [ 19, 50 ],
  [ 44, 150 ],
  [ 16, 100 ],
  [ 20, 80 ],
  [ 50, 160 ],
  [ 34, 140 ],
  [ 50, 20 ],
  [ 30, 30 ],
  [ 22, 72 ],
  [ 24, 105 ],
  [ 20, 110 ],
  [ 40, 150 ],
  [ 26, 110 ],
  [ 30, 115 ],
  [ 24, 87 ],
  [ 24, 60 ],
  [ 24, 40 ],
  [ 38, 24 ],
  [ 30, 80 ],
  [ 30, 50 ],
  [ 34, 82 ],
  [ 32, 130 ],
  [ 30, 108 ],
  [ 30, 50 ],
  [ 40, 94 ],
  [ 30, 100 ],
  [ 35, 90 ],
  [ 24, 95 ],
  [ 34, 100 ],
  [ 35, 40 ],
  [ 30, 60 ],
  [ 32, 72 ],
  [ 30, 105 ],
  [ 34, 140 ],
  [ 30, 120 ],
  [ 30, 130 ],
  [ 30, 85 ],
  [ 34, 77 ],
  [ 35, 90 ],
  [ 40, 85 ],
  [ 34, 90 ],
  [ 35, 50 ],
  [ 46, 34 ],
  [ 32, 72 ],
  [ 30, 105 ],
  [ 34, 140 ],
  [ 34, 120 ],
  [ 30, 60 ],
  [ 30, 85 ],
  [ 34, 77 ]
];

// Positions of neutral atoms on balloon, relative to the upper-left corner of the balloon image.
export const BALLOON_START_CHARGE_POSITIONS = [
  [ 44, 50 ],
  [ 88, 50 ],
  [ 44, 140 ],
  [ 88, 140 ]
];

// Average Y position for the charges on the balloon, used to calculate the visual charge center.
export const AVERAGE_BALLOON_CHARGE_Y = BALLOON_COLLECTED_MINUS_CHARGE_POSITIONS.reduce(
  ( sum, position ) => sum + position[ 1 ],
  0
) / BALLOON_COLLECTED_MINUS_CHARGE_POSITIONS.length;

// Positions of the charge pairs on the sweater, in absolute model coordinates.
export const SWEATER_CHARGE_PAIR_POSITIONS = [
  new Vector2( 104, 64 ),
  new Vector2( 94, 90 ),
  new Vector2( 85, 121 ),
  new Vector2( 80, 147 ),
  new Vector2( 76, 178 ),
  new Vector2( 74, 209 ),
  new Vector2( 71, 242 ),
  new Vector2( 67, 273 ),
  new Vector2( 67, 304 ),
  new Vector2( 61, 330 ),
  new Vector2( 140, 85 ),
  new Vector2( 142, 116 ),
  new Vector2( 145, 145 ),
  new Vector2( 145, 174 ),
  new Vector2( 143, 205 ),
  new Vector2( 140, 237 ),
  new Vector2( 138, 267 ),
  new Vector2( 132, 296 ),
  new Vector2( 128, 327 ),
  new Vector2( 170, 98 ),
  new Vector2( 171, 129 ),
  new Vector2( 171, 160 ),
  new Vector2( 172, 191 ),
  new Vector2( 171, 223 ),
  new Vector2( 169, 254 ),
  new Vector2( 167, 287 ),
  new Vector2( 163, 318 ),
  new Vector2( 163, 350 ),
  new Vector2( 208, 88 ),
  new Vector2( 208, 117 ),
  new Vector2( 206, 148 ),
  new Vector2( 205, 179 ),
  new Vector2( 203, 210 ),
  new Vector2( 202, 241 ),
  new Vector2( 200, 272 ),
  new Vector2( 197, 302 ),
  new Vector2( 196, 333 ),
  new Vector2( 239, 75 ),
  new Vector2( 236, 105 ),
  new Vector2( 234, 135 ),
  new Vector2( 233, 166 ),
  new Vector2( 232, 197 ),
  new Vector2( 231, 229 ),
  new Vector2( 230, 260 ),
  new Vector2( 227, 291 ),
  new Vector2( 226, 321 ),
  new Vector2( 224, 350 ),
  new Vector2( 266, 59 ),
  new Vector2( 283, 90 ),
  new Vector2( 292, 121 ),
  new Vector2( 292, 152 ),
  new Vector2( 292, 187 ),
  new Vector2( 290, 217 ),
  new Vector2( 295, 247 ),
  new Vector2( 296, 278 ),
  new Vector2( 295, 308 ),
  new Vector2( 290, 337 )
];
