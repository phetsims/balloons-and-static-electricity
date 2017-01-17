// Copyright 2002-2016, University of Colorado Boulder

/**
 * A static object used to send aria-live updates to the screen reader.  The herald simply references 'aria-live'
 * elements in the HTML document and updates their content. ARIA attributes specify the behavior of timing for the
 * alerts. The following alert elements are in the document, but are subject to change, see
 * https://github.com/phetsims/chipper/issues/472. These elements were tested and determined to be the most widely
 * supported and most useful.
 *
 *    <p id="assertive" aria-live="assertive" aria-atomic="true"></p>
 *    <p id="polite" aria-live="polite" aria-atomic="true"></p>
 *    <p id="assertive-alert" aria-live="assertive" role="alert" aria-atomic="true"></p>
 *    <p id="polite-status" aria-live="polite" role="status" aria-atomic="true"></p>
 *
 * @author Jesse Greenberg
 * @author John Blanco
 */

define( function( require ) {
  'use strict';

  // modules
  var BalloonsAndStaticElectricityQueryParameters = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/BalloonsAndStaticElectricityQueryParameters' );
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );

  // DOM elements which will receive the updated content
  var assertiveElement = document.getElementById( 'assertive' );
  var politeElement = document.getElementById( 'polite' );
  var assertiveAlertElement = document.getElementById( 'assertive-alert' );
  var politeStatusElement = document.getElementById( 'polite-status' );
  var alertContainer = document.getElementById( 'aria-live-elements' );

  // verify that all elements are present
  assert && assert( assertiveElement, 'No assertive element found in document' );
  assert && assert( politeElement, 'No polite element found in document' );
  assert && assert( assertiveAlertElement, 'No assertive alert element found in document' );
  assert && assert( politeStatusElement, 'No polite status element found in document' );
  assert && assert( alertContainer, 'No alert container element found in document' );

  // convenience function used for output of debugging information
  function printAlert( textContent ) {
    if ( !alertContainer.hidden ) {
      console.log( textContent );
    }
  }

  /**
   * static object that provides the functions for updating the aria-live regions for announcements
   */
  var AriaHerald = {

    /**
     * Announce an assertive alert.  This alert should be announced by the AT immediately, regardless of current user
     * interaction status.
     *
     * @param  {string} textContent - the alert to announce
     */
    announceAssertive: function( textContent ) {
      if ( BalloonsAndStaticElectricityQueryParameters.showLiveOutput ) {
        printAlert( textContent );
      }
      assertiveElement.textContent = textContent;
    },

    /**
     * Announce a polite alert.  This alert should be announced when the user has finished their current interaction or
     * after other utterances in the queue are finished.
     *
     * @param  {string} textContent - the polite content to announce
     */
    announcePolite: function( textContent ) {
      if ( BalloonsAndStaticElectricityQueryParameters.showLiveOutput ) {
        printAlert( textContent );
      }
      politeElement.textContent = textContent;
    },

    /**
     * Announce an assertive alert, with ARIA alert behavior.  This behaves similarly to announceAssertive but AT will
     * add extra functionality with the alert role, such as literally saying 'Alert' or providing extra navigation
     * strategies to find this content.
     *
     * @param  {string} textContent - the content ot announce
     */
    announceAssertiveWithAlert: function( textContent ) {
      if ( BalloonsAndStaticElectricityQueryParameters.showLiveOutput ) {
        printAlert( textContent );
      }
      assertiveAlertElement.textContent = textContent;
    },

    /**
     * Announce polite with ARIA status behavior.  This behaves similarly to announcePolite but AT will add extra
     * functionality with the status role, such as literally saying 'Status' or providing extra navigation strategies
     * to find this content.
     *
     * @param  {string} textContent - the content ot announce
     */
    announcePoliteWithStatus: function( textContent ) {
      if ( BalloonsAndStaticElectricityQueryParameters.showLiveOutput ) {
        printAlert( textContent );
      }
      politeStatusElement.textContent = textContent;
    },

    /**
     * Sets whether the group of aria-live elements is visible.
     *
     * @param {boolean} hidden
     */
    setHidden: function( hidden ) {
      alertContainer.hidden = hidden;
    },
    set hidden( value ) { this.setHidden( value ); }
  };


  // The following is necessary because the live regions are initially hidden due to an issue where one of the screen
  // readers would try to read them at load time if visible.
  AriaHerald.setHidden( false );

  balloonsAndStaticElectricity.register( 'AriaHerald', AriaHerald );

  return AriaHerald;
} );