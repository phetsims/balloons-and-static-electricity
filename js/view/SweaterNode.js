// Copyright 2002-2013, University of Colorado

/**
 * Scenery display object (scene graph node) for the Sweater of the model.
 *
 *
 @author Vasily Shakhov (Mlearner)
 */

define( function ( require ) {
  'use strict';
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Image = require( 'SCENERY/nodes/Image' );

  function SweaterNode( x, y ) {
    var self = this;

    // super constructor
    Node.call( this );

    this.x = x;
    this.y = y;

    // add the Sweater image
    this.addChild( new Image( "images/sweater.svg", {
      centerX: 0,
      centerY: 0
    } ) );

  }

  inherit( SweaterNode, Node ); // prototype chaining

  return SweaterNode;
} );
