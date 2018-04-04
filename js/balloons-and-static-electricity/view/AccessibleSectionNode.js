// Copyright 2017, University of Colorado Boulder

/**
 * A container type for accessible content in a simulation. The container is a Node (Scenery display object),
 * so its children will be other Nodes with accessible content. The accessible content is a 'section' under the
 * ScreenView 'article' with an 'H2' label.  Children are contained under a 'div' element, and labels will come
 * before the accessible content of the descendants.
 * 
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

define( function( require ) {
  'use strict';

  // modules
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );

  /**
   * @constructor
   * @param {string} label
   */
  function AccessibleSectionNode( label, options ) {
    assert && assert( label && typeof label === 'string', 'Accessible section must have a label' );

    // options for accessibility, but others can be passed to Node call
    options = _.extend( {
      containerTagName: 'section',
      tagName: 'div',
      labelContent: label,
      labelTagName: 'h2'
    }, options );

    Node.call( this, options );
  }

  balloonsAndStaticElectricity.register( 'AccessibleSectionNode', AccessibleSectionNode );

  return inherit( Node, AccessibleSectionNode );
} );
