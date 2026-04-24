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
const SCALE = 3.0;

// Offset for the plus charges so that they appear up and to the left relative to minus charges
// when no force is applied.
const PLUS_CHARGE_OFFSET = 8;

// This is to prevent an instrumented phet-io instance from being created outside a constructor,
// see https://github.com/phetsims/phet-io-wrappers/issues/97
const createSharedChargeNodeGetter = <T>( createNode: () => T ): () => T => {
  let sharedNode: T | null = null;

  return () => {
    if ( !sharedNode ) {
      sharedNode = createNode();
    }
    return sharedNode;
  };
};

const getMinusChargeNode = createSharedChargeNodeGetter( () => {
  return new MinusChargeNode( new Vector2( 0, 0 ), {
    scale: SCALE
  } );
} );

const getPlusChargeNode = createSharedChargeNodeGetter( () => {
  return new PlusChargeNode( new Vector2( 0, 0 ), {
    scale: SCALE
  } );
} );

export default class ChargesCanvasNode extends CanvasNode {

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
    this.minusChargeImageNode = rasterizeNode( getMinusChargeNode(), { wrap: false } );
    this.plusChargeImageNode = rasterizeNode( getPlusChargeNode(), { wrap: false } );
  }

  /**
   * Draw charges at their correct positions indicating induced charge.
   */
  public override paintCanvas( context: CanvasRenderingContext2D ): void {

    // we scaled up the node before converting to image so that it looks less pixelated, so now we need to
    // scale it back down
    context.scale( 1 / SCALE, 1 / SCALE );

    // Draw plus charges first, then minus charges, to preserve the previous layering.
    for ( let i = 0; i < this.plusCharges.length; i++ ) {
      const charge = this.plusCharges[ i ];
      const chargePosition = charge.position;

      // Preserve a visible static offset between plus and minus charges when there is no induced motion.
      const xPosition = ( chargePosition.x - this.wallX - PLUS_CHARGE_OFFSET ) * SCALE;
      const yPosition = ( chargePosition.y - PLUS_CHARGE_OFFSET ) * SCALE;

      context.drawImage( this.plusChargeImageNode.image, xPosition, yPosition );
    }

    for ( let i = 0; i < this.minusCharges.length; i++ ) {
      const charge = this.minusCharges[ i ];
      const chargePosition = charge.positionProperty.get();

      const xPosition = ( ( chargePosition.x - this.wallX + PointChargeModel.RADIUS - BASEConstants.IMAGE_PADDING ) * SCALE );
      const yPosition = ( chargePosition.y + PointChargeModel.RADIUS - BASEConstants.IMAGE_PADDING ) * SCALE;

      context.drawImage( this.minusChargeImageNode.image, xPosition, yPosition );
    }
  }
}
