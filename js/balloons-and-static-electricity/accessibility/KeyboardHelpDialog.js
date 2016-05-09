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

    this.activeElement = null;

    // create the content for this dialog, temporarily just a text label
    var dialogLabelText = new Text( keyboardHelpDialogString, { 
      font: new PhetFont( { size: 18, weight: 'bold', style: 'italic' } ),
      fill: 'rgba( 0, 0, 0, 0.5 )'
    } );

    // create visual text for the keyboard help dialog
    var createTextContent = function( string, font, spacing ) {
      var textContent = new Text( string, font );

      var spacedContent = new HBox( {
        children: [ spacing, textContent ]
      } );

      return spacedContent;
    };

    var textChildren = [
      createTextContent( keyboardHelpBalloonInteractionsHeadingString, SECTION_HEADING_FONT, SECTION_TAB ),
      createTextContent( keyboardHelpGrabAndDragHeadingString, SUB_SECTION_HEADING_FONT, SUB_SECTION_TAB ),
      createTextContent( keyboardHelpGrabDescriptionString, CONTENT_FONT, SUB_SECTION_TAB ),
      createTextContent( keyboardHelpWASDKeysDescriptionString, CONTENT_FONT, SUB_SECTION_TAB ),
      createTextContent( keyboardHelpWKeyDescriptionString, CONTENT_FONT, CONTENT_TAB ),
      createTextContent( keyboardHelpAKeyDescriptionString, CONTENT_FONT, CONTENT_TAB ),
      createTextContent( keyboardHelpSKeyDescriptionString, CONTENT_FONT, CONTENT_TAB ),
      createTextContent( keyboardHelpDKeyDescriptionString, CONTENT_FONT, CONTENT_TAB ),
      createTextContent( keyboardHelpReleaseBalloonHeadingString, SUB_SECTION_HEADING_FONT, SUB_SECTION_TAB ),
      createTextContent( keyboardHelpSpacebarDescriptionString, CONTENT_FONT, CONTENT_TAB ),
      createTextContent( keyboardHelpTabBalloonDescriptionString, CONTENT_FONT, CONTENT_TAB ),
      createTextContent( keyboardHelpQuickMoveHeadingString, SUB_SECTION_HEADING_FONT, SUB_SECTION_TAB ),
      createTextContent( keyboardHelpQuickMoveDescriptionString, CONTENT_FONT, SUB_SECTION_TAB ),
      createTextContent( keyboardHelpJPlusSDescriptionString, CONTENT_FONT, CONTENT_TAB ),
      createTextContent( keyboardHelpJPlusWDescriptionString, CONTENT_FONT, CONTENT_TAB ),
      createTextContent( keyboardHelpJPlusNDescriptionString, CONTENT_FONT, CONTENT_TAB ),
      createTextContent( keyboardHelpJPlusMDescriptionString, CONTENT_FONT, CONTENT_TAB ),
      createTextContent( keyboardHelpSimNavigationAndHelpHeadingString, SECTION_HEADING_FONT, SECTION_TAB ),
      createTextContent( keyboardHelpTabDescriptionString, CONTENT_FONT, CONTENT_TAB ),
      createTextContent( keyboardHelpShiftPlusTabDescriptionString, CONTENT_FONT, CONTENT_TAB ),
      createTextContent( keyboardHelpHDescriptionString, CONTENT_FONT, CONTENT_TAB )
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
            keyboardHelpText.accessibleInstances[0].peer.domElement.focus();
            event.preventDefault();
          }
        } );

        return accessiblePeer;
      }
    };

    // dialogLabelText and closeText in an VBox to center in the dialog
    var contentVBox = new VBox( {
      children: [ dialogLabelText, keyboardHelpText, closeButton ],
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

    Dialog.call( this, contentVBox, {
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

    keyboardHelpText.accessibleContent = {
      createPeer: function( accessibleInstance ) {
        var uniqueID = accessibleInstance.trail.getUniqueId();

        // The dialog needs to look like the following in the parallel DOM:
        // TODO: Eventually, this content will be distributed accross the visual scener nodes.  Since there is no
        // visual representation yet, DOM elements are all created here.
        // <div id="dialog-14-498-496" role="dialog" tabindex="0" aria-labelledby="dialog-label-14-498-496" aria-describedby="dialog-section-14-498-496">
        //     <h1 id="dialog-label-14-498-496">‪Keyboard Commands and Help‬ Dialog</h1>
        //     <section id="dialog-section-14-498-496" role="document" tabIndex="0">
        //         <h2>‪Balloon Interactions‬</h2>
        //         <h3>Grab and Drag Balloon</h3>
        //         <p>Use the WASD keys to grab and drag the balloon in four directions. Add the Shift key to the letter to make bigger steps.</p>
        //         <ul>
        //             <li>W key drags up. Shift plus W drags up a lot.</li>
        //             <li>A key drags left.</li>
        //             <li>S key drags down.</li>
        //             <li>D key drags right.</li>
        //        </ul>
        //        <h3>Release Balloon</h3>
        //        <ul>
        //            <li>‪Spacebar: Releases balloon.‬</li>
        //            <li>‪Control plus Enter (Windows-only): Releases balloon.‬</li>
        //            <li>‪Tabbing away from the balloon will release it.‬</li>
        //         </ul>
        //         <h3>‪Quick Move Hotkeys‬</h3>
        //        <p>Use these key combinations to jump to a location in the Play Area.</p>
        //         <ul>
        //             <li>‪J plus S jumps to edge of sweater.‬</li>
        //             <li>‪J plus W jumps to wall.‬</li>
        //             <li>‪J plus N jumps to near wall.‬</li>
        //             <li>‪J plus M jumps to middle of Play Area.‬</li>
        //         </ul>

        //   <h2>‪Sim Navigation and Help‬</h2>
        //         <ul>
        //             <li>‪Press Tab to go to next item.‬</li>
        //             <li>‪Shift plus Tab to go to previous item.‬</li>
        //             <li>‪Press H to opens keyboard commands and help.‬</li>
        //         </ul>
        //     </section>
        // </div>
        
        // create the h1 element, and add its content
        var titleHeadingElement = document.createElement( 'h1' );
        titleHeadingElement.id = 'dialog-title-' + uniqueID;
        titleHeadingElement.textContent = keyboardHelpDialogString;

        var domElement = document.createElement( 'div' );
        domElement.setAttribute( 'aria-labelledby', titleHeadingElement.id );
        domElement.tabIndex = '0';

        // create the containing section element, and give it the document role
        var sectionElement = document.createElement( 'section' );

        // create the h2 elements
        var balloonInteractionsHeadingElement = document.createElement( 'h2' );
        balloonInteractionsHeadingElement.textContent = keyboardHelpBalloonInteractionsHeadingString;

        var simNavigationAndHelpHeadingElement = document.createElement( 'h2' );
        simNavigationAndHelpHeadingElement.textContent = keyboardHelpSimNavigationAndHelpHeadingString;

        // create the h3 elements
        var grabAndDragBalloonHeadingElement = document.createElement( 'h3' );
        grabAndDragBalloonHeadingElement.textContent = keyboardHelpGrabAndDragHeadingString;

        var releaseBalloonHeadingElement = document.createElement( 'h3' );
        releaseBalloonHeadingElement.textContent = keyboardHelpReleaseBalloonHeadingString;

        var quickMoveHotkeysHeadingElement = document.createElement( 'h3' );
        quickMoveHotkeysHeadingElement.textContent = keyboardHelpQuickMoveHeadingString;

        // create the description paragraphs
        var enterToGrabBalloonParagraphElement = document.createElement( 'p' );
        enterToGrabBalloonParagraphElement.textContent = keyboardHelpGrabDescriptionString;
        var WASDDescriptionParagraphElement = document.createElement( 'p' );
        WASDDescriptionParagraphElement.textContent = keyboardHelpWASDKeysDescriptionString;

        var keyCombinationsDescriptionParagraphElement = document.createElement( 'p' );
        keyCombinationsDescriptionParagraphElement.textContent = keyboardHelpQuickMoveDescriptionString;

        // create the unordered list elements
        var WASDKeyListElement = document.createElement( 'ul' );
        var releaseBalloonListElement = document.createElement( 'ul' );
        var keyCombinationListElement = document.createElement( 'ul' );
        var simNavigationAndHelpListElement = document.createElement( 'ul' );

        // create the list items
        var WKeyListItem = document.createElement( 'li' );
        WKeyListItem.textContent = keyboardHelpWKeyDescriptionString;

        var AKeyListItem = document.createElement( 'li' );
        AKeyListItem.textContent = keyboardHelpAKeyDescriptionString;

        var SKeyListItem = document.createElement( 'li' );
        SKeyListItem.textContent = keyboardHelpSKeyDescriptionString;

        var DKeyListItem = document.createElement( 'li' );
        DKeyListItem.textContent = keyboardHelpDKeyDescriptionString;

        var spacebarListItem = document.createElement( 'li' );
        spacebarListItem.textContent = keyboardHelpSpacebarDescriptionString;

        var tabBalloonListItem = document.createElement( 'li' );
        tabBalloonListItem.textContent = keyboardHelpTabBalloonDescriptionString;

        var JPlusSListItem = document.createElement( 'li' );
        JPlusSListItem.textContent = keyboardHelpJPlusSDescriptionString;

        var JPlusWListItem = document.createElement( 'li' );
        JPlusWListItem.textContent = keyboardHelpJPlusWDescriptionString;

        var JPlusNListItem = document.createElement( 'li' );
        JPlusNListItem.textContent = keyboardHelpJPlusNDescriptionString;

        var JPlusMListItem = document.createElement( 'li' );
        JPlusMListItem.textContent = keyboardHelpJPlusMDescriptionString;

        var tabListItem = document.createElement( 'li' );
        tabListItem.textContent = keyboardHelpTabDescriptionString;

        var shiftPlusTabListItem = document.createElement( 'li' );
        shiftPlusTabListItem.textContent = keyboardHelpShiftPlusTabDescriptionString;

        var hListItem = document.createElement( 'li' );
        hListItem.textContent = keyboardHelpHDescriptionString;

        // build up the lists
        WASDKeyListElement.appendChild( WKeyListItem );
        WASDKeyListElement.appendChild( AKeyListItem );
        WASDKeyListElement.appendChild( SKeyListItem );
        WASDKeyListElement.appendChild( DKeyListItem );

        releaseBalloonListElement.appendChild( spacebarListItem );
        releaseBalloonListElement.appendChild( tabBalloonListItem );

        keyCombinationListElement.appendChild( JPlusSListItem );
        keyCombinationListElement.appendChild( JPlusWListItem );
        keyCombinationListElement.appendChild( JPlusNListItem );
        keyCombinationListElement.appendChild( JPlusMListItem );

        simNavigationAndHelpListElement.appendChild( tabListItem );
        simNavigationAndHelpListElement.appendChild( shiftPlusTabListItem );
        simNavigationAndHelpListElement.appendChild( hListItem );

        // structure the help menu, adding headings, lists, and paragraphs
        sectionElement.appendChild( balloonInteractionsHeadingElement );
        sectionElement.appendChild( grabAndDragBalloonHeadingElement );
        sectionElement.appendChild( enterToGrabBalloonParagraphElement );
        sectionElement.appendChild( WASDDescriptionParagraphElement );
        sectionElement.appendChild( WASDKeyListElement );
        sectionElement.appendChild( releaseBalloonHeadingElement );
        sectionElement.appendChild( releaseBalloonListElement );
        sectionElement.appendChild( quickMoveHotkeysHeadingElement );
        sectionElement.appendChild( keyCombinationsDescriptionParagraphElement );
        sectionElement.appendChild( keyCombinationListElement );
        sectionElement.appendChild( simNavigationAndHelpHeadingElement );
        sectionElement.appendChild( simNavigationAndHelpListElement );

        // add the title to the domElement
        domElement.appendChild( titleHeadingElement );

        // add the section to the dom element
        domElement.appendChild( sectionElement );

        // screenView 'hidden' property need to be linked to the shownProperty.  If the dialog is shown, hide everything
        // in the screen view.
        thisDialog.shownProperty.link( function( isShown ) {

          var screenViewElement = document.getElementById( screenView.accessibleId );
          screenViewElement.setAttribute( 'aria-hidden', isShown );

        } );


        // if shift tab is pressed on this element, we need to restrict navigation to what is in the close dialog
        domElement.addEventListener( 'keydown', function( event ) {
          if( event.keyCode === Input.KEY_TAB ) {
            if( event.shiftKey ) {
              // TODO: Scenery should eventually be able to provide a reference to the node's DOM element?
              closeButton.accessibleInstances[0].peer.domElement.focus();
              event.preventDefault();
            }
          }
          else if ( event.keyCode === 27 ) {
            // hide the dialog
            thisDialog.shownProperty.set( false );
            thisDialog.activeElement.focus(); 
          }
        } );

        return new AccessiblePeer( accessibleInstance, domElement );
      }
    };

    // screenView 'hidden' property need to be linked to the shownProperty.  If the dialog is shown, hide everything
    // in the screen view.
    thisDialog.shownProperty.link( function( isShown ) {

      // if shown, focus immediately - must happen before hiding the screenView, or the AT gets lost in the hidden elements.
      if ( isShown ) {
        // TODO: Scenery should eventually be able to create a reference to the node's DOM element?
        keyboardHelpText.accessibleInstances[0].peer.domElement.focus();
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