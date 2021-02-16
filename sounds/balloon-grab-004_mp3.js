/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//swxAAAA5wREZRhgDGNGOs3NLACAADTcnxiAF6CAAAIOTPvSo4yf1Ah8+v//L//+D5Iss1122u20FolAYAADgOIYEMHBTF4SYEvOkDo7vnNDILYeu9irTmtgiB4JRiB0ChwvjIAvA+KgHNXXYHiaaB8A6S4v3wQyaReeIVV1//9OY0+mpJ40qf/+uvZTlSpF5xv/XSqAAWlu1tw//syxAMASGCDXb2WACkGCaplnaRpAADol7TMnPYo53AeIvOmvXKW3EJTLoch/hLHh1ZU6UwloZqTON91cV0kXfCxZauZWe5aXL02sGM27Z+OZwDAAAKgeNchkxHElhxHSaaSAIoX5Eog6k8/rAmjtcc8CiVpnnBGEAaBIqpa155ES4EVEm+iJLaS0idLcSnSg1/5qqUHL9pddawAw//7MsQEgAiUfWesMKrxCwyrdPYZTpSmtBK6GGGiMOgrt5czWwhYsnLB6cpE9pahXKvVHdqEE2DWK7KbmZJRCSKKKFGELGte0RGUA6ZYls5dQ2glNbZI20gK20ELCRgfgEZXmIuEylRd7A93PbrgSizdSxNosrDPjVfxD7u+igqNXRuKKJn1zdikoRK23fT1lW0PrVUEmW22RyNkgUL/+zLEBIAITItVoDxh8RoSKHTEjRzaLCYhr6UTgXI9UBHRq9hXNkKMqx1ZyxdYAcfQcFp1i2RBd9PK+vcjzBKMWRDQVDJR06ARE37Ha/0kge/eaW2xkCywKikbiYDKoJCStELIxg+yq0iTZXUMBnHASZuKAif1lqrqQF+eaw/1LjbBSRZZ1dZ0sCuSaCqwVlZWBj3/1gAEhaLrLIBA//swxAQDxDQDMaAMIDAAADSAAAAEDIjMjC21Yq7bCrtbOkWFzNuwzbt/57///01MQU1FMy45OS41VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
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