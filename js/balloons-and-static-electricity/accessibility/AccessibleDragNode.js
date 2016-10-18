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
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );
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

    options = _.extend( {
      onTab: function() {}, // optional function to call when user 'tabs' away
      restrictLocation: function() {}, // fires during the drag
      positionDelta: 5, // change in model coordinates when user presses directional key, in model coordinates
      dragBounds: Bounds2.EVERYTHING, // drag bounds (like MovableDragHandler) in model coordinate frame
      modelViewTransform: ModelViewTransform2.createIdentity(), // {ModelViewTransform2} defaults to identity
      focusable: true,
      onKeyUp: function() {}
    }, options );

    // @private
    this.restrictLocation = options.restrictLocation;

    // the key drag events for dragging with the WASD keys
    var dragKeyEvents = [
      {
        eventName: 'keydown',
        eventFunction: function( event ) {

          // update the key state on down
          self.keyState[ event.keyCode || event.which ] = {
            isKeyDown: true,
            keyEvent: event
          };

          // notify that key state changed
          self.keyStateChangedEmitter.emit();
        }
      },
      {
        eventName: 'keyup',
        eventFunction: function( event ) {

          // update the key state on down
          self.keyState[ event.keyCode || event.which ] = {
            isKeyDown: false,
            keyEvent: event
          };

          if ( self.draggableKeyUp( event.keyCode || event.which ) ) {
            options.onKeyUp();
          }

          // notify that key state changed
          self.keyStateChangedEmitter.emit();
        }
      }
    ];
    options.events = dragKeyEvents.concat( options.events || [] );

    // validate options - the draggable node must be represented with <div role='application'> for
    // screen reader support
    assert && assert( !options.tagName || options.tagName === 'div', 'a draggable element must be represented by a div' );
    options.tagName = 'div';

    // the element must have the application role for dragging behavior
    assert && assert( !options.ariaRole || options.role === 'application', 'draggable peer must be of role "application"' );
    options.ariaRole = 'application';

    // @private
    this.locationProperty = locationProperty;
    this._positionDelta = options.positionDelta;
    this._dragBounds = options.dragBounds;
    this._modelViewTransform = options.modelViewTransform;
    this._onTab = options.onTab;

    // button contained in a div so that it can contain descriptions or other children
    AccessibleNode.call( this, nodeBounds, options );

    // the dom element is explicitly draggable, but not picked up
    this.domElement.draggable = true;
    this.setGrabbedState( false );

    // // listen for changes to the keystate and update the model vavlue
    // this.keyStateChangedEmitter.addListener( function() {
    //   // if tab is down, we may want to do something specific (like drop the element or
    //   // focus something other than what is in the default navigation order )
    //   if ( self.keyState[ KEY_TAB ] ) {
    //     options.onTab();
    //   }
    //
    //   var deltaX = 0;
    //   var deltaY = 0;
    //   if ( self.keyState[ KEY_A ] ) {
    //     deltaX = -self._positionDelta;
    //   }
    //   if ( self.keyState[ KEY_D ] ) {
    //     deltaX = self._positionDelta;
    //   }
    //   if ( self.keyState[ KEY_W ] ) {
    //     deltaY = -self._positionDelta;
    //   }
    //   if ( self.keyState[ KEY_S ] ) {
    //     deltaY = self._positionDelta;
    //   }
    //
    //   var locationDelta = options.modelViewTransform.modelToViewDelta( new Vector2( deltaX, deltaY ) );
    //   var newLocation = self.dragBounds.closestPointTo( self.locationProperty.value.plus( locationDelta ) );
    //
    //   // update the location if it is different
    //   if ( !newLocation.equals( self.locationProperty.value ) ) {
    //     self.locationProperty.set( newLocation );
    //   }
    // } );
  }

  balloonsAndStaticElectricity.register( 'AccessibleDragNode', AccessibleDragNode );

  return inherit( AccessibleNode, AccessibleDragNode, {

    /**
     * Set the position delta for the draggable element when a key is pressed
     *
     * @param  {number} newDelta - delta for position in model coordinates
     */
    setPositionDelta: function( newDelta ) {
      this._positionDelta = newDelta;
    },

    step: function() {

      var self = this;
      // if tab is down, we may want to do something specific (like drop the element or
      // focus something other than what is in the default navigation order )
      if ( self.keyState[ KEY_TAB ] && self.keyState[ KEY_TAB ].isKeyDown ) {
        self._onTab( self.keyState[ KEY_TAB].keyEvent );
        // keyup is fired immediately for tab, so now update the keystate
        self.keyState[ KEY_TAB ].isKeyDown = false;
      }

      var deltaX = 0;
      var deltaY = 0;
      if ( self.keyState[ KEY_A ] && self.keyState[ KEY_A ].isKeyDown ) {
        deltaX = -self._positionDelta;
      }
      if ( self.keyState[ KEY_D ] && self.keyState[ KEY_D ].isKeyDown ) {
        deltaX = self._positionDelta;
      }
      if ( self.keyState[ KEY_W ] && self.keyState[ KEY_W ].isKeyDown ) {
        deltaY = -self._positionDelta;
      }
      if ( self.keyState[ KEY_S ] && self.keyState[ KEY_S ].isKeyDown ) {
        deltaY = self._positionDelta;
      }

      var locationDelta = new Vector2( deltaX, deltaY );
      var newLocation = self.locationProperty.get().plus( locationDelta );
      newLocation = self._dragBounds.closestPointTo( newLocation );

      // update the location if it is different
      if ( !newLocation.equals( self.locationProperty.value ) ) {
        self.locationProperty.set( newLocation );
      }
    },

    /**
     * For accessibility, the element can be 'grabbed' while the focus is somewhere else.
     * ara-grabbed specifies the grabbed state for a screen reader.
     *
     * @param {boolean} grabbed
     */
    setGrabbedState: function( grabbed ) {
      this.domElement.setAttribute( 'aria-grabbed', grabbed );
    },

    /**
     * Check to see if the key up was one of the keys that drags the element.
     *
     * @param {number} keyCode - event key code on the 'keyup' event
     * @return {boolean}
     */
    draggableKeyUp: function( keyCode ) {
      return ( keyCode === KEY_S || keyCode === KEY_W || keyCode === KEY_A || keyCode === KEY_D );
    },

    /**
     * Sets the dragBounds.
     * In addition, it forces the location to be within the bounds.
     * @param {Bounds2} dragBounds
     * @public
     */
    setDragBounds: function( dragBounds ) {
      this._dragBounds = dragBounds.copy();
      this.locationProperty.set( this._dragBounds.closestPointTo( this.locationProperty.get() ) );
    },
    set dragBounds( value ) { this.setDragBounds( value ); },

    /**
     * Gets the dragBounds. Clients should not mutate the value returned.
     * @returns {Bounds2}
     * @public
     */
    getDragBounds: function() {
      return this._dragBounds;
    },
    get dragBounds() { return this.getDragBounds(); },
  } );

} );
