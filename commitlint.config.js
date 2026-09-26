export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-max-line-length': [1, 'always', 200],
    'scope-enum': [2, 'always', []],
  },
};
