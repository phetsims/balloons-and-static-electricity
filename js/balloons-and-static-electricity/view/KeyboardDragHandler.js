// Copyright 2017, University of Colorado Boulder

/**
 * A general type for keyboard dragging.  Updates a position Property with keyboard interaction.  Objects can be
 * dragged in two dimensions with the arrow keys and with the WASD keys.
 *
 * JavaScript does not natively handle many 'keydown' events at once, so we have a custom implementation that
 * tracks which keys are down and for how long in a step() function. Therefore, this drag handler requires a view step.
 * 
 * @author Jesse Greenberg
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );
  var Vector2 = require( 'DOT/Vector2' );
  var Input = require('SCENERY/input/Input' );
  var Bounds2 = require( 'DOT/Bounds2' );

  /**
   * @constructor
   * @param {Property} positionProperty
   * @param {Object} options
   */
  function KeyboardDragHandler( positionProperty, options ) {

    var self = this;
    options = _.extend( {
      positionDelta: 5, // while the key is down, 1D delta for the positionProperty
      shiftKeyMultiplier: 2, // if shift key is down, dragging speed will be changed by this multiplier
      dragBounds: Bounds2.EVERYTHING // position will be limited to these bounds
    }, options );

    // @private - tracks the state of the keyboard, key value pairs of keycode {number} and isDown {boolean}
    // JavaScript doesn't handle multiple key presses, so we track whcih keys are currently down and update via step()
    this.keyState = {};

    // @private - the change in position (in model coordinates) that will be applied by
    // dragging with the keyboard
    this.positionDelta = options.positionDelta;

    // @private
    this.shiftKeyMultiplier = options.shiftKeyMultiplier;
    this.positionProperty = positionProperty;
    this._dragBounds = options.dragBounds;

    // @public (read-only) - listener that will be added to the node for dragging behavior, made public on the Object
    // so that a KeyboardDragHandler can be added via myNode.addAccessibleInputListener( myKeyboardDragHandler )
    this.keydown = function( event ) {

      // required to work with Safari and VoiceOver, otherwise arrow keys will move virtual cursor
      if ( Input.isArrowKey( event.keyCode ) ) {
        event.preventDefault();
      }

      // update the key state
      self.keyState[ event.keyCode ] = true;
    };

    // @public (read-only) - listener that will be added to the node for dragging behavior, made public on the Object
    // so that a KeyboardDragHandler can be added via myNode.addAccessibleInputListener( myKeyboardDragHandler )
    this.keyup = function( event ) {

      // update the key state
      self.keyState[ event.keyCode ] = false;
    };
  }

  balloonsAndStaticElectricity.register( 'KeyboardDragHandler', KeyboardDragHandler );

  return inherit( Object, KeyboardDragHandler, {

    /**
     * Step function for the drag handler. JavaScript does not natively handle many keydown events at once,
     * so we need to track the state of the keyboard in an Object and update the position Property in a step
     * function based on the keyboard state object every animation frame.  In order for the drag handler to
     * work, call this function somewhere in ScreenView.step().
     * 
     * @public
     */
    step: function( dt ) {

      var deltaX = 0;
      var deltaY = 0;
      var positionDelta = this.shiftKeyDown() ? ( this.positionDelta * this.shiftKeyMultiplier ) : this.positionDelta;

      if ( this.leftMovementKeysDown() ) {
        deltaX = -positionDelta;
      }
      if ( this.rightMovementKeysDown() ) {
        deltaX = positionDelta;
      }
      if ( this.upMovementKeysDown() ) {
        deltaY = -positionDelta;
      }
      if ( this.downMovementKeysDown() ) {
        deltaY = positionDelta;
      }

      // determine if the new position is within the constraints of the drag bounds
      var vectorDelta = new Vector2( deltaX, deltaY );
      var newPosition = this.positionProperty.get().plus( vectorDelta );
      newPosition = this._dragBounds.closestPointTo( newPosition );

      // update the position if it is different
      if ( !newPosition.equals( this.positionProperty.get() ) ) {
        this.positionProperty.set( newPosition );
      }
    },

    /**
     * Returns true if the keystate indicates that a key is down that should move the object to the left.
     * 
     * @private
     * @return {boolean}
     */
    leftMovementKeysDown: function() {
      return this.keyState[ Input.KEY_LEFT_ARROW ] || this.keyState[ Input.KEY_A ];
    },

    /**
     * Returns true if the keystate indicates that a key is down that should move the object to the right.
     * 
     * @public
     * @return {boolean}
     */
    rightMovementKeysDown: function() {
      return this.keyState[ Input.KEY_RIGHT_ARROW ] || this.keyState[ Input.KEY_D ];
    },

    /**
     * Returns true if the keystate indicatest that a key is down that should move the object up.
     * 
     * @public
     * @return {boolean}
     */
    upMovementKeysDown: function() {
      return this.keyState[ Input.KEY_UP_ARROW ] || this.keyState[ Input.KEY_W ];
    },

    /**
     * Returns true if the keystate indicates that a key is down that should move the upject down.
     * 
     * @public
     * @return {boolean}
     */
    downMovementKeysDown: function() {
      return this.keyState[ Input.KEY_DOWN_ARROW ] || this.keyState[ Input.KEY_S ];
    },

    /**
     * Returns true if the keystate indicates that the shift key is currently down.
     * 
     * @return {boolean}
     */
    shiftKeyDown: function() {
      return this.keyState[ Input.KEY_SHIFT ];
    },

    /**
     * Sets the bounds for dragging with the keyboard.
     *
     * @public
     * @param {Bounds2} dragBounds
     */
    setDragBounds: function( dragBounds ) {
      this._dragBounds = dragBounds.copy();
      this.positionProperty.set( this._dragBounds.closestPointTo( this.positionProperty.get() ) );
    },
    set dragBounds( dragBounds ) { this.setDragBounds( dragBounds ); },

    /**
     * Get the Bounds2 Object wich constrains the possible Vector2 values of the position Property.
     * 
     * @public
     * @return {Bounds2}
     */
    getDragBounds: function() {
      return this._dragBounds;
    },
    get dragBounds() { return this.getDragBounds(); },

    /**
     * Reset the keystate Object tracking which keys are currently pressed down.
     * 
     * @public
     */
    reset: function() {
      this.keyState = {};
    }

  } );
} );
