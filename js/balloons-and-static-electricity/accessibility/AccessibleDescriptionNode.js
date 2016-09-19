// Copyright 2015, University of Colorado Boulder

/**
 * A Scenery node used to contain a description element in the Parallel DOM.  By giving the element its own node, we can
 * contain it and have full control of its location in the parallel DOM relative to other child elements.
 *
 * This node is entirely invisible, other than its representation in Scenery's accessibility tree.
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
   * Create a node that contains a heading so that users can use AT to quickly find content in the DOM
   *
   * @param {Obejct} options
   * @constructor
   **/
  function AccessibleDescriptionNode( options ) {

    options = _.extend( {
      accessibleDescription:'',
      isLive: false,
      liveDescriptionFunction: function( property ) {
        // a function to be called whenever the text chanes
      },
      property: null,
      hidden: false
    }, options );

    var self = this;

    Node.call( this, {
      accessibleContent: {
        createPeer: function( accessibleInstance ) {
          var trail = accessibleInstance.trail;
          this.node = trail.lastNode(); // @public (a11y)

          var domElement = document.createElement( 'p' );
          domElement.textContent = options.accessibleDescription;
          domElement.id = self.id;

          if( options.isLive ) {
            domElement.setAttribute( 'aria-live', 'assertive' );
          }

          if( options.hidden ) {
            domElement.setAttribute( 'aria-hidden', true );
          }

          if( options.property ) {
            options.property.link( function( value ) {
              var newDescription = options.liveDescriptionFunction( options.property );
              domElement.textContent = newDescription;
            } );
          }
          return new AccessiblePeer( accessibleInstance, domElement );
        }
      }
    } );
  }

  return inherit( Node, AccessibleDescriptionNode );

} );
