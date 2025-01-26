import { Segmenter } from '~/Segmenter';

const segmenter = new Segmenter('en', { granularity: 'grapheme' });

for (const segment of segmenter.segment('Your input string here.')) {
  console.log(segment);
}
