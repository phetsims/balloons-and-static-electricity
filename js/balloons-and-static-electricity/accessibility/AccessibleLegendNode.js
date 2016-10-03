// Copyright 2015, University of Colorado Boulder

/**
 * A Scenery node used to contain a legend element in the Parallel DOM.  By giving the element its own node, we can
 * contain it and have full control of its location in the parallel DOM relative to other child elements.  This node
 * is only necessary because this element must exist and is not directly associated with a visual Scenery node on the
 * ScreenView.
 *
 * This node is entirely invisible, other than its representation in the accessibility tree.
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
   * Create a node that contains a legend for radio button groups.
   *
   * @param {string} accessibleLabel
   * @constructor
   **/
  function AccessibleHeadingNode( accessibleLabel ) {

    Node.call( this, {
      accessibleContent: {
        createPeer: function( accessibleInstance ) {
          var trail = accessibleInstance.trail;
          var uniqueId = trail.getUniqueId();
          this.node = trail.lastNode(); // @public (a11y)

          // we want the accessible content to look like:
          // <legend id="legend-id">accessibleLabel</legend>

          // heading element
          var headingElement = document.createElement( 'legend' );
          headingElement.textContent = accessibleLabel;
          headingElement.id = 'legend-' + uniqueId;

          // @public (a11y), assign the node an id to quickly look up its a11y DOM element
          this.node.accessibleId = uniqueId;

          return new AccessiblePeer( accessibleInstance, headingElement );
        }
      }
    } );
  }

  return inherit( Node, AccessibleHeadingNode );

} );
