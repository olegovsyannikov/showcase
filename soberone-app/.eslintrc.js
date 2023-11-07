module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
    jest: true,
  },
  extends: ['eslint:recommended', 'plugin:react/recommended'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    require: true,
    module: true,
    window: true,
    $: true,
    cp: true,
    YandexCheckout: true,
    YandexCheckoutUI: true,
    Appsee: true,
    jQuery: true,
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
      modules: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['react', 'react-hooks', 'babel', 'no-loops', 'import'],
  settings: {
    'import/resolver': {
      node: {
        paths: ['src'],
      },
    },
    react: {
      version: 'detect',
    },
  },
  rules: {
    semi: ['error', 'never'],
    quotes: ['error', 'single'],
    'linebreak-style': ['error', 'unix'],
    indent: ['error', 2, { SwitchCase: 1 }],
    'object-curly-spacing': ['error', 'always'],
    'array-bracket-spacing': ['error', 'never'],
    'no-unused-vars': ['warn', { vars: 'all', args: 'after-used', ignoreRestSiblings: true }],
    'react-hooks/rules-of-hooks': 'warn',
    'react-hooks/exhaustive-deps': 'warn',
    'react/jsx-first-prop-new-line': [1, 'multiline'],
    'react/jsx-closing-bracket-location': [1, 'line-aligned'],
    'react/forbid-prop-types': 'off',
    'react/display-name': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    yoda: ['error', 'never'],
  },
}
