// Copyright 2013-2026, University of Colorado Boulder

/**
 * Scenery display object (scene graph node) for minusCharge.
 *
 @author Vasily Shakhov (Mlearner)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import ChargeNode, { ChargeNodeOptions, createSharedChargeNode } from './ChargeNode.js';

const sharedMinusChargeNode = createSharedChargeNode( {
  colorStops: [
    { offset: 0, color: '#0FBBFF' },
    { offset: 0.5, color: '#009DD6' },
    { offset: 1, color: '#0092C7' }
  ],
  includeVerticalBar: false
} );

export default class MinusChargeNode extends ChargeNode {

  public constructor( position: Vector2, options?: ChargeNodeOptions ) {
    super( position, sharedMinusChargeNode, options );
  }
}
