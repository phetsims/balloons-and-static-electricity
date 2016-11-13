// Copyright 2016, University of Colorado Boulder

/**
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var BalloonsAndStaticElectricityQueryParameters = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/BalloonsAndStaticElectricityQueryParameters' );
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );

  /**
   * @constructor
   */
  function ReaderDisplayNode( reader, rectBounds ) {

    Rectangle.call( this, rectBounds, 10, 10, {
      fill: 'rgb( 247, 247, 239 )',
      stroke: 'black'
    } );

    var text = new Text( '', { font: new PhetFont( 18 ), maxWidth: rectBounds.width, center: this.center } );
    this.addChild( text );

    // this should override the output to show information about keyup events
    if ( BalloonsAndStaticElectricityQueryParameters.keyData ) {
      document.addEventListener( 'keyup', function( event ) {
        var outputText;
        var keyCode = event.keyCode ? event.keyCode : event.which;
        if ( keyCode === 0 ) {
          outputText = 'keyup event not supported, event.which = ' + keyCode;
        }
        else {
          outputText = 'key up fired with keyCode ' + keyCode;
        }
        text.setText( outputText );
        text.center = rectBounds.center;
      } );
    }

    else {

      // when the reader begins to speak a new utterance, update the text in the display node
      reader.speakingStartedEmitter.addListener( function speakingStartedListener( outputUtterance ) {

        // text goes in the center of the rectangle
        text.setText( outputUtterance.text );
        text.center = rectBounds.center;
      } );
    }
  }

  balloonsAndStaticElectricity.register( 'ReaderDisplayNode', ReaderDisplayNode );

  return inherit( Rectangle, ReaderDisplayNode, {} );
} );