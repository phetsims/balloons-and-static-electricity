// Copyright 2013-2019, University of Colorado Boulder

/**
 * Scenery display object (scene graph node) for the plusCharge.
 *
 @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var BASEConstants = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/BASEConstants' );
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PointChargeModel = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/PointChargeModel' );
  var RadialGradient = require( 'SCENERY/util/RadialGradient' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  var RADIUS = PointChargeModel.RADIUS;

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
  var sharedPlusChargeNode = icon.rasterized( { resolution: BASEConstants.IMAGE_SCALE } );

  /**
   * @constructor
   * @param {Vector2} location
   * @pararm {Tandem} tandem
   */
  function PlusChargeNode( location, tandem ) {

    Node.call( this, { pickable: false, tandem: tandem } );

    this.translate( location.x + BASEConstants.IMAGE_PADDING, location.y + BASEConstants.IMAGE_PADDING );

    this.addChild( sharedPlusChargeNode );
  }

  balloonsAndStaticElectricity.register( 'PlusChargeNode', PlusChargeNode );

  return inherit( Node, PlusChargeNode );
} );
