/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,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VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVKRARbijRZSe5Gcu49OTM1gPtrWEkk1g+KpZgEqjagQlWQ0OlITDmPgBk6E2PRKhLCaRE1RFl1uXjVqw2Pj4563xZSat5CHgK5EqceFRABScYpP/7cMT5AA+tnwHhjNXiZLQa5GMmPItikilpCz/4+yxNtaisaPkqSJqN5K2SJ7KKCLYwlbKzaxJZuOjXJWRmc52zOVR1etdtI45sFonbWtJy5anxsOtE5YKgSZLWdF+qTEFNRTMuOTkuNaqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqr/+3LEuwHTHaKtpiTZYAoAQAGwAASqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqkxBTUUzLjk5LjWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqv/7cMRtg8AAAaQAAAAgAAA0gAAABKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqo=';
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