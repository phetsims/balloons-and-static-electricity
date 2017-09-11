// Copyright 2015, University of Colorado Boulder

/**
 * A Scenery node used to contain a dialog for keyboard interaction help in the Parallel DOM.
 *
 * The content of this node is mostly invisible for the time being.  It will act as a modal dialog, but only contain
 * invisible content to give the user a list of keyboard interactions for Forces and Motion: Basics.  Once the look and
 * feel are defined, that will be inplemented in an object like this.

 * TODO: Accessible dialogs are tricky!  They Don't work very well for many screen readers.  For now, everything will be
 * contained inside of a section, but it will still be hidden and accessed much like a modal dialog.
 *
 * @author: Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );
  var BASEA11yStrings = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/BASEA11yStrings' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Spacer = require( 'SCENERY/nodes/Spacer' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // constants
  var SECTION_HEADING_FONT = new PhetFont( { size: 15, style: 'italic' } );
  var CONTENT_FONT = new PhetFont( 10 );
  var DIALOG_MARGIN = 25;

  // horizontal spacers
  var SECTION_TAB = new Spacer( 30, 0 );
  var SUB_SECTION_TAB = new Spacer( 50, 0 );
  var CONTENT_TAB = new Spacer( 70, 0 );

  /**
   * Create a node that contains a heading so that users can use AT to quickly find content in the DOM
   *
   * @param {Object} options
   * @constructor
   **/
  function BASEKeyboardHelpContent( options ) {

    options = _.extend( {
      stroke: null,
      xMargin: DIALOG_MARGIN,
      yMargin: DIALOG_MARGIN,
      fill: 'rgb( 214, 237, 249 )'
    }, options );

    // create the content for this dialog, temporarily just a text label
    var dialogLabelText = new Text( BASEA11yStrings.keyboardHelpDialogString, {
      font: new PhetFont( { size: 18, weight: 'bold', style: 'italic' } ),
      fill: 'rgba( 0, 0, 0, 0.5 )',

      // a11y
      tagName: 'h1',
      accessibleLabel: BASEA11yStrings.keyboardHelpDialogString
    } );

    // create visual text for the keyboarg help dialog
    var createTextContent = function( string, font, spacing, domRepresentation, listItem ) {
      var textContent = new Text( string, { font: font } );

      var children = listItem ? [ spacing, new Circle( 2, { fill: 'black' } ), textContent ] : [ spacing, textContent ];

      var spacedContent = new HBox( {
        children: children,
        spacing: 2,

        // a11y
        tagName: domRepresentation,
        accessibleLabel: string
      } );

      return spacedContent;
    };

    var createListContent = function( strings ) {

      var children = [];
      strings.forEach( function( string ) {
        children.push( createTextContent( string, CONTENT_FONT, CONTENT_TAB, 'li', true ) );
      } );
      return new VBox( {
        children: children,
        spacing: 5,
        align: 'left',

        // a11y
        tagName: 'ul'
      } );
    };

    var textChildren = [
      createTextContent( BASEA11yStrings.grabBalloonString, SECTION_HEADING_FONT, SECTION_TAB, 'h2' ),
      createListContent( [ BASEA11yStrings.grabDescriptionString ] ),
      createTextContent( BASEA11yStrings.hotkeysJumpingString, SECTION_HEADING_FONT, SECTION_TAB, 'h2' ),
      createListContent( [ BASEA11yStrings.JSString, BASEA11yStrings.JWString, BASEA11yStrings.JNString, BASEA11yStrings.JCString ] ),
      createTextContent( BASEA11yStrings.keysForDraggingAndRubbingString, SECTION_HEADING_FONT, SECTION_TAB, 'h2' ),
      createTextContent( BASEA11yStrings.draggingDescriptionString, CONTENT_FONT, SUB_SECTION_TAB, 'p' ),
      createTextContent( BASEA11yStrings.draggingDescriptionWASDString, CONTENT_FONT, SUB_SECTION_TAB, 'p' ),
      createTextContent( BASEA11yStrings.addShiftString, CONTENT_FONT, SUB_SECTION_TAB, 'p' ),
      createTextContent( BASEA11yStrings.generalNavigationString, SECTION_HEADING_FONT, SECTION_TAB, 'h2' ),
      createListContent( [ BASEA11yStrings.tabString, BASEA11yStrings.shiftTabString, BASEA11yStrings.escString ] )
    ];

    // all visual text in a layout box
    var keyboardHelpText = new VBox( {
      children: textChildren,
      spacing: 5,
      align: 'left'
    } );

    // dialogLabelText and closeText in an VBox to center in the dialog
    var contentVBox = new VBox( {
      children: [ dialogLabelText, keyboardHelpText ],
      spacing: 20,

      tagName: 'div',
      focusable: true
    } );

    Panel.call( this, contentVBox, options );
  }

  balloonsAndStaticElectricity.register( 'BASEKeyboardHelpContent', BASEKeyboardHelpContent );

  return inherit( Panel, BASEKeyboardHelpContent );
} );