/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//swxAAABdQTF1TxgDFCDyx3NMACAAEsgogiAAIATBMGg/x6x6y5qsFwfD5Qo5OGBPIfDHu4YwwUdKO/4PwQ/D//63gBFaW2XW3Xa2CAAAAAMkmzAtw4OKTxJk28sdaqpfp2WntNfyP04iVCUBva+ecsQwMy+7Kzru8YuPoajlnfSWSSeNnLFu14COOBEqdipX2NAqohSuVy1ySO//syxAOACIBLd72DADENku51hhimAXX1dFcocp/26PbNPvTw2xORww4l7V6eTAe99Jp6xhBCCADD5Q5f4IBj3AgUc+sEHS/y583/Ua2m0sDFimAWjW4nJGgBaiO09QItkQYVRyy60ZPCkiA2xwVQMFPh2Ha/ef/ziS5ytp0W2WqySTyRn+datnKci4BIuEXyBbGBr/LVxC03+111kv/7MsQDgAhkP2+npGjxE4ynraMM4ACdL9ogAro4RKuSaSESIG2Oq80RCppOoxTw1UMNgIGTQ1Kq3h4tPLXFYmHETu/zqThURXJOuvIqJ4xStAAAShAZShcJ3DCUDkrCIW1GXjQU0AQAkoBAJEp0kNmofW6sbn8pU1KsHwq4JCBbNUkoM5hJ1Nyh3a7KbAkkXULOCs0pqwA7HWgoyAP/+zLEA4AIZDc9huGAQRAVZzDEDPCKgqMzHaBIw+Ig7OMxGJaNh5MlsDNpXQPu1Cjh5AqUWaDQ1DR9zQYYtglWwXQ8i4XXdnfc1L3rRA6NO0aG445EtZgDYSaHBDCkCKK4c0W4HmtgtJNJVSdjvpOlbhtYZEy7HnMvXKr9Uj+Uv+M+dGeBAdAoinZJ8TTzsyVTg0JrDyopS6ByORoA//swxAOBRSgJP6CIQDBOgpe09IxMQTARLmMHktUqRDZ2xRYeCxoKCwFERUJP/olSzf//1I9P5L3S2QADdJEmVICYke4dhYk//iotTEFNRTMuOTkuNVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
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