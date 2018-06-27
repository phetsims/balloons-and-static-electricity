// Copyright 2018, University of Colorado Boulder

/**
 * A canvas node for minus charges in the wall. This was added as a performance enhancement for #409.
 *
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );
  var CanvasNode = require( 'SCENERY/nodes/CanvasNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MinusChargeNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/MinusChargeNode' );
  var PointChargeModel = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/PointChargeModel' );
  var Tandem = require( 'TANDEM/Tandem' );
  var Vector2 = require( 'DOT/Vector2' );

  // Node converted to image to be drawn in canvas - scale up the node, then back down when converting to image so it
  // doesn't look fuzzy
  var scale = 3.0;
  var chargeNode = null;

  // This is to prevent an instrumented phet-io instance from being created outside of a constructor, see https://github.com/phetsims/phet-io-wrappers/issues/97
  var getChargeNode = function() {
    if ( !chargeNode ) {
      chargeNode = new MinusChargeNode( new Vector2( 0, 0 ), Tandem.rootTandem.createTandem( 'chargeNode' ), {
        scale: scale
      } );
    }
    return chargeNode;
  };

  /**
   * @constructor
   *
   * @param {number} wallX - x location of the wall, to offset charge locations
   * @param {Bounds2} wallBounds - bounds of the wall in view coordinates, passed as canvasBounds
   * @param {Array.<MovablePointChargeModel} charges
   * @param {[object]} options
   */
  function MinusChargesCanvasNode( wallX, wallBounds, charges, options ) {

    // @private {Array.<MovablePointChargeNode>}
    this.charges = charges;

    // @private {number}
    this.wallX = wallX;

    // @private - created synchronously so that it can be drawn immediately in paintCanvas
    this.chargeImageNode = getChargeNode().rasterized( { wrap: false } );

    CanvasNode.call( this, options );
    this.setCanvasBounds( wallBounds );
    this.invalidatePaint();
  }

  balloonsAndStaticElectricity.register( 'MinusChargesCanvasNode', MinusChargesCanvasNode );

  return inherit( CanvasNode, MinusChargesCanvasNode, {

    /**
     * Draw charges at their correct positions indicating induced charge.
     *
     * @param {CanvasRenderingContext2D} context
     * @override
     * @public
     */
    paintCanvas: function( context ) {

      // we scaled up the node before converting to image so that it looks less pixelated, so now we need to 
      // scale it back down
      context.scale( 1 / scale, 1 / scale );

      // draw all of the charges
      for ( var i = 0; i < this.charges.length; i++ ) {
        var charge = this.charges[ i ];
        var chargePosition = charge.locationProperty.get();

        var xPosition = ( ( chargePosition.x - this.wallX + PointChargeModel.RADIUS ) * scale );
        var yPosition = ( chargePosition.y + PointChargeModel.RADIUS ) * scale;

        // render particle
        context.drawImage( this.chargeImageNode.image, xPosition, yPosition );
      }
    }
  } );
} );
