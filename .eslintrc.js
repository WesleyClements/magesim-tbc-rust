module.exports = {
  env: {
    browser: true,
    es2021: true,
    worker: true,
  },
  extends: [
    'plugin:vue/essential',
    'plugin:vue/recommended',
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'vue',
  ],
  rules: {
    curly: ['error', 'all'],
    'brace-style': ['error', '1tbs'],
    'function-call-argument-newline': ['warn', 'consistent'],
  },
};
