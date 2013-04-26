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

  function BalloonNode( x, y, model, imgsrc, globalModel ) {
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
                                                      model.location = globalModel.getBalloonRestrictions( args.position, model.width, model.height );
                                                    }
                                                  } ) );

    // add the Balloon image
    this.addChild( new Image( imgsrc, {
    } ) );

    model.link( 'location', function updateLocation( location ) {
      self.translation = location;
    } );

    model.link('isVisible',function updateVisibility (boolean) {
      self.visible = boolean;
    });

    model.view = this;
  }

  inherit( BalloonNode, Node ); // prototype chaining

  return BalloonNode;
} );
