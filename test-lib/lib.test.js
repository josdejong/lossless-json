import { strictEqual } from 'node:assert'
import cp from 'node:child_process'
import { createRequire } from 'node:module'
import path from 'node:path'
import { describe, test } from 'vitest'

describe('lib', () => {
  test('should load the library using ESM', () =>
    new Promise((resolve) => {
      const filename = path.join(__dirname, 'apps/esmApp.mjs')

      cp.exec(`node ${filename}`, (error, result) => {
        strictEqual(error, null)
        strictEqual(
          result,
          '9223372036854775827\n' + '{"float":2.370,"long":9223372036854775827,"big":2.3e+500}\n'
        )
        resolve()
      })
    }))

  test('should load the library using UMD bundle', () =>
    new Promise((resolve) => {
      const filename = path.join(__dirname, 'apps/umdApp.cjs')

      cp.exec(`node ${filename}`, (error, result) => {
        strictEqual(error, null)
        strictEqual(
          result,
          '9223372036854775827\n' + '{"float":2.370,"long":9223372036854775827,"big":2.3e+500}\n'
        )
        resolve()
      })
    }))
})

test('recognize genuine lossless numbers across the ESM and CommonJS builds', async () => {
  const esm = await import('../lib/esm/index.js')
  const cjs = createRequire(path.join(__dirname, 'lib.test.js'))('../lib/umd/lossless-json.js')
  const esmNumber = new esm.LosslessNumber('9007199254740993')
  const cjsNumber = new cjs.LosslessNumber('9007199254740993')
  strictEqual(esm.isLosslessNumber(cjsNumber), true)
  strictEqual(cjs.isLosslessNumber(esmNumber), true)
  strictEqual(esm.stringify(cjsNumber), '9007199254740993')
  strictEqual(cjs.stringify(esmNumber), '9007199254740993')
})
