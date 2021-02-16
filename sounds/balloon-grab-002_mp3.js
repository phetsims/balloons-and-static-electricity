/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//swxAAABEwXPVQxgBFvk63zHsAAUAEJIkqUB+F1zgcWH4IYIYP8ocWD6g/y5/+nwQ/3/D/5c/ACAAESiQAAAghsBFZ5VLBGRRsUYr4jabL4hAL4xRYl2vXgfPAid9YsonPlaaPpyh66qktJ17t/mlHcdWxqmlziH2zMy7E1MP356DIkaBi1oS0x5QXSAFJ7vX9j1ZYeDvEu2uqs//syxAQACAylXhmFAAEjD+p3HpAAFUABrozdqZNQQVWPwdXhkG0JTS0EIRR5XfECeQhen+mKosiCKFzqfxVc0w0pX/xaQ4hae/UFVuLAAAACMfaIVhoIBEAAADtFPTgh2OXhds+/0C2Yl/EwBESv4WDzRBRF9p5QqruxW//A1N7LONRvP//WsqFgEPdoGBFGg92TiyzUqoawcA0s7f/7MsQDAAhUo1e49AABEBNxtx6wAgYAgGQAAAADkcYlzoEYj7ktmx+IyLXXm5H54eDEnURiQDlh2L3dXb95xk2RHMXO2WiTafaz1SH9G0Z98SBwN2SyCSx6IJBoAAAAf/OR3/3T8ZGZulzkQoL8n4zQKh3frQTDeyG3x5oUGRqOo0NWMqN/Rumy4tv//Xs7RlZzvvWWVW22wi3DaUz/+zLEA4AIYFN/uJSAAKGMJqeEMAagCChKLwAOJOJvEnRCEY9IESwflIXTSZ8oxwNOO7WzlfT00kdOmAiZMndRMcgOH36yoRkXO/La/6t2pBIpaa25LDerUNAgIVLQxMx6lsWzMeq6iS26phQE6DT+JTqMS9bv93X9SkxBTUUzLjk5LjWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq';
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