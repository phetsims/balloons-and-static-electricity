// Copyright 2017, University of Colorado Boulder

/**
 * A node that provides an interaction cue for interacting with the balloon in Balloons and Static Electricity.
 * When focused for the first time, a rectangle will appear under the balloon that indicates how to grab it.  Once grabbed,
 * arrow and letter keys will appear to indicate that the user can use WASD or arrow keys to move it around the play area.
 * After the first interaction, this will be invisible.
 *
 * TODO: needs to float to stay visible in the screen view
 * 
 *
 @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );
  var TextKeyNode = require( 'SCENERY_PHET/keyboard/TextKeyNode' );
  var RichText = require( 'SCENERY_PHET/RichText' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );

  // strings
  var toGrabOrReleaseString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/toGrabOrRelease' );
  var spaceString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/space' );


  function BalloonInteractionCueNode( balloonModel, focusEmitter, options ) {

    Node.call( this );
    var self = this;

    // other than first keyboard focus, we are invisible
    self.visible = false;

    // when the balloon receives focus, this will get incremented.  For the first focus (after reset/refresh)
    // balloon will receive focus
    var keyboardFocusCount = 0;

    // Create the help content for the space key to pick up the balloon
    var spaceKeyNode = new TextKeyNode( spaceString, {
      xMargin: 15,
      minKeyWidth: 60,
      maxKeyWidth: 70,
      xAlign: 'center',
      yAlign: 'center',
    } );

    var spaceLabelText = new RichText( toGrabOrReleaseString, {
      font: new PhetFont( 12 )
    } );

    var spaceKeyHBox = new HBox( {
      children: [ spaceKeyNode, spaceLabelText ],
      spacing: 10
    } );

    // rectangle containing the content
    var backgroundRectangle = new Rectangle( spaceKeyHBox.bounds.dilatedXY( 15, 5 ), {
      fill: 'white',
      stroke: 'black'
    } );
    backgroundRectangle.addChild( spaceKeyHBox );
    this.addChild( backgroundRectangle );

    // create the help node for the WASD and arrow keys

    // layout once children and bounds have been defined
    this.mutate( options );

    balloonModel.locationProperty.link( function( location ) {
      backgroundRectangle.centerTop = balloonModel.getCenter().plusXY( 0, balloonModel.height / 2 + 10 );
    } );

    focusEmitter.addListener( function( focussed ) {
      keyboardFocusCount++;

      // debugger;
      if ( keyboardFocusCount === 1 ) {
        self.visible = true;
      }
      else {
        self.visible = false;
      }
    } );  

  }

  balloonsAndStaticElectricity.register( 'BalloonInteractionCueNode', BalloonInteractionCueNode );

  return inherit( Node, BalloonInteractionCueNode );
} );
