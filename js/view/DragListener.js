// Copyright 2002-2013, University of Colorado Boulder

/**
 * Copied from SimpleDragHandler on 6-15-2013.  This drag listener keeps the mouse in the same relative location and respects constraints.
 *
 * @author Jonathan Olson <olsonsjc@gmail.com>
 */

define( function( require ) {
  'use strict';

  var Matrix3 = require( 'DOT/Matrix3' );

  var scenery = require( 'SCENERY/scenery' );

  /*
   * Allowed options: {
   *    allowTouchSnag: false // allow touch swipes across an object to pick it up,
   *    start: null           // if non-null, called when a drag is started. start( event, trail )
   *    drag: null            // if non-null, called when the user moves something with a drag (not a start or end event).
   *                                                                         drag( event, trail )
   *    end: null             // if non-null, called when a drag is ended.   end( event, trail )
   *    translate:            // if this exists, translate( { delta: _, oldPosition: _, position: _ } ) will be called instead of directly translating the node
   * }
   */
  var DragListener = function DragListener( positionProperty, options ) {
    this.positionProperty = positionProperty;
    var handler = this;
    var dragListener = this;

    this.options = _.extend( {
      allowTouchSnag: false
    }, options );

    this.dragging = false;     // whether a node is being dragged with this handler
    this.pointer = null;      // the pointer doing the current dragging
    this.trail = null;      // stores the path to the node that is being dragged
    this.transform = null;      // transform of the trail to our node (but not including our node, so we can prepend the deltas)
    this.node = null;      // the node that we are handling the drag for
    this.lastDragPoint = null;      // the location of the drag at the previous event (so we can calculate a delta)
    this.startTransformMatrix = null;      // the node's transform at the start of the drag, so we can reset on a touch cancel
    this.mouseButton = undefined; // tracks which mouse button was pressed, so we can handle that specifically

    // this listener gets added to the pointer when it starts dragging our node
    this.dragListener = {
      // mouse/touch up
      up: function( event ) {
        assert && assert( event.pointer === handler.pointer );
        if ( !event.pointer.isMouse || event.domEvent.button === handler.mouseButton ) {
          handler.endDrag( event );
        }
      },

      // touch cancel
      cancel: function( event ) {
        assert && assert( event.pointer === handler.pointer );
        handler.endDrag( event );

        // since it's a cancel event, go back!
        handler.node.setMatrix( handler.startTransformMatrix );
      },

      // mouse/touch move
      move: function( event ) {
        assert && assert( event.pointer === handler.pointer );

        var point = dragListener.transform.inversePosition2( event.pointer.point );
        point = point.minus( dragListener.relativePoint );
        positionProperty.set( point );
      }
    };
  };

  DragListener.prototype = {
    constructor: DragListener,

    startDrag: function( event ) {
      // set a flag on the pointer so it won't pick up other nodes
      event.pointer.dragging = true;
      event.pointer.addInputListener( this.dragListener );
      // event.trail.rootNode().addEventListener( this.transformListener ); // TODO: replace with new parent transform listening solution

      // set all of our persistent information
      this.dragging = true;
      this.pointer = event.pointer;
      this.trail = event.trail.subtrailTo( event.currentTarget, true );
      this.transform = this.trail.getTransform();
      this.node = event.currentTarget;
      this.lastDragPoint = event.pointer.point;
      this.startTransformMatrix = event.currentTarget.getMatrix();
      this.mouseButton = event.domEvent.button; // should be undefined for touch events
      var point = this.transform.inversePosition2( event.pointer.point );
      this.relativePoint = point.minus( this.positionProperty.get() );
      if ( this.options.start ) {
        this.options.start( event, this.trail );
      }
    },

    endDrag: function( event ) {
      this.pointer.dragging = false;
      this.pointer.removeInputListener( this.dragListener );
      // this.trail.rootNode().removeEventListener( this.transformListener ); // TODO: replace with new parent transform listening solution
      this.dragging = false;

      if ( this.options.end ) {
        this.options.end( event, this.trail );
      }
    },

    tryToSnag: function( event ) {
      // only start dragging if the pointer isn't dragging anything, we aren't being dragged, and if it's a mouse it's button is down
      if ( !this.dragging && !event.pointer.dragging ) {
        this.startDrag( event );
      }
    },

    /*---------------------------------------------------------------------------*
     * events called from the node input listener
     *----------------------------------------------------------------------------*/

    // mouse/touch down on this node
    down: function( event ) {
      this.tryToSnag( event );
    },

    // touch enters this node
    touchenter: function( event ) {
      // allow touches to start a drag by moving "over" this node
      if ( this.options.allowTouchSnag ) {
        this.tryToSnag( event );
      }
    }
  };

  return DragListener;
} );