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
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import balloonGreen from '../../../images/balloon-green_png.js';
import balloonYellow from '../../../images/balloon-yellow_png.js';
import greenBalloonDriftVelocityLoop from '../../../sounds/carrier-002_wav.js';
import balloonsAndStaticElectricity from '../../balloonsAndStaticElectricity.js';
import BASEA11yStrings from '../BASEA11yStrings.js';
import BASEQueryParameters from '../BASEQueryParameters.js';
import BalloonNode from './BalloonNode.js';
import BalloonRubbingSoundGenerator from './BalloonRubbingSoundGenerator.js';
import BASESummaryNode from './BASESummaryNode.js';
import ControlPanel from './ControlPanel.js';
import PlayAreaGridNode from './PlayAreaGridNode.js';
import SweaterNode from './SweaterNode.js';
import TetherNode from './TetherNode.js';
import WallNode from './WallNode.js';

const greenBalloonLabelString = BASEA11yStrings.greenBalloonLabel.value;
const yellowBalloonLabelString = BASEA11yStrings.yellowBalloonLabel.value;

// constants
const BALLOON_TIE_POINT_HEIGHT = 14; // empirically determined

class BASEView extends ScreenView {

  /**
   * @param {BASEModel} model
   * @param {Tandem} tandem
   */
  constructor( model, tandem ) {

    super( {
      layoutBounds: new Bounds2( 0, 0, 768, 504 ),
      tandem: tandem
    } );

    const sweaterNode = new SweaterNode( model, tandem.createTandem( 'sweaterNode' ) );

    // @public (for QUnit tests)
    this.wallNode = new WallNode( model, this.layoutBounds.height, tandem.createTandem( 'wall' ) );

    this.pdomPlayAreaNode.addChild( sweaterNode );
    this.pdomPlayAreaNode.addChild( this.wallNode );

    //Show black to the right side of the wall so it doesn't look like empty space over there
    this.addChild( new Rectangle(
      model.wall.x + this.wallNode.wallNode.width,
      0,
      1000,
      1000,
      { fill: 'black', tandem: tandem.createTandem( 'spaceToRightOfWall' ) }
    ) );

    // Add black to the left of the screen to match the black region to the right of the wall
    const maxX = this.layoutBounds.maxX - model.wall.x - this.wallNode.wallNode.width;
    this.addChild( new Rectangle(
      maxX - 1000,
      0,
      1000,
      1000,
      { fill: 'black', tandem: tandem.createTandem( 'spaceToLeftOfWall' ) }
    ) );

    const controlPanel = new ControlPanel( model, this.layoutBounds, tandem.createTandem( 'controlPanel' ) );

    this.yellowBalloonNode = new BalloonNode(
      model.yellowBalloon,
      balloonYellow,
      model,
      yellowBalloonLabelString,
      greenBalloonLabelString,
      this.layoutBounds,
      tandem.createTandem( 'yellowBalloonNode' ),
      {
        labelContent: yellowBalloonLabelString
      }
    );
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
    this.greenBalloonNode = new BalloonNode(
      model.greenBalloon,
      balloonGreen,
      model,
      greenBalloonLabelString,
      yellowBalloonLabelString,
      this.layoutBounds,
      tandem.createTandem( 'greenBalloonNode' ),
      {
        labelContent: greenBalloonLabelString,
        balloonVelocitySoundGeneratorOptions: { basisSound: greenBalloonDriftVelocityLoop },
        balloonRubbingSoundGeneratorOptions: {
          centerFrequency: BalloonRubbingSoundGenerator.DEFAULT_CENTER_FREQUENCY * 1.25
        }
      }
    );
    this.greenBalloonTetherNode = new TetherNode(
      model.greenBalloon,
      tetherAnchorPoint,
      new Vector2( this.greenBalloonNode.width / 2, this.greenBalloonNode.height - BALLOON_TIE_POINT_HEIGHT ),
      tandem.createTandem( 'greenBalloonTetherNode' )
    );

    // created after all other view objects so we can access each describer
    const screenSummaryNode = new BASESummaryNode( model, this.yellowBalloonNode, this.greenBalloonNode, this.wallNode, tandem.createTandem( 'screenSummaryNode' ) );
    this.setScreenSummaryContent( screenSummaryNode );

    // combine the balloon content into single nodes so that they are easily layerable
    const greenBalloonLayerNode = new Node( { children: [ this.greenBalloonTetherNode, this.greenBalloonNode ] } );
    const yellowBalloonLayerNode = new Node( { children: [ this.yellowBalloonTetherNode, this.yellowBalloonNode ] } );
    this.pdomPlayAreaNode.addChild( yellowBalloonLayerNode );
    this.pdomPlayAreaNode.addChild( greenBalloonLayerNode );

    // Only show the selected balloon(s)
    model.greenBalloon.isVisibleProperty.link( isVisible => {
      this.greenBalloonNode.visible = isVisible;
      this.greenBalloonTetherNode.visible = isVisible;
    } );

    this.pdomControlAreaNode.addChild( controlPanel );

    // when one of the balloons is picked up, move its content and cue nodes to front
    Property.multilink( [ model.yellowBalloon.isDraggedProperty, model.greenBalloon.isDraggedProperty ], ( yellowDragged, greenDragged ) => {
      if ( yellowDragged ) {
        yellowBalloonLayerNode.moveToFront();
      }
      else if ( greenDragged ) {
        greenBalloonLayerNode.moveToFront();
      }
    } );

    // set the accessible order: sweater, balloons wall
    this.pdomPlayAreaNode.pdomOrder = [ sweaterNode, yellowBalloonLayerNode, greenBalloonLayerNode, this.wallNode ];

    //--------------------------------------------------------------------------
    // debugging
    //--------------------------------------------------------------------------

    // visualise regions of the play area
    if ( BASEQueryParameters.showGrid ) {
      this.addChild( new PlayAreaGridNode( this.layoutBounds, tandem.createTandem( 'playAreaGridNode' ) ) );
    }
  }

  /**
   * Step the view.  For accessibility, we want to step the 'AudioView' and the keyboard drag handlers.
   * @param {number} dt
   * @public
   */
  step( dt ) {
    this.greenBalloonNode.step( dt );
    this.yellowBalloonNode.step( dt );
    this.wallNode.step( dt );

    // step the audio
    this.audioView && this.audioView.step( dt );
  }

  /**
   * Custom layout function for this view. It is most natural for this simulation for the view to
   * be held on the bottom of the navigation bar so that the balloon's tether and wall are always cut
   * off by the navigation bar, see #77.
   *
   * @param {number} width
   * @param {number} height
   * @public (joist-internal)
   * @override
   */
  layout( width, height ) {
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
}

balloonsAndStaticElectricity.register( 'BASEView', BASEView );
export default BASEView;