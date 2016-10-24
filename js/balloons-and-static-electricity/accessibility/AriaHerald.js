// Copyright 2002-2016, University of Colorado Boulder

/**
 * An abstraction to send aria-live updates to the screen reader.  The herald simply
 * references 'aria-live' elements in the HTML document and updates content.
 * ARIA attributes specify the behavior of timing for the alert.  The following alert elements are
 * in the document, but are subject to change, see https://github.com/phetsims/chipper/issues/472
 * These elements were tested and determined to be the most widely supported and most useful.
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
  var BalloonsAndStaticElectricityQueryParameters = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/BalloonsAndStaticElectricityQueryParameters' );
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );

  /**
   *
   * @constructor
   */
  function AriaHerald() {

    // @private - collect the DOM elements which will receive the updated content
    this.assertiveElement = document.getElementById( 'assertive' );
    this.politeElement = document.getElementById( 'polite' );
    this.assertiveAlertElement = document.getElementById( 'assertive-alert' );
    this.politeStatusElement = document.getElementById( 'polite-status' );
    this.alertContainer = document.getElementById( 'aria-live-elements' );

    // verify that all elements are present
    assert && assert( this.assertiveElement, 'No assertive element found in document' );
    assert && assert( this.politeElement, 'No polite element found in document' );
    assert && assert( this.assertiveAlertElement, 'No assertive alert element found in document' );
    assert && assert( this.politeStatusElement, 'No polite status element found in document' );
    assert && assert( this.alertContainer, 'No alert container element found in document' );

    // once assembled, make sure that the aria live elements are not hidden
    this.setHidden( false );
  }

  balloonsAndStaticElectricity.register( 'AriaHerald', AriaHerald );

  return inherit( Object, AriaHerald, {

    /**
     * Announce an assertive alert.  This alert should be annouced by the AT immediately,
     * regardless of current user interaction status.
     *
     * @param  {string} textContent - the alert to announce
     */
    announceAssertive: function( textContent ) {
      if ( BalloonsAndStaticElectricityQueryParameters.SHOW_LIVE_OUTPUT ) {
        this.printAlert( textContent );
      }
      this.assertiveElement.textContent = textContent;
    },

    /**
     * Announce a polite alert.  This alert should be annouced when the user has finished
     * their current interaction or after other utterenances in the queue are finished
     *
     * @param  {string} textContent - the polite content to announce
     */
    announcePolite: function( textContent ) {
      if ( BalloonsAndStaticElectricityQueryParameters.SHOW_LIVE_OUTPUT ) {
        this.printAlert( textContent );
      }
      this.politeElement.textContent = textContent;
    },

    /**
     * Announce an assertive alert, with ARIA alert behavior.  This behaves similarly to
     * announceAssertive but AT will add extra functionality with the alert role, such as
     * literally saying 'Alert' or providing extra navigation strategies to find this content.
     *
     * @param  {string} textContent - the content ot announce
     */
    announceAssertiveWithAlert: function( textContent ) {
      if ( BalloonsAndStaticElectricityQueryParameters.SHOW_LIVE_OUTPUT ) {
        this.printAlert( textContent );
      }
      this.assertiveAlertElement.textContent = textContent;
    },

    /**
     * Announce polite with ARIA status behavior.  This behaves similarly to
     * announcePolite but AT will add extra functionality with the status role, such as
     * literally saying 'Status' or providing extra navigation strategies to find this content.
     *
     * @param  {string} textContent - the content ot announce
     */
    announcePoliteWithStatus: function( textContent ) {
      if ( BalloonsAndStaticElectricityQueryParameters.SHOW_LIVE_OUTPUT ) {
        this.printAlert( textContent );
      }
      this.politeStatusElement.textContent = textContent;
    },

    /**
     * Sets whether the gruop of aria-live elements is visible.
     * 
     * @param {boolean} hidden
     */
    setHidden: function( hidden ) {
      this.alertContainer.hidden = hidden;      
    },
    set hidden( value ) { this.setHidden( value ); },

    /**
     * Useful for debugging without a screen reader turned on. Checks if the live
     * element is hidden before printing.
     * 
     * @param  {string} textContent
     */
    printAlert: function( textContent ) {
      if ( !this.alertContainer.hidden ) {
        console.log( textContent );
      }
    }
  } );

} );
