// Copyright 2015, University of Colorado Boulder

/**
 * Accessibility content for a Scenery Node. Perhaps this could at some point be
 * merged into scenery/Node rather than extending it.
 *
 * @author: Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );
  var AccessiblePeer = require( 'SCENERY/accessibility/AccessiblePeer' );

  /**
   * Constructor for a button Node.
   * @constructor
   **/
  function AccessibleNode( bounds, options ) {

    options = _.extend( {
      type: 'button', // TODO: should this really be optional? Is button a proper default?
      parentContainerType: null, // container for this dom element and peer elements
      childContainerType: null, // container for children added to this element
      focusHighlight: null, // Node|Shape|Bounds2
      label: '', // string
      description: '', // string
      ariaDescribedby: false, // if true, the description will be read on focus
      events: {}, // object with keys of type event name, values of type function
      hotkeys: {}, // object with keys of type keycode and values of type function
      hidden: false
    }, options );

    Node.call( this, options );
    var self = this;

    // TODO: better way to do this - should be unecessary if BalloonNode extends this directly
    this.localBounds = bounds;

    // the main dom element representing this node in the accessibility tree
    self.domElement = document.createElement( options.type );
    self.domElement.textContent = 'this is a button';

    // create the labels and descriptions
    // TODO: OK to have blank paragaphs?
    // TODO: This will have to be added in varying ways depending on the element type
    self.descriptionElement = document.createElement( 'p' );
    self.labelElement = document.createElement( 'p' );

    self.descriptionElement.textContent = options.description;
    self.labelElement.textContent = options.label;

    // containers to hold DOM children if necessary
    // TODO: is the parent type ALWAYS necessary? Perhaps always for descriptions?
    if ( options.parentContainerType ) {
      self.parentContainerElement = document.createElement( options.parentContainerType );

      // with a parent container, the children are added here
      self.parentContainerElement.appendChild( self.labelElement );
      self.parentContainerElement.appendChild( self.descriptionElement );
    }
    if ( options.childContainerType ) {
      self.childContainerType = document.createElement( options.childContainerType );
    }

    // now set the accessible content by creating an accessible peer
    this.accessibleContent = {
      focusHighlight: self.bounds,
      createPeer: function( accessibleInstance ) {

        // register listeners to the events
        // TODO: This will be burden the GC for nodes that need to be created
        // and destroyed frequently
        for ( var event in options.events ) {
          if ( options.events.hasOwnProperty( event ) ) {
            self.domElement.addEventListener( event, options.events[ event ] );
          }
        }

        return new AccessiblePeer( accessibleInstance, self.domElement, {
          parentContainerElement: self.parentContainerElement,
          childContainerElement: self.childContainerElement
        } );
      }
    };

    this.disposeAccessibleNode = function() {
      // TODO: This will be burden the GC for nodes that need to be create and destroyed frequently
      for ( var event in options.events ) {
        if ( options.events.hasOwnProperty( event ) ) {
          self.domElement.removeEventListener( event, options.events[ event ] );
        }
      }
    };
  }

  return inherit( Node, AccessibleNode, {

    dispose: function() {
      this.disposeAccessibleNode();
    },

    /**
     * Set the description of this widget element
     *
     * @param  {type} textContent description
     */
    setDescription: function( textContent ) {
      assert && assert( self.descriptionElement, 'desription element must exist in prallel DOM' );
      self.descriptionElement.textContent = textContent;
    },

    /**
     * Hide completely from a screen reader by setting the aria-hidden attribute.
     *
     * @param  {boolean} hidden
     */
    setHidden: function( hidden ) {
      this.domElement.hidden = hidden ;
    },

    /**
     * Make the container dom element focusable
     *
     * @param {boolean} isFocusable
     */
    setFocusable: function( isFocusable ) {
      this.domElement.tabIndex = isFocusable ? 0 : -1;
    },

    /**
     * Focus this dom element
     *
     * @return {type}  description
     */
    focus: function() {
      this.domElement.focus();
    }
  } );

} );
