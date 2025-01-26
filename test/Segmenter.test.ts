import assert from 'node:assert/strict';
import { Segmenter } from '~/Segmenter';

describe('Segmenter', () => {
  describe('constructor', () => {
    it('should create instance with default options', () => {
      const seg = new Segmenter('en');
      assert.strictEqual(seg.language, 'en', 'should set language');
      assert.deepStrictEqual(seg.options, {}, 'should use empty options by default');
    });

    it('should create instance with custom options', () => {
      const opts = { granularity: 'word' as const };
      const seg = new Segmenter('en', opts);
      assert.deepStrictEqual(seg.options, opts, 'should store provided options');
    });
  });

  describe('segment', () => {
    it('should segment simple text', () => {
      const seg = new Segmenter('en', { granularity: 'word' });
      const text = 'Hello world';
      const segments = Array.from(seg.segment(text));

      assert.strictEqual(segments.length, 3, 'should have three segments');
      assert.strictEqual(segments[0].segment, 'Hello', 'should segment first word');
      assert.strictEqual(segments[1].segment, ' ', 'should segment space');
      assert.strictEqual(segments[2].segment, 'world', 'should segment second word');
    });

    it('should handle maxChunkLength', () => {
      const seg = new Segmenter('en', { maxChunkLength: 5 });
      const text = 'Hello world';
      const segments = Array.from(seg.segment(text));

      assert.ok(segments.length > 2, 'should split into multiple chunks');
      assert.strictEqual(segments.map(s => s.segment).join(''), text, 'should preserve full text');
    });
  });

  describe('findSafeBreakPoint', () => {
    it('should find space break points', () => {
      const seg = new Segmenter('en');
      const pos = seg.findSafeBreakPoint('Hello world');
      assert.strictEqual(pos, 11, 'should break at end of input with space');
    });

    it('should handle ASCII characters', () => {
      const input = 'Hello!World√ß';
      const seg = new Segmenter('en');
      const pos = seg.findSafeBreakPoint(input);
      assert.strictEqual(pos, 11, 'should break at then end of input with ASCII character');
    });
  });

  describe('getSegments', () => {
    it('should return array of segments', () => {
      const seg = new Segmenter('en', { granularity: 'word' });
      const segments = seg.getSegments('Hello world');

      assert.ok(Array.isArray(segments), 'should return array');
      assert.strictEqual(segments.length, 3, 'should have three segments');
    });

    it('should handle empty input', () => {
      const seg = new Segmenter('en');
      const segments = seg.getSegments('');
      assert.strictEqual(segments.length, 0, 'should return empty array');
    });
  });

  describe('static getSegments', () => {
    it('should segment text with default options', () => {
      const segments = Segmenter.getSegments('Hello world', 'en');
      assert.ok(segments.length > 0, 'should return segments');
    });

    it('should segment text with custom options', () => {
      const segments = Segmenter.getSegments('Hello world', 'en', { granularity: 'word' });
      assert.strictEqual(segments.length, 3, 'should return word segments');
    });
  });
});
