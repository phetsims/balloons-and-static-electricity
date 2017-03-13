// Copyright 2017, University of Colorado Boulder

/**
 * wrapper type for AccessibleDragNode
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
   * @param accessibleDragNode
   * @param phetioID
   * @constructor
   */
  function TAccessibleDragNode( accessibleDragNode, phetioID ) {
    assertInstanceOf( accessibleDragNode, phet.balloonsAndStaticElectricity.AccessibleDragNode );
    TNode.call( this, accessibleDragNode, phetioID );

    toEventOnEmit(
      accessibleDragNode.startedCallbacksForKeyDownEmitter,
      accessibleDragNode.endedCallbacksForKeyDownEmitter,
      'user',
      phetioID,
      TAccessibleDragNode,
      'keyDown',
      function( keyCode ) { return { keyCode: keyCode }; }
    );

    toEventOnEmit(
      accessibleDragNode.startedCallbacksForKeyUpEmitter,
      accessibleDragNode.endedCallbacksForKeyUpEmitter,
      'user',
      phetioID,
      TAccessibleDragNode,
      'keyUp',
      function( keyCode ) { return { keyCode: keyCode }; }
    );
  }

  phetioInherit( TNode, 'TAccessibleDragNode', TAccessibleDragNode, {}, {
    documentation: 'A node in the scene graph with representation in the Parallel DOM.  This node can be dragged with the WASD keys.',
    events: [ 'keyDown', 'keyUp' ]
  } );

  balloonsAndStaticElectricity.register( 'TAccessibleDragNode', TAccessibleDragNode );

  return TAccessibleDragNode;
} );

