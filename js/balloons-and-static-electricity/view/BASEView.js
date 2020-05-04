// Copyright 2013-2020, University of Colorado Boulder

/**
 * main view class for the simulation
 *
 * @author Vasily Shakhov (Mlearner)
 * @author John Blanco
 */

import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import inherit from '../../../../phet-core/js/inherit.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import PitchedPopGenerator from '../../../../tambo/js/sound-generators/PitchedPopGenerator.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import balloonGreen from '../../../images/balloon-green_png.js';
import balloonYellow from '../../../images/balloon-yellow_png.js';
import balloonsAndStaticElectricity from '../../balloonsAndStaticElectricity.js';
import BASEA11yStrings from '../BASEA11yStrings.js';
import BASEConstants from '../BASEConstants.js';
import BASEQueryParameters from '../BASEQueryParameters.js';
import BalloonNode from './BalloonNode.js';
import BASEShapeHitDetector from './BASEShapeHitDetector.js';
import BASESummaryNode from './BASESummaryNode.js';
import ControlPanel from './ControlPanel.js';
import PlayAreaGridNode from './PlayAreaGridNode.js';
import SweaterNode from './SweaterNode.js';
import TetherNode from './TetherNode.js';
import vibrationController from './vibrationController.js';
import WallNode from './WallNode.js';

const greenBalloonLabelString = BASEA11yStrings.greenBalloonLabel.value;
const yellowBalloonLabelString = BASEA11yStrings.yellowBalloonLabel.value;


// constants
const BALLOON_TIE_POINT_HEIGHT = 14; // empirically determined

/**
 * @constructor
 * @param {BASEModel} model
 * @param {Tandem} tandem
 */
