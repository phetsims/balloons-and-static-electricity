/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//swxAAABBQBUbQRgDF5E6l3OPAAKSkkl1sgEABxYPvBwEAQBAMPvg4CAIAgCAPn/4P///9AABGS2X0k02koQAAAABiwDINmbbGZ1Fphjom2xEn2/AODTSQgD3HZae01/LuY4HojoRnWVWZER41lh8eL3mrxdK2JHa3DTzW6eCnWSGwwLazG3TXp6Z9a/+SXvfY0CgWvAqhZjiSa//syxAQDCEwzSl2zAAEUiqhB16TQFYnTeZ1qIYaHoMKhlUfi77xenp6fu7JAZRrpgukcxziwuIwffnF0cuTdU+uTpd0ERIHf6jW02lgYsUpcBAVBAJmWjanBWgmR6bBigIoge5wqTaUa0SUAz9MpCNUM1XPapFeSNVtn2lzdEQZIRgbNiwbUXI6ypLiJ8cEUSjHf4cqACKWyOONJAf/7MsQEAAiUP12sJGcxBgysdPMNHgy0q8OENGzolOGeDgORIgbY6rzREKmk6jFPDVQw2AgZNDUqreHi08tcViYcRO7/OpOFRFck668ionjFK0RGfba2SRsICVPUCEEunSsceIrpoAgBJQYUNAnHIbNQ+t1Y3P5SpqVYPhVwSEC2apJQZzCTqblDv/qSLqFnBWaU1dUAzXes03KDgoL/+zLEBIAIXDdDg72AAQuHp7TBoNHOAshArHY0JzjMQkh8Mh5MlsDNpXQPu1Cjh5AqUWaDQ1DR9zQYYtglWwXQ8i4XXdnfc1L3rRA6NO0aHK5LW4UigAN09KhDCkCKI46gXB5rYLSTSVUnY76jInSlZVAnJ7WvNZN6Kfyb/hHtq7AxZI7H+q/07LX/p5r/yKncyQAUzgSWyfhhGgCC//swxAWABhjtKaKEUdCtlOMoEIl6tSl6t1pwkwsPLKJmETQiMmEhQhJ//+uGI2AC////yNqcAGI9P7UOrvbccRoIwybZiJmoc0LmFZhChZrF3F8nAnK39fQqGzWhh///lXEekS/KqkxBTUUzLjk5LjWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//syxBqDwAABpAAAACAAADSAAAAEqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqg==';
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