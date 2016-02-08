'use strict';

import test from 'ava';
import 'babel-core/register';

import { parse, stringify, LosslessNumber } from '../lib/index';

test('Public API', function (t) {
  t.same(parse('{}'), {}, 'parse json');
  t.same(stringify({}), '{}', 'stringify json');
  t.ok(new LosslessNumber(2).isLosslessNumber, 'create lossless number');
});
