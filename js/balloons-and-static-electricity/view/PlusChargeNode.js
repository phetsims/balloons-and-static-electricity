// Copyright 2013-2019, University of Colorado Boulder

/**
 * Scenery display object (scene graph node) for the plusCharge.
 *
 @author Vasily Shakhov (Mlearner)
 */
define( require => {
  'use strict';

  // modules
  const BASEConstants = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/BASEConstants' );
  const balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );
  const Circle = require( 'SCENERY/nodes/Circle' );
  const inherit = require( 'PHET_CORE/inherit' );
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
  const sharedPlusChargeNode = icon.rasterized( { resolution: BASEConstants.IMAGE_SCALE } );

  /**
   * @constructor
   * @param {Vector2} position
   * @pararm {Tandem} tandem
   */
  function PlusChargeNode( position, tandem ) {

    Node.call( this, { pickable: false, tandem: tandem } );

    this.translate( position.x + BASEConstants.IMAGE_PADDING, position.y + BASEConstants.IMAGE_PADDING );

    this.addChild( sharedPlusChargeNode );
  }

  balloonsAndStaticElectricity.register( 'PlusChargeNode', PlusChargeNode );

  return inherit( Node, PlusChargeNode );
} );
