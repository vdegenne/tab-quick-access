import resolve from '@rollup/plugin-node-resolve'
import cjs from '@rollup/plugin-commonjs'

export default {
  input: 'src/background.js',
  output: { file: 'background.js', format: 'iife' },
  plugins: [
    cjs(),
    resolve()
  ]
}