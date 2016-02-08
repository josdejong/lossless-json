import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';

export default {
  entry: 'lib/index.js',
  dest: 'dist/lossless-json.js',
  format: 'umd',
  moduleName: 'LosslessJSON',
  sourceMap: true,
  plugins: [
    babel({
      babelrc: false,
      presets: ["es2015-rollup"]
    }),
    uglify()
  ]
};
