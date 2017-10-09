// Copyright 2017, University of Colorado Boulder

/**
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var assertInstanceOf = require( 'ifphetio!PHET_IO/assertions/assertInstanceOf' );
  var phetioInherit = require( 'ifphetio!PHET_IO/phetioInherit' );
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );
  var TNode = require( 'SCENERY/nodes/TNode' );

  /**
   * Wrapper type for TwoSceneSelectionNode class.
   * @param {TwoSceneSelectionNode} selectionNode
   * @param {string} phetioID
   * @constructor
   */
  function TTwoSceneSelectionNode( selectionNode, phetioID ) {
    assertInstanceOf( selectionNode, phet.balloonsAndStaticElectricity.TwoSceneSelectionNode );
    TNode.call( this, selectionNode, phetioID );
  }

  phetioInherit( TNode, 'TTwoSceneSelectionNode', TTwoSceneSelectionNode, {}, {
    documentation: 'A button that toggles between two scenes',
    events: [ 'fired' ]
  } );


  balloonsAndStaticElectricity.register( 'TTwoSceneSelectionNode', TTwoSceneSelectionNode );

  return TTwoSceneSelectionNode;
} );