// Copyright 2002-2013, University of Colorado

/**
 * Model of a Sweater.
 * Sweater can loose minus charges
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';
  var Fort = require( 'FORT/Fort' );
  var Vector2 = require( 'DOT/Vector2' );
  var PointChargeModel = require( 'model/PointChargeModel' );

  var SweaterModel = Fort.Model.extend(
    {
      //Properties of the model.  All user settings belong in the model, whether or not they are part of the physical model
      defaults: {
        positions: [
          [104, 114],
          [94, 140],
          [85, 171],
          [80, 197],
          [76, 228],
          [74, 259],
          [71, 292],
          [67, 323],
          [67, 354],
          [61, 380],
          [140, 135],
          [142, 166],
          [145, 195],
          [145, 224],
          [143, 255],
          [140, 287],
          [138, 317],
          [132, 346],
          [128, 377],
          [170, 148],
          [171, 179],
          [171, 210],
          [172, 241],
          [171, 273],
          [169, 304],
          [167, 337],
          [163, 368],
          [163, 400],
          [208, 138],
          [208, 167],
          [206, 198],
          [205, 229],
          [203, 260],
          [202, 291],
          [200, 322],
          [197, 352],
          [196, 383],
          [239, 125],
          [236, 155],
          [234, 185],
          [233, 216],
          [232, 247],
          [231, 279],
          [230, 310],
          [227, 341],
          [226, 371],
          [224, 400],
          [266, 109],
          [283, 140],
          [292, 171],
          [292, 202],
          [292, 237],
          [290, 267],
          [295, 297],
          [296, 328],
          [295, 358],
          [290, 387]
        ],
        isVisible: true,
        width: 315,
        height: 420,
        charge: 0
      },
      init: function( x, y ) {
        var self = this;

        this.x = x;
        this.y = y;
        this.center = new Vector2( self.x + self.width / 2, self.y + self.height / 2 );
        this.plusCharges = [];
        this.minusCharges = [];

        this.positions.forEach( function( entry ) {
          var plusCharge = new PointChargeModel( entry[0], entry[1] + y );
          self.plusCharges.push( plusCharge );

          //minus
          var minusCharge = new PointChargeModel( entry[0] + PointChargeModel.radius, entry[1] + y + PointChargeModel.radius );
          self.minusCharges.push( minusCharge );
        } );
        this.reset();
      },

      //is balloon over minus charge on sweater?
      findIntersection: function( balloon ) {
        var self = this;

        var x1 = balloon.location.x - 5,
          x2 = balloon.location.x + 50,
          y1 = balloon.location.y - 10,
          y2 = balloon.location.y + balloon.height + 10;

        this.minusCharges.forEach( function( entry ) {
          if ( !entry.moved ) {
            if ( x1 < entry.location.x && entry.location.x < x2 ) {
              if ( y1 < entry.location.y && entry.location.y < y2 ) {
                self.moveChargeTo( entry, balloon );
              }
            }
          }
        } );
      },
      //charge from sweater to balloon
      moveChargeTo: function( charge, balloon ) {
        charge.moved = true;
        charge.view.visible = false;
        balloon.charge--;
        this.charge++;
      },

      // Reset the entire model
      reset: function() {
        this.minusCharges.forEach( function( entry ) {
          if ( entry.view ) {
            entry.moved = false;
          }
        } );
        this.charge = 0;
      }
    } );

  return SweaterModel;
} );