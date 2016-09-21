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

  // constants
  var NEXT = 'NEXT';
  var PREVIOUS = 'PREVIOUS';

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
      hidden: false,
      ariaRole: null, // aria role for the element, can define extra semantics for the reader
      focusable: false // explicitly set whether the element can receive keyboard focus
    }, options );

    // @private
    this.type = options.type;

    // TODO
    // strip out focusable for now, it is still in scenery/Node mutator keys with
    // incorrect behavior - once fixed in scenery remove this line
    // temorarily named 'isFocusable' due to collision with scenery/Node
    this._isFocusable = options.focusable;
    options = _.omit( options, 'focusable');

    Node.call( this, options );
    var self = this;

    this.localBounds = bounds;

    // the main dom element representing this node in the accessibility tree
    self.domElement = document.createElement( options.type );

    // set tab index for keyboard focus
    if ( this._isFocusable ) { self.domElement.tabIndex = 0; }

    // set initial hidden state
    // TODO: Does this need to be done by the peer to hide the parent container? If jsut for structure, then NO.
    if ( options.hidden ) { self.domElement.hidden = true; }

    // add aria roles and attributes
    // TODO: This will be burden the GC for nodes that need to be created
    // and destroyed frequently
    for ( var role in options.ariaRoles ) {
      if ( options.ariaRoles.hasOwnProperty( role ) ) {
        self.domElement.setAttribute( role, options.ariaRoles[ role ] );
      }
    }

    // create the labels and descriptions
    // TODO: OK to have blank paragaphs?
    // TODO: This will have to be added in varying ways depending on the element type
    self.descriptionElement = document.createElement( 'p' );
    self.labelElement = document.createElement( 'p' );

    self.descriptionElement.textContent = options.description;
    self.labelElement.textContent = options.label;

    // if the type supports inner text, the label should be added as inner text
    if ( this.typeSupportsInnerText() && options.label ) {
      self.domElement.innerText = options.label;
    }

    // containers to hold DOM children if necessary
    // TODO: is the parent type ALWAYS necessary? Perhaps always for descriptions?
    if ( options.parentContainerType ) {
      self.parentContainerElement = document.createElement( options.parentContainerType );

      // with a parent container, the children are added here
      if ( !this.typeSupportsInnerText() ) {
        self.parentContainerElement.appendChild( self.labelElement );
      }
      self.parentContainerElement.appendChild( self.descriptionElement );
    }
    if ( options.childContainerType ) {
      self.childContainerType = document.createElement( options.childContainerType );
    }

    // now set the accessible content by creating an accessible peer
    this.accessibleContent = {
      focusHighlight: options.focusHighlight,
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

    /**
     * Some types support inner text, and these types should have a label
     * defined this way, rather than a second paragraph contained in a parent element.
     *
     * TODO: populate with more element types
     * @return {boolean}
     * @private
     */
    typeSupportsInnerText: function() {
      var supportsInnerText = false;

      var typesWithInnerText = [ 'button' ];
      for ( var i = 0; i < typesWithInnerText.length; i++ ) {
        if ( this.type === typesWithInnerText[ i ] ) {
          supportsInnerText = true;
        }
      }
      return supportsInnerText;
    },

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
      this._isFocusable = isFocusable;
      this.domElement.tabIndex = isFocusable ? 0 : -1;
    },
    set focusable( value ) { this.setFocusable( value ); },

    getFocusable: function() {
      return this._isFocusable;
    },
    get isFocusable() { this.getFocusable(); },

    /**
     * Focus this dom element
     *
     * @return {type}  description
     */
    focus: function() {
      // make sure that the elememnt is in the navigation order
      this.setFocusable( true );
      this.domElement.focus();
    },

    /**
     * Get all 'element' nodes off the parent element, placing them in an array
     * for easy traversal.  Note that this includes all elements, even those
     * that are 'hidden' or purely for structure.
     *
     * TODO: This should be somewhere deeper in scenery
     * @param  {DOMElement} domElement - the parent element to linearize
     * @return {Array.<DOMElement>}
     * @private
     */
    getLinearDOMElements: function( domElement ) {
      // gets ALL descendent children for the element
      var children = domElement.getElementsByTagName( '*' );

      var linearDOM = [];
      for ( var i = 0; i < children.length; i++ ) {

        // searching for the HTML type Node.ELEMENT_NODE, which is equal to 1
        if ( children[i].nodeType === 1 ) {
          linearDOM[i] = ( children[ i ] );
        }
      }
      return linearDOM;
    },

    /**
     * Get the
     *
     * @return {type}  description
     */
    getNextFocusable: function() {
      return this.getNextPreviousFocusable( NEXT );
    },

    getPreviousFocusable: function() {
      return this.getNextPreviousFocusable( PREVIOUS );
    },

    /**
     * Get the next focusable element in the parallel DOM.
     *
     * @return {Node}
     */
    getNextPreviousFocusable: function( direction ) {

      var nextFocusable;
      var linearDOM = this.getLinearDOMElements( document.getElementsByClassName( 'accessibility' )[ 0 ] );

      // list of attributes or element types that make an element focusable
      var focusableTypes = [ 'BUTTON', 'INPUT' ];

      // get the active element
      var activeElement = this.domElement;

      // get the index of the active element in the linear DOM
      var activeIndex;
      for ( var i = 0; i < linearDOM.length; i++ ) {

        // find the active element in the DOM
        if ( activeElement === linearDOM[ i ] ) {
          activeIndex = i;

          // direction to move through the DOM
          var delta = direction === NEXT ? +1 : -1;

          // find the next focusable element in the DOM
          var nextIndex = activeIndex + delta;
          while ( !nextFocusable && nextIndex < linearDOM.length - 1 ) {
            for ( var j = 0; j < focusableTypes.length; j++ ) {
              var nextElement = linearDOM[ nextIndex ];

              // continue to while if the next element is meant to be hidden
              if ( nextElement.hidden ) {
                break;
              }

              // if the next element is focusable, return it
              if ( nextElement.tabIndex > -1 ) {
                nextFocusable = nextElement;
                break;
              }
              else if ( nextElement.tagName === focusableTypes[ j ] ) {
                nextFocusable = nextElement;
                break;
              }
            }
            nextIndex += delta;
          }
          // break out of the while loop
          if ( nextFocusable ) {
            break;
          }
        }
      }

      // if no next focusable is found, return this DOMElement
      return nextFocusable || this.domElement;
    },

    alertAssertive: function() {
      console.log( 'please implement' );
    },

    alertPolite: function() {
      console.log( 'please implement' );
    }

  } );

} );
