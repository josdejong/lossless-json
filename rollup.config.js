import babel from 'rollup-plugin-babel';
import { uglify } from 'rollup-plugin-uglify';

export default {
  input: 'lib/index.js',
  output: {
    name: 'LosslessJSON',
    file: 'dist/lossless-json.js',
    format: 'umd',
    sourcemap: true,
  },
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
    uglify()
  ]
};
