// Copyright 2015, University of Colorado Boulder

/**
 * A Scenery node used to contain a dialog for keyboard interaction help in the Parallel DOM.
 * 
 * The content of this node is mostly invisible for the time being.  It will act as a modal dialog, but only contain
 * invisible content to give the user a list of keyboard interactions for Forces and Motion: Basics.  Once the look and
 * feel are defined, that will be inplemented in an object like this.

 * TODO: Accessible dialog's are tricky!  They Don't work very well for many screen readers.  For now, everything will be
 * contained inside of a section, but it will still be hidden and accessed much like a modal dialog.
 * 
 * @author: Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Dialog = require( 'JOIST/Dialog' );
  var ButtonListener = require( 'SCENERY/input/ButtonListener' );
  var Property = require( 'AXON/Property' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HSeparator = require( 'SUN/HSeparator' );
  var AccessiblePeer = require( 'SCENERY/accessibility/AccessiblePeer' );
  var Input = require( 'SCENERY/input/Input' );

  // strings
  var keyboardHelpDialogString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/keyboardHelp.dialog' );
  var keyboardHelpCloseString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/keyboardHelp.close' );
  var keyboardHelpBalloonInteractionsHeadingString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/keyboardHelp.balloonInteractions.heading' );  
  var keyboardHelpGrabAndDragHeadingString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/keyboardHelp.grabAndDrag.heading' );
  var keyboardHelpGrabDescriptionString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/keyboardHelp.grab.description' );
  var keyboardHelpWASDKeysDescriptionString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/keyboardHelp.WASDKeys.description' );
  var keyboardHelpWKeyDescriptionString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/keyboardHelp.WKey.description' );
  var keyboardHelpAKeyDescriptionString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/keyboardHelp.AKey.description' );
  var keyboardHelpSKeyDescriptionString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/keyboardHelp.SKey.description' );
  var keyboardHelpDKeyDescriptionString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/keyboardHelp.DKey.description' );
  var keyboardHelpReleaseBalloonHeadingString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/keyboardHelp.releaseBalloon.heading' );
  var keyboardHelpSpacebarDescriptionString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/keyboardHelp.spacebar.description' );
  var keyboardHelpTabBalloonDescriptionString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/keyboardHelp.tabBalloon.description' );
  var keyboardHelpQuickMoveHeadingString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/keyboardHelp.quickMove.heading' );
  var keyboardHelpQuickMoveDescriptionString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/keyboardHelp.quickMove.description' );
  var keyboardHelpJPlusSDescriptionString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/keyboardHelp.JPlusS.description' );
  var keyboardHelpJPlusWDescriptionString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/keyboardHelp.JPlusW.description' );
  var keyboardHelpJPlusNDescriptionString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/keyboardHelp.JPlusN.description' );
  var keyboardHelpJPlusMDescriptionString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/keyboardHelp.JPlusM.description' );
  var keyboardHelpSimNavigationAndHelpHeadingString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/keyboardHelp.simNavigationAndHelp.heading' );
  var keyboardHelpTabDescriptionString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/keyboardHelp.tab.description' );
  var keyboardHelpShiftPlusTabDescriptionString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/keyboardHelp.shiftPlusTab.description' );
  var keyboardHelpHDescriptionString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/keyboardHelp.h.description' );

  // constants
  var SECTION_HEADING_FONT = new PhetFont( { size: 15, style: 'italic' } );
  var SUB_SECTION_HEADING_FONT = new PhetFont( 11 );
  var CONTENT_FONT = new PhetFont( 9 );

  var SEPARATOR_OPTIONS = { fill: 'white', lineWidth: 0 };
  var SECTION_TAB = new HSeparator( 30 , SEPARATOR_OPTIONS );
  var SUB_SECTION_TAB = new HSeparator( 50 , SEPARATOR_OPTIONS );
  var CONTENT_TAB = new HSeparator( 70 , SEPARATOR_OPTIONS );

  /**
   * Create a node that contains a heading so that users can use AT to quickly find content in the DOM
   * 
   * @param {ScreenView} screenView
   * @constructor
   **/
  function KeyboardHelpDialog( screenView ) {

    var thisDialog = this;

    // generate a uniqueID for the accessible label
    thisDialog.labelID = 'label-id-' + screenView.id;

    this.activeElement = null;

    // create the content for this dialog, temporarily just a text label
    var dialogLabelText = new Text( keyboardHelpDialogString, { 
      font: new PhetFont( { size: 18, weight: 'bold', style: 'italic' } ),
      fill: 'rgba( 0, 0, 0, 0.5 )',
      accessibleContent: {
        createPeer: function( accessibleInstance ) {
          var domElement = document.createElement( 'h1' );
          domElement.id = thisDialog.labelID;
          domElement.textContent = keyboardHelpDialogString;

          return new AccessiblePeer( accessibleInstance, domElement );
        }
      }
    } );

    // create visual text for the keyboard help dialog
    var createTextContent = function( string, font, spacing, domRepresentation ) {
      var textContent = new Text( string, font );

      var spacedContent = new HBox( {
        children: [ spacing, textContent ]
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

    var textChildren = [
      createTextContent( keyboardHelpBalloonInteractionsHeadingString, SECTION_HEADING_FONT, SECTION_TAB, 'h1' ),
      createTextContent( keyboardHelpGrabAndDragHeadingString, SUB_SECTION_HEADING_FONT, SUB_SECTION_TAB, 'h2' ),
      createTextContent( keyboardHelpGrabDescriptionString, CONTENT_FONT, SUB_SECTION_TAB, 'p' ),
      createTextContent( keyboardHelpWASDKeysDescriptionString, CONTENT_FONT, SUB_SECTION_TAB, 'p' ),
      createTextContent( keyboardHelpWKeyDescriptionString, CONTENT_FONT, CONTENT_TAB, 'p' ),
      createTextContent( keyboardHelpAKeyDescriptionString, CONTENT_FONT, CONTENT_TAB, 'p' ),
      createTextContent( keyboardHelpSKeyDescriptionString, CONTENT_FONT, CONTENT_TAB, 'p' ),
      createTextContent( keyboardHelpDKeyDescriptionString, CONTENT_FONT, CONTENT_TAB, 'p' ),
      createTextContent( keyboardHelpReleaseBalloonHeadingString, SUB_SECTION_HEADING_FONT, SUB_SECTION_TAB, 'h3' ),
      createTextContent( keyboardHelpSpacebarDescriptionString, CONTENT_FONT, CONTENT_TAB, 'p' ),
      createTextContent( keyboardHelpTabBalloonDescriptionString, CONTENT_FONT, CONTENT_TAB, 'p' ),
      createTextContent( keyboardHelpQuickMoveHeadingString, SUB_SECTION_HEADING_FONT, SUB_SECTION_TAB, 'h3' ),
      createTextContent( keyboardHelpQuickMoveDescriptionString, CONTENT_FONT, SUB_SECTION_TAB, 'p' ),
      createTextContent( keyboardHelpJPlusSDescriptionString, CONTENT_FONT, CONTENT_TAB, 'p' ),
      createTextContent( keyboardHelpJPlusWDescriptionString, CONTENT_FONT, CONTENT_TAB, 'p' ),
      createTextContent( keyboardHelpJPlusNDescriptionString, CONTENT_FONT, CONTENT_TAB, 'p' ),
      createTextContent( keyboardHelpJPlusMDescriptionString, CONTENT_FONT, CONTENT_TAB, 'p' ),
      createTextContent( keyboardHelpSimNavigationAndHelpHeadingString, SECTION_HEADING_FONT, SECTION_TAB, 'h2' ),
      createTextContent( keyboardHelpTabDescriptionString, CONTENT_FONT, CONTENT_TAB, 'p' ),
      createTextContent( keyboardHelpShiftPlusTabDescriptionString, CONTENT_FONT, CONTENT_TAB, 'p' ),
      createTextContent( keyboardHelpHDescriptionString, CONTENT_FONT, CONTENT_TAB, 'p' )
    ];

    // all visual text in a layout box
    var keyboardHelpText = new VBox( {
      children: textChildren,
      spacing: 5,
      align: 'left'
    } );

    // Add a custom close button to this dialdog.
    var closeText = new Text( keyboardHelpCloseString, { font: new PhetFont( 18 ) } );
    var closeFunction = function() {
      thisDialog.shownProperty.set( false );


      // set focus to the previously active screen view element
      thisDialog.activeElement.focus();
    };
    var closeButton = new RectangularPushButton( { 
      content: closeText,
      listener: closeFunction
     } );

    // define the accessible content for the close button - close button neds to have a unique event listener
    // that sets focus to the dialog content if 'tab' is pressed
    closeButton.accessibleContent = {
      createPeer: function( accessibleInstance ) {
        var accessiblePeer = RectangularPushButton.RectangularPushButtonAccessiblePeer( accessibleInstance, keyboardHelpCloseString, closeFunction );

        accessiblePeer.domElement.addEventListener( 'keydown', function( event ) {
          if( event.keyCode === Input.KEY_TAB ) {
            // TODO: Scenery should eventually be able to provide a reference to the node's domElement?
            contentVBox.accessibleInstances[0].peer.domElement.focus();
            event.preventDefault();
          }
        } );

        return accessiblePeer;
      }
    };

    // dialogLabelText and closeText in an VBox to center in the dialog
    var contentVBox = new VBox( {
      children: [ dialogLabelText, keyboardHelpText ],
      spacing: 20,
      accessibleContent: {
        createPeer: function( accessibleInstance ) {
          var domElement = document.createElement( 'div' );
          domElement.tabIndex = 0;

          domElement.setAttribute( 'aria-labelledby', thisDialog.labelID );

          domElement.addEventListener( 'keydown', function( event ) {
            if ( event.keyCode === Input.KEY_TAB ) {
              if ( event.shiftKey ) {
                closeButton.accessibleInstances[0].peer.domElement.focus();
                event.preventDefault();
              }
            }
          } );

          return new AccessiblePeer( accessibleInstance, domElement );
        }
      }
    } );

    var dialogVBox = new VBox( {
      children: [ contentVBox, closeButton ],
      spacing: 20
    } );

    // Create a property that both signals changes to the 'shown' state and can also be used to show/hide the dialog
    // remotely.  Done for a11y so the property can be tracked in the accessibility tree, allowing keyboard and mouse
    // events to be tracked together.
    this.shownProperty = new Property( false );

    var manageDialog = function( shown ) {
      if ( shown ) {
        Dialog.prototype.show.call( thisDialog );
      }
      else {
        Dialog.prototype.hide.call( thisDialog );
      }
    };

    this.shownProperty.lazyLink( function( shown ) {
      manageDialog( shown );
    } );

    Dialog.call( this, dialogVBox, {
      modal: true,
      focusable: true,
      hasCloseButton: false,
      layoutStrategy: function( window, simBounds, screenBounds, scale ) {
        // if simBounds are null, return without setting center.
        if ( simBounds !== null ) {
          // Update the location of the dialog (size is set in Sim.js)
          thisDialog.center = simBounds.center.times( 1.0 / scale );
        }
      }
    } );

    // screenView 'hidden' property need to be linked to the shownProperty.  If the dialog is shown, hide everything
    // in the screen view.
    thisDialog.shownProperty.link( function( isShown ) {

      // if shown, focus immediately - must happen before hiding the screenView, or the AT gets lost in the hidden elements.
      if ( isShown ) {
        // TODO: Scenery should eventually be able to create a reference to the node's DOM element?
        contentVBox.accessibleInstances[0].peer.domElement.focus();
      }
    } );

    // close it on a click
    this.addInputListener( new ButtonListener( {
      fire: thisDialog.hide.bind( thisDialog )
    } ) );

  }

  return inherit( Dialog, KeyboardHelpDialog, {
    hide: function() {
      this.shownProperty.value = false;
    },
    show: function() {
      this.shownProperty.value = true;
    }
  } );
} );