// Copyright 2018-2021, University of Colorado Boulder

/**
 * A canvas node for minus charges in the wall. This was added as a performance enhancement for #409.
 *
 * @author Jesse Greenberg
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import { CanvasNode } from '../../../../scenery/js/imports.js';
import balloonsAndStaticElectricity from '../../balloonsAndStaticElectricity.js';
import BASEConstants from '../BASEConstants.js';
import PointChargeModel from '../model/PointChargeModel.js';
import MinusChargeNode from './MinusChargeNode.js';

// Node converted to image to be drawn in canvas - scale up the node, then back down when converting to image so it
// doesn't look fuzzy
const scale = 3.0;
let chargeNode = null;

// This is to prevent an instrumented phet-io instance from being created outside of a constructor,
// see https://github.com/phetsims/phet-io-wrappers/issues/97
const getChargeNode = () => {
  if ( !chargeNode ) {
    chargeNode = new MinusChargeNode( new Vector2( 0, 0 ), {
      scale: scale
    } );
  }
  return chargeNode;
};

class MinusChargesCanvasNode extends CanvasNode {

  /**
   * @param {number} wallX - x position of the wall, to offset charge positions
   * @param {Bounds2} wallBounds - bounds of the wall in view coordinates, passed as canvasBounds
   * @param {Array.<MovablePointChargeModel>} charges
   * @param {[object]} options
   */
  constructor( wallX, wallBounds, charges, options ) {

    super( options );
    this.setCanvasBounds( wallBounds );
    this.invalidatePaint();

    // @private {Array.<MovablePointChargeNode>}
    this.charges = charges;

    // @private {number}
    this.wallX = wallX;

    // @private - created synchronously so that it can be drawn immediately in paintCanvas
    this.chargeImageNode = getChargeNode().rasterized( { wrap: false } );
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
    context.scale( 1 / scale, 1 / scale );

    // draw all of the charges
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

export default MinusChargesCanvasNode;