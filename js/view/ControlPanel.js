/**
 * Copyright 2002-2013, University of Colorado
 * Author: Vasily Shakhov (Mlearner)
 */

define( function ( require ) {
  'use strict';
  var resetButtonTemplate = require( 'tpl!../../html/reset-button.html' );
  var switchWallButtonTemplate = require( 'tpl!../../html/switch-wall-button.html' );
  var DOM = require( 'SCENERY/nodes/DOM' );
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );


  function ControlPanel( strings, model ) {

    // super constructor
    Node.call( this );


    //reset button
    var resetButton = new DOM( $( resetButtonTemplate( {} ) ) );
    this.addChild( resetButton );
    resetButton._$element.bind( 'click', model.reset.bind( model ) );


    //switch wall button
    var f = switchWallButtonTemplate( {removeWall: strings["BalloonApplet.removeWall"],
                                        addWall: strings["BalloonApplet.addWall"]} );
    this.addChild( new DOM( $( f ) ) );
    $( "#removeWallButton" ).bind( 'click', function () {model.wall.isVisible = false;} );
    $( "#addWallButton" ).bind( 'click', function () {model.wall.isVisible = true;} );


    model.wall.link( 'isVisible', function updateLocation( value ) {
      if ( value ) {
        $( "#removeWallButton" ).show();
        $( "#addWallButton" ).hide();
      }
      else {
        $( "#removeWallButton" ).hide();
        $( "#addWallButton" ).show();
      }
    } );


  }

  inherit( ControlPanel, Node );

  return ControlPanel;
} );
