// Copyright 2002-2013, University of Colorado

/**
 * Model of a balloon.
 * Balloon can have charge, position and velocity.
 * @author Vasily Shakhov (Mlearner)
 */
define( function ( require ) {
  'use strict';
  var Fort = require( 'FORT/Fort' );
  var Vector2 = require( 'DOT/Vector2' );
  var PointCharge = require( 'model/PointChargeModel' );

  // Constructor for BarMagnet.
  var Balloon = Fort.Model.extend(
      {
        defaults: {
          charge: 0,
          velocity: 0,
          isVisible: true,
          width: 161,
          height: 266,
          location: new Vector2( 0, 0 ),
          thresholdSpeed: 0.38,
          positions: [
            [20, 66],
            [24, 56],
            [14, 86],
            [20, 156],
            [14, 116],
            [20, 81],
            [14, 126],
            [14, 104],
            [30, 46],
            [40, 196],
            [14, 96],
            [16, 76],
            [46, 206],
            [37, 186],
            [51, 26],
            [36, 36],
            [28, 68],
            [26, 101],
            [16, 136],
            [18, 146],
            [22, 166],
            [26, 181],
            [30, 173],
            [26, 66],
            [32, 56],
            [34, 86],
            [26, 156],
            [26, 146],
            [30, 78],
            [28, 126],
            [26, 104],
            [26, 46],
            [36, 190],
            [26, 96],
            [31, 86],
            [36, 181],
            [30, 186],
            [31, 46],
            [46, 36],
            [28, 68],
            [26, 101],
            [26, 136],
            [26, 116],
            [26, 156],
            [26, 181],
            [30, 173],
            [31, 86],
            [36, 181],
            [30, 186],
            [31, 46],
            [42, 30],
            [28, 68],
            [26, 101],
            [26, 136],
            [30, 116],
            [26, 156],
            [26, 181],
            [30, 173]
          ],
          positionsOfStartCharges: [
            [50, 50],
            [100, 50],
            [50, 150],
            [100, 150]
          ]
        },
        init: function ( x, y, isVisibleByDefault ) {
          var self = this;

          this.location = new Vector2( x, y );
          this.isVisibleByDefault = isVisibleByDefault;
          this.initialLocation = this.location.copy();
          this.plusCharges = [];
          this.minusCharges = [];

          this.positionsOfStartCharges.forEach( function ( entry ) {
            //plus
            var plusCharge = new PointCharge( entry[0], entry[1] );
            self.plusCharges.push( plusCharge );

            //minus
            var minusCharge = new PointCharge( entry[0] + PointCharge.radius, entry[1] + PointCharge.radius );
            self.minusCharges.push( minusCharge );
          } );

          this.positions.forEach( function ( entry ) {
            //minus
            var minusCharge = new PointCharge( entry[0], entry[1] );
            self.minusCharges.push( minusCharge );
          } );
          this.reset();
        },
        getCenter: function () {
          return new Vector2( this.location.x + this.width / 2, this.location.y + this.height / 2 );
        },
        reset: function () {
          this.xVelocityArr = [0, 0, 0, 0, 0];
          this.xVelocityArr.counter = 0;
          this.yVelocityArr = [0, 0, 0, 0, 0];
          this.yVelocityArr.counter = 0;
          this.charge = 0;
          this.velocity = new Vector2( 0, 0 );
          this.location = this.initialLocation.copy();
          this.charge = 0;
          this.isVisible = this.isVisibleByDefault;

          for ( var i = this.plusCharges.length; i < this.minusCharges.length; i++ ) {
            if ( this.minusCharges[i].view ) {
              this.minusCharges[i].view.visible = false;
            }
          }
          this.isDragged = false;
        },
        step: function ( model, dt ) {
          if ( dt > 0 ) {
            if ( this.isDragged ) {
              this.dragBalloon( model, dt );
            }
            else {
              Balloon.applyForce( model, this, dt );
            }
          }
          this.oldLoc = this.location.copy();
        },
        dragBalloon: function ( model, dt ) {
          var dx = (this.location.x - this.oldLoc.x) / dt,
              dy = (this.location.y - this.oldLoc.y) / dt;

          this.xVelocityArr[this.xVelocityArr.counter++] = dx * dx;
          this.xVelocityArr.counter %= 5;
          this.yVelocityArr[this.yVelocityArr.counter++] = dy * dy;
          this.yVelocityArr.counter %= 5;

          var averageX = 0,
              averageY = 0;
          for ( var i = 0; i < 5; i++ ) {
            averageX += this.xVelocityArr[0];
            averageY += this.yVelocityArr[0];
          }
          averageX /= 5;
          averageY /= 5;

          var speed = Math.sqrt( averageX * averageX + averageY * averageY );
          if ( speed >= this.thresholdSpeed ) {
            model.sweater.findIntersection( this );
          }
        }
      }, {
        getForce: function ( p1, p2, kqq, power ) {
          power = power || 2;
          var diff = p1.minus( p2 );
          var r = diff.magnitude();
          if ( r === 0 ) {
            return new Vector2( 0, 0 );
          }
          var fa = diff.timesScalar( kqq / ( Math.pow( r, power + 1 ) ) );
          return fa;
        },
        getSweaterForce: function ( sweaterModel, balloonModel ) {
          return Balloon.getForce( sweaterModel.center, balloonModel.getCenter(), -Balloon.koeff * sweaterModel.charge * balloonModel.charge );
        },
        getOtherForce: function ( balloonModel ) {
          if ( balloonModel.isDragged || !balloonModel.isVisible || !balloonModel.other.isVisible ) {
            return new Vector2( 0, 0 );
          }
          var kqq = Balloon.koeff * balloonModel.charge * balloonModel.other.charge;
          return Balloon.getForce( balloonModel.getCenter(), balloonModel.other.getCenter(), kqq );
        },
        getTotalForce: function ( model, balloonModel ) {
          if ( model.wall.isVisible ) {
            var distFromWall = model.wall.x - balloonModel.location.x;
            if ( balloonModel.charge < -5 ) {
              var relDist = distFromWall - balloonModel.width;
              var fright = 0.3;
              if ( relDist <= 20 + balloonModel.charge / 8 ) {
                return new Vector2( -fright * balloonModel.charge / 20.0, 0 );
              }
            }
          }

          var force = Balloon.getSweaterForce( model.sweater, balloonModel );
          var other = Balloon.getOtherForce( balloonModel );
          return force.plus( other );
        },
        applyForce: function ( model, balloonModel, dt ) {
          var force = Balloon.getTotalForce( model, balloonModel );

          var newVelocity = balloonModel.velocity.add( force.timesScalar( dt ) );
          var newLocation = balloonModel.location.plus( balloonModel.velocity.timesScalar( dt ) );
          var isStopped = false;
          if ( newLocation.x > model.bounds[0] && newLocation.y > model.bounds[1] ) {
            var right = model.wall.isVisible ? model.bounds[2] : model.bounds[2] + model.wall.width;
            if ( newLocation.x + balloonModel.width > right ) {
              isStopped = true;
              newLocation.x = right - balloonModel.width;
            }
            if ( newLocation.y + balloonModel.height > model.bounds[3] ) {
              newLocation.y = model.bounds[3] - balloonModel.height;
            }
          }
          else {
            isStopped = true;
            if ( newLocation.x < model.bounds[0] ) {
              newLocation.x = model.bounds[0];
            }
            if ( newLocation.y < model.bounds[1] ) {
              newLocation.y = model.bounds[1];
            }
          }
          balloonModel.velocity = newVelocity;
          balloonModel.location = newLocation;
          if ( isStopped ) {
            balloonModel.velocity = new Vector2( 0, 0 );
          }
        },
        koeff: 1
      } );

  return Balloon;
} );
