/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,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gAtw/zvtMGkhdKQnfYSNXFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+1DE54AMVOc57DBn6V8cJ3zzDixVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//sQxOeDxtgzI4ekZygAAD/AAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU=';
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