# lossless-json

Parse JSON without risk of losing numeric information.

```js
import { parse, stringify } from 'lossless-json'

const text = '{"float":2.370,"long":9223372036854775827,"big":2.3e+500}';

// JSON.parse will lose some digits and a whole number:
console.log(JSON.stringify(JSON.parse(text)));
// '{"float":2.37,"long":9223372036854776000,"big":null}'      
// WHOOPS!!!

// LosslessJSON.parse will preserve all numbers and even the formatting:
console.log(stringify(parse(text)));
// '{"float":2.370,"long":9223372036854775827,"big":2.3e+500}'
```

**How does it work?** The library works exactly the same as the native `JSON.parse` and `JSON.stringify`. The difference is that `lossless-json` preserves information of big numbers. `lossless-json` parses numeric values not as a regular number but as a `LosslessNumber`, a lightweight class which stores the numeric value as a string. One can perform regular operations with a `LosslessNumber`, and it will throw an error when this would result in losing information.

**When to use?** Only in some special cases. For example when you have to create some sort of data processing middleware which has to process arbitrary JSON without risk of screwing up. JSON objects containing big numbers are rare in the wild. It can occur for example when interoperating with applications written in C++, Java, or C#, which support data types like `long`. Parsing a `long` into a JavaScript `number` can result in losing information because a `long` can hold more digits than a `number`. If possible, it's preferable to change these applications such that they serialize big numbers in a safer way, for example in a stringified form. If that's not feasible, `lossless-json` is here to help you out.

Features:

- No risk of losing numeric information when working with big numbers.
- Built-in support for `bigint`
- Built-in support for `Date` (turned off by default)
- Customizable: parse numeric values into any data type, like `BigNumber`, `bigint`, `number`, or a mix of them.
- Compatible with the native, built-in `JSON.parse` and `JSON.stringify`.
- Helpful error messages when parsing invalid JSON.
- Works in browsers and node.js.
- Modular and composable ES module functions. 
- Less than 3kB when minified and gzipped in full.


## Install

