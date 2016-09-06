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
  var AccessibleNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/accessibility/AccessibleNode' );
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
      onClick: function() {} // fired when the button is clicked
    }, options );

    // @private
    this.onClick = options.onClick;

    // button contained in a div so that it can contain descriptions or other children
    AccessibleNode.call( this );

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
          domElement.addEventListener( 'click', options.onClick );

          return new AccessiblePeer( accessibleInstance, domElement );

        }
      }
    } );

    this.addChild( buttonNode ); // this will probably be the last child, but it should come first
  }

  return inherit( AccessibleNode, AccessibleButtonNode, {

    /**
     * Set the function that will be called when the button is clicked
     *
     * @param  {function} clickFunction
     */
    setOnClick: function( clickFunction ) {
      this.onClick = clickFunction;
    }

  } );

} );
