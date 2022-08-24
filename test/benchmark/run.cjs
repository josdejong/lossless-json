'use strict';

const { readFileSync } = require('fs');
const LosslessJSON = require('../../dist/lossless-json.js');
const Benchmark = require('benchmark')

const json = JSON.parse(readFileSync(__dirname + '/largefile.json', 'utf-8'));
const text = JSON.stringify(json);

const suite = new Benchmark.Suite()
suite
  .add('        JSON.parse    ', () => JSON.parse(text))
  .add('LosslessJSON.parse    ', () => LosslessJSON.parse(text))
  .add('        JSON.stringify', () => JSON.stringify(json))
  .add('LosslessJSON.stringify', () => LosslessJSON.stringify(json))
  .on('cycle', function (event) {
    console.log(String(event.target))
  })
  .on('complete', function () {
  })
  .run()
