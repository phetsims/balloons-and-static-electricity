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
 
  // strings
  var keyboardHelpDialogString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/keyboardHelp.dialog' );
  var keyboardHelpCloseString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/keyboardHelp.close' );
  var keyboardHelpBalloonInteractionsHeadingString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/keyboardHelp.balloonInteractions.heading' );  
  var keyboardHelpGrabAndDragHeadingString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/keyboardHelp.grabAndDrag.heading' );
  var keyboardHelpWASDKeysDescriptionString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/keyboardHelp.WASDKeys.description' );
  var keyboardHelpWKeyDescriptionString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/keyboardHelp.WKey.description' );
  var keyboardHelpAKeyDescriptionString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/keyboardHelp.AKey.description' );
  var keyboardHelpSKeyDescriptionString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/keyboardHelp.SKey.description' );
  var keyboardHelpDKeyDescriptionString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/keyboardHelp.DKey.description' );
  var keyboardHelpReleaseBalloonHeadingString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/keyboardHelp.releaseBalloon.heading' );
  var keyboardHelpSpacebarDescriptionString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/keyboardHelp.spacebar.description' );
  var keyboardHelpControlPlusEnterDescriptionString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/keyboardHelp.controlPlusEnter.description' );
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
  var keyboardHelpQuestionMarkDescriptionString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/keyboardHelp.questionMark.description' );

  /**
   * Create a node that contains a heading so that users can use AT to quickly find content in the DOM
   * 
   * @param {ScreenView} screenView
   * @constructor
   **/
  function KeyboardHelpDialog( screenView ) {

    var thisDialog = this;

    // create the content for this dialog, temporarily just a text label
    var dialogLabelText = new Text( keyboardHelpDialogString, { 
      font: new PhetFont( { size: 18, weight: 'bold', style: 'italic' } ),
      fill: 'rgba( 0, 0, 0, 0.5 )'
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

    Dialog.call( this, dialogLabelText, {
      modal: true,
      focusable: true,
      hasCloseButton: false,
      layoutStrategy: function( window, simBounds, screenBounds, scale ) {
        // if simBounds are null, return without setting center.
        if ( simBounds !== null ) {

        // Update the location of the dialog (size is set in Sim.js)
        this.center = simBounds.center.times( 1.0 / scale );
        }
      }
    } );

    this.accessibleContent = {
      createPeer: function( accessibleInstance ) {
        var accessiblePeer = Dialog.DialogAccessiblePeer( accessibleInstance, thisDialog );
        var domElement = accessiblePeer.domElement;
        thisDialog.domElement = domElement;

        // The dialog needs to look like the following in the parallel DOM:
        // TODO: Eventually, this content will be distributed accross the visual scener nodes.  Since there is no
        // visual representation yet, DOM elements are all created here.
        // <div id="dialog-14-498-496" role="dialog" tabindex="0" aria-labelledby="dialog-label-14-498-496" aria-describedby="dialog-section-14-498-496">
        //     <h1 id="dialog-label-14-498-496">‪Keyboard Commands and Help‬ Dialog</h1>
        //     <section id="dialog-section-14-498-496" role="document">
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
        //             <li>‪Press Question Mark to opens keyboard commands and help.‬</li>
        //         </ul>
        //     </section>
        // </div>

        // create the h1 element, and add its content
        var titleHeadingElement = document.createElement( 'h1' );
        titleHeadingElement.textContent = keyboardHelpDialogString;

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

        var controlListItem = document.createElement( 'li' );
        controlListItem.textContent = keyboardHelpControlPlusEnterDescriptionString;

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

        var questionMarkListItem = document.createElement( 'li' );
        questionMarkListItem.textContent = keyboardHelpQuestionMarkDescriptionString;

        // create an invisible, accessible button to close the dialog
        var closeButtonElement = document.createElement( 'button' );
        closeButtonElement.textContent = keyboardHelpCloseString; 

        // build up the lists
        WASDKeyListElement.appendChild( WKeyListItem );
        WASDKeyListElement.appendChild( AKeyListItem );
        WASDKeyListElement.appendChild( SKeyListItem );
        WASDKeyListElement.appendChild( DKeyListItem );

        releaseBalloonListElement.appendChild( spacebarListItem );
        releaseBalloonListElement.appendChild( controlListItem );
        releaseBalloonListElement.appendChild( tabBalloonListItem );

        keyCombinationListElement.appendChild( JPlusSListItem );
        keyCombinationListElement.appendChild( JPlusWListItem );
        keyCombinationListElement.appendChild( JPlusNListItem );
        keyCombinationListElement.appendChild( JPlusMListItem );

        simNavigationAndHelpListElement.appendChild( tabListItem );
        simNavigationAndHelpListElement.appendChild( shiftPlusTabListItem );
        simNavigationAndHelpListElement.appendChild( questionMarkListItem );

        // structure the help menu, adding headings, lists, and paragraphs
        sectionElement.appendChild( balloonInteractionsHeadingElement );
        sectionElement.appendChild( grabAndDragBalloonHeadingElement );
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

        // add the close button to the domElement
        domElement.appendChild( closeButtonElement );

        // the close button should close the dialog
        closeButtonElement.addEventListener( 'click', function( event ) {
          thisDialog.shownProperty.set( false );

          // set focus to the active screen view element
          screenView.activeElement.focus();
        } );

        // the domElement should be of role document.
        // NOTE: Not in joist/Dialog because this feature is experimental.  this dialog is brought up with the '?' key,
        // in 'forms' mode.  Because of this, the document role is only used to this subtype.
        domElement.setAttribute( 'role', 'document' );

        // screenView 'hidden' property need to be linked to the shownProperty.  If the dialog is shown, hide everything
        // in the screen view.
        thisDialog.shownProperty.link( function( isShown ) {

          var screenViewElement = document.getElementById( screenView.accessibleId );
          screenViewElement.setAttribute( 'aria-hidden', isShown );

        } );

        return accessiblePeer;
      }
    };

    // screenView 'hidden' property need to be linked to the shownProperty.  If the dialog is shown, hide everything
    // in the screen view.
    thisDialog.shownProperty.link( function( isShown ) {

      // if shown, focus immediately - must happen before hiding the screenView, or the AT gets lost in the hidden elements.
      if ( isShown ) {
        thisDialog.domElement.focus();
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