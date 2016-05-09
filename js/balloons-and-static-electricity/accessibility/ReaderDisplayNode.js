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

  // constants

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

    // when the reader begins to speak a new utterance, update the text in the display node
    reader.speakingStartedEmitter.addListener( function speakingStartedListener( outputUtterance ) {
      // text goes in the center of the rectangle
      text.setText( outputUtterance.text );
      text.center = rectBounds.center;
    } );

  }

  return inherit( Rectangle, ReaderDisplayNode, {} );

} );
