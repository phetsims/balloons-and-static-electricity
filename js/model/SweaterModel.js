// Copyright 2002-2013, University of Colorado

/**
 * Model of a balloon.
 * Wall have electrons which can change position under force
 * @author Vasily Shakhov (Mlearner)
 */
define( function ( require ) {
  'use strict';
  var Fort = require( 'FORT/Fort' );
  var Vector2 = require( 'DOT/Vector2' );
  var PointCharge = require( 'model/PointChargeModel' );

  // Constructor for BarMagnet.
  var Sweater = Fort.Model.extend(
      {
        //Properties of the model.  All user settings belong in the model, whether or not they are part of the physical model
        defaults: {
          positions: [
            [110, 110],
            [94, 136],
            [87, 167],
            [82, 199],
            [78, 230],
            [76, 261],
            [73, 294],
            [69, 325],
            [69, 356],
            [65, 382],
            [136, 137],
            [138, 168],
            [141, 197],
            [141, 226],
            [139, 257],
            [136, 289],
            [134, 319],
            [128, 348],
            [124, 379],
            [166, 150],
            [167, 181],
            [167, 212],
            [168, 243],
            [167, 275],
            [165, 306],
            [163, 339],
            [159, 370],
            [156, 402],
            [204, 140],
            [204, 169],
            [202, 200],
            [201, 231],
            [199, 262],
            [198, 293],
            [196, 324],
            [193, 354],
            [192, 385],
            [235, 127],
            [232, 157],
            [230, 187],
            [229, 218],
            [228, 249],
            [227, 281],
            [226, 312],
            [223, 343],
            [222, 373],
            [219, 402],
            [267, 113],
            [284, 144],
            [291, 175],
            [291, 206],
            [293, 241],
            [291, 271],
            [296, 301],
            [297, 332],
            [296, 362],
            [291, 393]
          ],
          isVisible: true,
          width: 315,
          height: 420
        },

        //Main constructor
        init: function ( x, y ) {
          var self = this;

          this.x = x;
          this.y = y*1;
          this.center = new Vector2(self.x+self.width/2,self.y+self.height/2);
          this.plusCharges = [];
          this.minusCharges = [];

          this.positions.forEach( function ( entry ) {
            var plusCharge = new PointCharge( entry[0], entry[1] );
            self.plusCharges.push( plusCharge );

            //minus
            var minusCharge = new PointCharge( entry[0] + PointCharge.radius, entry[1] + PointCharge.radius );
            self.minusCharges.push( minusCharge );
          } );
          this.reset();
        },

        findIntersection: function ( balloon ) {
          var self = this;

          var x1 = balloon.location.x,
              x2 = balloon.location.x + 35,
              y1 = balloon.location.y,
              y2 = balloon.location.y + balloon.height - 10;

          this.minusCharges.forEach( function ( entry ) {
            if ( entry.view.visible ) {
              if ( x1 < entry.location.x && entry.location.x < x2 ) {
                if ( y1 < entry.location.y && entry.location.y < y2 ) {
                  self.moveChargeTo( entry, balloon );
                }
              }
            }
          } );
        },

        moveChargeTo: function ( charge, balloon ) {
          charge.view.visible = false;
          balloon.charge--;
          this.charge++;
        },

        // Reset the entire model
        reset: function () {
          this.charge = 0;
          this.minusCharges.forEach( function ( entry ) {
            if(entry.view) {
              entry.view.visible = true;
            }
          } );
        }
      });

  return Sweater;
} )
;
