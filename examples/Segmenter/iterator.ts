import { Segmenter } from '~/Segmenter';

const segmenter = new Segmenter('fr', { granularity: 'grapheme' });
console.log(segmenter.resolvedOptions());

const text = 'Hello 👨‍👩‍👧‍👦 world! 🌍✨ a'.repeat(1_700);
console.log(text.length.toLocaleString(), 'length');

console.time('total time');
const segments = [];
for (const segment of segmenter.segment(text)) {
  segments.push(segment);
}

console.timeEnd('total time');
// M2 MacBook Pro:
// total time: 28.986ms (~68x faster than Intl.Segmenter)
// 32,300 segments

console.log(segments.length.toLocaleString(), 'segments');
