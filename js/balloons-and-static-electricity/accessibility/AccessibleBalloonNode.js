// Copyright 2015, University of Colorado Boulder

/**
 * A node for a Balloon in Balloons and Static Electricity.  This contains a BalloonNode, but structures it as a child
 * of another node for the accessibility tree.
 *
 * The HTML should look like:
 * <div id="balloon-widget" aria-labelledby="balloon-label" aria-describedby="balloon-description">
 *    <input role="application" type="image" src="" alt="‪" name="balloon-14-35-37-270-343-346" aria-live="polite" 
 *      id="balloon-14-35-37-270-343-346" draggable="true" class="Balloon" aria-labelledby="balloon-label" 
 *      aria-describedby="balloon-description">
 *    <h3 id="balloon-label">Balloon One</h3>
 *    <p id="balloon-description">
 *        ...
 *    </p>
 * </div
 * 
 * NOTE: This type of structure is experimental. If this structure is successful and can be applied to additional 
 * simulation elements, Scenery should eventually be able to handle this kind of thing.
 * 
 * @author: Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );
  var BalloonNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/BalloonNode' );
  var AccessiblePeer = require( 'SCENERY/accessibility/AccessiblePeer' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );

  // strings
  var neutralString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/neutral' );
  var netNegativeString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/netNegative' );
  var noString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/no' );
  var aFewString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/aFew' );
  var severalString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/several' );
  var manyString = require( 'string!BALLOONS_AND_STATIC_ELECTRICITY/many' );

  /**
   * Constructor.
   * 
   * @param {number} x
   * @param {number} y
   * @param {BalloonModel} model
   * @param {Image} imgsrc
   * @param {BalloonsAndStaticElectricityModel} globalModel
   * @param {object} options
   * @constructor
   **/
  function AccessibleBalloonNode( x, y, model, imgsrc, globalModel, options ) {

    Node.call( this );
    var thisNode = this;

    // The accessible balloon node needs to track the id's of accessible labels so that they can be passed to the 
    // BalloonNode
    this.accessibleLabelId = 'balloon-label-' + this.id; // @private (a11y)
    this.accessibleDescriptionId = 'balloon-description-' + this.id; // @private (a11y)

    // create the div container for this element
    this.accessibleContent = {
      createPeer: function( accessibleInstance ) {
        var trail = accessibleInstance.trail;
        var uniqueId = trail.getUniqueId();

        // The element should look like the following in the Parallel DOM.
        // Note that the input element is defined in BalloonNode.js
        //  <div id="balloon-widget" aria-labelledby="balloon-label" aria-describedby="balloon-description" aria-live='polite'>
        //     <input role="application" type="image" src="" alt="‪" name="balloon-14-35-37-270-343-346" 
        //       id="balloon-14-35-37-270-343-346" draggable="true" class="Balloon" aria-labelledby="balloon-label" 
        //       aria-describedby="balloon-description">
        //     <h3 id="balloon-label">Balloon One</h3>
        //     <p id="balloon-description">
        //         ...
        //     </p>
        //  </div

        // create the div, set its id
        var domElement = document.createElement( 'div' );
        domElement.id = 'balloon-container-' + uniqueId;
        domElement.setAttribute( 'aria-live', 'polite' );
        domElement.setAttribute( 'role', 'application' );

        // create the accessible label
        var labelElement = document.createElement( 'h3' );
        labelElement.id = thisNode.accessibleLabelId;
        labelElement.textContent = options.accessibleLabel;
        domElement.setAttribute( 'aria-labelledby', labelElement.id );

        // create the accessible description
        var descriptionElement = document.createElement( 'p' );
        descriptionElement.id = thisNode.accessibleDescriptionId;
        descriptionElement.textContent = options.accessibleDescription;
        domElement.setAttribute( 'aria-describedby', descriptionElement.id );

        // data-at-shortcutkeys is the JAWS API for allowing key pressed to go to the browser.  This is a test to see if it works.
        domElement.setAttribute( 'data-at-shortcutkeys', "{'j': 'Key to start jumping', 'w': 'Key to jump to wall', 's': 'Key to jump to sweater'}"  ); // eslint-disable-line quotes

        // structure the domElement
        domElement.appendChild( labelElement );
        domElement.appendChild( descriptionElement );

        // build up the correct charge description based on the state of the model
        var createDescription = function( charge ) {
          var chargeNeutralityDescriptionString = charge < 0 ? netNegativeString : neutralString;

          var chargeAmountString;
          if( charge === 0 ) {
            chargeAmountString = noString;
          }
          else if( charge >= -15 ) {
            chargeAmountString = aFewString;
          }
          else if( charge >= -40 && charge < -10 ) {
            chargeAmountString = severalString;
          }
          else if ( charge < -40 ) {
            chargeAmountString = manyString;
          }
          assert && assert( chargeAmountString, 'String charge amount description not defined.' );

          return StringUtils.format( options.accessibleDescriptionPatternString, chargeNeutralityDescriptionString, chargeAmountString );
        };

        // whenever the model charge changes, update the accesible description
        model.chargeProperty.link( function( charge ) {
          descriptionElement.textContent = createDescription( charge );
        } );

        // TODO: it is starting to look like this kind of thing needs to be handled entirely by scenery
        model.isVisibleProperty.link( function( isVisible ) {
          domElement.hidden = !isVisible;
        } );

        return new AccessiblePeer( accessibleInstance, domElement );

      }
    };

    var balloonNodeOptions  =_.extend( {
      accessibleLabelId: thisNode.accessibleLabelId,
      accessibleDescriptionId: thisNode.accessibleDescriptionId
    } );
    var balloonNode = new BalloonNode( x, y, model, imgsrc, globalModel, balloonNodeOptions );
    this.addChild( balloonNode );

    // make sure that the balloon comes before its descriptions
    this.accessibleOrder = [ balloonNode ];

  }

  return inherit( Node, AccessibleBalloonNode );

} );