# intl-segmenter [![NPM version](https://img.shields.io/npm/v/intl-segmenter.svg?style=flat)](https://www.npmjs.com/package/intl-segmenter) [![NPM monthly downloads](https://img.shields.io/npm/dm/intl-segmenter.svg?style=flat)](https://npmjs.org/package/intl-segmenter) [![NPM total downloads](https://img.shields.io/npm/dt/intl-segmenter.svg?style=flat)](https://npmjs.org/package/intl-segmenter)

> A high-performance wrapper around `Intl.Segmenter` for efficient text segmentation. This class resolves memory handling issues seen with large strings and can enhance performance by 50-500x. Only ~60 loc and no dependencies.

Please consider following this project's author, [Jon Schlinkert](https://github.com/jonschlinkert), and consider starring the project to show your :heart: and support.

## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install --save intl-segmenter
```

Install with [pnpm](https://pnpm.io):

```sh
$ pnpm install intl-segmenter
```

## Overview

If you do any text processing, parsing, or formatting, especially for the terminal, you know the challenges of handling special characters, emojis, and extended Unicode characters.

The `Intl.Segmenter` object was introduced to simplify text segmentation and correctly handle these special characters. However, it has notable limitations and potential risks:

* Predictable "Maximum call stack exceeded" exceptions occur when strings exceed 40-50k characters.
* Performance degrades geometrically as the number of non-ASCII/extended Unicode characters increases.

For context:

* Blog posts average 2k-10k chars
* Novels 450k-500k chars
* This README ~7k chars

This library wraps `Intl.Segmenter` to address these issues:

* Handles strings up to millions of characters in length (tested to ~24m chars on M2 Macbook Pro).
* Improves performance by 50-500x compared to direct `Intl.Segmenter` usage.
* Prevents "Maximum call stack exceeded" exceptions that predictably occur with long strings over a certain length.

Use this as a drop-in replacement for `Intl.Segmenter` when accurate text segmentation is needed, particularly for strings with non-ASCII/extended Unicode characters.

## Usage

```js
// Use Segmenter instead of Intl.Segmenter
import { Segmenter } from 'intl-segmenter';

const segmenter = new Segmenter('en', { granularity: 'grapheme' });
const segments = [];

// The segmenter.segment method is a generator
for (const segment of segmenter.segment('Your input string here.')) {
  segments.push(segment);
}

// You can also use Array.from, but read the "Heads up" section first
console.log(Array.from(segmenter.segment('Your input string here.')));
```

### Heads up!

I recommend using manual iteration (traditional loops) if there's any chance the string will exceed a few hundred characters.

**Note on Array.from's Iterator Handling**

When `Array.from` processes an iterator/generator, it retains the entire iteration state in memory. Unlike a `for...of` loop, it can't process and discard items one by one. Instead, it:

* Keeps the full generator state alive
* Maintains the entire call stack for iteration
* Holds all intermediate values
* Builds up the final array

This creates a deeper call stack and increased memory usage compared to manual iteration, where each step can be completed and garbage collected.

## API

### Segmenter

**Params**

* `language` **{String}**: A [BCP 47 language tag](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter/Segmenter#parameters), or an [Intl.Locale](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale) instance.
* `options` **{Object}**: Supports all [Intl.Segmenter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter/Segmenter#parameters) options, with an additional `maxChunkLength` that defaults to `100`.

**Example**

```js
const segmenter = new Segmenter('en', { maxChunkLength: 100 });
```

### .segment

Segments the provided string into an iterable sequence of `Intl.Segment` objects, optimized for performance and memory management.

**Params**

* `input` **{String}**: The string to be segmented.

**Returns**

* **{Generator}**: Yields `Intl.Segment` objects.

**Example**

```js
const segmenter = new Segmenter('en', { localeMatcher: 'lookup' });

