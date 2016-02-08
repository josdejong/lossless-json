# lossless-json

Parse JSON without the risk of losing numeric information.

Features:

- Compatible with the native `JSON.parse` and `JSON.stringify`.
- No risk of information loss when parsing large numbers which cannot be
  represented in the native JavaScript `number` type.

<!-- TODO: write when to use, how does it work, and motivation -->

Missing

- support for reviver, replacer, space.
- easy integration with big number libraries.
- docs, examples


## Install

```
npm install lossless-json
```


## Use

The library works exactly the same as the native `JSON.parse` and `JSON.stringify`.

```js
const LosslessJSON = require('lossless-json');

let text = LosslessJSON.stringify({foo: 'bar'}); // '{"foo":"bar"}'
let json = LosslessJSON.parse(text);             // {foo: 'bar'}
```

Difference with the native `JSON` functions is that `lossless-json` preserves large numbers:

```js
let text = '{"long":123456789012345678901}';
let json1 = JSON.parse(text);
let text1 = JSON.stringify(json1);          // '{"long":123456789012345680000}'
                                            // whoops the last digits are lost :(

let json2 = LosslessJSON.parse(text);
let text2 = LosslessJSON.stringify(json2);  // '{"long":123456789012345678901}'
                                            // yippee! no information loss :)
```

Here another example:

```js
let text = '{"big":2.3e+500}';
let json1 = JSON.parse(text);
let text1 = JSON.stringify(json1);          // '{"big":null}'
                                            // whoops the value is completely gone :(

let json2 = LosslessJSON.parse(text);
let text2 = LosslessJSON.stringify(json2);  // '{"big":2.3e+500}'
                                            // yippee! no information loss :)
```

Instead of regular numbers, `lossless-json` parses numbers as `LosslessNumber`,
a class which stores the numeric value as a string. One can perform regular
operations with `LosslessNumber`. It will throw an error when this would yield
losing information:


```js
let text = '{"normal":2.3,"long":123456789012345678901,"big":2.3e+500}';
let json = LosslessJSON.parse(text);

console.log(json.normal.isLosslessNumber); // true
console.log(json.normal.valueOf());        // number, 2.3
console.log(json.normal + 2);              // 4.3

// the following operations will throw an error as they would result in
// information loss
console.log(json.long + 1); // throws Error Cannot convert to number: value
                            //   contains more than 15 digits
console.log(json.big + 1);  // throws Error Cannot convert to number: number overflow
```


## API

TODO: document full API


## Test

To test the library, first install dependencies once:

```
npm install
```

Then run the tests:

```
npm test
```


## Build

To build a bundled and minified library (ES5), first install the dependencies once:

```
npm install
```

Then bundle the code:

```
npm run build
```

This will generate an ES5 compatible bundle `./dist/lossless-json.js` which can be executed in browsers and node.js.


## License

Released under the [MIT license](LICENSE.md).
