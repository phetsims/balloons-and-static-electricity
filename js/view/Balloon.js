// Copyright 2002-2013, University of Colorado

/**
 * Scenery display object (scene graph node) for the Balloon of the model.
 *
 *
 @author Vasily Shakhov (Mlearner)
 */

define( function ( require ) {
  'use strict';
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Image = require( 'SCENERY/nodes/Image' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );

  function BalloonNode( x, y, model, imgsrc ) {
    var self = this;

    // super constructor
    Node.call( this, { cursor: 'pointer' } );

    this.x = x;
    this.y = y;

    //When dragging, move the balloon
    this.addInputListener( new SimpleDragHandler( {
                                                    //When dragging across it in a mobile device, pick it up
                                                    allowTouchSnag: true,

                                                    //Translate on drag events
                                                    translate: function ( args ) {
                                                      console.log("translating!")
                                                      this.location = args.position;
                                                    }
                                                  } ) );

    // add the Sweater image
    this.addChild( new Image( imgsrc ) );

  }

  inherit( BalloonNode, Node ); // prototype chaining

  return BalloonNode;
} );
