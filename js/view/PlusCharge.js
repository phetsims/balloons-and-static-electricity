// Copyright 2002-2013, University of Colorado

/**
 * Scenery display object (scene graph node) for the static elements of the model.
 * sweater, wall
 *
 @author Vasily Shakhov (Mlearner)
 */

define( function ( require ) {
  'use strict';
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var Grad = require( 'SCENERY/util/RadialGradient' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  function PlusChargeNode( location ) {
    var self = this;

    // super constructor
    Node.call( this );

    var radius = 6;
    this.translate(location.x+radius,location.y+radius);

    // add the centered bar magnet image

    this.addChild( new Circle( radius, {
      x: 0, y: 0,
      fill: new Grad( 1, -2, 0, 1, -2, 5 )
          .addColorStop( 0, '#fff' )
          .addColorStop( 0.5, '#f47c81' )
          .addColorStop( 1, '#f00' )
    } ) );

    this.addChild (new Text("+", {
      font: '14px sans-serif',
      fill : 'white',
      centerX: 0,
      centerY: 0
    }));
  }

  inherit( PlusChargeNode, Node ); // prototype chaining

  return PlusChargeNode;
} );
