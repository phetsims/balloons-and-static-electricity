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
  var keyboardHelpTitleString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/keyboardHelp.title' );
  var keyboardHelpQuickMoveString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/keyboardHelp.quickMove' );
  var keyboardHelpBalloonInteractionsString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/keyboardHelp.balloonInteractions' );
  var keyboardHelpSimNavigationString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/keyboardHelp.simNavigation' );
  var keyboardHelpInteractionsWASDString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/keyboardHelp.interactions.WASD' );
  var keyboardHelpInteractionsSpacebarControlEnterString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/keyboardHelp.interactions.spacebarControlEnter' );
  var keyboardHelpInteractionsShiftPlusWASDString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/keyboardHelp.interactions.shiftPlusWASD' );
  var keyboardHelpHotKeysBalloonJumpToSweaterString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/keyboardHelp.hotKeys.balloonJumpToSweater' );
  var keyboardHelpHotKeysBalloonJumpToWallString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/keyboardHelp.hotKeys.balloonJumpToWall' );
  var keyboardHelpHotKeysBalloonJumpToNearWallString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/keyboardHelp.hotKeys.balloonJumpToNearWall' );
  var keyboardHelpHotKeysBalloonJumpToMiddleString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/keyboardHelp.hotKeys.balloonJumpToMiddle' );
  var keyboardHelpNavigationTabString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/keyboardHelp.navigation.tab' );
  var keyboardHelpNavigationQuestionMarkString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/keyboardHelp.navigation.questionMark' );
  var keyboardHelpCloseString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/keyboardHelp.close' );

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
        var trail = accessibleInstance.trail;
        var uniqueId = trail.getUniqueId();

        var accessiblePeer = Dialog.DialogAccessiblePeer( accessibleInstance, thisDialog );
        var domElement = accessiblePeer.domElement;
        thisDialog.domElement = domElement;

        // The dialog needs to look like the following in the parallel DOM:
        // TODO: Eventually, this content will be distributed accross the visual scener nodes.  Since there is no
        // visual representation yet, DOM elements are all created here.
        // <div role="dialog" aria-labelledby="dialog1Title" aria-describedby="dialog1Desc">
        // <h1 id="dialog1Title">Keyboard Help</h1>
        //     <section id="dialog1Desc">
        //         <h2>Balloon Interactions </h2>
        //         <ul>
        //             <li>Arrow Keys: Grabs &amp; moves balloon in any direction.</li>
        //             <li>Spacebar or Control plus Enter: Releases balloon.</li>
        //             <li>Shift plus Arrow Key: Grabs &amp; Moves balloon with bigger steps.</li> 
        //         </ul>
        //         <h2>Quick Move Hotkey Combinations</h2>
        //         <ul>
        //             <li>J plus S: Jumps to edge of Sweater.</li> 
        //             <li>J plus W: Jumps to Wall.</li>
        //             <li>J plus N: Jumps to Near Wall.</li>
        //             <li>J plus M: Jumps to Middle of Play Area.</li>  
        //         </ul>
        //         <h2>Sim Navigation &amp; Help</h2>  
        //         <ul>
        //             <li>Tab key: Goes to next focusable item.</li>
        //             <li>Question Mark: Opens keyboard help.</li>
        //         </ul>
        //     </section>
        //   <button>Close</button> 
        // </div>

        // create the h1
        var keyboardHelpHeadingElement = document.createElement( 'h1' );
        keyboardHelpHeadingElement.id = 'dialog-label-' + uniqueId;
        domElement.setAttribute( 'aria-labelledby', keyboardHelpHeadingElement.id );
        keyboardHelpHeadingElement.textContent = keyboardHelpTitleString;

        // create the containing section element
        var containingSectionElement = document.createElement( 'section' );
        containingSectionElement.id ='dialog-section-' + uniqueId;
        domElement.setAttribute( 'aria-describedby', containingSectionElement.id );

        // create the h2 elements
        var balloonInteractionsHeadingElement = document.createElement( 'h2' );
        balloonInteractionsHeadingElement.textContent = keyboardHelpBalloonInteractionsString;

        var quickMoveHeadingElement = document.createElement( 'h2' );
        quickMoveHeadingElement.textContent = keyboardHelpQuickMoveString;

        var simNavigationHeadingElement = document.createElement( 'h2' );
        simNavigationHeadingElement.textContent = keyboardHelpSimNavigationString;


        // create the balloon interactions list
        var balloonInteractionsListElement = document.createElement( 'ul' );

        var arrowKeysListItemElement = document.createElement( 'li' );
        arrowKeysListItemElement.textContent = keyboardHelpInteractionsWASDString;

        var spacebarControlEnterListItemElement = document.createElement( 'li' );
        spacebarControlEnterListItemElement.textContent = keyboardHelpInteractionsSpacebarControlEnterString;

        var shiftPlusArrowListItemElement = document.createElement( 'li' );
        shiftPlusArrowListItemElement.textContent = keyboardHelpInteractionsShiftPlusWASDString;

        // create the quick move list
        var quickMoveListElement = document.createElement( 'ul' );

        var balloonJumpToSweaterListItemElement = document.createElement( 'li' );
        balloonJumpToSweaterListItemElement.textContent = keyboardHelpHotKeysBalloonJumpToSweaterString;

        var balloonJumpToWallListItemElement = document.createElement( 'li' );
        balloonJumpToWallListItemElement.textContent = keyboardHelpHotKeysBalloonJumpToWallString;

        var balloonJumpToNearWallListItemElement = document.createElement( 'li' );
        balloonJumpToNearWallListItemElement.textContent = keyboardHelpHotKeysBalloonJumpToNearWallString;

        var balloonJumpToMiddleListItemElement = document.createElement( 'li' );
        balloonJumpToMiddleListItemElement.textContent = keyboardHelpHotKeysBalloonJumpToMiddleString;

        // create the sim navigation list
        var simNavigationListElement = document.createElement( 'ul' );

        var tabKeyListItemElement = document.createElement( 'li' );
        tabKeyListItemElement.textContent = keyboardHelpNavigationTabString;

        var questionMarkListItemElement = document.createElement( 'li' );
        questionMarkListItemElement.textContent = keyboardHelpNavigationQuestionMarkString;

        // create the button to close the dialog
        var closeButtonElement = document.createElement( 'button' );
        closeButtonElement.textContent = keyboardHelpCloseString; 

        // structure the help content, starting with the lists
        balloonInteractionsListElement.appendChild( arrowKeysListItemElement );
        balloonInteractionsListElement.appendChild( spacebarControlEnterListItemElement );
        balloonInteractionsListElement.appendChild( shiftPlusArrowListItemElement );

        quickMoveListElement.appendChild( balloonJumpToSweaterListItemElement );
        quickMoveListElement.appendChild( balloonJumpToWallListItemElement );
        quickMoveListElement.appendChild( balloonJumpToNearWallListItemElement );
        quickMoveListElement.appendChild( balloonJumpToMiddleListItemElement );

        simNavigationListElement.appendChild( tabKeyListItemElement );
        simNavigationListElement.appendChild( questionMarkListItemElement );

        // structure lists and headings under the domElement and containingSectionElement
        domElement.appendChild( keyboardHelpHeadingElement );
        domElement.appendChild( containingSectionElement );
        containingSectionElement.appendChild( balloonInteractionsHeadingElement );
        containingSectionElement.appendChild( balloonInteractionsListElement );
        containingSectionElement.appendChild( quickMoveHeadingElement );
        containingSectionElement.appendChild( quickMoveListElement );
        containingSectionElement.appendChild( simNavigationHeadingElement );
        containingSectionElement.appendChild( simNavigationListElement );
        domElement.appendChild( closeButtonElement );

        // the close button should close the dialog
        closeButtonElement.addEventListener( 'click', function( event ) {
          thisDialog.shownProperty.set( false );
        } );

        // screenView 'hidden' property need to be linked to the shownProperty.  If the dialog is shown, hide everything
        // in the screen view.
        thisDialog.shownProperty.link( function( isShown ) {

          var screenViewElement = document.getElementById( screenView.accessibleId );
          screenViewElement.hidden = isShown;

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