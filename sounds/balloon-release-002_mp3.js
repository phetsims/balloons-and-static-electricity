/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//swxAAABZwZLPQxgBFKli73GIACACAS07xohUOBi4BizBAEBoIFw/lIPnwf/LvB/5R1YP/EEMco7/QsH3h/l38mwIAiESkAAgEAiIgGAAhEzD/Cw4TICuhmac/C95YWQ8GyFBFz1FygdFR8zb3ixgyRx0Dore7VJa27O7TMdzn1op6R6s+K/OGQdmQxnOx1//rCoHXxyKpJAkAk//syxAOACFyxfbzBgDEUB6q0xhiYwDGSsEwEhkOsJogEpUpSB2Ywf0gzkzfQw9XUlEqsP1q6oKy2q+Td/qrD/aif2RuGFKJfPSWHYl63e7w7It9K2kyE7gEDw5F6COIgjAc0p8FZ4HSoeaSKSWyTbNctRoeIgbYDaDxlZQVHPLNKoSsMpEpkYP6yKVNHiJ/5NSULDfpQjUjcln3VB//7MsQDgAgouWeU8oAxEZfskzCgAHZf2NCE+U5OEZhWRE+h5zi5o+GOExESEQcWTOLClmZSaEz0bXdH9CFownuef78zNrzjjY17VZr3lPoAAAADAkJAnI6sgmQWBBBY3UWfPExwSf7kNSYu3Eycx0CMQiH2J0G5YV7bJi2CAKgsf+IckiLFv/92yQz//MPJ//0BgP0AQBdErwbu0wb/+zLEBIAIxI10OPMAAQoGrnOYkAaAf9y2uaJVhejKLCF6mgEccMTG4o1+BHYcf9PolBAeFHRGpYXAoslMokiNbjv9jWRQFCgBv31sfnzeB6Kla2W2WMbewHkAUmxFYEhKEoCR6hCEDYSo2SSJIaXQupZEieWPQVgq4sHCwNA1LB0qCvLA0d5aVBUNLOxEe/Kgq4q4splaXUkAGCtQ//swxAQDxWg+qSGMZOgAADSAAAAEQOAwQJQwUEDCBxBNZZZQoYKGqiD3f////9NNNINVVErppppqTEFNRTMuOTkuNaqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq';
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