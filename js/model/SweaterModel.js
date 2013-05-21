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
            [116, 116],
            [100, 142],
            [93, 173],
            [88, 199],
            [84, 230],
            [82, 261],
            [79, 294],
            [75, 325],
            [75, 356],
            [71, 382],
            [142, 137],
            [144, 168],
            [147, 197],
            [147, 226],
            [145, 257],
            [142, 289],
            [140, 319],
            [134, 348],
            [130, 379],
            [172, 150],
            [173, 181],
            [173, 212],
            [174, 243],
            [173, 275],
            [171, 306],
            [169, 339],
            [165, 370],
            [165, 402],
            [210, 140],
            [210, 169],
            [208, 200],
            [207, 231],
            [205, 262],
            [204, 293],
            [202, 324],
            [199, 354],
            [198, 385],
            [241, 127],
            [238, 157],
            [236, 187],
            [235, 218],
            [234, 249],
            [233, 281],
            [232, 312],
            [229, 343],
            [228, 373],
            [226, 402],
            [273, 113],
            [290, 144],
            [299, 175],
            [299, 206],
            [299, 241],
            [297, 271],
            [302, 301],
            [303, 332],
            [302, 362],
            [297, 393]
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

          var x1 = balloon.location.x,
              x2 = balloon.location.x + 35,
              y1 = balloon.location.y,
              y2 = balloon.location.y + balloon.height - 10;

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
} )
;