function BASEView( model, tandem ) {

  const self = this;

  ScreenView.call( this, {
    layoutBounds: new Bounds2( 0, 0, 768, 504 ),
    tandem: tandem
  } );

  const sweaterNode = new SweaterNode( model, tandem.createTandem( 'sweaterNode' ) );
  const wallNode = new WallNode( model, this.layoutBounds.height, tandem.createTandem( 'wall' ) );

  this.pdomPlayAreaNode.addChild( sweaterNode );
  this.pdomPlayAreaNode.addChild( wallNode );

  //Show black to the right side of the wall so it doesn't look like empty space over there
  this.addChild( new Rectangle(
    model.wall.x + wallNode.wallNode.width,
    0,
    1000,
    1000,
    { fill: 'black', tandem: tandem.createTandem( 'spaceToRightOfWall' ) }
  ) );

  // Add black to the left of the screen to match the black region to the right of the wall
  const maxX = this.layoutBounds.maxX - model.wall.x - wallNode.wallNode.width;
  this.addChild( new Rectangle(
    maxX - 1000,
    0,
    1000,
    1000,
    { fill: 'black', tandem: tandem.createTandem( 'spaceToLeftOfWall' ) }
  ) );

  const controlPanel = new ControlPanel( model, this.layoutBounds, tandem.createTandem( 'controlPanel' ) );

  this.yellowBalloonNode = new BalloonNode( model.yellowBalloon, balloonYellow, model, yellowBalloonLabelString, greenBalloonLabelString, this.layoutBounds, tandem.createTandem( 'yellowBalloonNode' ), {
    labelContent: yellowBalloonLabelString
  } );
  const tetherAnchorPoint = new Vector2(
    model.yellowBalloon.positionProperty.get().x + 30, // a bit to the side of directly below the starting position
    this.layoutBounds.height
  );
  this.yellowBalloonTetherNode = new TetherNode(
    model.yellowBalloon,
    tetherAnchorPoint,
    new Vector2( this.yellowBalloonNode.width / 2, this.yellowBalloonNode.height - BALLOON_TIE_POINT_HEIGHT ),
    tandem.createTandem( 'yellowBalloonTetherNode' )
  );
  this.greenBalloonNode = new BalloonNode( model.greenBalloon, balloonGreen, model, greenBalloonLabelString, yellowBalloonLabelString, this.layoutBounds, tandem.createTandem( 'greenBalloonNode' ), {
    labelContent: greenBalloonLabelString
  } );
  this.greenBalloonTetherNode = new TetherNode(
    model.greenBalloon,
    tetherAnchorPoint,
    new Vector2( this.greenBalloonNode.width / 2, this.greenBalloonNode.height - BALLOON_TIE_POINT_HEIGHT ),
    tandem.createTandem( 'greenBalloonTetherNode' )
  );

  // created after all other view objects so we can access each describer
  const screenSummaryNode = new BASESummaryNode( model, this.yellowBalloonNode, this.greenBalloonNode, wallNode, tandem.createTandem( 'screenSummaryNode' ) );
  this.setScreenSummaryContent( screenSummaryNode );

  // combine the balloon content into single nodes so that they are easily layerable
  const greenBalloonLayerNode = new Node( { children: [ this.greenBalloonTetherNode, this.greenBalloonNode ] } );
  const yellowBalloonLayerNode = new Node( { children: [ this.yellowBalloonTetherNode, this.yellowBalloonNode ] } );
  this.pdomPlayAreaNode.addChild( yellowBalloonLayerNode );
  this.pdomPlayAreaNode.addChild( greenBalloonLayerNode );

  // Only show the selected balloon(s)
  model.greenBalloon.isVisibleProperty.link( function( isVisible ) {
    self.greenBalloonNode.visible = isVisible;
    self.greenBalloonTetherNode.visible = isVisible;
  } );

  this.pdomControlAreaNode.addChild( controlPanel );

  // when one of the balloons is picked up, move its content and cue nodes to front
  Property.multilink( [ model.yellowBalloon.isDraggedProperty, model.greenBalloon.isDraggedProperty ], function( yellowDragged, greenDragged ) {
    if ( yellowDragged ) {
      yellowBalloonLayerNode.moveToFront();
    }
    else if ( greenDragged ) {
      greenBalloonLayerNode.moveToFront();
    }
  } );

  // sound generation
  const popSoundGenerator = new PitchedPopGenerator( {
    // enableControlProperties: [ resetNotInProgressProperty ],
    initialOutputLevel: 0.3
  } );
  soundManager.addSoundGenerator( popSoundGenerator );
  model.balloons.forEach( balloon => {
    balloon.chargeProperty.lazyLink( charge => {
      const chargeAbsoluteValue = Math.abs( charge );
      if ( chargeAbsoluteValue > 0 ) {
        popSoundGenerator.playPop( chargeAbsoluteValue / BASEConstants.MAX_BALLOON_CHARGE );
      }
    } );
  } );

  // set the accessible order: sweater, balloons wall
  this.pdomPlayAreaNode.accessibleOrder = [ sweaterNode, yellowBalloonLayerNode, greenBalloonLayerNode, wallNode ];

  // init vib controller
  vibrationController.initialize( model );

  if ( phet.chipper.queryParameters.vibration !== null ) {
    const hitDetector = new BASEShapeHitDetector( model, this, tandem.createTandem( 'hitDetector' ) );
    phet.joist.display.addInputListener( hitDetector );
  }

  //--------------------------------------------------------------------------
  // debugging
  //--------------------------------------------------------------------------

  // visualise regions of the play area
  if ( BASEQueryParameters.showGrid ) {
    this.addChild( new PlayAreaGridNode( this.layoutBounds, tandem.createTandem( 'playAreaGridNode' ) ) );
  }
}

balloonsAndStaticElectricity.register( 'BASEView', BASEView );

inherit( ScreenView, BASEView, {

  /**
   * Step the view.  For acccessibility, we want to step the 'AudioView' and the keyboard drag handlers.
   * @param {number} dt
   * @public
   */
  step: function( dt ) {
    this.greenBalloonNode.step( dt );
    this.yellowBalloonNode.step( dt );

    // step the audio
    this.audioView && this.audioView.step( dt );
  },

  /**
   * Custom layout function for this view. It is most natural for this simulation for the view to
   * be held on the bottom of the navigation bar so that the balloon's tether and wall are always cut
   * off by the navigation bar, see #77.
   *
   * @param {number} width
   * @param {number} height
   */
  layout: function( width, height ) {
    this.resetTransform();

    const scale = this.getLayoutScale( width, height );
    this.setScaleMagnitude( scale );

    let dx = 0;
    let offsetY = 0;

    // Move to bottom vertically (custom for this sim)
    if ( scale === width / this.layoutBounds.width ) {
      offsetY = ( height / scale - this.layoutBounds.height );
    }

    // center horizontally (default behavior for ScreenView)
    else if ( scale === height / this.layoutBounds.height ) {
      dx = ( width - this.layoutBounds.width * scale ) / 2 / scale;
    }
    this.translate( dx, offsetY );

    // update the visible bounds of the screen view
    this.visibleBoundsProperty.set( new Bounds2( -dx, -offsetY, width / scale - dx, height / scale - offsetY ) );
  }
} );

export default BASEView;