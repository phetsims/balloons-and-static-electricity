// Copyright 2015, University of Colorado Boulder

/**
 * A Scenery node used to contain a heading element in the Parallel DOM.  By giving the element its own node, we can 
 * contain it and have full control of its location in the parallel DOM relative to other child elements.
 * 
 * This node is entirely invisible, other than its representation in the accessibility tree.
 * 
 * Author: Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );
  var AccessiblePeer = require( 'SCENERY/accessibility/AccessiblePeer' );

  function AccessibleHeadingNode( headingLevel, textContent ) {

    Node.call( this, {
      accessibleContent: {
        createPeer: function( accessibleInstance ) {
          var trail = accessibleInstance.trail;
          var uniqueId = trail.getUniqueId();
          this.node = trail.lastNode(); // @public (a11y)

          // heading element
          var headingElement = document.createElement( headingLevel );
          headingElement.textContent = textContent;
          headingElement.id = 'heading-node-' + uniqueId;
          this.node.accessibleId = uniqueId;

          return new AccessiblePeer( accessibleInstance, headingElement );
        }
      }
    } );
  }

  return inherit( Node, AccessibleHeadingNode );

} );