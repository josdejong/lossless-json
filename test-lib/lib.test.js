import { strictEqual } from 'node:assert'
import cp from 'node:child_process'
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
