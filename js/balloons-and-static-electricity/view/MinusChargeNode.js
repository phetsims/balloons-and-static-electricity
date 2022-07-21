// Copyright 2013-2022, University of Colorado Boulder

/**
 * Scenery display object (scene graph node) for minusCharge.
 *
 @author Vasily Shakhov (Mlearner)
 */

import merge from '../../../../phet-core/js/merge.js';
import { Circle, Node, RadialGradient, Rectangle } from '../../../../scenery/js/imports.js';
import '../../../../scenery/js/nodes/Image.js'; // to support static call to rasterize, see https://github.com/phetsims/chipper/issues/871
import balloonsAndStaticElectricity from '../../balloonsAndStaticElectricity.js';
import BASEConstants from '../BASEConstants.js';
import PointChargeModel from '../model/PointChargeModel.js';

const RADIUS = PointChargeModel.RADIUS;

const icon = new Node( {
  children: [
    new Circle( RADIUS, {
      x: 0, y: 0,
      fill: new RadialGradient( 2, -3, 2, 2, -3, 7 )
        .addColorStop( 0, '#4fcfff' )
        .addColorStop( 0.5, '#2cbef5' )
        .addColorStop( 1, '#00a9e8' )
    } ),

    new Rectangle( 0, 0, 11, 2, {
      fill: 'white',
      centerX: 0,
      centerY: 0
    } )
  ]
} );
const sharedMinusChargeNode = icon.rasterized( { resolution: BASEConstants.IMAGE_SCALE } );

class MinusChargeNode extends Node {

  /**
   * @param {Vector2} position
   * @param {Object} [options]
   */
  constructor( position, options ) {

    options = merge( {
      pickable: false
    }, options );

    super( options );

    this.translate( position.x + BASEConstants.IMAGE_PADDING, position.y + BASEConstants.IMAGE_PADDING );

    this.addChild( sharedMinusChargeNode );
  }
}

balloonsAndStaticElectricity.register( 'MinusChargeNode', MinusChargeNode );

export default MinusChargeNode;