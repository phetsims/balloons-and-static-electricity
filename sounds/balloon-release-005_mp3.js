/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//swxAAAA2ADI7QBgDGUlmq3MyADIAAEdwFEgAAneIDgIY4M5yIDn9uTL/5Q5JwfAAAIBRTaicQjCIAAAAlc8t9XDEGryyKGmiYOaXqKEvpAe+W8JnpMV0AsAACZNJpldgAKAiQYPMSkTyZuyYDmACYL0iREmZZvTeDdYPlGaEpCkWoz/4wxmh2jvHs8tbf/NkTcMP4qbjYNlzsh//syxAMACBzTW7zzgDDuD2e0wKGGiAAgKKfGAhSiblc5HMxGkdTNG0nXpIu6Fzppd0NWaJwKl5UiRU5Djr7pdp41FBKy///qLmp0Ru39BqwCSTTcUbKAgJRuB0KVl6PMwkkCIeB8yTNgt+vczTDak0QgXbDUcVGBaf44KZtRUYLHQeJfw6rR/f///TUEyCVatxgNwDjRpGE9xU89VP/7MsQIgAP4BzejGCAwawBldJCIBlFLu7anb///Lfle1Ov+QCkajcDYjSAASCRlCFliF0dfp9n4Yy+7d+3+tQhVoplGA3qixZJJFCmLp7G13CkX2OPcX2Jf7M2/pXd82tqpJu21ABEcSQR0pQEkKMBVwieo9EQNO66g71A0e1qOlhE//sqPYl/Ud8SndWWDigAEWo0VwAG1lljkJYL/+zLELwAEzAcXJ4ggMKgBYFjzBASCFhIb/zAqKirPxZqBgsLC1UxBTUUzLjk5LjVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//swxEqDw6wsf4AAYKAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
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