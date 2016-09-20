// Copyright 2015, University of Colorado Boulder

/**
 * A node in the scene graph with representation in the Parallel DOM.  This node can be 'dragged' with
 * WASD keys.
 *
 * @author: Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Emitter = require( 'AXON/Emitter' );
  var Vector2 = require( 'DOT/Vector2' );
  var AccessibleNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/accessibility/AccessibleNode' );

  // constants
  var KEY_TAB = 9;
  var KEY_S = 83; // keycode for 's'
  var KEY_W = 87; // keyvode for 'w'
  var KEY_A = 65; // keycode for 'a'
  var KEY_D = 68; // keycode for 'd'

  /**
   * Constructor for a button Node.
   * @constructor
   **/
  function AccessibleDragNode( nodeBounds, locationProperty, options ) {

    var self = this;

    // @private - track the state of pressed keys - JavaScript doesn't handle
    // multiple key presses, so we track which keys are pressed
    // and track how long they are down in ms via step()
    this.keyState = {};

    // @private - emit when the keystate changes
    this.keyStateChangedEmitter = new Emitter();

    /**
     * Update the keystate object when a keypress occurs.
     *
     * @param  {DOMEvent} event
     * @param  {boolean} keyDown - was the key pressed down?
     */
    var updateKeyState = function( event, keyDown ) {

      // update the key state on down
      self.keyState[ event.keyCode || event.which ] = true;

      // optional behavior when a key is pressed
      // TODO: Just check WASD keys?
      options.onKeyDown( event );

      // notify that key state changed
      self.keyStateChangedEmitter.emit();
    };

    // the key drag events for dragging with the WASD keys
    // TODO: this is really bad - we need to addEventListeners not have one for each event type
    var dragKeyEvents = {
      keydown: function( event ) {
        updateKeyState( event, true );
      },
      keyup: function( event ) {
        updateKeyState( event, false );
      }
    };
    options = _.extend( {
      tabIndex: 0, // most draggable elements will be in the navigation order
      events: _.extend( dragKeyEvents, options.events ), // this is REALLY bad
      onTab: function() {}, // optional function to call when user 'tabs' away
      onKeyDown: function() {}, // called on key down
      onKeyUp: function() {}, // called whenever a key is released
      positionDelta: 5, // change in model coordinates when user presses directional key, in model coordinates
      dragBounds: Bounds2.EVERYTHING, // drag bounds (like MovableDragHandler) in model coordinate frame
      modelViewTransform: ModelViewTransform2.createIdentity() // {ModelViewTransform2} defaults to identity
    }, options );

    // validate options - the draggable node must be represented with <div role='application'> for
    // screen reader support
    assert && assert( !options.type || options.type === 'div', 'a draggable element must be represented by a div' );
    options.type = 'div';

    // the element must have the application role for dragging behavior
    assert && assert( !options.ariaRole || options.role === 'application', 'draggable peer must be of role "application"' );
    options.ariaRole = 'application';

    // @private
    this.locationProperty = locationProperty;
    this._positionDelta = options.positionDelta;
    this.dragBounds = options.dragBounds;
    this.modelViewTransform = options.modelViewTransform;
    this.onTab = options.onTab;

    // button contained in a div so that it can contain descriptions or other children
    AccessibleNode.call( this, nodeBounds, options );

    // the dom element is explicitly draggable
    this.domElement.draggable = true;

    // listen for changes to the keystate and update the model vavlue
    this.keyStateChangedEmitter.addListener( function() {
      // if tab is down, we may want to do something specific (like drop the element or
      // focus something other than what is in the default navigation order )
      if ( self.keyState[ KEY_TAB ] ) {
        options.onTab();
      }

      var deltaX = 0;
      var deltaY = 0;
      if ( self.keyState[ KEY_A ] ) {
        deltaX = -self._positionDelta;
      }
      if ( self.keyState[ KEY_D ] ) {
        deltaX = self._positionDelta;
      }
      if ( self.keyState[ KEY_W ] ) {
        deltaY = -self._positionDelta;
      }
      if ( self.keyState[ KEY_S ] ) {
        deltaY = self._positionDelta;
      }

      var locationDelta = options.modelViewTransform.modelToViewDelta( new Vector2( deltaX, deltaY ) );
      var newLocation = self.dragBounds.closestPointTo( self.locationProperty.value.plus( locationDelta ) );

      // update the location if it is different
      if ( !newLocation.equals( self.locationProperty.value ) ) {
        self.locationProperty.set( newLocation );
      }
    } );
  }

  return inherit( AccessibleNode, AccessibleDragNode, {

    /**
     * Focus the draggable element, overriding the super type function
     *
     * @return {type}  description
     * @override
     */
    // focus: function() {
      // this._draggableElement.focus();
    // },

    /**
     * Set the position delta for the draggable element when a key is pressed
     *
     * @param  {number} newDelta - delta for position in model coordinates
     * @return {type}          description
     */
    setPositionDelta: function( newDelta ) {
      this._positionDelta = newDelta;
    }
  } );

} );
