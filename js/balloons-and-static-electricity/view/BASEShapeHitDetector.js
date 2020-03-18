// Copyright 2019-2020, University of Colorado Boulder

/**
 * Detects if a finger is over an element in the view while the user is scanning for objects.
 *
 * @author Jen Tennison
 * @author Jesse Greenberg
 */

import Shape from '../../../../kite/js/Shape.js';
import ShapeHitDetector from '../../../../tappi/js/view/ShapeHitDetector.js';
import balloonsAndStaticElectricity from '../../balloonsAndStaticElectricity.js';

// constants

class BASEShapeHitDetector extends ShapeHitDetector {

  constructor( model, view, tandem ) {
    super( view );

    this.addShape( Shape.bounds( view.yellowBalloonNode.bounds ), model.scanningPropertySet.yellowBalloonDetectedProperty );
    this.addShape( Shape.bounds( model.sweater.bounds ), model.scanningPropertySet.sweaterDetectedProperty );
    this.addShape( Shape.bounds( model.wall.bounds ), model.scanningPropertySet.wallDetectedProperty );

    model.yellowBalloon.isDraggedProperty.link( isDragged => {
      if ( isDragged ) {
        this.interrupt();
      }
    } );

    model.greenBalloon.isDraggedProperty.link( isDragged => {
      if ( isDragged ) {
        this.interrupt();
      }
    } );

    model.yellowBalloon.positionProperty.link( position => {
      this.updateShape( Shape.bounds( view.yellowBalloonNode.bounds ), model.scanningPropertySet.yellowBalloonDetectedProperty );
    } );
  }
}

balloonsAndStaticElectricity.register( 'BASEShapeHitDetector', BASEShapeHitDetector );
export default BASEShapeHitDetector;