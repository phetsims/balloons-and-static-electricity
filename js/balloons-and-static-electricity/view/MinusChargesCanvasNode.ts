// Copyright 2018-2026, University of Colorado Boulder

/**
 * A canvas node for wall charges. This was added as a performance enhancement for #409.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import CanvasNode from '../../../../scenery/js/nodes/CanvasNode.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import { rasterizeNode } from '../../../../scenery/js/util/rasterizeNode.js';
import BASEConstants from '../BASEConstants.js';
import MovablePointChargeModel from '../model/MovablePointChargeModel.js';
import PointChargeModel from '../model/PointChargeModel.js';
import MinusChargeNode from './MinusChargeNode.js';
import PlusChargeNode from './PlusChargeNode.js';

// Node converted to image to be drawn in canvas - scale up the node, then back down when converting to image so it
// doesn't look fuzzy
const scale = 3.0;
const PLUS_CHARGE_OFFSET = 8 * BASEConstants.IMAGE_PADDING;
let minusChargeNode: MinusChargeNode | null = null;
let plusChargeNode: PlusChargeNode | null = null;

// This is to prevent an instrumented phet-io instance from being created outside a constructor,
// see https://github.com/phetsims/phet-io-wrappers/issues/97
const getChargeNode = (): MinusChargeNode => {
  if ( !minusChargeNode ) {
    minusChargeNode = new MinusChargeNode( new Vector2( 0, 0 ), {
      scale: scale
    } );
  }
  return minusChargeNode;
};

// This is to prevent an instrumented phet-io instance from being created outside a constructor,
// see https://github.com/phetsims/phet-io-wrappers/issues/97
const getPlusChargeNode = (): PlusChargeNode => {
  if ( !plusChargeNode ) {
    plusChargeNode = new PlusChargeNode( new Vector2( 0, 0 ), {
      scale: scale
    } );
  }
  return plusChargeNode;
};

export default class MinusChargesCanvasNode extends CanvasNode {

  private readonly plusCharges: PointChargeModel[];
  private readonly minusCharges: MovablePointChargeModel[];
  private readonly wallX: number;
  private readonly minusChargeImageNode: Image;
  private readonly plusChargeImageNode: Image;

  /**
   * @param wallX - x position of the wall, to offset charge positions
   * @param wallBounds - bounds of the wall in view coordinates, passed as canvasBounds
   * @param plusCharges
   * @param minusCharges
   */
  public constructor( wallX: number, wallBounds: Bounds2, plusCharges: PointChargeModel[], minusCharges: MovablePointChargeModel[] ) {

    super();
    this.setCanvasBounds( wallBounds );
    this.invalidatePaint();

    this.plusCharges = plusCharges;
    this.minusCharges = minusCharges;
    this.wallX = wallX;

    // created synchronously so that it can be drawn immediately in paintCanvas
    this.minusChargeImageNode = rasterizeNode( getChargeNode(), { wrap: false } );
    this.plusChargeImageNode = rasterizeNode( getPlusChargeNode(), { wrap: false } );
  }

  /**
   * Draw charges at their correct positions indicating induced charge.
   */
  public override paintCanvas( context: CanvasRenderingContext2D ): void {

    // we scaled up the node before converting to image so that it looks less pixelated, so now we need to
    // scale it back down
    context.scale( 1 / scale, 1 / scale );

    // Draw plus charges first, then minus charges, to preserve the previous layering.
    for ( let i = 0; i < this.plusCharges.length; i++ ) {
      const charge = this.plusCharges[ i ];
      const chargePosition = charge.position;

      // Preserve a visible static offset between plus and minus charges when there is no induced motion.
      const xPosition = ( chargePosition.x - this.wallX - PLUS_CHARGE_OFFSET ) * scale;
      const yPosition = ( chargePosition.y - PLUS_CHARGE_OFFSET ) * scale;

      context.drawImage( this.plusChargeImageNode.image, xPosition, yPosition );
    }

    for ( let i = 0; i < this.minusCharges.length; i++ ) {
      const charge = this.minusCharges[ i ];
      const chargePosition = charge.positionProperty.get();

      const xPosition = ( ( chargePosition.x - this.wallX + PointChargeModel.RADIUS - BASEConstants.IMAGE_PADDING ) * scale );
      const yPosition = ( chargePosition.y + PointChargeModel.RADIUS - BASEConstants.IMAGE_PADDING ) * scale;

      context.drawImage( this.minusChargeImageNode.image, xPosition, yPosition );
    }
  }
}
