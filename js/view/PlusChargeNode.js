// Copyright 2002-2013, University of Colorado

/**
 * Scenery display object (scene graph node) for the plusCharge.
 *
 @author Vasily Shakhov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var RadialGradient = require( 'SCENERY/util/RadialGradient' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var PointChargeModel = require( 'model/PointChargeModel' );

  function PlusChargeNode( location ) {

    // super constructor
    // Use svg for the shape and text
    Node.call( this, {renderer: 'svg'} );

    var radius = PointChargeModel.radius;
    this.translate( location.x, location.y );

    // add the centered bar magnet image

    this.addChild( new Circle( radius, {
      x: 0, y: 0,
      fill: new RadialGradient( 2, -3, 2, 2, -3, 7 )
        .addColorStop( 0, '#fff' )
        .addColorStop( 0.5, '#f47c81' )
        .addColorStop( 1, '#f00' )
    } ) );

    this.addChild( new Rectangle( 0, 0, 11, 2, {
      fill: 'white',
      centerX: 0,
      centerY: 0
    } ) );

    this.addChild( new Rectangle( 0, 0, 2, 11, {
      fill: 'white',
      centerX: 0,
      centerY: 0
    } ) );
  }

  inherit( Node, PlusChargeNode ); // prototype chaining

  return PlusChargeNode;
} );