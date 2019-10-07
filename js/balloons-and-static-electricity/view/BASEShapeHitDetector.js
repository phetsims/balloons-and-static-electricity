// Copyright 2019, University of Colorado Boulder

/**
 * Detects if a finger is over an element in the view while the user is scanning for objects.
 *
 * @author Jen Tennison
 * @author Jesse Greenberg
 */
define( require => {
  'use strict';

  // modules
  const balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );
  const ShapeHitDetector = require( 'TAPPI/view/ShapeHitDetector' );
  const Shape = require( 'KITE/Shape' );

  // constants

  class BASEShapeHitDetector extends ShapeHitDetector {

    constructor( model, view, tandem ) {
      super( view, tandem );

      this.addShape( Shape.bounds( view.yellowBalloonNode.bounds ), model.scanningPropertySet.yellowBalloonDetectedProperty );
      this.addShape( Shape.bounds( model.sweater.bounds ), model.scanningPropertySet.sweaterDetectedProperty );
      //debugger;
      this.addShape( Shape.bounds( model.wall.bounds ), model.scanningPropertySet.wallDetectedProperty );

      model.yellowBalloon.isDraggedProperty.link( isDragged => {
        if( isDragged ){
          this.interrupt();
        }
      } );

      model.greenBalloon.isDraggedProperty.link( isDragged => {
        if( isDragged ){
          this.interrupt();
        }
      } );

      model.yellowBalloon.locationProperty.link( location => {
        this.updateShape( Shape.bounds( view.yellowBalloonNode.bounds ), model.scanningPropertySet.yellowBalloonDetectedProperty );
      } );
    }
  }

  return balloonsAndStaticElectricity.register( 'BASEShapeHitDetector', BASEShapeHitDetector );
} );
