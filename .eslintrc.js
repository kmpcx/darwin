module.exports = {
  env: {
    browser: true,
    es6: true
  },
  // "extends": "plugin:vue/essential",
  extends: 'standard',
  parser: 'babel-eslint',
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  plugins: [
    'vue'
  ],
  'extends': 'plugin:vue/essential'
}
