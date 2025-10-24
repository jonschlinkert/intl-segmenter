export class Segmenter extends Intl.Segmenter {
  constructor(private readonly language: string, private readonly options: Intl.SegmenterOptions & { maxChunkLength?: number; } = {}) {
    super(language, options);
  }

  segment(input: string): Intl.Segments {
    const { maxChunkLength = 100, ...options } = this.options;
    const language = this.language;
    const findSafeBreakPoint = this.findSafeBreakPoint;

    return {
      // eslint-disable-next-line no-unused-vars
      containing(_codeUnitIndex?: number) {
        // TODO: implement this method to comply an original interface
        throw new Error('Not implemented');
      },
      *[Symbol.iterator](): Generator<Intl.SegmentData, undefined> {
        let position = 0;

        while (position < input.length) {
          const remainingText = input.slice(position);
          const chunkSize = Math.min(maxChunkLength, remainingText.length);
          const potentialChunk = remainingText.slice(0, chunkSize);

          // Find a safe position to break the string
          const breakPoint = findSafeBreakPoint(potentialChunk);
          const chunk = potentialChunk.slice(0, breakPoint);

          // Process the chunk with Intl.Segmenter. Using this approach instead
          // of super.segment() to avoid any potential side effects.
          const segmenter = new Intl.Segmenter(language, { ...options });
          const segments = segmenter.segment(chunk);

          for (const segment of segments) {
            yield segment;
          }

          position += breakPoint;
        }
      }
    };
  }

  findSafeBreakPoint(input: string): number {
    // Work backwards from the end of the input
    for (let i = input.length - 1; i >= 0; i--) {
      // Check for whitespace or simple ASCII characters
      if (/\s/.test(input[i]) || /^[\x20-\x7E]$/.test(input[i])) {
        return i + 1;
      }
    }

    // If no safe break points were found, return the full length
    return input.length;
  }

  getSegments(input: string): Intl.SegmentData[] {
    const array = [];

    // A for loop is much faster than Array.from, it doesn't cause a
    // maximum call stack error for large strings. Also, optimizations
    // in v8 make using `push` much faster than pre-allocating an array,
    // like `Array(input.length)` and setting the values at each index.
    for (const segment of this.segment(input)) {
      array.push(segment);
    }

    return array;
  }

  static getSegments(
    input: string,
    language: string,
    options: Intl.SegmenterOptions = {}
  ): Intl.SegmentData[] {
    const segmenter = new this(language, options);
    return segmenter.getSegments(input);
  }
}
