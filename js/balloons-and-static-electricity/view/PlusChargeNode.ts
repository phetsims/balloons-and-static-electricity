// Copyright 2013-2025, University of Colorado Boulder

/**
 * Scenery display object (scene graph node) for the plusCharge.
 *
 @author Vasily Shakhov (Mlearner)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import RadialGradient from '../../../../scenery/js/util/RadialGradient.js';
import { rasterizeNode } from '../../../../scenery/js/util/rasterizeNode.js';
import balloonsAndStaticElectricity from '../../balloonsAndStaticElectricity.js';
import BASEConstants from '../BASEConstants.js';
import PointChargeModel from '../model/PointChargeModel.js';

const RADIUS = PointChargeModel.RADIUS;

const icon = new Node( {
  children: [
    new Circle( RADIUS, {
      x: 0, y: 0,
      fill: new RadialGradient( 2, -3, 2, 2, -3, 7 )
        .addColorStop( 0, '#f97d7d' )
        .addColorStop( 0.5, '#ed4545' )
        .addColorStop( 1, '#f00' )
    } ),

    new Rectangle( 0, 0, 11, 2, {
      fill: 'white',
      centerX: 0,
      centerY: 0
    } ),

    new Rectangle( 0, 0, 2, 11, {
      fill: 'white',
      centerX: 0,
      centerY: 0
    } )
  ]
} );
const sharedPlusChargeNode = rasterizeNode( icon, { resolution: BASEConstants.IMAGE_SCALE } );

export default class PlusChargeNode extends Node {

  public constructor( position: Vector2 ) {

    super( { pickable: false } );

    this.translate( position.x + BASEConstants.IMAGE_PADDING, position.y + BASEConstants.IMAGE_PADDING );

    this.addChild( sharedPlusChargeNode );
  }
}

balloonsAndStaticElectricity.register( 'PlusChargeNode', PlusChargeNode );