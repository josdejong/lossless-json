# lossless-json

Parse JSON without the risk of losing numeric information.

```js
let text = '{"normal":2.3,"long":123456789012345678901,"big":2.3e+500}';

// JSON.parse will lose some digits and a whole number:
console.log(JSON.stringify(JSON.parse(text)));
    // '{"normal":2.3,"long":123456789012345680000,"big":null}'  whoops...

// LosslessJSON will preserve large numbers:
console.log(LosslessJSON.stringify(LosslessJSON.parse(text)));
    // '{"normal":2.3,"long":123456789012345678901,"big":2.3e+500}'
```

**How does it work?** The library works exactly the same as the native `JSON.parse` and `JSON.stringify`. The difference is that `lossless-json` preserves information of large numbers. Instead of regular numbers, `lossless-json` parses numbers into a `LosslessNumber`, a data type which stores the numeric value as a string. One can perform regular operations with a `LosslessNumber`, and it will throw an error when this would result in losing information.

**When to use?** Never. Unless you're writing a middleware which (using JSON data) interoperates with applications written in languages like C++, Java, and C#. These languages support data types like `long`. Parsing a `long` into a JavaScript `number` can result in losing information because a `long` can hold more digits than a `number`.

Features:

- No risk of losing numeric information when parsing JSON containing large numbers.
- Compatible with the native `JSON.parse` and `JSON.stringify` functions.
- Less then 3kB when minified and gzipped.

Missing:

- support for reviver, replacer, space.
- easy integration with big number libraries.
- handle circular dependencies.


## Install

```
npm install lossless-json
```


## Use

Parsing and stringification:

```js
const LosslessJSON = require('lossless-json');

let text = LosslessJSON.stringify({foo: 'bar'}); // '{"foo":"bar"}'
let json = LosslessJSON.parse(text);             // {foo: 'bar'}
```

Numbers are parsed into a `LosslessNumber`, which can be used like a regular number. It will throw an error when this would result in losing information.

```js
let text = '{"normal":2.3,"long":123456789012345678901,"big":2.3e+500}';
let json = LosslessJSON.parse(text);

console.log(json.normal.isLosslessNumber); // true
console.log(json.normal.valueOf());        // number, 2.3
console.log(json.normal + 2);              // number, 4.3

// the following operations will throw an error as they would result in
// information loss
console.log(json.long + 1); // throws Error Cannot convert to number: value
                            //   contains more than 15 digits
console.log(json.big + 1);  // throws Error Cannot convert to number: number overflow
```


## API


### LosslessJSON.parse(text [, reviver])

The JSON.parse() method parses a string as JSON, optionally transforming the value produced by parsing.

- **@param** `{string} text`
  The string to parse as JSON. See the JSON object for a description of JSON syntax.
- **@param** `{function(key: string, value: *)} [reviver]`
  If a function, prescribes how the value originally produced by parsing is
   * transformed, before being returned.
- **@returns** `{*}`
  Returns the Object corresponding to the given JSON text.
- **@throws** Throws a SyntaxError exception if the string to parse is not valid JSON.

### LosslessJSON.stringify(value [, replacer [, space]])

The JSON.stringify() method converts a JavaScript value to a JSON string,
optionally replacing values if a replacer function is specified, or
optionally including only the specified properties if a replacer array is specified.

- **@param** `{*} value`
  The value to convert to a JSON string.
- **@param** `{function | Array.<string | number>} [replacer]`
  A function that alters the behavior of the stringification process,
  or an array of String and Number objects that serve as a whitelist for
  selecting the properties of the value object to be included in the JSON string.
  If this value is null or not provided, all properties of the object are
  included in the resulting JSON string.
- **@param** `{number | string} [space]`
  A String or Number object that's used to insert white space into the output
  JSON string for readability purposes. If this is a Number, it indicates the
  number of space characters to use as white space; this number is capped at 10
  if it's larger than that. Values less than 1 indicate that no space should be
  used. If this is a String, the string (or the first 10 characters of the string,
  if it's longer than that) is used as white space. If this parameter is not
  provided (or is null), no white space is used.
- **@returns** `{string | undefined}`
  Returns the string representation of the JSON object.

### LosslessNumber

#### Construction

```
new LosslessJSON.LosslessNumber(value: number | string) : LosslessNumber
```

#### Methods

- `valueOf() : number`
  Convert the LosslessNumber to a regular number.
  Throws an Error when this would result in loss of information: when the number contains more then 15 digits, or when the number would become infinite.
- `toString() : string`
  Get the string representation of the lossless number.


#### Properties

- `{boolean} isLosslessNumber : true`
  Lossless numbers contain a property `isLosslessNumber` which can be used to
  check whether some variable contains LosslessNumber.


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
