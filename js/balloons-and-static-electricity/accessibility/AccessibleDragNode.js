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
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );
  var AccessiblePeer = require( 'SCENERY/accessibility/AccessiblePeer' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Bounds2 = require( 'DOT/Bounds2' );
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
  function AccessibleDragNode( locationProperty, options ) {

    options = _.extend( {
      label: '',
      focusable: true, // can this element be focused?
      onTab: function() {}, // optional function to call when user 'tabs' away
      hotkeys: {}, // object with keys of type keycode and values of type function - add to the common type!
      onKeyDown: function() {}, // called on key down
      onKeyUp: function() {}, // called whenever a key is released
      positionDelta: 5, // change in model coordinates when user presses directional key, in model coordinates
      dragBounds: Bounds2.EVERYTHING, // drag bounds (like MovableDragHandler) in model coordinate frame
      modelViewTransform: ModelViewTransform2.createIdentity() // {ModelViewTransform2} defaults to identity
    }, options );

    // @private - track the state of pressed keys - JavaScript doesn't handle
    // multiple key presses, so we track which keys are pressed
    // and track how long they are down in ms via step()
    this.keyState = {};

    // @private
    this.locationProperty = locationProperty;
    this._positionDelta = options.positionDelta;
    this._dragBounds = options.dragBounds;
    this._modelViewTransform = options.modelViewTransform;
    this._onTab = options.onTab;

    // button contained in a div so that it can contain descriptions or other children
    // TODO: accessible nodes should extend this some how
    var self = this;
    AccessibleNode.call( this, options );

    // create the button
    var draggableNode = new Node( {
      accessibleContent: {
        focusHighlight: options.focusHighlight,
        createPeer: function( accessibleInstance ) {

          self._draggableElement = document.createElement( 'div' );

          // provide the 'application' role so that we can use the keyboard
          // when a screen reader is enabled
          self._draggableElement.setAttribute( 'role', 'application' );

          // a draggable element is generally focusable
          self._draggableElement.tabIndex = 0;

          // some screen readers will anounce this to notify
          // that thte element can be dragged
          self._draggableElement.setAttribute( 'draggable', 'true' );

          // set the label
          self._draggableElement.textContent = options.label;

          // implement accessible drag and drop behavior
          self._draggableElement.addEventListener( 'keydown', function( event ) {
            // update the key state on down
            self.keyState[ event.keyCode || event.which ] = true;

            options.onKeyDown( event );
          } );

          self._draggableElement.addEventListener( 'keyup', function( event ) {
            // update the keystate object on up
            self.keyState[ event.keyCode || event.which ] = false;

            options.onKeyUp( event );
          } );

          return new AccessiblePeer( accessibleInstance, self._draggableElement );

        }
      }
    } );
    this.addChild( draggableNode );

    // if there is an accessible description, create as a paragraph and add
    // as a child of the container node
    if ( options.description ) {
      var descriptionNode = new Node( {
        accessibleContent: {
          createPeer: function( accessibleInstance ) {
            var domElement = document.createElement( 'p' );
            domElement.textContent = options.description;

            return new AccessiblePeer( accessibleInstance, domElement );
          }
        }
      } );
      this.addChild( descriptionNode );
    }
  }

  return inherit( AccessibleNode, AccessibleDragNode, {
    setLabel: function() {}, // set the accessible label
    setDescription: function() {}, // set the accessible description
    setFocusable: function() {}, // add/remove from navigable order


    /**
     * Focus the draggable element, overriding the parent function
     *
     * @return {type}  description
     * @override
     */
    focus: function() {
      this._draggableElement.focus();
    },

    /**
     * Update the keystate in miliseconds
     * TODO: Use emitters instead of step in AcccesssibleDragNode
     * This will remove the need to track the keystate in miliseconds
     *
     * @return {type}  description
     */
    step: function() {
      // if tab is down, we may want to do something specfic
      // (like drop the element or focus something other than
      // what is in the default navigation order )
      if ( this.keyState[ KEY_TAB ] ) {
        this._onTab();
      }

      var deltaX = 0;
      var deltaY = 0;
      if ( this.keyState[ KEY_A ] ) {
        deltaX = -this._positionDelta;
      }
      if ( this.keyState[ KEY_D ] ) {
        deltaX = this._positionDelta;
      }
      if ( this.keyState[ KEY_W ] ) {
        deltaY = -this._positionDelta;
      }
      if ( this.keyState[ KEY_S ] ) {
        deltaY = this._positionDelta;
      }

      var locationDelta = this._modelViewTransform.modelToViewDelta( new Vector2( deltaX, deltaY ) );
      var newLocation = this._dragBounds.closestPointTo( this.locationProperty.value.plus( locationDelta ) );

      if ( !newLocation.equals( this.locationProperty.value ) ) {
        this.locationProperty.set( newLocation );
      }
    }, // must be called by view step
    setPositionDelta: function() {} // set the position delta when directional key is pressed
  } );

} );
