/**
 * HEADS UP!!!!
 *
 * This will cause a maximum call stack exceeded error if you change
 * the `repeat` value higher than ~1,270 or so. This is due to limitations
 * in in `Intl.Segmenter`.
 */

const repeat = 1_200;
const text = ' 👨‍👩‍👧‍👦 🌍✨He👨‍👩‍👧‍👦llo 👨‍👩‍👧‍👦 world! 🌍✨'.repeat(repeat);
console.log(text.length.toLocaleString(), 'length');

const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme', localeMatcher: 'best fit' });
console.time('total time');
const segments = Array.from(segmenter.segment(text));
console.timeEnd('total time');
console.log(segments.length.toLocaleString(), 'segments');
// M2 MacBook Pro:
// total time: 3.019s
// 27,600 segments
