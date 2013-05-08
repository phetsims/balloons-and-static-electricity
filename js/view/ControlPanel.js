/**
 * Copyright 2002-2013, University of Colorado
 * buttons and model control elements
 * Author: Vasily Shakhov (Mlearner)
 */

define( function ( require ) {
  'use strict';
  var resetButtonTemplate = require( 'tpl!../../html/reset-button.html' );
  var switchWallButtonTemplate = require( 'tpl!../../html/switch-wall-button.html' );
  var showChargesChoiceTemplate = require( 'tpl!../../html/show-charges-choice.html' );
  var showBalloonsChoiceTemplate = require( 'tpl!../../html/show-balloons-choice.html' );
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
    var switchWallButton = new DOM( $( switchWallButtonTemplate( {removeWall: strings["BalloonApplet.removeWall"],
                                                                   addWall: strings["BalloonApplet.addWall"]} ) ) );
    this.addChild( switchWallButton );
    switchWallButton._$element.find( "#removeWallButton" ).bind( 'click', function () {model.wall.isVisible = false;} );
    switchWallButton._$element.find( "#addWallButton" ).bind( 'click', function () {model.wall.isVisible = true;} );

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

    //show charges radioGroup
    var showChargesChoice = new DOM( $( showChargesChoiceTemplate( {showChargeDifferences: strings["BalloonApplet.ShowChargeDifferences"],
                                                                     showAllCharges: strings["BalloonApplet.ShowAllCharges"],
                                                                     showNoCharges: strings["BalloonApplet.ShowNoCharges"]} ) ) );
    this.addChild( showChargesChoice );
    showChargesChoice._$element.find( "button" ).each( function () {
      var button = this;
      $( this ).bind( 'click', function switchChargeView() {
        model.showCharges = button.value;
      } );
    } );


    //show balloons radioGroup
    var showBalloonsChoice = new DOM( $( showBalloonsChoiceTemplate() ) );
    this.addChild( showBalloonsChoice );
    showBalloonsChoice._$element.find("#showOneBalloon" ).bind('click',function showSingleBalloon(){
      model.balloons[1].isVisible = false;
    });
    showBalloonsChoice._$element.find("#showTwoBalloons" ).bind('click',function showTwoBalloons(){
      model.balloons[1].isVisible = true;
    });


  }

  inherit( ControlPanel, Node );

  return ControlPanel;
} );
