// Copyright 2013-2019, University of Colorado Boulder

/**
 * Scenery display object (scene graph node) for minusCharge.
 *
 @author Vasily Shakhov (Mlearner)
 */
define( require => {
  'use strict';

  // modules
  const balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );
  const BASEConstants = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/BASEConstants' );
  const Circle = require( 'SCENERY/nodes/Circle' );
  const inherit = require( 'PHET_CORE/inherit' );
  const merge = require( 'PHET_CORE/merge' );
  // ES6-MIGRATE-ADD import '../../../../scenery/js/nodes/Image.js'; // to support static call to rasterize, see https://github.com/phetsims/chipper/issues/871
  const Node = require( 'SCENERY/nodes/Node' );
  const PointChargeModel = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/PointChargeModel' );
  const RadialGradient = require( 'SCENERY/util/RadialGradient' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );

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

  /**
   * @constructor
   * @param {Vector2} position
   * @param {Tandem} tandem
   * @param {Object} [options]
   */
  function MinusChargeNode( position, tandem, options ) {

    options = merge( {
      pickable: false,
      tandem: tandem
    }, options );

    Node.call( this, options );

    this.translate( position.x + BASEConstants.IMAGE_PADDING, position.y + BASEConstants.IMAGE_PADDING );

    this.addChild( sharedMinusChargeNode );
  }

  balloonsAndStaticElectricity.register( 'MinusChargeNode', MinusChargeNode );

  return inherit( Node, MinusChargeNode );
} );