Install via [npm](https://www.npmjs.com/package/lossless-json):

```
npm install lossless-json
```


## Use

### Parse and stringify

Parsing and stringification works as you're used to:

```js
import { parse, stringify } from 'lossless-json'

const json = parse('{"foo":"bar"}') // {foo: 'bar'}
const text = stringify(json);       // '{"foo":"bar"}'
```

### LosslessNumbers

Numbers are parsed into a `LosslessNumber`, which can be used like a regular number in numeric operations. Converting to a number will throw an error when this would result in losing information due to truncation, overflow, or underflow.

```js
import { parse } from 'lossless-json'

const text = '{"normal":2.3,"long":123456789012345678901,"big":2.3e+500}'
const json = parse(text)

console.log(json.normal.isLosslessNumber) // true
console.log(json.normal.valueOf())        // number, 2.3
console.log(json.normal + 2)              // number, 4.3

// the following operations will throw an error
// as they would result in information loss
console.log(json.long + 1) // throws Error Cannot convert to number: number would be truncated
console.log(json.big + 1)  // throws Error Cannot convert to number: number would overflow
```

If you want parse a json string into an object with regular numbers, but want to validate that no numeric information is lost, you write your own number parser and use `isSafeNumber` to validate the numbers:

```js
import { parse, isSafeNumber } from 'lossless-json'

function parseAndValidateNumber (value) {
  if (!isSafeNumber(value)) {
    throw new Error(`Cannot safely convert value '${value}' into a number`)
  }
  
  return parseFloat(value)
}

// will parse with success if all values can be represented with a number
let json = parse('[1,2,3]', undefined, parseAndValidateNumber)
console.log(json)  // [1, 2, 3] (regular numbers)

// will throw an error when some of the values are too large to represent correctly as number
try {
  let json = parse('[1,2e+500,3]', undefined, parseAndValidateNumber)
}
catch (err) {
  console.log(err) // throws Error 'Cannot safely convert value '2e+500' into a number'
}
```


### BigNumbers

To use the library in conjunction with your favorite BigNumber library, for example [decimal.js](https://github.com/MikeMcl/decimal.js/). You have to define a custom number parser and stringifier

```js
import { parse, stringify } from 'lossless-json'
import Decimal from 'decimal.js'

const parseDecimal = value => new Decimal(value)

const decimalStringifier = {
  test: value => Decimal.isDecimal(value),
  stringify: value => value.toString()
}

// parse JSON, operate on a Decimal value, then stringify again
const text = '{"value":2.3e500}';
const json = parse(text, undefined, parseDecimal) // {value: new Decimal('2.3e500')}
const output = {                                  // {result: new Decimal('4.6e500')}
  result: json.value.times(2)
}
const str = stringify(output, undefined, undefined, [decimalStringifier])
// '{"result":4.6e500}'
```

## API

### parse(text [, reviver [, parseNumber]])

The `LosslessJSON.parse()` function parses a string as JSON, optionally transforming the value produced by parsing.

- **@param** `{string} text`
  The string to parse as JSON. See the JSON object for a description of JSON syntax.
- **@param** `{function(key: string, value: *)} [reviver]`
  If a function, prescribes how the value originally produced by parsing is
   * transformed, before being returned.
- **@param** `{function(value: string) : any} [parseNumber]`
     Pass an optional custom number parser. Input is a string, and the output can be any numeric value: `number`, `bigint`, `LosslessNumber`, or a custom `BigNumber` library. By default, all numeric values are parsed into a `LosslessNumber`.
- **@returns** `{*}`
  Returns the Object corresponding to the given JSON text.
- **@throws** Throws a SyntaxError exception if the string to parse is not valid JSON.

### stringify(value [, replacer [, space [, valueStringifiers]]])

The `LosslessJSON.stringify()`` function converts a JavaScript value to a JSON string,
optionally replacing values if a replacer function is specified, or
optionally including only the specified properties if a replacer array is specified.

- **@param** `{*} value`
  The value to convert to a JSON string.
- **@param** `{function(key: string, value: *) | Array.<string | number>} [replacer]`
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
- **@param** `{Array<{test: (value: any) => boolean, stringify: (value: any) => string}>} [valueStringifiers]`
  An optional list with additional value stringifiers, for example to serialize a `BigNumber`. The output of the function must be valid stringified JSON. When undefined is returned, the property will be deleted from the object. The difference with using a replacer is that the output of a replacer must be JSON and will be stringified afterwards, whereas the output of the `valueStringifiers` is inserted in the JSON as is.
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
  Throws an Error when this would result in loss of information: when the numbers digits would be truncated, or when the number would overflow or underflow.
- `toString() : string`
  Get the string representation of the lossless number.


#### Properties

- `{boolean} isLosslessNumber : true`
  Lossless numbers contain a property `isLosslessNumber` which can be used to
  check whether some variable contains LosslessNumber.

### Utility functions

- `reviveDate(key, value)`
  Revive strings containing an ISO 8601 date string into a JavaScript `Date` object. This reviver is not turned on by default because there is a small risk of parsing a text field that _accidentally_ contains a date into a `Date`. Whether `reviveDate` is safe to use depends on the use case. Usage: 

  ```js
  import { parse, reviveDate } from 'lossless-json'
  
  const data = parse('["2022-08-25T09:39:19.288Z"]', reviveDate)
  // output:
  // [
  //   new Date('2022-08-25T09:39:19.288Z')
  // ]
  ```

  An alternative solution is to stringify a `Date` in a specific recognizable object like `{'$date':'2022-08-25T09:39:19.288Z'}`, and use a reviver and replacer to turn this object into a `Date` and vice versa.


## Test

To test the library, first install dependencies once:

```
npm install
```

Then generate a bundle (some tests validate the created bundle):

```
npm run build
```

Then run the tests:

```
npm test
```

To run a benchmark to compare the performance with the native `JSON` parser:

```
npm run benchmark
```

(Spoiler: `lossless-json` is much slower than native)



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


## Deploy

- Update version number in `package.json`
- Describe changes is `HISTORY.md`
- run `npm test` to see whether everything works correctly.
- merge changes from `develop` into `master`
- create git tag and push it: `git tag v1.0.2 && git push --tags`
- publish via `npm publish` (this will first run `npm test && npm run build` before actually publishing the library).


## License

Released under the [MIT license](LICENSE.md).

