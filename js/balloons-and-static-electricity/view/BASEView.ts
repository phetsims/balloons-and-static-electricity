// Copyright 2013-2025, University of Colorado Boulder

/**
 * main view class for the simulation
 *
 * @author Vasily Shakhov (Mlearner)
 * @author John Blanco
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import balloonGreen_png from '../../../images/balloonGreen_png.js';
import balloonYellow_png from '../../../images/balloonYellow_png.js';
import carrier002_wav from '../../../sounds/carrier002_wav.js';
import balloonsAndStaticElectricity from '../../balloonsAndStaticElectricity.js';
import BASEA11yStrings from '../BASEA11yStrings.js';
import BASEQueryParameters from '../BASEQueryParameters.js';
import BASEModel from '../model/BASEModel.js';
import BalloonNode from './BalloonNode.js';
import BalloonRubbingSoundGenerator from './BalloonRubbingSoundGenerator.js';
import BASESummaryNode from './BASESummaryNode.js';
import ChargeDeflectionSoundGenerator from './ChargeDeflectionSoundGenerator.js';
import ControlPanel from './ControlPanel.js';
import PlayAreaGridNode from './PlayAreaGridNode.js';
import SweaterNode from './SweaterNode.js';
import TetherNode from './TetherNode.js';
import WallNode from './WallNode.js';

const greenBalloonLabelString = BASEA11yStrings.greenBalloonLabel.value;
const yellowBalloonLabelString = BASEA11yStrings.yellowBalloonLabel.value;

// constants
const BALLOON_TIE_POINT_HEIGHT = 14; // empirically determined

export default class BASEView extends ScreenView {

  // for QUnit tests
  public readonly wallNode: WallNode;

  // sound generator for the deflection of the charges in the wall, never disposed
  private readonly chargeDeflectionSoundGenerator: ChargeDeflectionSoundGenerator;

  public readonly yellowBalloonNode: BalloonNode;
  private readonly yellowBalloonTetherNode: TetherNode;
  public readonly greenBalloonNode: BalloonNode;
  private readonly greenBalloonTetherNode: TetherNode;

  // layer on which the green balloon resides
  private readonly greenBalloonLayerNode: Node;

  // layer on which the yellow balloon resides
  private readonly yellowBalloonLayerNode: Node;

  public constructor( model: BASEModel, tandem: Tandem ) {

    super( {

      // A PhET wide decision was made to not update custom layout bounds even if they do not match the
      // default layout bounds in ScreenView. Do not change these bounds as changes could break or disturb
      // any phet-io instrumentation. https://github.com/phetsims/phet-io/issues/1939
      layoutBounds: new Bounds2( 0, 0, 768, 504 ),
      tandem: tandem
    } );

    const sweaterNode = new SweaterNode( model, tandem.createTandem( 'sweaterNode' ) );

    this.wallNode = new WallNode( model, tandem.createTandem( 'wall' ) );

    this.addChild( sweaterNode );
    this.addChild( this.wallNode );

    // Show black to the right side of the wall so it doesn't look like empty space over there.
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

    const controlPanel = new ControlPanel( model, this, tandem.createTandem( 'controlPanel' ) );

    this.chargeDeflectionSoundGenerator = new ChargeDeflectionSoundGenerator(
      model.wall,
      model.balloons,
      {
        initialOutputLevel: 0.3,
        enabledProperty: new DerivedProperty( [ model.showChargesProperty ], showCharges => showCharges === 'all' )
      }
    );
    soundManager.addSoundGenerator( this.chargeDeflectionSoundGenerator );

    this.yellowBalloonNode = new BalloonNode(
      model.yellowBalloon,
      balloonYellow_png,
      model,
      yellowBalloonLabelString,
      greenBalloonLabelString,
      this.layoutBounds,
      this,
      tandem.createTandem( 'yellowBalloonNode' ),
      {
        pointerDrag: () => {
          this.chargeDeflectionSoundGenerator.balloonDraggedByPointer( model.yellowBalloon );
        },
        keyboardDrag: () => {
          this.chargeDeflectionSoundGenerator.balloonDraggedByKeyboard( model.yellowBalloon );
        }
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
      balloonGreen_png,
      model,
      greenBalloonLabelString,
      yellowBalloonLabelString,
      this.layoutBounds,
      this,
      tandem.createTandem( 'greenBalloonNode' ),
      {
        balloonVelocitySoundGeneratorOptions: { basisSound: carrier002_wav },
        balloonRubbingSoundGeneratorOptions: {
          centerFrequency: BalloonRubbingSoundGenerator.DEFAULT_CENTER_FREQUENCY * 1.25
        },
        pointerDrag: () => {
          this.chargeDeflectionSoundGenerator.balloonDraggedByPointer( model.greenBalloon );
        },
        keyboardDrag: () => {
          this.chargeDeflectionSoundGenerator.balloonDraggedByKeyboard( model.greenBalloon );
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
    const screenSummaryNode = new BASESummaryNode( model, this.yellowBalloonNode, this.greenBalloonNode );
    this.setScreenSummaryContent( screenSummaryNode );

    this.greenBalloonLayerNode = new Node( { children: [ this.greenBalloonTetherNode, this.greenBalloonNode ] } );
    this.addChild( this.greenBalloonLayerNode );

    this.yellowBalloonLayerNode = new Node( { children: [ this.yellowBalloonTetherNode, this.yellowBalloonNode ] } );
    this.addChild( this.yellowBalloonLayerNode );

    // Only show the selected balloon(s)
    model.greenBalloon.isVisibleProperty.link( isVisible => {
      this.greenBalloonNode.visible = isVisible;
      this.greenBalloonTetherNode.visible = isVisible;
    } );

    this.addChild( controlPanel );

    // Make sure that we start with the correct z-order for the balloons.
    this.setDefaultBalloonZOrder();

    // When one of the balloons is picked up, move its content and cue nodes to the front.
    Multilink.multilink(
      [ model.yellowBalloon.isDraggedProperty, model.greenBalloon.isDraggedProperty ],
      ( yellowDragged, greenDragged ) => {
        if ( yellowDragged ) {
          this.yellowBalloonLayerNode.moveToFront();
        }
        else if ( greenDragged ) {
          this.greenBalloonLayerNode.moveToFront();
        }
      }
    );

    // pdom - assign components to the appropriate sections and specify order
    this.pdomPlayAreaNode.pdomOrder = [
      sweaterNode,
      this.yellowBalloonLayerNode,
      this.greenBalloonLayerNode,
      this.wallNode
    ];
    this.pdomControlAreaNode.pdomOrder = [ controlPanel ];

    //--------------------------------------------------------------------------
    // debugging
    //--------------------------------------------------------------------------

    // visualise regions of the play area
    if ( BASEQueryParameters.showGrid ) {
      this.addChild( new PlayAreaGridNode( this.layoutBounds ) );
    }
  }

  /**
   * Step the view.
   */
  public override step( dt: number ): void {
    this.greenBalloonNode.step( dt );
    this.yellowBalloonNode.step( dt );
  }

  /**
   * Set the default layering of the balloons, generally used to restore initial view state.
   */
  public setDefaultBalloonZOrder(): void {
    this.yellowBalloonLayerNode.moveToFront();
  }

  /**
   * Custom layout function for this view. It is most natural for this simulation for the view to
   * be held on the bottom of the navigation bar so that the balloon's tether and wall are always cut
   * off by the navigation bar, see #77.
   */
  public override layout( viewBounds: Bounds2 ): void {
    this.resetTransform();

    const scale = this.getLayoutScale( viewBounds );
    const width = viewBounds.width;
    const height = viewBounds.height;
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
    this.translate( dx + viewBounds.left / scale, offsetY );

    // update the visible bounds of the screen view
    this.visibleBoundsProperty.set( new Bounds2( -dx, -offsetY, width / scale - dx, height / scale - offsetY ) );
  }
}

balloonsAndStaticElectricity.register( 'BASEView', BASEView );