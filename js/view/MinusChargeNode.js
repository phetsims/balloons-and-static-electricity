// Copyright 2002-2013, University of Colorado Boulder

/**
 * Scenery display object (scene graph node) for minusCharge.
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
  var Image = require( 'SCENERY/nodes/Image' );
  require( 'SCENERY/Scene' ); //Force Scene to load before using Node.toImage

  var radius = PointChargeModel.radius;

  //Scale up before rasterization so it won't be too pixellated/fuzzy
  var scale = 2;

  var minusChargeNode = new Node( {
    children: [
      new Circle( radius, {
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
    ], scale: scale
  } );

  var node = new Node();
  minusChargeNode.toImage( function( im ) {

    //Scale back down so the image will be the desired size
    node.children = [new Image( im, {scale: 1.0 / scale} )];
  } );

  function MinusChargeNode( location ) {

    // super constructor
    // Use svg for the shape and text
    Node.call( this, {pickable: false} );

    this.translate( location.x - radius, location.y - radius );

    this.addChild( node );
  }

  inherit( Node, MinusChargeNode ); // prototype chaining

  return MinusChargeNode;
} );
