import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { readFileSync } from 'fs'
import { parse, stringify } from '../../lib/esm/index.js'
import Benchmark from 'benchmark'
import assert from 'assert'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const text = readFileSync(__dirname + '/largefile.json', 'utf-8')
const json = JSON.parse(text)
const losslessJSON = parse(text)

assert.deepStrictEqual(JSON.parse(stringify(losslessJSON)), json)

const suite = new Benchmark.Suite('parse and stringify benchmark')
suite
  .add('        JSON.parse    ', () => JSON.parse(text))
  .add('LosslessJSON.parse    ', () => parse(text))
  .add('        JSON.stringify', () => JSON.stringify(json))
  .add('LosslessJSON.stringify', () => stringify(losslessJSON))
  .on('cycle', function (event) {
    console.log(String(event.target))
  })
  .run()
