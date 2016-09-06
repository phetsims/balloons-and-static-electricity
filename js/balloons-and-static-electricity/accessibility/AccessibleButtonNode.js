// Copyright 2015, University of Colorado Boulder

/**
 * A node with button content in the parallel DOM.  This node will act like a button for keyboard navigation
 * and auditory descriptions.  This node is a div which contains the button and an optional description
 * paragraph.  The description can be found only by the virtual cursor.
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
  function AccessibleButtonNode( options) {

    options = _.extend( {
      label: '',
      description: '', //
      focusHighlight: null, // node | shape | bounds
      onclick: function() {} // fired when the button is clicked
    }, options );

    // button contained in a div so that it can contain descriptions or other children
    Node.call( this, {
      accessibleContent: {
        createPeer: function( accessibleInstance ) {

          // container element
          var domElement = document.createElement( 'div' );
          return new AccessiblePeer( accessibleInstance, domElement );
        }
      }
    } );

    // create the button
    var buttonNode = new Node( {
      accessibleContent: {
        focusHighlight: options.focusHighlight,
        createPeer: function( accessibleInstance ) {

          // represented as a 'button' in the PDOM
          var domElement = document.createElement( 'button' );

          // set the label and description
          domElement.textContent = options.label;

          // add the click event listener
          // TODO: Perhaps this should not be optional
          domElement.addEventListener( 'click', options.onclick );

          return new AccessiblePeer( accessibleInstance, domElement );

        }
      }
    } );
    this.addChild( buttonNode );

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

  return inherit( Node, AccessibleButtonNode, {
    setLabel: function() {},
    setDescription: function() {},
    setOnClick: function() {}
  } );

} );
