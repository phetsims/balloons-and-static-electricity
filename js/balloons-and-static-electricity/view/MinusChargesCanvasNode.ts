// Copyright 2018-2025, University of Colorado Boulder

/**
 * A canvas node for minus charges in the wall. This was added as a performance enhancement for #409.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import CanvasNode from '../../../../scenery/js/nodes/CanvasNode.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import { rasterizeNode } from '../../../../scenery/js/util/rasterizeNode.js';
import balloonsAndStaticElectricity from '../../balloonsAndStaticElectricity.js';
import BASEConstants from '../BASEConstants.js';
import MovablePointChargeModel from '../model/MovablePointChargeModel.js';
import PointChargeModel from '../model/PointChargeModel.js';
import MinusChargeNode from './MinusChargeNode.js';

// Node converted to image to be drawn in canvas - scale up the node, then back down when converting to image so it
// doesn't look fuzzy
const scale = 3.0;
let chargeNode: MinusChargeNode | null = null;

// This is to prevent an instrumented phet-io instance from being created outside a constructor,
// see https://github.com/phetsims/phet-io-wrappers/issues/97
const getChargeNode = (): MinusChargeNode => {
  if ( !chargeNode ) {
    chargeNode = new MinusChargeNode( new Vector2( 0, 0 ), {
      scale: scale
    } );
  }
  return chargeNode;
};

export default class MinusChargesCanvasNode extends CanvasNode {

  private readonly charges: MovablePointChargeModel[];
  private readonly wallX: number;
  private readonly chargeImageNode: Image;

  /**
   * @param wallX - x position of the wall, to offset charge positions
   * @param wallBounds - bounds of the wall in view coordinates, passed as canvasBounds
   * @param charges
   */
  public constructor( wallX: number, wallBounds: Bounds2, charges: MovablePointChargeModel[] ) {

    super();
    this.setCanvasBounds( wallBounds );
    this.invalidatePaint();

    this.charges = charges;
    this.wallX = wallX;

    // created synchronously so that it can be drawn immediately in paintCanvas
    this.chargeImageNode = rasterizeNode( getChargeNode(), { wrap: false } );
  }

  /**
   * Draw charges at their correct positions indicating induced charge.
   */
  public override paintCanvas( context: CanvasRenderingContext2D ): void {

    // we scaled up the node before converting to image so that it looks less pixelated, so now we need to
    // scale it back down
    context.scale( 1 / scale, 1 / scale );

    // draw the charges
    for ( let i = 0; i < this.charges.length; i++ ) {
      const charge = this.charges[ i ];
      const chargePosition = charge.positionProperty.get();

      const xPosition = ( ( chargePosition.x - this.wallX + PointChargeModel.RADIUS - BASEConstants.IMAGE_PADDING ) * scale );
      const yPosition = ( chargePosition.y + PointChargeModel.RADIUS - BASEConstants.IMAGE_PADDING ) * scale;

      // render particle
      context.drawImage( this.chargeImageNode.image, xPosition, yPosition );
    }
  }
}

balloonsAndStaticElectricity.register( 'MinusChargesCanvasNode', MinusChargesCanvasNode );