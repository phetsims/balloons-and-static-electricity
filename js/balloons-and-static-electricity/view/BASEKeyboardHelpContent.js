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
  var inherit = require( 'PHET_CORE/inherit' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HSeparator = require( 'SUN/HSeparator' );
  var AccessiblePeer = require( 'SCENERY/accessibility/AccessiblePeer' );
  var Input = require( 'SCENERY/input/Input' );
  var Panel = require( 'SUN/Panel' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );

  // strings
  var keyboardHelpDialogString = 'Balloon Hot Keys and Key Commands';

  var keysForDraggingAndRubbingString = 'Keys for Dragging and Rubbing';
  var draggindDescriptionString = 'Press the W, A, S, or D keys to drag or rub the balloon up, left, down, or right with small steps.';
  var pressWString = 'Press W to drag up, or Shift key plus W to drag up a little.';
  var pressAString = 'Press A to drag left, or Shift key plus A to drag left a little. ';
  var pressSString = 'Press S to drag down, or Shift key plus S to drag down a little.';
  var pressDString = 'Press D to drag right, or Shift key plus D to drag right a little.';
  var addShiftString = 'Add the Shift key to a letter key to drag or rub with smaller steps.';
  var hotkeysJumpingString = 'Hot Keys for Jumping';
  var pressToJumpString = 'Move the balloon quickly to a location with these hot key combinations:';
  var JSString = 'JS jumps close to Sweater.';
  var JWString = 'JW jumps to Wall.';
  var JNString = 'JN jumps to near Wall.';
  var JCString = 'JC jumps to center of Play Area.';
  var releaseBalloonString = 'Release Balloon';
  var spacebarString = 'Press Space bar to release the balloon.';
  var tabString = 'Pressing the Tab key also releases the Balloon as you go to the next item in the simulation.';
  var grabDescriptionString = 'Press Space bar or Enter key on the Grab Balloon button to pick up or grab the Balloon. Once grabbed, press the W, A, S, or D key to drag the balloon.';
  var grabBalloonString = 'Grab balloon';

  // constants
  var SECTION_HEADING_FONT = new PhetFont( { size: 15, style: 'italic' } );
  var CONTENT_FONT = new PhetFont( 10 );
  var DIALOG_MARGIN = 25;

  var SEPARATOR_OPTIONS = { fill: 'white', lineWidth: 0 };
  var SECTION_TAB = new HSeparator( 30, SEPARATOR_OPTIONS );
  var SUB_SECTION_TAB = new HSeparator( 50, SEPARATOR_OPTIONS );
  var CONTENT_TAB = new HSeparator( 70, SEPARATOR_OPTIONS );

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

    var self = this;

    // create the content for this dialog, temporarily just a text label
    var dialogLabelText = new Text( keyboardHelpDialogString, {
      font: new PhetFont( { size: 18, weight: 'bold', style: 'italic' } ),
      fill: 'rgba( 0, 0, 0, 0.5 )',
      accessibleContent: {
        createPeer: function( accessibleInstance ) {
          var domElement = document.createElement( 'h1' );
          domElement.id = self.labelID;
          domElement.textContent = keyboardHelpDialogString;

          return new AccessiblePeer( accessibleInstance, domElement );
        }
      }
    } );

    // create visual text for the keyboarg help dialog
    var createTextContent = function( string, font, spacing, domRepresentation, listItem ) {
      var textContent = new Text( string, font );

      var children = listItem ? [ spacing, new Circle( 2, { fill: 'black' } ), textContent ] : [ spacing, textContent ];

      var spacedContent = new HBox( {
        children: children,
        spacing: 2
      } );

      spacedContent.accessibleContent = {
        createPeer: function( accessibleInstance ) {
          var domElement = document.createElement( domRepresentation );
          domElement.textContent = string;
          return new AccessiblePeer( accessibleInstance, domElement );
        }
      };

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
        accessibleContent: {
          createPeer: function( accessibleInstance ) {
            var domElement = document.createElement( 'ul' );
            return new AccessiblePeer( accessibleInstance, domElement );
          }
        }
      } );
    };

    var textChildren = [
      createTextContent( hotkeysJumpingString, SECTION_HEADING_FONT, SECTION_TAB, 'h2' ),
      createTextContent( pressToJumpString, CONTENT_FONT, SUB_SECTION_TAB, 'p' ),
      createListContent( [ JSString, JWString, JNString, JCString ] ),
      createTextContent( releaseBalloonString, SECTION_HEADING_FONT, SECTION_TAB, 'h2' ),
      createListContent( [ spacebarString, tabString ] ),
      createTextContent( grabBalloonString, SECTION_HEADING_FONT, SECTION_TAB, 'h2' ),
      createListContent( [ grabDescriptionString ] ),
      createTextContent( keysForDraggingAndRubbingString, SECTION_HEADING_FONT, SECTION_TAB, 'h2' ),
      createTextContent( draggindDescriptionString, CONTENT_FONT, SUB_SECTION_TAB, 'p' ),
      createTextContent( addShiftString, CONTENT_FONT, SUB_SECTION_TAB, 'p' ),
      createListContent( [ pressWString, pressAString, pressSString, pressDString ] )
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
      accessibleContent: {
        createPeer: function( accessibleInstance ) {
          var domElement = document.createElement( 'div' );
          domElement.tabIndex = 0;

          domElement.setAttribute( 'aria-labelledby', self.labelID );

          domElement.addEventListener( 'keydown', function( event ) {
            if ( event.keyCode === Input.KEY_TAB ) {
              if ( event.shiftKey ) {
                event.preventDefault();
              }
            }
          } );

          return new AccessiblePeer( accessibleInstance, domElement );
        }
      }
    } );

    Panel.call( this, contentVBox, options );
  }

  balloonsAndStaticElectricity.register( 'BASEKeyboardHelpContent', BASEKeyboardHelpContent );

  return inherit( Panel, BASEKeyboardHelpContent );
} );