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
          thresholdSpeed: 0.38
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
          this.oldTime = new Date().getTime();
          this.minusCharges = [];
        },
        step: function (model) {
          var curTime = new Date().getTime();
          var dt = curTime - this.oldTime;
          if ( dt > 0 ) {
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
              model.sweater.findIntersection(this);
            }
          }
          this.oldTime = curTime;
          this.oldLoc = this.location.copy();
        }
      }, {
        getForce: function ( p1, p2, kqq, power ) {
          var diff = p1.minus( p2 );
          var r = diff.magnitude();
          if ( r === 0 ) {
            return new Vector2( 0, 0 );
          }
          var fa = diff.timesScalar( kqq / ( Math.pow( r, power + 1 ) ) );
          return fa;
        }
      } );

  return Balloon;
} );
