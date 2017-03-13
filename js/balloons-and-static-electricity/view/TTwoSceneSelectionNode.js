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
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );

  // phet-io modules
  var assertInstanceOf = require( 'ifphetio!PHET_IO/assertions/assertInstanceOf' );
  var phetioInherit = require( 'ifphetio!PHET_IO/phetioInherit' );
  var TNode = require( 'ifphetio!PHET_IO/types/scenery/nodes/TNode' );
  var toEventOnEmit = require( 'ifphetio!PHET_IO/events/toEventOnEmit' );

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

  balloonsAndStaticElectricity.register( 'TTwoSceneSelectionNode', TTwoSceneSelectionNode );

  return TTwoSceneSelectionNode;
} );

