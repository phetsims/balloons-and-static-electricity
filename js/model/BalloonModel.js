// Copyright 2002-2013, University of Colorado

/**
 * Model of a balloon.
 * Balloon can have charge, position and velocity.
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';
  var PropertySet = require( 'AXON/PropertySet' );
  var Vector2 = require( 'DOT/Vector2' );
  var PointChargeModel = require( 'model/PointChargeModel' );
  var inherit = require( 'PHET_CORE/inherit' );

  function BalloonModel( x, y, defaultVisibility ) {
    PropertySet.call( this, {
      charge: 0,
      velocity: 0,
      isVisible: true,
      width: 134,
      height: 222,
      location: new Vector2( 0, 0 ),
      thresholdSpeed: 0.36,
      positions: [
        [14, 70],
        [18, 60],
        [14, 90],
        [24, 130],
        [22, 120],
        [14, 79],
        [22, 120],
        [18, 108],
        [19, 50],
        [44, 150],
        [16, 100],
        [20, 80],
        [50, 160],
        [34, 140],
        [50, 20],
        [30, 30],
        [22, 72],
        [24, 105],
        [20, 110],
        [40, 150],
        [26, 110],
        [30, 115],
        [24, 87],
        [24, 60],
        [24, 40],
        [38, 24],
        [30, 80],
        [30, 50],
        [34, 82],
        [32, 130],
        [30, 108],
        [30, 50],
        [40, 94],
        [30, 100],
        [35, 90],
        [24, 95],
        [34, 100],
        [35, 40],
        [30, 60],
        [32, 72],
        [30, 105],
        [34, 140],
        [30, 120],
        [30, 130],
        [30, 85],
        [34, 77],
        [35, 90],
        [40, 85],
        [34, 90],
        [35, 50],
        [46, 34],
        [32, 72],
        [30, 105],
        [34, 140],
        [34, 120],
        [30, 60],
        [30, 85],
        [34, 77]
      ],
      positionsOfStartCharges: [
        [44, 50],
        [88, 50],
        [44, 140],
        [88, 140]
      ]
    } );

    var self = this;

    this.location = new Vector2( x, y );
    this.initialLocation = this.location.copy();
    this.defaultVisibily = defaultVisibility;
    this.plusCharges = [];
    this.minusCharges = [];

    //neutral pair of charges
    this.positionsOfStartCharges.forEach( function( entry ) {
      //plus
      var plusCharge = new PointChargeModel( entry[0], entry[1] );
      self.plusCharges.push( plusCharge );

      //minus
      var minusCharge = new PointChargeModel( entry[0] + PointChargeModel.radius, entry[1] + PointChargeModel.radius );
      self.minusCharges.push( minusCharge );
    } );

    //charges that we can get from sweater
    this.positions.forEach( function( entry ) {
      //minus
      var minusCharge = new PointChargeModel( entry[0], entry[1] );
      self.minusCharges.push( minusCharge );
    } );

    this.reset();
  }

  inherit( PropertySet, BalloonModel, {

    //get center of Balloon
    getCenter: function() {
      return new Vector2( this.location.x + this.width / 2, this.location.y + this.height / 2 );
    },
    //reset balloon to initial state
    reset: function( notResetVisibility ) {
      this.xVelocityArray = [0, 0, 0, 0, 0];
      this.xVelocityArray.counter = 0;
      this.yVelocityArray = [0, 0, 0, 0, 0];
      this.yVelocityArray.counter = 0;
      this.charge = 0;
      this.velocity = new Vector2( 0, 0 );
      this.location = this.initialLocation.copy();
      this.charge = 0;

      for ( var i = this.plusCharges.length; i < this.minusCharges.length; i++ ) {
        if ( this.minusCharges[i].view ) {
          this.minusCharges[i].view.visible = false;
        }
      }
      if ( !notResetVisibility ) {
        this.isVisible = this.defaultVisibily;
      }
      this.isDragged = false;
    },
    step: function( model, dt ) {
      if ( dt > 0 ) {
        if ( this.isDragged ) {
          this.dragBalloon( model, dt );
        }
        else {
          BalloonModel.applyForce( model, this, dt );
        }
      }
      this.oldLocation = this.location.copy();
    },
    //when balloon dragged check if we can catch minus charges
    dragBalloon: function( model, dt ) {
      var dx = (this.location.x - this.oldLocation.x) / dt,
        dy = (this.location.y - this.oldLocation.y) / dt;

      this.xVelocityArray[this.xVelocityArray.counter++] = dx * dx;
      this.xVelocityArray.counter %= 5;
      this.yVelocityArray[this.yVelocityArray.counter++] = dy * dy;
      this.yVelocityArray.counter %= 5;

      var averageX = 0,
        averageY = 0;
      for ( var i = 0; i < 5; i++ ) {
        averageX += this.xVelocityArray[0];
        averageY += this.yVelocityArray[0];
      }
      averageX /= 5;
      averageY /= 5;

      //if average speed larger than thresholdSpeed - we try to move minus charges from sweater to balloon
      var speed = Math.sqrt( averageX * averageX + averageY * averageY );
      if ( speed >= this.thresholdSpeed ) {
        model.sweater.findIntersection( this );
      }
    }
  } );

  {
    //force between two objects with positions p1 and p2, kqq - coefficient, F = kqq / (distance^power)
    BalloonModel.getForce = function( p1, p2, kqq, power ) {
      power = power || 2;
      var diff = p1.minus( p2 );
      var r = diff.magnitude();
      if ( r === 0 ) {
        return new Vector2( 0, 0 );
      }
      var fa = diff.timesScalar( kqq / ( Math.pow( r, power + 1 ) ) );
      return fa;
    };

    //force between sweater and balloon
    BalloonModel.getSweaterForce = function( sweaterModel, balloonModel ) {
      var retValue = new Vector2();
      if ( balloonModel.location.x > sweaterModel.center.x ) {
        retValue = BalloonModel.getForce( sweaterModel.center, balloonModel.getCenter(), -BalloonModel.coeff * sweaterModel.charge * balloonModel.charge );
      }
      return retValue;
    };
    //force between two balloons
    BalloonModel.getOtherForce = function( balloonModel ) {
      if ( balloonModel.isDragged || !balloonModel.isVisible || !balloonModel.other.isVisible ) {
        return new Vector2( 0, 0 );
      }
      var kqq = BalloonModel.coeff * balloonModel.charge * balloonModel.other.charge;
      return BalloonModel.getForce( balloonModel.getCenter(), balloonModel.other.getCenter(), kqq );
    };
    //sum of all forces applying to balloons
    BalloonModel.getTotalForce = function( model, balloonModel ) {
      if ( model.wall.isVisible ) {
        var distFromWall = model.wall.x - balloonModel.location.x;
        //if balloon have enough charge and close enough to wall, wall attracts it more than sweater
        if ( balloonModel.charge < -5 ) {
          var relDist = distFromWall - balloonModel.width;
          var fright = 0.003;
          if ( relDist <= 40 + balloonModel.charge / 8 ) {
            return new Vector2( -fright * balloonModel.charge / 20.0, 0 );
          }
        }
      }

      var force = BalloonModel.getSweaterForce( model.sweater, balloonModel );
      var other = BalloonModel.getOtherForce( balloonModel );
      return force.plus( other );
    };
    //applying force and move balloon to new coords each step
    BalloonModel.applyForce = function( model, balloonModel, dt ) {
      var rightBound = model.wall.isVisible ? model.bounds.maxX : model.bounds.maxX + model.wall.width;

      var isStopped = false;

      var force = BalloonModel.getTotalForce( model, balloonModel );
      var newVelocity = balloonModel.velocity.add( force.timesScalar( dt ) );
      var newLocation = balloonModel.location.plus( balloonModel.velocity.timesScalar( dt ) );
      if ( newLocation.x + balloonModel.width > rightBound ) {
        isStopped = true;
        newLocation.x = rightBound - balloonModel.width;
      }

      if ( newLocation.y + balloonModel.height > model.bounds.maxY ) {
        isStopped = true;
        newLocation.y = model.bounds.maxY - balloonModel.height;
      }
      if ( newLocation.x < model.bounds.minX ) {
        isStopped = true;
        newLocation.x = model.bounds.minX;
      }
      if ( newLocation.y < model.bounds.minY ) {
        isStopped = true;
        newLocation.y = model.bounds.minY;
      }

      balloonModel.velocity = newVelocity;
      balloonModel.location = newLocation;

      if ( isStopped ) {
        balloonModel.velocity = new Vector2( 0, 0 );
      }
    };
    BalloonModel.coeff = 0.1;
  }

  return BalloonModel;
} );