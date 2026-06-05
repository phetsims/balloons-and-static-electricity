// Copyright 2016-2026, University of Colorado Boulder

/**
 * Node that shows the various regions of the play area for accessibility.  The play area is broken into
 * regions so that the balloons have unique descriptions depending on which region they are in.  In addition,
 * there are vertical and horizontal lines of significance that impact the output of the screen reader, and these
 * are drawn in the play area as well.
 *
 * This is not instrumented for phet-io because external users will not see or use it.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import PlayAreaMap from '../model/PlayAreaMap.js';

const COLUMN_OPTIONS = { fill: 'rgba( 0, 0, 255, 0.5 )' };
const ROW_OPTIONS = { fill: 'rgba( 200, 200, 200, 0.5 )' };
const LANDMARK_OPTIONS = { fill: 'rgba( 250, 0, 50, 0.45 )' };
const LINE_OPTIONS = { stroke: 'rgba( 0, 0, 0, 0.4 )', lineWidth: 2, lineDash: [ 2, 4 ] };

export default class PlayAreaGridNode extends Node {

  public constructor( layoutBounds: Bounds2 ) {

    super( {
      pickable: false,
      children: PlayAreaGridNode.createChildren( layoutBounds )
    } );
  }

  private static createChildren( layoutBounds: Bounds2 ): Node[] {
    const children: Node[] = [];

    Object.values( PlayAreaMap.COLUMN_RANGES ).forEach( ( column, index ) => {
      if ( index % 2 === 0 ) {
        const minX = Math.max( layoutBounds.minX, column.min );
        const maxX = Math.min( layoutBounds.maxX, column.max );
        children.push( new Rectangle( minX, 0, maxX - minX, PlayAreaMap.HEIGHT, COLUMN_OPTIONS ) );
      }
    } );

    const columnCount = Object.values( PlayAreaMap.COLUMN_RANGES ).length;
    Object.values( PlayAreaMap.ROW_RANGES ).forEach( ( row, index ) => {
      if ( ( columnCount + index ) % 2 === 0 ) {
        const minY = Math.max( layoutBounds.minY, row.min );
        const maxY = Math.min( layoutBounds.maxY, row.max );
        children.push( new Rectangle( 0, minY, PlayAreaMap.WIDTH, maxY - minY, ROW_OPTIONS ) );
      }
    } );

    Object.values( PlayAreaMap.LANDMARK_RANGES ).forEach( landmark => {
      const minX = Math.max( layoutBounds.minX, landmark.min );
      const maxX = Math.min( layoutBounds.maxX, landmark.max );
      children.push( new Rectangle( minX, 0, maxX - minX, PlayAreaMap.HEIGHT, LANDMARK_OPTIONS ) );
    } );

    Object.values( PlayAreaMap.X_POSITIONS ).forEach( xPosition => {
      children.push( new Line( xPosition, 0, xPosition, PlayAreaMap.HEIGHT, LINE_OPTIONS ) );
    } );

    Object.values( PlayAreaMap.Y_POSITIONS ).forEach( yPosition => {
      children.push( new Line( 0, yPosition, PlayAreaMap.WIDTH, yPosition, LINE_OPTIONS ) );
    } );

    return children;
  }
}