for (const segment of segmenter.segment('This is a test')) {
  console.log(segment);
}
```

### .findSafeBreakPoint

Mostly an internal method, but documented here in case you need to use it directly, or override it in a subclass.

This method determines a safe position to break the string into chunks for efficient processing without splitting essential non-ASCII/extended Unicode character groups.

**Params**

* `input` **{String}**: The string to analyze.

**Returns**

* **{Number}**: Position index to use for safely breaking the string.

**Example**

```js
const segmenter = new Segmenter();
const breakPoint = segmenter.findSafeBreakPoint('This is a test');
console.log(breakPoint); // e.g., 4
```

### .getSegments

Returns all segments of the input string as an array, using the efficient generator from `.segment()`.

**Params**

* `input` **{String}**: The string to be segmented.

**Returns**

* **{Array}**: An array of `Intl.Segment` objects.

**Example**

```js
const segmenter = new Segmenter();
const segments = segmenter.getSegments('This is a test');
console.log(segments);
// Returns:
// [
//   { segment: 'T', index: 0, input: 'This is a test' },
//   { segment: 'h', index: 1, input: 'This is a test' },
//   { segment: 'i', index: 2, input: 'This is a test' },
//   { segment: 's', index: 3, input: 'This is a test' },
//   { segment: ' ', index: 4, input: 'This is a test' },
//   { segment: 'i', index: 5, input: 'This is a test' },
//   { segment: 's', index: 6, input: 'This is a test' },
//   { segment: ' ', index: 7, input: 'This is a test' },
//   { segment: 'a', index: 8, input: 'This is a test' },
//   { segment: ' ', index: 9, input: 'This is a test' },
//   { segment: 't', index: 10, input: 'This is a test' },
//   { segment: 'e', index: 11, input: 'This is a test' },
//   { segment: 's', index: 12, input: 'This is a test' },
//   { segment: 't', index: 13, input: 'This is a test' }
// ]
```

### Segmenter.getSegments

Static method for segmenting a string. Creates a `Segmenter` instance and returns the segments as an array.

**Params**

* `input` **{String}**: The string to be segmented.
* `language` **{String}**: A [BCP 47 language tag](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter/Segmenter#parameters), or an [Intl.Locale](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale) instance.
* `options` **{Object}**: _(optional)_ Intl.Segmenter options.

**Returns**

* **{Array}**: An array of `Intl.Segment` objects.

**Example**

```js
const segments = Segmenter.getSegments('This is a test', 'en');
console.log(segments);
```

## FAQ

In a nutshell, this library prevents maximum call stack exceeded exceptions caused by memory management issues in  `Intl.Segmenter`, and improves performance by 50-500x over using `Intl.Segmenter` directly.

**What does this do?**

This library wraps `Intl.Segmenter` and serves as a drop-in replacement that not only improves performance by 50-500x over `Intl.Segmenter` directly, but prevents maximum call stack exceeded exceptions that predictably occur with long strings.

Without this library, exceptions reliably occur with strings exceeding 20-50k in length, depending on the number of non-ASCII/extended Unicode characters. These characters significantly affect performance and trigger exceptions sooner.

Simply import the library and use `Segmenter` instead of `Intl.Segmenter`.

**Why use this?**

If you use `Intl.Segmenter`, your application is at risk of being terminated due to maximum call stack exceed exceptions. To prevent the exception from happening, you need to either prevent input strings from exceeding a certain length, say 10k characters, or wrap `segment` method to iterate over longer strings.

However, _this is not as trivial as it sounds_. If you limit the length of the input string, in theory this would still allow users to break their input into chunks, then programmatically loop over those chunks. But now you've created the potential to split on a non-ASCII/extended unicode character, completely negating the entire point of using `Intl.Segmenter` in the first place.

Alternatively, you can use this library, since it solves those problems for you and ensures that `Intl.Segmenter` handles all characters correctly. This library not only improves performance by 50-500x over `Intl.Segmenter` directly, but it prevents maximum call stack exceeded exceptions that _consistently occur when long strings are passed_.

**What is Intl.Segmenter?**

The newly introduced (2024) built-in [Intl.Segmenter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter) object enables locale-sensitive text segmentation, enabling you to get meaningful items (graphemes, words or sentences) from a string.

**What causes the exception?**

As of Nov. 17, 2024, a maximum call stack exceeded exception occurs when using `Intl.Segmenter` on strings that exceed 40-60k characters. The avg. blog post is around 2,500-10,000 characters, so you'll only encounter the call stack error when working with longer strings. However, even on shorter strings you might notice performance issues.

Notably, performance in `Intl.Segmenter` degrades geometrically as the number of non-ASCII/extended unicode characters present in string increases, same goes for when _when the exception occurs_.

_(On a related note, stack traces from exceptions indicate that the issue is related to the way Node.js interacts with V8 and how memory management is occurring at the application level via Node.js. We're still looking into this.)_

**Will the exception be fixed?**

I'm not sure yet if this is a bug, or a limitation in `Intl.Segmenter`. But there has been an open [issue](https://issues.chromium.org/issues/326176949) about this for almost a year, and it doesn't seem to be a priority.

Please [create an issue](../../issues) on this library if you have information or updates related to this issue.

## Comparison to Intl.Segmenter

In this example, we compare the performance of `Segmenter` to `Intl.Segmenter` when processing a string with a length of 1200 characters.

```ts
const text = ' 👨‍👩‍👧‍👦 🌍✨He👨‍👩‍👧‍👦llo 👨‍👩‍👧‍👦 world! 🌍✨'.repeat(1200);

// With Intl.Segmenter
const intlSegmenter = new Intl.Segmenter('en', { granularity: 'grapheme', localeMatcher: 'best fit' });
console.time('total time');
Array.from(intlSegmenter.segment(text));
console.timeEnd('total time');
// total time: 3.040s

// With Segmenter
const segmenter = new Segmenter('en', { granularity: 'grapheme', localeMatcher: 'best fit' });
console.time('total time');
Array.from(segmenter.segment(text));
console.timeEnd('total time');
// total time: 18.102ms
```

Segmenter is ~167x faster than `Intl.Segmenter`. The performance difference would be even more pronounced with longer strings, but the call stack exceeded exception would prevent you from testing that.

## About

<details>
<summary><strong>Contributing</strong></summary>

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](../../issues/new).

</details>

<details>
<summary><strong>Running Tests</strong></summary>

Running and reviewing unit tests is a great way to get familiarized with a library and its API. You can install dependencies and run tests with the following command:

```sh
$ npm install && npm test
```

</details>

<details>
<summary><strong>Building docs</strong></summary>

_(This project's readme.md is generated by [verb](https://github.com/verbose/verb-generate-readme), please don't edit the readme directly. Any changes to the readme must be made in the [.verb.md](.verb.md) readme template.)_

To generate the readme, run the following command:

```sh
$ npm install -g verbose/verb#dev verb-generate-readme && verb
```

</details>

### Author

**Jon Schlinkert**

* [GitHub Profile](https://github.com/jonschlinkert)
* [Twitter Profile](https://twitter.com/jonschlinkert)
* [LinkedIn Profile](https://linkedin.com/in/jonschlinkert)

### License

Copyright © 2025, [Jon Schlinkert](https://github.com/jonschlinkert).
Released under the MIT License.

***

_This file was generated by [verb-generate-readme](https://github.com/verbose/verb-generate-readme), v0.8.0, on January 26, 2025._
