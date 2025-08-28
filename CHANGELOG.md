# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [4.2.0](https://github.com/josdejong/lossless-json/compare/v4.1.1...v4.2.0) (2025-08-28)


### Features

* [#268](https://github.com/josdejong/lossless-json/issues/268) make `isSafeNumber` compatible with `Number.isSafeInteger` ([#269](https://github.com/josdejong/lossless-json/issues/269)) ([df63f20](https://github.com/josdejong/lossless-json/commit/df63f20e3f9ce45be38bc4fa63c1a73fbf04e27e))

### [4.1.1](https://github.com/josdejong/lossless-json/compare/v4.1.0...v4.1.1) (2025-06-23)


### Bug Fixes

* [#266](https://github.com/josdejong/lossless-json/issues/266) `isSafeNumber` not reckoning round-off errors ([#267](https://github.com/josdejong/lossless-json/issues/267)) ([92e0cc4](https://github.com/josdejong/lossless-json/commit/92e0cc4bf992383dfe418b5194527b1f0aa697ea))

## [4.1.0](https://github.com/josdejong/lossless-json/compare/v4.0.2...v4.1.0) (2025-05-19)


### Features

* implement helper functions `splitNumber`, `compareNumber`, and `compareLosslessNumber` ([9b9497e](https://github.com/josdejong/lossless-json/commit/9b9497ec57f331f9acae6a9e99b58bae3ede099e))
* improve the performance of util functions `toLosslessNumber`, `isSafeNumber`, and others ([3796e12](https://github.com/josdejong/lossless-json/commit/3796e1293e3edcb732eb53c2b351bff94f33dacc))

### [4.0.2](https://github.com/josdejong/lossless-json/compare/v4.0.1...v4.0.2) (2024-09-18)


### Bug Fixes

* use `Number.parseFloat`, `Number.parseInt`, etc and use string templates consistently ([af946b1](https://github.com/josdejong/lossless-json/commit/af946b11688bc7c22da382b08692c269d3a3e57e))

### [4.0.1](https://github.com/josdejong/lossless-json/compare/v4.0.0...v4.0.1) (2023-12-14)


### Bug Fixes

* allow replacer and reviver to be `null` ([b280774](https://github.com/josdejong/lossless-json/commit/b2807742f05f01f583632a982743388ba68ae2e5))

## [4.0.0](https://github.com/josdejong/lossless-json/compare/v3.0.2...v4.0.0) (2023-12-13)


### ⚠ BREAKING CHANGES

* The usages of types `JSONValue`, `JSONObject`, `JSONArray`, and `JSONPrimitive`
must be replaced with `unknown`. Only relevant when using a `replacer`.

### Bug Fixes

* replace `JSONValue` with `unknown` ([7f4d81b](https://github.com/josdejong/lossless-json/commit/7f4d81be5f18376f94f2fb8de9ca8da933243635))

### [3.0.2](https://github.com/josdejong/lossless-json/compare/v3.0.1...v3.0.2) (2023-11-13)


### Bug Fixes

* crash when input ends with a truncated unicode character ([fe6a1e3](https://github.com/josdejong/lossless-json/commit/fe6a1e3d1cb92665b8a152fb0cf1686fb9e7ca25))

### [3.0.1](https://github.com/josdejong/lossless-json/compare/v3.0.0...v3.0.1) (2023-11-06)


### Bug Fixes

* [#252](https://github.com/josdejong/lossless-json/issues/252) move `vitest` from `dependencies` to `devDependencies` ([2732ecc](https://github.com/josdejong/lossless-json/commit/2732ecc6930fefe85c931c857f4f69da0b852ccc))

## [3.0.0](https://github.com/josdejong/lossless-json/compare/v2.0.11...v3.0.0) (2023-11-01)


### ⚠ BREAKING CHANGES

* The usages of types `JavaScriptValue`, `JavaScriptObject`, `JavaScriptArray` and `JavaScriptPrimitive` must be replaced with `unknown`.

### Bug Fixes

* [#250](https://github.com/josdejong/lossless-json/issues/250) replace the `JavaScriptValue` type definition with `unknown`, which is more accurate ([6033fec](https://github.com/josdejong/lossless-json/commit/6033fec2cf5b8064e5eff1ee3dfa8e3c951f98f8))
* drop official support for node.js 16 ([ee88c4a](https://github.com/josdejong/lossless-json/commit/ee88c4ab36ca5034436d1b11c4aac2be1461478e))
* for backward compatibility, keep the JavaScriptValue types there and mark them deprecated ([bb92e3f](https://github.com/josdejong/lossless-json/commit/bb92e3f1ec1d304a0d024b35893966bf507307bd))
* replace `JavaScriptValue` with `unknown`, which is more accurate (see [#250](https://github.com/josdejong/lossless-json/issues/250)) ([94d2503](https://github.com/josdejong/lossless-json/commit/94d250311b6035de2b8700e7eaf7c9ba0b4639fc))

### [2.0.11](https://github.com/josdejong/lossless-json/compare/v2.0.10...v2.0.11) (2023-07-12)


### Bug Fixes

* adjust published module types ([311995d](https://github.com/josdejong/lossless-json/commit/311995d9323c086a058a766486191197189004f4))

### [2.0.10](https://github.com/josdejong/lossless-json/compare/v2.0.9...v2.0.10) (2023-07-07)


### Bug Fixes

* let the `main` field in `package.json` point to the CommonJS output instead of ESM ([0d6c48f](https://github.com/josdejong/lossless-json/commit/0d6c48f75925e292ae4829301db8a6f9f1beca39))

### [2.0.9](https://github.com/josdejong/lossless-json/compare/v2.0.8...v2.0.9) (2023-05-05)


### Bug Fixes

* [#247](https://github.com/josdejong/lossless-json/issues/247) throw an error in case of a missing object value ([c260715](https://github.com/josdejong/lossless-json/commit/c260715fe6c38cf999663bd83ffdce308ba623ee))

### [2.0.8](https://github.com/josdejong/lossless-json/compare/v2.0.7...v2.0.8) (2023-03-06)

### [2.0.7](https://github.com/josdejong/lossless-json/compare/v2.0.6...v2.0.7) (2023-03-06)


### Bug Fixes

* do to throw a duplicate key error when the values are equal ([452f385](https://github.com/josdejong/lossless-json/commit/452f3851560241fd7c2afaab0268141b0fa4c4dc))


### 2.0.6 (2023-02-15)

- Fix: empty objects and arrays being formatted with indentation inside.

### 2.0.5 (2023-01-06)

- Fix: error handling unicode characters containing a `9`.

### 2.0.4 (2022-12-19)

- Improved performance.

### 2.0.3 (2022-12-01)

- Fix: `parse` not throwing an exception on illegal characters inside a string, like an unescaped new line.

### 2.0.2 (2022-11-17)

- Fix: `parse` throwing a duplicate key error when using built-in property name like `toString` as key.

### 2.0.1 (2022-10-03)

- Fix: configure `exports` in `package.json` to fix problems with Jest (#243).
  Thanks @akphi.

## 2.0.0 (2022-09-28)

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

### 1.0.5 (2021-07-22)

- Fixed stringifing of object keys containing special characters like backslash, see #239. Thanks @mengfanliao.

### 1.0.4 (2020-05-08)

- Fix #117: remove unnecessary configuration files from npm package.

### 1.0.3 (2018-07-31)

- Improved performance of `stringify` by using `JSON.stringify` where possible. Thanks @SergeyFromHell for the suggestion (see #5).

### 1.0.2 (2018-02-11)

- Fixed #4: parser not handling strings equaling a JSON delimiter
  like `"["` correctly.

### 1.0.1 (2017-10-17)

- Upgraded all dev dependencies, fixes broken build script. See #2.

## 1.0.0 (2016-02-13)

- Implemented support for circular references (configurable).

## 0.1.0 (2016-02-12)

- Implemented support for reviver, replacer, and indentation (space).
- Throw error in case of underflow.
- Performance improvements.

## 0.0.2 (2016-02-08)

- The `LosslessNumber` class now throws errors when you would lose information when converting from and to a `LosslessNumber`.
- Handle escape characters when stringifying a string.
- Exposed `LosslessNumber` in public API.

## 0.0.1 (2016-02-08)

- First functional version which can parse and stringify.
