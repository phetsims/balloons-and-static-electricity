/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//swxAAABCgDE1QRgDF7Dez3O7AC/EVpNi0QADgfzhd5ApLlDhyfBAoNB8ocOf+f/7S//+Uk3FKrhcrpM7oGAAAAAALFcHA8JCDAtyLtmMVQnMfwgiL+tsj4b2RIZsCm7dIHAkXOYbTPTSt1xHkvmJCJkBCYKIVNbsWO4FuTAANGZMvX1uWO4XvTRXwre3WGIty5I+5KWMAiy2yL//syxAOACISLTbj1gAChAOSrsCAGbSQAAAAAAJ3is0b504JfHsvG6CObxjUOVx8mUanUaz7HqNjkM1vDyf4NnQ+9e2slkOl27IC/8wcISoS7dYAApJJlFQBHmXS4CuBpQdqPCmqwOknGP7txK2v/nr5ZR7Zu/cq2NtLKDsktu1F1AgAavWg294qlkBJahCEfp0C0Vz1C2bP//0gJRv/7MsQRAAP0BTejhGAw0ABk9GEIBuSxyNtuAGBwqNTI3JASQbctzBVglmgLNGg4DXit3omj3U+pAFFTIKrpDYM1VC2mPgJNAkwGwG2AAAGae/QKt/ireKdaTEFNRTMuOTkuNaqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqr/+zLEKwPCNAEboARAMAAANIAAAASqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq';
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