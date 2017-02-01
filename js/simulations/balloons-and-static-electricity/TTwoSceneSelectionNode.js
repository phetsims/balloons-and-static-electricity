// Copyright 2017, University of Colorado Boulder

/**
 * wrapper type for TwoSceneSelectionNode
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var assertInstanceOf = require( 'PHET_IO/assertions/assertInstanceOf' );
  var phetioInherit = require( 'PHET_IO/phetioInherit' );
  var phetioNamespace = require( 'PHET_IO/phetioNamespace' );
  var TNode = require( 'PHET_IO/types/scenery/nodes/TNode' );
  var toEventOnEmit = require( 'PHET_IO/events/toEventOnEmit' );

  /**
   * @param twoSceneSelectionNode
   * @param phetioID
   * @constructor
   */
  function TTwoSceneSelectionNode( twoSceneSelectionNode, phetioID ) {
    assertInstanceOf( twoSceneSelectionNode, phet.balloonsAndStaticElectricity.TwoSceneSelectionNode );
    TNode.call( this, twoSceneSelectionNode, phetioID );

    toEventOnEmit(
      twoSceneSelectionNode.startedCallbacksForToggledEmitter,
      twoSceneSelectionNode.endedCallbacksForToggledEmitter,
      'user',
      phetioID,
      TTwoSceneSelectionNode,
      'toggled',
      function( oldValue, newValue ) {
        return {
          oldValue: oldValue,
          newValue: newValue
        };
      }
    );
  }

  phetioInherit( TNode, 'TTwoSceneSelectionNode', TTwoSceneSelectionNode, {}, {
    documentation: 'A toggle node that looks like two buttons.',
    events: [ 'toggled' ]
  } );

  phetioNamespace.register( 'TTwoSceneSelectionNode', TTwoSceneSelectionNode );

  return TTwoSceneSelectionNode;
} );

