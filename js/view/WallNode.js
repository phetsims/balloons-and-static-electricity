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
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  function WallNode( maxX, maxY ) {
    var self = this;

    // super constructor
    Node.call( this, { cursor: 'pointer' } );

    // add the centered bar magnet image

    this.addChild( new Rectangle( maxX - 70, 0, 70, maxY, {
      fill: '#ff0'
    } ) );

  }

  inherit( WallNode, Node ); // prototype chaining

  return WallNode;
} );
