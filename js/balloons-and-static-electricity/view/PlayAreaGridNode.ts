// Copyright 2016-2025, University of Colorado Boulder

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

import Bounds2 from '../../../../dot/js/Bounds2.js';
import IntentionalAny from '../../../../phet-core/js/types/IntentionalAny.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import balloonsAndStaticElectricity from '../../balloonsAndStaticElectricity.js';
import PlayAreaMap from '../model/PlayAreaMap.js';

class PlayAreaGridNode extends Node {

  public constructor( layoutBounds: Bounds2, tandem: Tandem ) {

    super( { pickable: false } );
    const blueOptions = { fill: 'rgba(0,0,255,0.5)' };
    const greyOptions = { fill: 'rgba(200,200,200,0.5)' };
    const redOptions = { fill: 'rgba(250,0,50,0.45)' };

    const columns = PlayAreaMap.COLUMN_RANGES;
    const rows = PlayAreaMap.ROW_RANGES;
    const landmarks = PlayAreaMap.LANDMARK_RANGES;

    // draw each column
    let i = 0;
    let range: string;
    let minValue: number;
    let maxValue: number;
    for ( range in columns ) {
      if ( columns.hasOwnProperty( range ) ) {
        if ( i % 2 === 0 ) {

          // @ts-expect-error
          minValue = Math.max( layoutBounds.minX, columns[ range ].min );

          // @ts-expect-error
          maxValue = Math.min( layoutBounds.maxX, columns[ range ].max );
          const width = maxValue - minValue;
          this.addChild( new Rectangle( minValue, 0, width, PlayAreaMap.HEIGHT, blueOptions ) );
        }
        i++;
      }
    }

    // draw each row
    for ( range in rows ) {
      if ( rows.hasOwnProperty( range ) ) {
        if ( i % 2 === 0 ) {
          minValue = Math.max( layoutBounds.minY, ( rows as IntentionalAny )[ range ].min );
          maxValue = Math.min( layoutBounds.maxY, ( rows as IntentionalAny )[ range ].max );
          const height = maxValue - minValue;
          this.addChild( new Rectangle( 0, minValue, PlayAreaMap.WIDTH, height, greyOptions ) );
        }
        i++;
      }
    }

    // draw rectangles around the landmark regions
    for ( range in landmarks ) {
      if ( landmarks.hasOwnProperty( range ) ) {
        minValue = Math.max( layoutBounds.minX, ( landmarks as IntentionalAny )[ range ].min );
        maxValue = Math.min( layoutBounds.maxX, ( landmarks as IntentionalAny )[ range ].max );
        const landmarkWidth = maxValue - minValue;
        this.addChild( new Rectangle( minValue, 0, landmarkWidth, PlayAreaMap.HEIGHT, redOptions ) );
      }
    }

    // draw the lines to along critical balloon positions along both x and y
    const lineOptions = { stroke: 'rgba(0, 0, 0,0.4)', lineWidth: 2, lineDash: [ 2, 4 ] };
    const xPositions = PlayAreaMap.X_POSITIONS;
    const yPositions = PlayAreaMap.Y_POSITIONS;
    let position: string;
    for ( position in xPositions ) {
      if ( xPositions.hasOwnProperty( position ) ) {
        this.addChild( new Line( ( xPositions as IntentionalAny )[ position ], 0, ( xPositions as IntentionalAny )[ position ], PlayAreaMap.HEIGHT, lineOptions ) );
      }
    }

    for ( position in yPositions ) {
      if ( yPositions.hasOwnProperty( position ) ) {
        this.addChild( new Line( 0, ( yPositions as IntentionalAny )[ position ], PlayAreaMap.WIDTH, ( yPositions as IntentionalAny )[ position ], lineOptions ) );
      }
    }
  }
}

balloonsAndStaticElectricity.register( 'PlayAreaGridNode', PlayAreaGridNode );

export default PlayAreaGridNode;