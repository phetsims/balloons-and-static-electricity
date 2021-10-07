/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//swxAAABbwpImwkZFELDO189hhuAJBTwL8AGZhIEsM5VDAyAAjJ1Oi92IRQ4FnCPk0I08mj/0dv7v+XB8Hw+7p8TiAIzRDu921sAEhAxNxcy0eDWwTwHiJcc2hLZMjEYLFCTjESaS2hsPpVwWkam03AIMusPewCZRC1DFOt3iDnCHE/l3qHDBIeTTSRTu4/jgNsjiIpDZ8TJglu//syxAsAChyBOg7phUkJFWmlwZYpsKcWSqyLheeJP84r0rwlLkFgySiQURcHIVri2ciUKx4GDa45YPh1MimYPHjWnl3G2UmM23ejR9fU50gBhyCzgEFLLLcGHx4bJJBsiomdxwYqByoGxQQryLffjkXhM5jlxEDgKrJOZqGcMzNFWZFpsWM6qSM6mRa6f4QQMLLVhAKe1ssriACmSP/7MsQFAAjIfVutMQlxEAytvPYhTmMSWy4jsGyhrpDAvASEsfWPXi04PVhTQaNbHDC3T5hnTZC6DdLdS37VGpGmIkxAwhta9oiMoB0yxLZy6hVQlRph321tkArbQkYm4VwMZXi8PRfWR+9gF7k12wwOGk2dR8I4yiOoZ+jO7vYYFRq6NxRRM+ubsUlCJW276esq2h9alQAHJJH30AX/+zLEA4AH+ItNgDxh8SGSZiWEjSgLaLCYhr6UTgXI9UBHRq9hXNkKMqx1ZyxdYAcfQcFp1i2RBd9PK+vcjzBKMWRDQVDJR06ARE37HawCO5lZRKZyC3yjScZYQGejLtRlaIWRjB9lVpEmyh6ERI9qaEmbigIn9Zaq6kBfnmsP9S42wWuPCW2JYMnaxpU6JTs7OpBr/8mqAAASMUiH//swxAMABkEjFYWES/CTAGN0AYgGxgJAIioBMOB0YpZtjzznwAnyr8y/2ZGbPr9LPr9f//5r+RuhG+3//39CMDcAgpuSSSORwDDwlGFan4ir53Wd7Op/PeVzvyMRA1WC1YK1//huTEFNRTMuOTkuNaqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//syxBsDwAABpAAAACAAADSAAAAEqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqg==';
const soundByteArray = base64SoundToByteArray( phetAudioContext, soundURI );
const unlock = asyncLoader.createLock( soundURI );
const wrappedAudioBuffer = new WrappedAudioBuffer();

// safe way to unlock
let unlocked = false;
const safeUnlock = () => {
  if ( !unlocked ) {
    unlock();
    unlocked = true;
  }
};

const onDecodeSuccess = decodedAudio => {
  if ( wrappedAudioBuffer.audioBufferProperty.value === null ) {
    wrappedAudioBuffer.audioBufferProperty.set( decodedAudio );
    safeUnlock();
  }
};
const onDecodeError = decodeError => {
  console.warn( 'decode of audio data failed, using stubbed sound, error: ' + decodeError );
  wrappedAudioBuffer.audioBufferProperty.set( phetAudioContext.createBuffer( 1, 1, phetAudioContext.sampleRate ) );
  safeUnlock();
};
const decodePromise = phetAudioContext.decodeAudioData( soundByteArray.buffer, onDecodeSuccess, onDecodeError );
if ( decodePromise ) {
  decodePromise
    .then( decodedAudio => {
      if ( wrappedAudioBuffer.audioBufferProperty.value === null ) {
        wrappedAudioBuffer.audioBufferProperty.set( decodedAudio );
        safeUnlock();
      }
    } )
    .catch( e => {
      console.warn( 'promise rejection caught for audio decode, error = ' + e );
      safeUnlock();
    } );
}
export default wrappedAudioBuffer;