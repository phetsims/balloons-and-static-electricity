// Copyright 2002-2016, University of Colorado Boulder

/**
 * An abstraction to send aria-live updates to the screen reader.  The herald simply
 * references 'aria-live' elements in the HTML document and updates content.
 * ARIA attributes specify the behavior of timing for the alert.  The following alert elements are
 * in the document, but are subject to change, see https://github.com/phetsims/chipper/issues/472
 *
 *    <p id="assertive" aria-live="assertive" aria-atomic="true"></p>
 *    <p id="polite" aria-live="polite" aria-atomic="true"></p>
 *    <p id="assertive-alert" aria-live="assertive" role="alert" aria-atomic="true"></p>
 *    <p id="polite-status" aria-live="polite" role="status" aria-atomic="true"></p>
 *
 * @author Jesse Greenberg
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );

  // constants

  /**
   *
   * @constructor
   */
  function AriaHerald( model ) {

    // @private - collect the DOM elements which will receive the updated content
    this.assertiveElement = document.getElementById( 'assertive' );
    this.politeElement = document.getElementById( 'polite' );
    this.assertiveAlertElement = document.getElementById( 'assertive-alert' );
    this.politeStatusElement = document.getElementnById( 'polite-status' );

  }

  balloonsAndStaticElectricity.register( 'AriaHerald', AriaHerald );

  return inherit( Object, AriaHerald, {

  } );

} );
