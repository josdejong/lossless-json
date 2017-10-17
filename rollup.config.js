import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';

export default {
  name: 'LosslessJSON',
  input: 'lib/index.js',
  output: {
    file: 'dist/lossless-json.js',
    format: 'umd'
  },
  sourcemap: true,
  plugins: [
    babel({
      babelrc: false,
      presets: ["es2015-rollup"]
    }),
    uglify()
  ]
};
