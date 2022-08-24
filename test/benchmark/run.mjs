import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { readFileSync } from 'fs';
import { parseLosslessJSON, stringifyLosslessJSON, config } from '../../src/index.js';
import Benchmark from 'benchmark'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const json = JSON.parse(readFileSync(__dirname + '/largefile.json', 'utf-8'));
const text = JSON.stringify(json);

config({ circularRefs: false })

const suite = new Benchmark.Suite()
suite
  .add('        JSON.parse    ', () => JSON.parse(text))
  .add('LosslessJSON.parse    ', () => parseLosslessJSON(text))
  .add('        JSON.stringify', () => JSON.stringify(json))
  .add('LosslessJSON.stringify', () => stringifyLosslessJSON(json))
  .on('cycle', function (event) {
    console.log(String(event.target))
  })
  .on('complete', function () {
  })
  .run()
