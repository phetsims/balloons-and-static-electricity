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
  var AccessiblePeer = require( 'SCENERY/accessibility/AccessiblePeer' );

  var AccessibleRadioButtonGroupContent =  {

    /**
     * Create accessible content for a radio button group.  This should eventually live in sun but
     * is local to balloons-and-static-electricity for testing.
     * 
     * @param {string} accessibleDescription
     **/
    createAccessibleContent: function( accessibleDescription ) {
      return {
        createPeer: function( accessibleInstance ) {
          var trail = accessibleInstance.trail;
          var uniqueId = trail.getUniqueId();

          /**
           *  We want elements of the parallel DOM to look like:
           * 
           *    <fieldset id="radio-button-group-id" role="radiogroup" aria-describedby="radio-group-description-id legend-id">
           *      <legend> (defined and added in another node so that we can place it on top of following children) </legend>
           *       ...(elements of the button group)
           *      <p id="radio-group-description-id">Translatable description of the radio group</p>
           */
          var domElement = document.createElement( 'fieldset' );
          domElement.id = 'radio-button-group-' + uniqueId;
          domElement.setAttribute( 'role', 'radiogroup' );

          var descriptionElement = document.createElement( 'p' );
          descriptionElement.id = 'radio-group-description-' + uniqueId;
          descriptionElement.textContent = accessibleDescription;

          domElement.setAttribute( 'aria-describedby', descriptionElement.id );

          // structure the elements, description element will eventually be the last child
          domElement.appendChild( descriptionElement );

          return new AccessiblePeer( accessibleInstance, domElement );
        }
      };
    }
  };

  return AccessibleRadioButtonGroupContent;

} );