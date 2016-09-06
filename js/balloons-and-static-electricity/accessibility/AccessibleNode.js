// Copyright 2015, University of Colorado Boulder

/**
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
  function AccessibleNode( locationProperty, options ) {

    options = _.extend( {
      description: '',
      hotkeys: {} // object with keys of type keycode and values of type function
    }, options );

    // all widgets will be contained in a div in the parallel DOM
    var self = this;
    Node.call( this, {
      accessibleContent: {
        createPeer: function( accessibleInstance ) {

          // @private - container element
          self.domElement = document.createElement( 'div' );
          return new AccessiblePeer( accessibleInstance, self.domElement );
        }
      }
    } );

    // if there is an accessible description, create as a paragraph and add
    // as a child of the container node
    if ( options.description ) {
      var descriptionNode = new Node( {
        accessibleContent: {
          createPeer: function( accessibleInstance ) {
            // @private
            self.descriptionElement = document.createElement( 'p' );
            self.descriptionElement.textContent = options.description;

            return new AccessiblePeer( accessibleInstance, self.descriptionElement );
          }
        }
      } );
      this.addChild( descriptionNode );
    }
  }

  return inherit( Node, AccessibleNode, {

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
