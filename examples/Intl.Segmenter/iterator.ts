/**
 * HEADS UP!!!!
 *
 * This will cause a maximum call stack exceeded error if you change
 * the `repeat` value higher. This is due to limitations in
 * in `Intl.Segmenter`.
 */

const getSegments = (text: string): string[] => {
  const segmenter = new Intl.Segmenter();
  const segments = [];

  for (const segment of segmenter.segment(text)) {
    segments.push(segment);
  }

  return segments;
};

console.time('total time');
const text = 'Hello 👨‍👩‍👧‍👦 world! 🌍✨ a'.repeat(1700);
const segments = getSegments(text);
console.timeEnd('total time');

// M2 MacBook Pro:
// total time: 1.964s
// 32,300 segments

console.log(segments.length.toLocaleString(), 'segments');

