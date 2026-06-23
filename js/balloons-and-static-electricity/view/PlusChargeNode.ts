// Copyright 2013-2026, University of Colorado Boulder

/**
 * Scenery display object (scene graph node) for the plusCharge.
 *
 @author Vasily Shakhov (Mlearner)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import ChargeNode, { ChargeNodeOptions, createSharedChargeNode } from './ChargeNode.js';

const sharedPlusChargeNode = createSharedChargeNode( {
  colorStops: [
    { offset: 0, color: '#f97d7d' },
    { offset: 0.5, color: '#ed4545' },
    { offset: 1, color: '#f00' }
  ],
  includeVerticalBar: true
} );

export default class PlusChargeNode extends ChargeNode {

  public constructor( position: Vector2, options?: ChargeNodeOptions ) {
    super( position, sharedPlusChargeNode, options );
  }
}
