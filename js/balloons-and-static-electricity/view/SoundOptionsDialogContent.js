// Copyright 2020, University of Colorado Boulder

/**
 * SoundOptionsDialogContent presents options to the user that allows them to make changes to the sound behavior, thus
 * enabling team members to compare different sound design options.
 *
 * TODO: This is temporary and should be removed prior to publication, see https://github.com/phetsims/balloons-and-static-electricity/issues/486.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import NumberPicker from '../../../../scenery-phet/js/NumberPicker.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import ComboBox from '../../../../sun/js/ComboBox.js';
import ComboBoxItem from '../../../../sun/js/ComboBoxItem.js';
import HSlider from '../../../../sun/js/HSlider.js';
import balloonsAndStaticElectricity from '../../balloonsAndStaticElectricity.js';

// constants
const TEXT_OPTIONS = { font: new PhetFont( 24 ) };

class SoundOptionsDialogContent extends Node {

  constructor() {

    super();

    // convenience variables
    const globalConfigProps = phet.ballonsAndStaticElectricity.chargeDeflectionSoundGeneratorInfo.configurationProperties;
    const discreteSoundSourcesMap = phet.ballonsAndStaticElectricity.chargeDeflectionSoundGeneratorInfo.discreteSoundSources;

    // create the combo box for selecting the sound source for the discrete sound sound generators
    const soundSourceComboBoxItems = [];
    discreteSoundSourcesMap.forEach( ( value, key ) => {
      soundSourceComboBoxItems.push( new ComboBoxItem(
        new Text( key, TEXT_OPTIONS ),
        value
      ) );
    } );

    const soundSourceComboBox = new ComboBox(
      soundSourceComboBoxItems,
      globalConfigProps.discreteSoundSourceProperty,
      this,
      { buttonFill: 'rgb( 218, 236, 255 )' }
    );

    // Put the combo box together with a label.
    const sourceSoundSelector = new HBox( {
      children: [ new Text( 'Sound: ', TEXT_OPTIONS ), soundSourceComboBox ],
      spacing: 10
    } );

    // create the combo box for selecting the pitch mapping algorithm for the discrete sound sound generators
    const pitchMappingAlgorithmComboBoxItems = [];
    const discreteSoundPitchMappingAlgorithms = phet.ballonsAndStaticElectricity.chargeDeflectionSoundGeneratorInfo.discretePitchMappingAlgorithms;
    discreteSoundPitchMappingAlgorithms.forEach( ( value, key ) => {
      pitchMappingAlgorithmComboBoxItems.push( new ComboBoxItem(
        new Text( key, TEXT_OPTIONS ),
        value
      ) );
    } );

    const pitchMappingAlgorithmComboBox = new ComboBox(
      pitchMappingAlgorithmComboBoxItems,
      globalConfigProps.discreteSoundPitchAlgorithmProperty,
      this,
      { buttonFill: 'rgb( 218, 236, 255 )' }
    );

    // Put the combo box together with a label.
    const pitchMappingAlgorithmSelector = new HBox( {
      children: [ new Text( 'Pitch mapping: ', TEXT_OPTIONS ), pitchMappingAlgorithmComboBox ],
      spacing: 10
    } );

    // Slider for the octave offset used in conjunction with pitch mapping.
    const octaveOffsetSlider = new HSlider( globalConfigProps.discreteSoundsOctaveOffsetProperty, new Range( -2, 2 ) );

    // Add tick marks to slider.
    _.times( 5, index => {
      const tickMarkValue = index - 2;
      octaveOffsetSlider.addMajorTick( tickMarkValue, new Text( tickMarkValue.toString(), TEXT_OPTIONS ) );
    } );

    // Put the slider into a horizontal box with a label.
    const octaveOffsetControl = new HBox( {
      children: [ new Text( 'Octave offset: ', TEXT_OPTIONS ), octaveOffsetSlider ],
      spacing: 10
    } );

    // Add a number picker to control the number of sound generators
    const numSoundGeneratorsNumberPicker = new NumberPicker(
      globalConfigProps.numberOfDiscreteSoundGeneratorsProperty,
      new Property( new Range( 1, 18 ) ) // hard coded to work with what we know the range to be
    );

    // Put the number picker together with a label.
    const numSoundGeneratorsSelector = new HBox( {
      children: [ new Text( 'Num sound generators: ', TEXT_OPTIONS ), numSoundGeneratorsNumberPicker ],
      spacing: 10
    } );

    // Add a number picker to control the number of discrete bins
    const numBinsNumberPicker = new NumberPicker(
      globalConfigProps.discreteSoundNumberOfBinsProperty,
      new Property( new Range( 2, 20 ) ) // educated guess
    );

    // Put the number picker together with a label.
    const numBinsController = new HBox( {
      children: [ new Text( 'Num discrete bins: ', TEXT_OPTIONS ), numBinsNumberPicker ],
      spacing: 10
    } );

    // Add a number picker to control the proportionate size of the first bin
    const firstBinProportionateSizePicker = new NumberPicker(
      globalConfigProps.discreteSoundBinZeroProportionProperty,
      new Property( new Range( 0.05, 2 ) ),
      {
        incrementFunction: value => value + 0.05,
        decrementFunction: value => value - 0.05,
        decimalPlaces: 2
      }
    );

    // Put the number picker together with a label.
    const firstBinProportionateSizeController = new HBox( {
      children: [ new Text( 'First bin proportionate size: ', TEXT_OPTIONS ), firstBinProportionateSizePicker ],
      spacing: 10
    } );

    // Slider for the controlling the overall output level.
    const outputLevelSlider = new HSlider( globalConfigProps.overallOutputLevelProperty, new Range( 0, 1 ) );

    // Add tick marks to slider.
    _.times( 2, index => {
      outputLevelSlider.addMajorTick(
        index,
        new Text( index === 0 ? 'min' : 'max', TEXT_OPTIONS )
      );
    } );

    // Put the slider into a horizontal box with a label.
    const overallOutputLevelControl = new HBox( {
      children: [ new Text( 'Output level: ', TEXT_OPTIONS ), outputLevelSlider ],
      spacing: 10
    } );

    // Add a vertical box with the controls.
    this.addChild( new VBox( {
      children: [
        new RichText( 'Options for the Charges-in-the-Wall<br>Sound Generator:', {
          font: new PhetFont( 32 ),
          weight: 'bold'
        } ),
        numSoundGeneratorsSelector,
        sourceSoundSelector,
        pitchMappingAlgorithmSelector,
        octaveOffsetControl,
        numBinsController,
        firstBinProportionateSizeController,
        overallOutputLevelControl
      ],
      spacing: 20,
      align: 'left'
    } ) );
  }
}

balloonsAndStaticElectricity.register( 'SoundOptionsDialogContent', SoundOptionsDialogContent );
export default SoundOptionsDialogContent;