// Copyright 2016-2019, University of Colorado Boulder

/**
 * Node that shows the various regions of the play area for accessibility.  The play area is broken into
 * regions so that the balloons have unique descriptions depending on which region they are in.  In addition,
 * there are vertical and horizontal lines of significance that impact the output of the screen reader, and these
 * are drawn in the play area as well.
 *
 * This is not instrumented for phet-io because external users will not see or use it.
 *
 @author Jesse Greenberg
 */
define( require => {
  'use strict';

  // modules
  const balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Line = require( 'SCENERY/nodes/Line' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PlayAreaMap = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/PlayAreaMap' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );

  /**
   * @constructor
   * @param {Bounds2} layoutBounds - layout bounds of the screen view
   */
  function PlayAreaGridNode( layoutBounds, tandem ) {

    Node.call( this, { pickable: false } );
    const blueOptions = { fill: 'rgba(0,0,255,0.5)' };
    const greyOptions = { fill: 'rgba(200,200,200,0.5)' };
    const redOptions = { fill: 'rgba(250,0,50,0.45)' };

    const columns = PlayAreaMap.COLUMN_RANGES;
    const rows = PlayAreaMap.ROW_RANGES;
    const landmarks = PlayAreaMap.LANDMARK_RANGES;

    // draw each column
    const self = this;
    let i = 0;
    let range;
    let minValue;
    let maxValue;
    for ( range in columns ) {
      if ( columns.hasOwnProperty( range ) ) {
        if ( i % 2 === 0 ) {
          minValue = Math.max( layoutBounds.minX, columns[ range ].min );
          maxValue = Math.min( layoutBounds.maxX, columns[ range ].max );
          const width = maxValue - minValue;
          self.addChild( new Rectangle( minValue, 0, width, PlayAreaMap.HEIGHT, blueOptions ) );
        }
        i++;
      }
    }

    // draw each row
    for ( range in rows ) {
      if ( rows.hasOwnProperty( range ) ) {
        if ( i % 2 === 0 ) {
          minValue = Math.max( layoutBounds.minY, rows[ range ].min );
          maxValue = Math.min( layoutBounds.maxY, rows[ range ].max );
          const height = maxValue - minValue;
          self.addChild( new Rectangle( 0, minValue, PlayAreaMap.WIDTH, height, greyOptions ) );
        }
        i++;
      }
    }

    // draw rectangles around the landmark regions
    for ( range in landmarks ) {
      if ( landmarks.hasOwnProperty( range ) ) {
        minValue = Math.max( layoutBounds.minX, landmarks[ range ].min );
        maxValue = Math.min( layoutBounds.maxX, landmarks[ range ].max );
        const landmarkWidth = maxValue - minValue;
        self.addChild( new Rectangle( minValue, 0, landmarkWidth, PlayAreaMap.HEIGHT, redOptions ) );
      }
    }

    // draw the lines to along critical balloon locations along both x and y
    const lineOptions = { stroke: 'rgba(0, 0, 0,0.4)', lineWidth: 2, lineDash: [ 2, 4 ] };
    const xLocations = PlayAreaMap.X_LOCATIONS;
    const yLocations = PlayAreaMap.Y_LOCATIONS;
    let location;
    for ( location in xLocations ) {
      if ( xLocations.hasOwnProperty( location ) ) {
        self.addChild( new Line( xLocations[ location ], 0, xLocations[ location ], PlayAreaMap.HEIGHT, lineOptions ) );
      }
    }

    for ( location in yLocations ) {
      if ( yLocations.hasOwnProperty( location ) ) {
        self.addChild( new Line( 0, yLocations[ location ], PlayAreaMap.WIDTH, yLocations[ location ], lineOptions ) );
      }
    }
  }

  balloonsAndStaticElectricity.register( 'PlayAreaGridNode', PlayAreaGridNode );

  return inherit( Node, PlayAreaGridNode );
} );
