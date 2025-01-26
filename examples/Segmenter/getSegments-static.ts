import { Segmenter } from '~/Segmenter';

const text = 'Hello 👨‍👩‍👧‍👦 world! 🌍✨ a'.repeat(10_000);
const segments = Segmenter.getSegments(text, 'en', {
  granularity: 'word',
  localeMatcher: 'best fit'
});

console.log(segments.map(segment => segment.segment));
