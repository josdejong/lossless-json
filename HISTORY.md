# History


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

- The `LosslessNumber` class now throws errors when you would lose information
  when converting from and to a `LosslessNumber`.
- Handle escape characters when stringifying a string.
- Exposed `LosslessNumber` in public API.


## 2016-02-08, version 0.0.1

- First functional version which can parse and stringify.
