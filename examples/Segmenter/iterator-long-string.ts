import { Segmenter } from '~/Segmenter';

const segmenter = new Segmenter('en', { granularity: 'grapheme' });
const text = 'Hello 👨‍👩‍👧‍👦 world! 🌍✨ a'.repeat(800_700);
console.log(text.length.toLocaleString(), 'length');

console.time('total time');
const segments = [];
for (const segment of segmenter.segment(text)) {
  segments.push(segment);
}

console.timeEnd('total time');
// M2 MacBook Pro:
// 3,021,000 length
// total time: 1.351s
// 1,913,300 segments

console.log(segments.length.toLocaleString(), 'segments');
