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
          minusCharges: []
        },
        init: function ( x, y ) {
          this.location = new Vector2( x, y );
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
          this.oldLoc = this.location.copy();
          this.charge = 0;
          this.velocity = new Vector2( 0, 0 );
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
          if ( newLocation.x > model.bounds[0] && newLocation.y > model.bounds[1] ) {
            var right = model.wall.isVisible ? model.bounds[2] : model.bounds[2] + model.wall.width;
            if ( newLocation.x + balloonModel.width < right && newLocation.y + balloonModel.height < model.bounds[3] ) {
              balloonModel.velocity = newVelocity;
              balloonModel.location = newLocation;
              return;
            }
          }
          balloonModel.velocity = new Vector2( 0, 0 );
        },
        koeff: 1
      } );

  return Balloon;
} );
