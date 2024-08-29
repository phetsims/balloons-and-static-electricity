// Copyright 2017-2023, University of Colorado Boulder

/**
 * A node that provides an interaction cue for dragging the balloon in Balloons and Static Electricity. Includes arrow
 * and letter keys to indicate that the user can use WASD or arrow keys to move it around the play area.
 *
 * @author Jesse Greenberg
 */

import Multilink from '../../../../axon/js/Multilink.js';
import balloonsAndStaticElectricity from '../../balloonsAndStaticElectricity.js';
import PlayAreaMap from '../model/PlayAreaMap.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import BalloonModel from '../model/BalloonModel.js';
import Property from '../../../../axon/js/Property.js';
import WASDCueNode from '../../../../scenery-phet/js/accessibility/nodes/WASDCueNode.js';

export default class BalloonInteractionCueNode extends WASDCueNode {

  public constructor( wallIsVisibleProperty: TReadOnlyProperty<boolean>, balloonModel: BalloonModel ) {

    super( new Property( balloonModel.bounds ) );

    // add listeners to update visibility of nodes when position changes and when the wall is made
    // visible/invisible
    Multilink.multilink( [ balloonModel.positionProperty, wallIsVisibleProperty ], ( position, visible ) => {

      // get the max x positions depending on if the wall is visible
      let centerXRightBoundary;
      if ( visible ) {
        centerXRightBoundary = PlayAreaMap.X_POSITIONS.AT_WALL;
      }
      else {
        centerXRightBoundary = PlayAreaMap.X_BOUNDARY_POSITIONS.AT_RIGHT_EDGE;
      }

      const balloonCenter = balloonModel.getCenter();
      this.aNode.visible = balloonCenter.x !== PlayAreaMap.X_BOUNDARY_POSITIONS.AT_LEFT_EDGE;
      this.sNode.visible = balloonCenter.y !== PlayAreaMap.Y_BOUNDARY_POSITIONS.AT_BOTTOM;
      this.dNode.visible = balloonCenter.x !== centerXRightBoundary;
      this.wNode.visible = balloonCenter.y !== PlayAreaMap.Y_BOUNDARY_POSITIONS.AT_TOP;
    } );
  }
}

balloonsAndStaticElectricity.register( 'BalloonInteractionCueNode', BalloonInteractionCueNode );