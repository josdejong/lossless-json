const { parse, stringify } = require('../../lib/umd/lossless-json.js')

const text = '{"float":2.370,"long":9223372036854775827,"big":2.3e+500}'
const json = parse(text)

// LosslessJSON.parse will preserve all numbers and even the formatting:
console.log(json.long.toString())
console.log(stringify(json))
// '{"float":2.370,"long":9223372036854775827,"big":2.3e+500}'
