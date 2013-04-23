// Copyright 2002-2013, University of Colorado

/**
 * Model container.
 *
 * @author Vasily Shakhov (Mlearner.com)
 */
define( function ( require ) {
  'use strict';
  var Balloon = require( 'model/Balloon' );
  var Fort = require( 'FORT/Fort' );

  var BalloonsAndStaticElectricityModel = Fort.Model.extend(
      {
        //Properties of the model.  All user settings belong in the model, whether or not they are part of the physical model
        defaults: { performanceMonitorVisible: true },

        //Main constructor
        init: function () {
          this.balloons = [
            new Balloon( { location: { x: 0, y: 0 } } ),
            new Balloon( { location: { x: 100, y: 100 } } )
          ];
        },

        // Called by the animation loop
        step: function () {
          // Make model changes here.
        },

        // Reset the entire model
        reset: function () {

          //Reset the properties in this model
          Fort.Model.prototype.reset.call( this );

          //Reset child models
          this.balloons.forEach( function ( entry ) {
            entry.reset();
          } );
        }
      } );

  return BalloonsAndStaticElectricityModel;
} );
