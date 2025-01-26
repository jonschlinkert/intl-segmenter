import { Segmenter } from '~/Segmenter';

const text = 'Hello 👨‍👩‍👧‍👦 world! 🌍✨ a'.repeat(1200);
console.log(text.length.toLocaleString(), 'length');
const segmenter = new Segmenter('en', { granularity: 'grapheme', localeMatcher: 'best fit' });
console.time('total time');
const segments = Array.from(segmenter.segment(text));
console.timeEnd('total time');
console.log(segments.length.toLocaleString(), 'segments');
// M2 MacBook Pro:
// total time: 22.604ms (~130x faster than Intl.Segmenter)
// 22,800 segments
