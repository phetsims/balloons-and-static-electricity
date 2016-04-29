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
  function ReaderDisplayNode( cursor, rectBounds ) {

    Rectangle.call( this, rectBounds, 10, 10, {
      fill: 'rgb( 247, 247, 239 )',
      stroke: 'black'
    } );

    var text = new Text( '', { font: new PhetFont( 18 ), maxWidth: rectBounds.width, center: this.center } );
    this.addChild( text );

    // TODO: we only want this to update after the utterance has been read.  Wait to update until
    // the Reader itself fires some event?
    cursor.outputUtteranceProperty.link( function( outputUtterance ) {
      // text goes in the center of the rectangle
      text.setText( outputUtterance.text );
      text.center = rectBounds.center;
    } );

  }

  return inherit( Rectangle, ReaderDisplayNode, {} );

} );
