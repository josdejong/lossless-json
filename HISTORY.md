# History

## 2022-10-03, version 2.0.1

- Fix: configure `exports` in `package.json` to fix problems with Jest (#243).
  Thanks @akphi.

## 2022-09-28, version 2.0.0

**IMPORTANT: BREAKING CHANGES**

Breaking changes:

- Function `parse` now throws an error when a duplicate key is encountered.
- Dropped support for circular references. If you encounter circular references in your data structures, please rethink your datastructures: better prevent circular references in the first place.
- The constructor of the `LosslessNumber` class now only supports a string as argument. Use `toLosslessNumber` to convert a number into a LosslessNumber in a safe way.
- Dropped the undocumented property `.type` on `LosslessNumber` instances. Please use `.isLosslessNumber` instead.
- Dropped official support for Node.js 12.

Non-breaking changes:

- Serialization of numeric values is now fully customizable via new options `parseNumber` and `numberStringifiers`, making it easier to integrate with a BigNumber library, or to write your own logic to turn numeric values into `bigint` when needed.
- Built in support for `bigint`.
- Built-in support for `Date` (turned off by default), see `reviveDate`.
- Export a set of utility functions: `isInteger`, `isNumber`, `isSafeNumber`, `toSafeNumberOrThrow`, `getUnsafeNumberReason`, `parseLosslessNumber`, `parseNumberAndBigInt`, `reviveDate`, `isLosslessNumber`, `toLosslessNumber`.
- THe library is modular now: it exports ES modules and an UMD bundle. The ES modules allow to import only the functions that you need, instead of pulling in the full bundle.
- The library now comes with TypeScript definitions, and the code has been rewritten in TypeScript,
- Performance of both `parse` and `stringify` has been improved a lot.

## 2021-07-22, version 1.0.5

- Fixed stringifing of object keys containing special characters like backslash, see #239. Thanks @mengfanliao.

## 2020-05-08, version 1.0.4

- Fix #117: remove unnecessary configuration files from npm package.

## 2018-07-31, version 1.0.3

- Improved performance of `stringify` by using `JSON.stringify` where possible. Thanks @SergeyFromHell for the suggestion (see #5).

## 2018-02-11, version 1.0.2

- Fixed #4: parser not handling strings equaling a JSON delimiter
  like `"["` correctly.

## 2017-10-17, version 1.0.1

- Upgraded all dev dependencies, fixes broken build script. See #2.

## 2016-02-13, version 1.0.0

- Implemented support for circular references (configurable).

## 2016-02-12, version 0.1.0

- Implemented support for reviver, replacer, and indentation (space).
- Throw error in case of underflow.
- Performance improvements.

## 2016-02-08, version 0.0.2

- The `LosslessNumber` class now throws errors when you would lose information when converting from and to a `LosslessNumber`.
- Handle escape characters when stringifying a string.
- Exposed `LosslessNumber` in public API.

## 2016-02-08, version 0.0.1

- First functional version which can parse and stringify.
