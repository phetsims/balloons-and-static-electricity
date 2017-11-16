// Copyright 2017, University of Colorado Boulder

/**
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var assertInstanceOf = require( 'ifphetio!PHET_IO/assertInstanceOf' );
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );
  var NodeIO = require( 'SCENERY/nodes/NodeIO' );
  var phetioInherit = require( 'ifphetio!PHET_IO/phetioInherit' );

  /**
   * Wrapper type for TwoSceneSelectionNode class.
   * @param {TwoSceneSelectionNode} selectionNode
   * @param {string} phetioID
   * @constructor
   */
  function TwoSceneSelectionNodeIO( selectionNode, phetioID ) {
    assert && assertInstanceOf( selectionNode, phet.balloonsAndStaticElectricity.TwoSceneSelectionNode );
    NodeIO.call( this, selectionNode, phetioID );
  }

  phetioInherit( NodeIO, 'TwoSceneSelectionNodeIO', TwoSceneSelectionNodeIO, {}, {
    documentation: 'A button that toggles between two scenes',
    events: [ 'fired' ]
  } );

  balloonsAndStaticElectricity.register( 'TwoSceneSelectionNodeIO', TwoSceneSelectionNodeIO );

  return TwoSceneSelectionNodeIO;
} );