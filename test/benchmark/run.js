'use strict';

import {readFileSync } from 'fs';
import { parse, stringify } from '../../lib';

const json = JSON.parse(readFileSync(__dirname + '/largefile.json', 'utf-8'));
const text = JSON.stringify(json);

const MAX = 10;

// benchmark native JSON
console.time('JSON.parse');
for (let i = 0; i < MAX; i++) {
  JSON.parse(text);
}
console.timeEnd('JSON.parse');

console.time('JSON.stringify');
for (let i = 0; i < MAX; i++) {
  JSON.stringify(json);
}
console.timeEnd('JSON.stringify');

console.log('');

// benchmark LosslessJSON
console.time('LosslessJSON.parse');
for (let i = 0; i < MAX; i++) {
  parse(text);
}
console.timeEnd('LosslessJSON.parse');

console.time('LosslessJSON.stringify');
for (let i = 0; i < MAX; i++) {
  stringify(json);
}
console.timeEnd('LosslessJSON.stringify');
