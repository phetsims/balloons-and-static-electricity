// Copyright 2015, University of Colorado Boulder

/**
 * Accessibility content for a Scenery Node. This could eventually be moved to and scenery/Node
 * with accessible content could extend this.
 *
 * @author: Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );
  var AccessiblePeer = require( 'SCENERY/accessibility/AccessiblePeer' );
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );

  // constants
  var NEXT = 'NEXT';
  var PREVIOUS = 'PREVIOUS';

  // specific DOM tagnames, used for handling how attributes and label are added
  var DOM_INPUT = 'INPUT';
  var DOM_LABEL = 'LABEL';
  var DOM_UNORDERED_LIST = 'UL';

  // identifier to generate id's for list items for this Node's description
  var ITEM_NUMBER = 0;

  /**
   * Constructor for an accessible Node.
   *
   * @param {Object} options
   * @constructor
   **/
  function AccessibleNode( options ) {

    options = _.extend( {
      tagName: 'button', // TODO: should this really be optional? Is button a proper default?
      inputType: null, // only relevant if tagName is 'intput'
      parentContainerTagName: null, // container for this dom element and peer elements
      childContainerTagName: null, // container for children added to this element
      focusHighlight: null, // Node|Shape|Bounds2 - default is a pink rectangle around the node's local bounds
      label: '', // string
      useAriaLabel: false, // if true, a label element will not be created and the label will be inline with aria-label
      useInnerLabel: false, // if true, the label will be added to the element as innerText 
      description: '', // string
      descriptionTagName: 'p', // tagname for the element containing the description, usually a paragraph or a list item
      labelTagName: 'p', // tagname for the elemnet containing the label, usually a paragraph, label, or heading
      events: {}, // array of objects with keys of type event name, values of type function
      hidden: false, // hides the element in the paralllel DOM
      ariaRole: null, // aria role for the element, can define extra semantics for the reader
      focusable: false, // explicitly set whether the element can receive keyboard focus
      domStyle: null, // extra styling for the parallel DOM, can be needed by Safari to support navigation
      ariaAttributes: [], // array of objects specifying aria attributes - keys attribute and value
      ariaDescribedBy: null, // an ID of a description element to describe this dom element
      ariaLabelledBy: null // an ID of a label element to describe this dom element
    }, options );

    // @private
    this.tagName = options.tagName;

    // TODO
    // strip out focusable for now, it is still in scenery/Node mutator keys with
    // incorrect behavior - once fixed in scenery remove this line
    // temporarily named 'isFocusable' due to collision with scenery/Node
    this._isFocusable = options.focusable;
    options = _.omit( options, 'focusable');

    Node.call( this, options );
    var self = this;

    // the main dom element representing this node in the accessibility tree
    self.domElement = document.createElement( options.tagName );

    // the dom element is labeled by the id of the node in the scene graph
    this.domElement.id = this.id;

    // set tab index for keyboard focus
    if ( this._isFocusable ) { self.domElement.tabIndex = 0; }

    // set initial hidden state
    // TODO: Does this need to be done by the peer to hide the parent container? If jsut for structure, then NO.
    if ( options.hidden ) { self.domElement.hidden = true; }

    // add aria role
    if ( options.ariaRole ) { this.domElement.setAttribute( 'role', options.ariaRole ); }

    // add type if supported and defined
    if ( this.domElement.tagName === DOM_INPUT && options.inputType ) {
      this.domElement.type = options.inputType;
    }

    for ( var i = 0; i < options.ariaAttributes.length; i++ ) {
      var ariaAttribute = options.ariaAttributes[ i ];
      this.domElement.setAttribute( ariaAttribute.attribute, ariaAttribute.value );
    }

    // create the labels and descriptions
    self.descriptionElement = document.createElement( options.descriptionTagName );
    self.descriptionElement.id = 'description-' + this.id;

    // the label can be either a paragraph or a 'label'
    self.labelElement = document.createElement( options.labelTagName );
    self.labelElement.id = 'label-' + this.id;
    self.descriptionElement.textContent = options.description;

    if ( options.useAriaLabel ) {

      // add the label inline with aria-label
      this.domElement.setAttribute( 'aria-label', options.label );
    }
    else {

      // if the label is specifically a 'label', it requires the 'for' attribute, referencing the dom element id
      if ( self.labelElement.tagName === DOM_LABEL ) {
        self.labelElement.setAttribute( 'for', this.domElement.id );
      }

      self.labelElement.textContent = options.label;

      // if the type supports inner text, the label should be added as inner text
      if ( ( this.elementSupportsInnerText() || options.useInnerLabel ) && options.label ) {
        self.domElement.textContent = options.label;
      }
    }

    // containers to hold DOM children if necessary
    // TODO: is the parent type ALWAYS necessary? Perhaps always for descriptions?
    if ( options.parentContainerTagName ) {
      self.parentContainerElement = document.createElement( options.parentContainerTagName );

      // with a parent container, the children are added here
      if ( !this.elementSupportsInnerText() && !options.useInnerLabel ) {

        // this.appendElementWithContent( self.parentContainerElement, self.labelElement );
        self.parentContainerElement.appendChild( self.labelElement );
      }

      // this.appendElementWithContent( self.parentContainerElement, self.descriptionElement );
      self.parentContainerElement.appendChild( self.descriptionElement );
    }
    else if ( options.childContainerTagName ) {

      // can only support one or the other child structure
      self.childContainerElement = document.createElement( options.childContainerTagName );

      // if we have child container, hte label and description come first
      // this.appendElementWithContent( this.domElement, self.labelElement );
      // this.appendElementWithContent( this.domElement, self.descriptionElement );
      if ( !options.useInnerLabel ) {
        this.domElement.appendChild( this.labelElement );
      }
      this.domElement.appendChild( this.descriptionElement );
    }
    else {

      // otherwise, just add the label and description below
      if ( !options.useInnerLabel ) {
        this.domElement.appendChild( this.labelElement );
      }
      this.domElement.appendChild( this.descriptionElement );
    }

    // now set the accessible content by creating an accessible peer
    this.accessibleContent = {
      focusHighlight: options.focusHighlight,
      createPeer: function( accessibleInstance ) {

        // register listeners to the events
        for ( var event in options.events ) {
          if ( options.events.hasOwnProperty( event ) ) {
            self.domElement.addEventListener( event, options.events[ event ] );
          }
        }

        if ( self.childContainerElement ) {
          self.domElement.appendChild( self.childContainerElement );
        }

        // add an aria-describedby attribute if it is specified in options
        if ( options.ariaDescribedBy ) {
          self.setAriaDescribedBy( options.ariaDescribedBy );
        }

        // add an aria-labelledby attribute if it is specified in options
        if ( options.ariaLabelledBy ) {
          self.setAriaLabelledBy( options.ariaLabelledBy );
        }

        return new AccessiblePeer( accessibleInstance, self.domElement, {
          parentContainerElement: self.parentContainerElement,
          childContainerElement: self.childContainerElement
        } );
      }
    };

    this.disposeAccessibleNode = function() {
      for ( var i = 0; i < options.events.length; i++ ) {
        var eventEntry = options.events[ i ];
        self.domElement.removeEventListener( eventEntry.eventName, eventEntry.eventFunction );
      }
    };
  }

  balloonsAndStaticElectricity.register( 'AccessibleNode', AccessibleNode );

  return inherit( Node, AccessibleNode, {

    /**
     * Some types support inner text, and these types should have a label
     * defined this way, rather than a second paragraph contained in a parent element.
     *
     * TODO: Move to a utils file
     *
     * TODO: populate with more element types
     * @return {boolean}
     * @private
     */
    elementSupportsInnerText: function() {
      var supportsInnerText = false;

      var elementsWithInnerText = [ 'button' ];
      for ( var i = 0; i < elementsWithInnerText.length; i++ ) {
        if ( this.tagName === elementsWithInnerText[ i ] ) {
          supportsInnerText = true;
        }
      }
      return supportsInnerText;
    },

    dispose: function() {
      this.disposeAccessibleNode();
    },

    /**
     * Set the text content for the label element of this node.  The label element
     * is usually either a paragraph, a label, or innerText for a certain inputs.
     *
     * @param  {string} textContent
     */
    setLabel: function( textContent ) {
      if ( !this.elementSupportsInnerText() ) {
        self.labelElement.textContent = textContent;
      }
      else {
        this.domElement.textContent = textContent;
      }
    },

    /**
     * Set the description of this widget element
     */
    setDescription: function( textContent ) {
      assert && assert( this.descriptionElement, 'desription element must exist in prallel DOM' );
      this.descriptionElement.textContent = textContent;
    },

    /**
     * Get an id referencing the description element of this node.  Useful when you want to 
     * set aria-describedby on a DOM element that is far from this one in the scene graph.
     * 
     * @return {string}
     */
    getDescriptionElementID: function() {
      assert && assert( this.descriptionElement, 'description element must exist in the parallel DOM' );
      return this.descriptionElement.id;
    },

    /**
     * Get an id referencing the label element of this node.  Useful when you want to 
     * set aria-labelledby on a DOM element that is far from this one in the scene graph.
     * 
     * @return {string}
     */
    getLabelElementID: function() {
      assert && assert( this.labelElement, 'description element must exist in the parallel DOM' );
      return this.labelElement.id;
    },

    /**
     * Add the 'aria-describedby' attribute to this node's dom element.  If no description 
     * id is passed in, the dom element will automatically be described by this element's
     * description.
     * 
     * @param {string} [descriptionID] - optional id referencing the description element
     */
    setAriaDescribedBy: function( descriptionID ) {
      assert && assert( document.getElementById( descriptionID ), 'no element in DOM with id ' + descriptionID );
      this.domElement.setAttribute( 'aria-describedby', descriptionID );
    },


    /**
     * Add the 'aria-labelledby' attribute to this node's dom element.  If no description 
     * id is passed in, the dom element will automatically be described by this element's
     * label elemnet.
     * 
     * @param {string} [labelID] - optional id referencing the description element
     */
    setAriaLabelledBy: function( labelID ) {
      assert && assert( document.getElementById( labelID ), 'no element in DOM with id ' + labelID );
      this.domElement.setAttribute( 'aria-labelledby', labelID );
    },

    /**
     * If the node is using a list for its description, add a list item to the end of the list with
     * the text content.  Returns an id so that the element can be referenced if need be.
     *
     * @param  {string} textContent description
     * @return {type}             description
     */
    addDescriptionItem: function( textContent ) {
      assert && assert( this.descriptionElement.tagName === DOM_UNORDERED_LIST, 'description element must be a list to use addDescriptionItem' );

      var listItem = document.createElement( 'li' );
      listItem.textContent = textContent;
      listItem.id = 'list-item-' + ITEM_NUMBER++;
      this.descriptionElement.appendChild( listItem );

      return listItem.id;
    },

    /**
     * Update the text content of the description item.  The item may not yet be in the DOM, so
     * document.getElementById cannot be used, and the element needs to be found
     * under the description element.
     *
     * @param  {string} itemID - id of the lits item to update
     * @param  {string} description - new textContent for the string
     */
    updateDescriptionItem: function( itemID, description ) {
      var listItem = this.getChildElementWithId( this.descriptionElement, itemID );
      listItem.textContent = description;
    },

    /**
     * Hide the desired list item from the screen reader
     *
     * @param  {type} itemID description
     * @return {type}        description
     */
    hideDescriptionItem: function( itemID ) {
      var listItem = document.getElementById( itemID );
      assert && assert( listItem, 'No list item in description with id ' + itemID );

      listItem.hidden = true;
    },

    /**
     * Show the desired list item so that it can be found by AT
     *
     * @param  {type} itemID description
     * @return {type}        description
     */
    showDescriptionItem: function( itemID ) {
      var listItem = document.getElementById( itemID );
      assert && assert( listItem, 'No list item in description with id ' + itemID );

      listItem.hidden = false;
    },

    /**
     * Hide completely from a screen reader by setting the aria-hidden attribute.
     *
     * @param  {boolean} hidden
     */
    setHidden: function( hidden ) {
      if ( this.parentContainerElement ) {
        this.parentContainerElement.hidden = hidden;
      }
      else {
        this.domElement.hidden = hidden;
      }
    },

    /**
     * Set a particular attribute for this node's peer element, generally to provide extra
     * semantic information for a screen reader.
     *
     * @param  {string} attribute - string naming the attribute
     * @param  {string|boolean} value - the value for the attribute
     */
    setAttribute: function( attribute, value ) {
      this.domElement.setAttribute( attribute, value );
    },

    /**
     * Remove a particular attribute, removing the associated semantic information from
     * the DOM element.
     *
     * @param  {string} attribute - name of the attribute to remove
     */
    removeAttribute: function( attribute ) {
      this.domElement.removeAttribute( attribute );
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
     * Get the next focusable element in the parallel DOM.
     * TODO: Move to a scenery utils?
     *
     * @return {DOMElement}
     */
    getNextFocusable: function() {
      return this.getNextPreviousFocusable( NEXT );
    },

    /**
     * Get the previous focusable elements in the parallel DOM
     *
     * @return {DOMElement}
     */
    getPreviousFocusable: function() {
      return this.getNextPreviousFocusable( PREVIOUS );
    },

    /**
     * Get the next or previous focusable element in the parallel DOM, depending on
     * parameter.
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


    /**
     * Get a child element with an id.  This should only be used if the element is not in the document.
     * If the element is in the document, document.getElementById is a faster (and more conventional)
     * option.  If the element is not yet in the document this function might be helpful.
     * 
     * @param  {DOMElement} parentElement
     * @param  {string} childId
     * @return {DOMElement}
     */
    getChildElementWithId: function( parentElement, childId ) {
      var childElement;
      var children = parentElement.children;

      for ( var i = 0; i < children.length; i++ ) {
        if ( children[ i ].id === childId ) {
          childElement = children[ i ];
          break;
        }
      }

      if ( !childElement ) {
        throw new Error( 'No child element under ' + parentElement + ' with id ' + childId );
      }

      return childElement;
    },

    /**
     * Append a child elelement, but only if it has content.
     * 
     * @param {DOMElement} domElement - the dom element to append the child
     * @param {DOMElement} childElement - the child element to append
     */
    appendElementWithContent: function( domElement, childElement ) {
      if ( childElement.textContent ) {
        domElement.appendChild( childElement );
      }
    }

  } );

} );
