import { Segmenter } from '~/Segmenter';

const segmenter = new Segmenter('en', { granularity: 'word' });
const text = 'Hello 👨‍👩‍👧‍👦 world! 🌍✨ a'.repeat(100_000);

console.time('total time');
const segments = segmenter.getSegments(text);
console.timeEnd('total time');
// M2 MacBook Pro:
// total time: 1.359s
// 1,900,000 segments

console.log(segments.length.toLocaleString(), 'segments');
