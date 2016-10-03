// Copyright 2015, University of Colorado Boulder

/**
 * A Scenery node used to contain a heading element in the Parallel DOM.  By giving the element its own node, we can
 * contain it and have full control of its location in the parallel DOM relative to other child elements.
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
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );

  /**
   * Create a node that contains a heading so that users can use AT to quickly find content in the DOM
   *
   * @param {string} headingLevel
   * @param {string} textContent
   * @constructor
   **/
  function AccessibleHeadingNode( headingLevel, textContent ) {

    var self = this;

    Node.call( this, {
      accessibleContent: {
        createPeer: function( accessibleInstance ) {
          var trail = accessibleInstance.trail;
          this.node = trail.lastNode(); // @public (a11y)

          // heading element
          var headingElement = document.createElement( headingLevel );
          headingElement.textContent = textContent;
          headingElement.id = 'heading-node-' + this.node.id;
          self.accessibleId = headingElement.id;

          return new AccessiblePeer( accessibleInstance, headingElement );
        }
      }
    } );
  }

  balloonsAndStaticElectricity.register( 'AccessibleHeadingNode', AccessibleHeadingNode );

  return inherit( Node, AccessibleHeadingNode );

} );
