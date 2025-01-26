import { Segmenter } from '~/Segmenter';

const segmenter = new Segmenter('en', { granularity: 'grapheme' });
const segments = Array.from(segmenter.segment('Your input string here.'));
const graphemes = segments.map(segment => segment.segment);
console.log(graphemes);
