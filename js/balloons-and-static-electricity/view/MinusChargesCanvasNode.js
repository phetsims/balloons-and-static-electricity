// Copyright 2018-2021, University of Colorado Boulder

/**
 * A canvas node for wall charges. This was added as a performance enhancement for #409.
 *
 * @author Jesse Greenberg
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import CanvasNode from '../../../../scenery/js/nodes/CanvasNode.js';
import balloonsAndStaticElectricity from '../../balloonsAndStaticElectricity.js';
import BASEConstants from '../BASEConstants.js';
import PointChargeModel from '../model/PointChargeModel.js';
import MinusChargeNode from './MinusChargeNode.js';
import PlusChargeNode from './PlusChargeNode.js';

// Node converted to image to be drawn in canvas - scale up the node, then back down when converting to image so it
// doesn't look fuzzy
const SCALE = 3.0;

// Offset for the plus charges so that they appear up and to the left relative to minus charges
// when no force is applied.
const PLUS_CHARGE_OFFSET = 8;

// This is to prevent an instrumented phet-io instance from being created outside of a constructor,
// see https://github.com/phetsims/phet-io-wrappers/issues/97
const createSharedChargeNodeGetter = createNode => {
  let sharedNode = null;

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

class MinusChargesCanvasNode extends CanvasNode {

  /**
   * @param {number} wallX - x position of the wall, to offset charge positions
   * @param {Bounds2} wallBounds - bounds of the wall in view coordinates, passed as canvasBounds
   * @param {Array.<PointChargeModel>} plusCharges
   * @param {Array.<MovablePointChargeModel>} minusCharges
   * @param {[object]} options
   */
  constructor( wallX, wallBounds, plusCharges, minusCharges, options ) {

    super( options );
    this.setCanvasBounds( wallBounds );
    this.invalidatePaint();

    // @private {Array.<PointChargeModel>}
    this.plusCharges = plusCharges;

    // @private {Array.<MovablePointChargeModel>}
    this.minusCharges = minusCharges;

    // @private {number}
    this.wallX = wallX;

    // @private - created synchronously so that it can be drawn immediately in paintCanvas
    this.minusChargeImageNode = getMinusChargeNode().rasterized( { wrap: false } );
    this.plusChargeImageNode = getPlusChargeNode().rasterized( { wrap: false } );
  }

  /**
   * Draw charges at their correct positions indicating induced charge.
   *
   * @param {CanvasRenderingContext2D} context
   * @override
   * @public
   */
  paintCanvas( context ) {

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

balloonsAndStaticElectricity.register( 'MinusChargesCanvasNode', MinusChargesCanvasNode );

export default MinusChargesCanvasNode;