// Copyright 2026, University of Colorado Boulder

/**
 * Shared base node for point charges. It owns the common charge icon construction, rasterization, and coordinate
 * padding used by the plus and minus charge nodes.
 *
 * @author Vasily Shakhov (Mlearner)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import RadialGradient from '../../../../scenery/js/util/RadialGradient.js';
import { rasterizeNode } from '../../../../scenery/js/util/rasterizeNode.js';
import BASEConstants from '../BASEConstants.js';
import PointChargeModel from '../model/PointChargeModel.js';

type SelfOptions = EmptySelfOptions;
export type ChargeNodeOptions = SelfOptions & NodeOptions;

type ChargeGradientColorStop = {
  offset: number;
  color: string;
};

type ChargeIconOptions = {
  colorStops: ChargeGradientColorStop[];
  includeVerticalBar: boolean;
};

const RADIUS = PointChargeModel.RADIUS;
const BAR_LENGTH = 11;
const BAR_WIDTH = 2;

const createChargeBar = ( width: number, height: number ): Rectangle => {
  return new Rectangle( 0, 0, width, height, {
    fill: 'white',
    centerX: 0,
    centerY: 0
  } );
};

const createChargeFill = ( colorStops: ChargeGradientColorStop[] ): RadialGradient => {
  const fill = new RadialGradient( 2, -3, 2, 2, -3, 7 );

  colorStops.forEach( colorStop => {
    fill.addColorStop( colorStop.offset, colorStop.color );
  } );

  return fill;
};

export const createSharedChargeNode = ( iconOptions: ChargeIconOptions ): Node => {
  const glyphNodes = [ createChargeBar( BAR_LENGTH, BAR_WIDTH ) ];

  if ( iconOptions.includeVerticalBar ) {
    glyphNodes.push( createChargeBar( BAR_WIDTH, BAR_LENGTH ) );
  }

  const icon = new Node( {
    children: [
      new Circle( RADIUS, {
        x: 0, y: 0,
        fill: createChargeFill( iconOptions.colorStops ),
        stroke: 'black',
        lineWidth: 0.5
      } ),
      ...glyphNodes
    ]
  } );

  return rasterizeNode( icon, { resolution: BASEConstants.IMAGE_SCALE } );
};

export default abstract class ChargeNode extends Node {

  protected constructor( position: Vector2, sharedChargeNode: Node, providedOptions?: ChargeNodeOptions ) {

    const options = optionize<ChargeNodeOptions, SelfOptions, NodeOptions>()( {
      pickable: false
    }, providedOptions );

    super( options );

    this.translate( position.x + BASEConstants.IMAGE_PADDING, position.y + BASEConstants.IMAGE_PADDING );

    this.addChild( sharedChargeNode );
  }
}
