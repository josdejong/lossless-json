export default {
  input: 'src/index.ts',
  output: {
    name: 'LosslessJSON',
    file: 'lib/umd/lossless-json.js',
    format: 'umd',
    compact: true,
    sourcemap: true
  }
}
