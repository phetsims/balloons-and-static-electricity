/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//swxAAAB3AjZvTBgDEPD20rMnACACW23IAvf9gkAgBwdGRAEQmHixYsWAmD4Pg+bwxlwfB8HwQBAEAQBMHwfB/gh/u/ggCDsHw/ggCBysHwQP4EMGAwGBAAAAGRA0rCG+P6MxrhOFpdwLNZiLDKGvxnGdAKAd4Ph0a/gNHhsNv9TR047/xsCoSPfLQkDX8ShIGip1UkAAOba0OJ//syxAOAB0AtRb3DADDrBKe1zCTOABwVSFSJbMFwQYfHBmePG60aYaAJc4OEQGByYTrZsNdWsNBkupE7N3di7v/o+3SWq2foCAALdskjSUCLODB0cGnoiGMzofBPR9GW7ATWZAOUXIF1AzuTYl71yVFyWvM6kqsR6/6O96rUzp+hX6UEAAp2sSJEwIs1pK8DxocAD1O/YTddcFFSwP/7MsQNAAawITmtYYZwtoPodNzgFm6KOI0uVUJGPRb6T3KAVbUIT/2RXfZJf/QxPpKYSku1sgiUAovZtNdLvCjI/aRIbhperlSmsdTrWR6LLLv7P/NDXKUKP/X6v/WqBQJcloAiREAxtj38WHaCcASsR2BxM6gjgm616nW//U96ZuWt/9dP///kwGZHf9brIwANkXxBFOdUUnRrOTT/+zLEHwAFSB05penisI+DKPQgPAY2B6la6+as+/n+326lqTR01QyGoLbIIwBANqhlGMj2+sZvTQXqR2OZ+qyOzmn/////cKi1bthI2yoFMEiNHlHDxuxLA4wJAE/+QJqaP2f9s1LO1/p/M2+11FwABxEQASuBRr52ArpiQG4iWpS+rruX//6v/f/6Pr92MUScogAHfUmbQ8isvRjG//swxDuABBQZPaEF4HChAmf0ELwOKR1err9a2aLPR//rZMQASVAGc7C0oKmqwXRUysBjPe/4r9aMKd9TEVb/1uRdHFrm6TDGgBFCBluIrkNrqv2/T/6E7H6F9X//Z+tUAEJNpOJAQHeR2bXTu1tnWg9xEe+/6P////0n/n1DJlQunWLaxSiKt/qZ/+tMQU1FMy45OS41qqqqqqqq//syxFqCA/gZHUbgYkBpAiRwcDwEqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpMQU1FMy45OS41qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqv/7MsSBgASgERzjhWBQZABkZCCIBqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqr/+zLEpoDDbAMpoIRAMEaAHiAQiAaqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//swxLwDwAABpAAAACAAADSAAAAEqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq';
const soundByteArray = base64SoundToByteArray( phetAudioContext, soundURI );
const unlock = asyncLoader.createLock( soundURI );
const wrappedAudioBuffer = new WrappedAudioBuffer();
const onDecodeSuccess = decodedAudio => {
  wrappedAudioBuffer.audioBufferProperty.set( decodedAudio );
  unlock();
};
const onDecodeError = decodeError => {
  console.warn( 'decode of audio data failed, using stubbed sound, error: ' + decodeError );
  wrappedAudioBuffer.audioBufferProperty.set( phetAudioContext.createBuffer( 1, 0, phetAudioContext.sampleRate ) );
  unlock();
};
phetAudioContext.decodeAudioData( soundByteArray.buffer, onDecodeSuccess, onDecodeError );
export default wrappedAudioBuffer;