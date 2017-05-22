// Copyright 2017, University of Colorado Boulder

/**
 * A container type for the 'Play Area' in a simulation. A simulation'Play Area' is the section of the
 * simulation with unique components that are not part of the 'Control Panel'.  This content may or may
 * not be interactive or focusable with a keyboard. The accessible content is a section under the
 * ScreenView article with an 'H2' label.
 * 
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var BASEA11yStrings = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/BASEA11yStrings' );
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );

  /**
   * @constructor
   */
  function PlayAreaNode() {
    Node.call( this, {
      pickable: false,

      // a11y
      parentContainerTagName: 'section',
      tagName: 'div',
      accessibleLabel: BASEA11yStrings.playAreaLabelString,
      labelTagName: 'h2',
      prependLabels: true
    } );
  }

  balloonsAndStaticElectricity.register( 'PlayAreaNode', PlayAreaNode );

  return inherit( Node, PlayAreaNode );
} );
