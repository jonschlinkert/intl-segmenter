export class Segmenter extends Intl.Segmenter {
  constructor(language: string, options: Intl.SegmenterOptions = {}) {
    super(language, options);
    this.language = language;
    this.options = options;
  }

  * segment(input: string): Generator<Intl.Segment> {
    const { maxChunkLength = 100, ...options } = this.options;
    let position = 0;

    while (position < input.length) {
      const remainingText = input.slice(position);
      const chunkSize = Math.min(maxChunkLength, remainingText.length);
      const potentialChunk = remainingText.slice(0, chunkSize);

      // Find a safe position to break the string
      const breakPoint = this.findSafeBreakPoint(potentialChunk);
      const chunk = potentialChunk.slice(0, breakPoint);

      // Process the chunk with Intl.Segmenter. Using this approach instead
      // of super.segment() to avoid any potential side effects.
      const segmenter = new Intl.Segmenter(this.language, { ...options });
      const segments = segmenter.segment(chunk);

      for (const segment of segments) {
        yield segment;
      }

      position += breakPoint;
    }
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

  getSegments(input: string): Intl.Segment[] {
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
  ): Intl.Segment[] {
    const segmenter = new this(language, options);
    return segmenter.getSegments(input);
  }
}
