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
  var KEY_J = 74; // keycode for 'j'
  var KEY_C = 67; // keycode for 'j'
  var KEY_N = 78; // keycode for 'j'
  var KEY_SHIFT = 16; // shift key down  
  var KEY_LEFT = 37; // left arrow key
  var KEY_RIGHT = 39; // right arrow key
  var KEY_UP = 38; // up arrow key
  var KEY_DOWN = 40; // down arrow key

  /**
   * Constructor for a button Node.
   * @constructor
   **/
  function AccessibleDragNode( locationProperty, options ) {

    // validate options - the draggable node must be represented with <div role='application'> for screen reader support
    assert && assert( !options.tagName || options.tagName === 'div', 'a draggable element must be represented by a div' );
    assert && assert( !options.ariaRole || options.role === 'application', 'draggable peer must be of role "application"' );
    if ( options.events ) {
      assert && assert( !options.events.keydown && !options.events.keyup, 'please use options.onKeyUp or options.onKeyDown for keyboard dragging' );
    }

    options = _.extend( {
      tagName: 'div',
      ariaRole: 'application',
      events: {
        keydown: function( event ) {

          // if key down is for dragging, prevent default
          if ( self.draggableKeyUp( event.keyCode ) ) {
            // required for VoiceOver with Safari
            event.preventDefault();
          }

          // update the key state on down
          self.keyState[ event.keyCode || event.which ] = {
            isKeyDown: true,
            keyEvent: event
          };

          options.onKeyDown( event );

          // notify that key state changed
          self.keyStateChangedEmitter.emit1( event );
          self.keyDownEmitter.emit1( event );
        },
        keyup: function( event ) {

          // update the key state on down
          self.keyState[ event.keyCode || event.which ] = {
            isKeyDown: false,
            keyEvent: event
          };

          options.onKeyUp( event );

          // notify that key state changed
          if ( self.keyState[ KEY_J ] ) {
            if ( !self.keyState[ KEY_J ].isKeyDown ) {
              self.keyStateChangedEmitter.emit1( event );
              self.keyUpEmitter.emit1( event );
            }
            else {
              self.balloonJumpingEmitter.emit1( event );
            }
          }
        }
      },
      onTab: function() {}, // optional function to call when user 'tabs' away
      restrictLocation: function() {}, // fires during the drag
      positionDelta: 5, // change in model coordinates when user presses directional key, in model coordinates
      dragBounds: Bounds2.EVERYTHING, // drag bounds (like MovableDragHandler) in model coordinate frame
      modelViewTransform: ModelViewTransform2.createIdentity(), // {ModelViewTransform2} defaults to identity
      focusable: true,
      onKeyUp: function() {},
      onKeyDown: function() {}
    }, options );


    var self = this;

    // @private - track the state of pressed keys - JavaScript doesn't handle multiple key presses, so we track which
    // keys are pressed and track how long they are down in ms via step()
    this.keyState = {};

    // @public - emit when the keystate changes
    this.keyStateChangedEmitter = new Emitter();
    this.keyUpEmitter = new Emitter();
    this.keyDownEmitter = new Emitter();

    // TODO Temporary hack to get working balloon
    this.keyState[ KEY_J ] = {
      isKeyDown: false,
      keyEvent: null
    };

    // TODO: Temporary for now...
    this.balloonJumpingEmitter = new Emitter();

    // @private
    this.restrictLocation = options.restrictLocation;

    // @private
    this.locationProperty = locationProperty;
    this._positionDelta = options.positionDelta;
    this._dragBounds = options.dragBounds;
    this._modelViewTransform = options.modelViewTransform;
    this._onTab = options.onTab;

    // button contained in a div so that it can contain descriptions or other children
    AccessibleNode.call( this, options );
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

      // if tab is down, we may want to do something specific (like drop the element or focus something other than what
      // is in the default navigation order )
      if ( self.keyState[ KEY_TAB ] && self.keyState[ KEY_TAB ].isKeyDown ) {
        self._onTab( self.keyState[ KEY_TAB ].keyEvent );

        // keyup is fired immediately for tab, so now update the keystate
        self.keyState[ KEY_TAB ].isKeyDown = false;
      }

      var deltaX = 0;
      var deltaY = 0;

      // TODO: This is specific to BASE... hotkeys need to be generalized
      if ( self.isKeyDown( KEY_J ) ) {

        // we have begun a jump interaction, here are the additional key presses
        if ( self.isKeyDown( KEY_S ) ) {
          self.locationProperty.set( new Vector2( 375 - 67, self.locationProperty.get().y ) );
        }
        if ( self.isKeyDown( KEY_W ) ) {
          self.locationProperty.set( new Vector2( 621 - 67, self.locationProperty.get().y ) );
        }
        if ( self.isKeyDown( KEY_C ) ) {
          self.locationProperty.set( new Vector2( 507 - 67, self.locationProperty.get().y ) );
        }
        if ( self.isKeyDown( KEY_N ) ) {
          self.locationProperty.set( new Vector2( 577 - 67, self.locationProperty.get().y ) );
        }
      }
      else {
        if ( self.isKeyDown( KEY_A ) || self.isKeyDown( KEY_LEFT ) ) {
          deltaX = -self._positionDelta;
        }
        if ( self.isKeyDown( KEY_D ) || self.isKeyDown( KEY_RIGHT ) ) {
          deltaX = self._positionDelta;
        }
        if ( self.isKeyDown( KEY_W ) || self.isKeyDown( KEY_UP ) ) {
          deltaY = -self._positionDelta;
        }
        if ( self.isKeyDown( KEY_S ) || self.isKeyDown( KEY_DOWN ) ) {
          deltaY = self._positionDelta;
        }
        if ( self.isKeyDown( KEY_SHIFT ) ) {
          deltaX /= 4;
          deltaY /= 4;
        }
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
     * Check to see if the key up was one of the keys that drags the element.
     *
     * @param {number} keyCode - event key code on the 'keyup' event
     * @return {boolean}
     */
    draggableKeyUp: function( keyCode ) {
      return ( keyCode === KEY_S || keyCode === KEY_W || keyCode === KEY_A || keyCode === KEY_D || 
                keyCode === KEY_LEFT || keyCode === KEY_RIGHT || keyCode === KEY_UP || keyCode === KEY_DOWN );
    },

    /**
     * Check to see if a key is currently down
     *
     * @private
     * @param  {number} keyCode
     * @return {Boolean}
     */
    isKeyDown: function( keyCode ) {
      return this.keyState[ keyCode ] && this.keyState[ keyCode ].isKeyDown;
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
    get dragBounds() { return this.getDragBounds(); }
  } );
} );