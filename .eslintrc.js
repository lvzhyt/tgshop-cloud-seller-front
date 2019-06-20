module.exports = {
  root: true,
  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'vue/no-parsing-error': [2, {
      'x-invalid-end-tag': false
    }],
    'no-undef': 'off',
    'camelcase': 'off',
    'key-spacing': 'off',
    'space-before-blocks': 'off',
    'space-before-function-paren': 'off',
    'no-trailing-spaces': 'off',
    'keyword-spacing': 'off',
    'object-curly-spacing': 'off',
    'space-infix-ops': 'off',
    'no-unused-vars': 'off',
    'semi': 'off',
    'comma-spacing': 'off',
    'indent': 'off'
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
