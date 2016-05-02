// Copyright 2002-2013, University of Colorado Boulder

/**
 * Scenery display object (scene graph node) for the wall of the model.
 *
 @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Image = require( 'SCENERY/nodes/Image' );
  var PlusChargeNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/PlusChargeNode' );
  var MinusChargeNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/MinusChargeNode' );
  var PointChargeModel = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/PointChargeModel' );
  var AccessiblePeer = require( 'SCENERY/accessibility/AccessiblePeer' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );

  // strings
  var wallLabelString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/wall.label' );
  var wallChargeNeutralityDescriptionString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/wall.chargeNeutralityDescription' );
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );

  // images
  var wallImage = require( 'image!BALLOONS_AND_STATIC_ELECTRICITY/wall.png' );

  function WallNode( model ) {
    var self = this;
    var wallModel = model.wall;

    // super constructor
    Node.call( this, { pickable: false } );

    this.translate( wallModel.x, 0 );

    // add the background
    this.wallNode = new Image( wallImage );
    this.addChild( this.wallNode );

    var plusChargesNode = new Node();
    var minusChargesNode = new Node( { layerSplit: true } );
    plusChargesNode.translate( -wallModel.x, 0 );
    minusChargesNode.translate( -wallModel.x, 0 );

    //draw plusCharges on the wall
    wallModel.plusCharges.forEach( function( entry ) {
      entry.view = new PlusChargeNode( entry.location );
      plusChargesNode.addChild( entry.view );
    } );

    //draw minusCharges on the wall
    wallModel.minusCharges.forEach( function( entry ) {
      entry.view = new MinusChargeNode( entry.location );
      entry.locationProperty.link( function updateLocation( location ) {
        entry.view.setTranslation( location.x + PointChargeModel.radius, location.y + PointChargeModel.radius );
      } );
      minusChargesNode.addChild( entry.view );
    } );

    this.addChild( plusChargesNode );
    this.addChild( minusChargesNode );

    wallModel.isVisibleProperty.link( function updateWallVisibility( isVisible ) {
      self.visible = isVisible;
    } );

    //show charges based on draw  property
    model.showChargesProperty.link( function switchWallChargesView( value ) {
      plusChargesNode.visible = (value === 'all');
      minusChargesNode.visible = (value === 'all');
    } );

    // outfit with accessible content
    this.accessibleContent = {
      createPeer: function( accessibleInstance ) {
        var trail = accessibleInstance.trail;
        var uniqueId = trail.getUniqueId();

        // representation should look like the following in the parallel DOM
        //  <div id="wall-widget">
        //    <h3 id="wall-label">Wall</h3>
        //    <!-- Wall charge information changes and will need to be associated with the balloon. -->
        //    <p id="wall-description">The wall has a neutral charge, no more positive charges than negative ones.</p>
        //
        //     TODO: Shouldn't these be part of the control panel?? Not implementing for now.
        //     <!-- If the button text is an image, use aria-label="Remove Wall" and aria-label="Add Wall". -->
        //     <button aria-pressed="true" aria-describedby="wall-button-description">Remove Wall</button>
        //     <!-- <button aria-pressed="true" aria-describedby="wall-button-description">Add Wall</button> -->
        //     <p id="wall-button-description">Toggle to conduct experiments with or without the wall.</p>
        //  </div>

        // create the element representing the wall
        var domElement = document.createElement( 'div' );
        domElement.id = 'wall-' + uniqueId;

        // create the label element for the wall
        var labelElement = document.createElement( 'h3' );
        labelElement.id = 'wall-label-' + uniqueId;
        labelElement.textContent = wallLabelString;
        domElement.setAttribute( 'aria-labelledby', labelElement.id );

        // create the description element for the wall
        var neutralDescriptionElement = document.createElement( 'p' );
        neutralDescriptionElement.id = 'wall-description-' + uniqueId;
        neutralDescriptionElement.textContent = wallChargeNeutralityDescriptionString;

        var repelDescriptionElement = document.createElement( 'p' );
        repelDescriptionElement.id = 'repel-description-' + uniqueId;
        repelDescriptionElement.setAttribute( 'aria-live', 'polite' );

        // update the description element text content when balloon position changes, accounting
        // for the charge of the balloon.
        model.balloons.forEach( function( balloon ) {
          balloon.locationProperty.lazyLink( function( location, oldLocation ) {

            if ( !location.equals( oldLocation ) ) {

              var distFromWall = model.wall.x - location.x;

              var atTouchPointString = 'At touch point, {0} {1}';
              var unchangedString = 'charges in neutral wall remain unchanged';
              var negativeChargesString = 'negative charges in the wall repel away from balloon';
              var aLittleBitString = 'a little bit';
              var aLotString = 'a lot';
              var quiteALotString = 'quite a lot';

              var repelDescriptionString = '';
              if( distFromWall < 135 ) {

                // build the charge displacement description.
                if( balloon.charge === 0 ) {
                  repelDescriptionString = StringUtils.format( atTouchPointString, unchangedString, '' );
                }
                else if( balloon.charge > -15 && balloon.charge < 0 ) {
                  repelDescriptionString = StringUtils.format( atTouchPointString, negativeChargesString, aLittleBitString );
                }
                else if( balloon.charge > -35 && balloon.charge < -16) {
                  repelDescriptionString = StringUtils.format( atTouchPointString, negativeChargesString, aLotString );
                }
                else if( balloon.charge > -60 && balloon.charge < -36 ) {
                  repelDescriptionString = StringUtils.format( atTouchPointString, negativeChargesString, quiteALotString );
                }
                assert && assert( repelDescriptionString, 'description string not defined' );
              }

              if ( wallModel.isVisible ) {
                if ( repelDescriptionElement.textContent !== repelDescriptionString ) {
                  // only update if changing content
                  repelDescriptionElement.textContent = repelDescriptionString;
                }
              }
            }
          } );
        } );

        // link accessible visibility to the model
        wallModel.isVisibleProperty.link( function updateWallVisibility( isVisible ) {
          domElement.hidden = !isVisible;
        } );

        // structure the wall element with its descriptions
        domElement.appendChild( labelElement );
        domElement.appendChild( neutralDescriptionElement );
        domElement.appendChild( repelDescriptionElement );

        return new AccessiblePeer( accessibleInstance, domElement );
      }
    };
  }

  balloonsAndStaticElectricity.register( 'WallNode', WallNode );

  return inherit( Node, WallNode );
} );
