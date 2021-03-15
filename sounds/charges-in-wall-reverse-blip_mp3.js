/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,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UovRi93WW9YWZZz+//178N04qRu/9v+3/b//Z2///YEBlhjQyhoaRR90mzGJShuBqccZE2DpHE04cLJxg8DmEFmc8hZtpLnPUJkgeYuUG//7ssSJA9xM3RAP70tDhRuhwf5skIP5xladBlnV3x18QaSDGAIIgRDZ4g6WUOjljgXYzIvMMGDCEkzJTN+gzin04hrMLHCoSmRhhiaEaelGnrBnJAAjIuuOqRlo4ZAVgY1Q0GQdM0wYbMkOzOjUONAABwKIgEdDDGSYzkyFjpMkCAdIspIUMAW5goNctrrsw+vexNrlWKoklUXmT0ZtLsO3HQTrhlMOE653DTPlLWzf//+q6lCEDZzbmTLkdOqEk9nv/9v+j2owjY6MOj76LD0g2K40QZkjM4YDkjFVQs0xEACmMKbAZz7xdM+Ck2MgTdMkM/j40mhjDibMmGw02EjMQVM8LczYDjIoSIREc90lGY8oBGZpDxyo4QcLxIxmaRgWgd0ka6CaJKbeIY1CEWQgsLATHjDDJwoyOKCNGmQFmBVE0IHDVHSYCECjGIx4GhwBIMBMTEkkGxwQUE0VDEAVVm4gU0Z0MFwAGLFzSEQlgx9S13l21zBFSYoDhSCZxi1SL6CgQKdgxIxEMZAiw1ZxbURgEx04XGUOQVZk4bqN86sDN4YckMCAhEoKpkslgDN2gtOWGYS1ht29Yk0lsThu+5rLmssycN1G+cVrL1Om8jfNdfZ4XQfhvmuuE9L6O+5rjNael9HXeVrzgvU6b9tq15wXwf+BHmcVwXwdt8nWcmAnxdiDnWcmAoLhiB3Vd5wnrfx73VdqAYIfeFvy5TowBD8HQM5MAwQ/8Ifp2XigN3IQ4zswFDcOQp+XafaC34e53XagmGIfg9+XagmAH7hLvOzBMAQPAr/PrBUNw5ArvPrBUNwJAz+0F60AImk5JbzCwf/7ssTWAjSGDvgP80cCfrRetYSY9MWXMR/Wo27qQ+IBgjMol3NISxZdjT3WEJY4ugbDBREUJEmX/REUJAxBNDc3/982SRooCPjVaxpRRZiakiIMJAxCat8nGllHwtFI0UBHobPo04q4tSRE40sxPP5OEgZhNBaJI0UUfG/KNOKPhNSRE40sy8+ycJLMPQWicaUUfG/CQKKAhZBNSRE4suNz0RBhIGIJoLRONKKuTEFNRTMuOTkuNaqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqg==';
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