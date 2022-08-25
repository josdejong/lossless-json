const { strictEqual } = require('assert')
const cp = require('child_process')
const path = require('path')

describe('lib', () => {
  test('should load the library using ESM', (done) => {
    const filename = path.join(__dirname, 'apps/esmApp.mjs')

    cp.exec(`node ${filename}`, function (error, result) {
      strictEqual(error, null)
      strictEqual(
        result,
        '9223372036854775827\n' + '{"float":2.370,"long":9223372036854775827,"big":2.3e+500}\n'
      )
      done()
    })
  })

  test('should load the library using UMD bundle', (done) => {
    const filename = path.join(__dirname, 'apps/umdApp.cjs')

    cp.exec(`node ${filename}`, function (error, result) {
      strictEqual(error, null)
      strictEqual(
        result,
        '9223372036854775827\n' + '{"float":2.370,"long":9223372036854775827,"big":2.3e+500}\n'
      )
      done()
    })
  })
})
