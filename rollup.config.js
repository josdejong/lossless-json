import terser from '@rollup/plugin-terser'

export default {
  input: './lib/esm/index.js',
  output: {
    name: 'LosslessJSON',
    file: 'lib/umd/lossless-json.js',
    format: 'umd',
    compact: true,
    sourcemap: true,
    plugins: [terser()]
  }
}
