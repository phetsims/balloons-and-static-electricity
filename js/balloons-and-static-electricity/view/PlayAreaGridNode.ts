// Copyright 2016-2025, University of Colorado Boulder

/**
 * Node that shows the various regions of the play area for accessibility.  The play area is broken into
 * regions so that the balloons have unique descriptions depending on which region they are in.  In addition,
 * there are vertical and horizontal lines of significance that impact the output of the screen reader, and these
 * are drawn in the play area as well.
 *
 * This is not instrumented for phet-io because external users will not see or use it.
 *
 @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import balloonsAndStaticElectricity from '../../balloonsAndStaticElectricity.js';
import PlayAreaMap from '../model/PlayAreaMap.js';

export default class PlayAreaGridNode extends Node {

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
    let minValue: number;
    let maxValue: number;
    Object.entries( columns ).forEach( ( [ key, column ] ) => {
      if ( i % 2 === 0 ) {
        minValue = Math.max( layoutBounds.minX, column.min );
        maxValue = Math.min( layoutBounds.maxX, column.max );
        const width = maxValue - minValue;
        this.addChild( new Rectangle( minValue, 0, width, PlayAreaMap.HEIGHT, blueOptions ) );
      }
      i++;
    } );

    // draw each row
    Object.entries( rows ).forEach( ( [ key, row ] ) => {
      if ( i % 2 === 0 ) {
        minValue = Math.max( layoutBounds.minY, row.min );
        maxValue = Math.min( layoutBounds.maxY, row.max );
        const height = maxValue - minValue;
        this.addChild( new Rectangle( 0, minValue, PlayAreaMap.WIDTH, height, greyOptions ) );
      }
      i++;
    } );

    // draw rectangles around the landmark regions
    Object.entries( landmarks ).forEach( ( [ key, landmark ] ) => {
      minValue = Math.max( layoutBounds.minX, landmark.min );
      maxValue = Math.min( layoutBounds.maxX, landmark.max );
      const landmarkWidth = maxValue - minValue;
      this.addChild( new Rectangle( minValue, 0, landmarkWidth, PlayAreaMap.HEIGHT, redOptions ) );
    } );

    // draw the lines to along critical balloon positions along both x and y
    const lineOptions = { stroke: 'rgba(0, 0, 0,0.4)', lineWidth: 2, lineDash: [ 2, 4 ] };
    const xPositions = PlayAreaMap.X_POSITIONS;
    const yPositions = PlayAreaMap.Y_POSITIONS;

    Object.entries( xPositions ).forEach( ( [ key, xPosition ] ) => {
      this.addChild( new Line( xPosition, 0, xPosition, PlayAreaMap.HEIGHT, lineOptions ) );
    } );

    Object.entries( yPositions ).forEach( ( [ key, yPosition ] ) => {
      this.addChild( new Line( 0, yPosition, PlayAreaMap.WIDTH, yPosition, lineOptions ) );
    } );
  }
}

balloonsAndStaticElectricity.register( 'PlayAreaGridNode', PlayAreaGridNode );