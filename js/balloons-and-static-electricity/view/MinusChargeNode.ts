// Copyright 2013-2026, University of Colorado Boulder

/**
 * Scenery display object (scene graph node) for minusCharge.
 *
 @author Vasily Shakhov (Mlearner)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import RadialGradient from '../../../../scenery/js/util/RadialGradient.js';
import { rasterizeNode } from '../../../../scenery/js/util/rasterizeNode.js';
import BASEConstants from '../BASEConstants.js';
import PointChargeModel from '../model/PointChargeModel.js';

const RADIUS = PointChargeModel.RADIUS;

const icon = new Node( {
  children: [
    new Circle( RADIUS, {
      x: 0, y: 0,
      fill: new RadialGradient( 2, -3, 2, 2, -3, 7 )
        .addColorStop( 0, '#0FBBFF' )
        .addColorStop( 0.5, '#009DD6' )
        .addColorStop( 1, '#0092C7' )
    } ),

    new Rectangle( 0, 0, 11, 2, {
      fill: 'white',
      centerX: 0,
      centerY: 0
    } )
  ]
} );
const sharedMinusChargeNode = rasterizeNode( icon, { resolution: BASEConstants.IMAGE_SCALE } );

export default class MinusChargeNode extends Node {

  public constructor( position: Vector2, options?: NodeOptions ) {

    const resolvedOptions = merge( {
      pickable: false
    }, options );

    super( resolvedOptions );

    this.translate( position.x + BASEConstants.IMAGE_PADDING, position.y + BASEConstants.IMAGE_PADDING );

    this.addChild( sharedMinusChargeNode );
  }
}
