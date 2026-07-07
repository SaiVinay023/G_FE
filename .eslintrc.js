module.exports = {
  extends: ['next/core-web-vitals', 'plugin:prettier/recommended'],
  settings: {
    next: {
      rootDir: ['/src'],
    },
  },
  rules: {
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],
    'import/order': [
      'error',
      {
        'groups': ['builtin', 'external', 'internal'],
        'pathGroups': [
          {
            pattern: 'react',
            group: 'external',
            position: 'before',
          },
        ],
        'newlines-between': 'always',
        'alphabetize': {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    'react/jsx-boolean-value': ['error', 'never'],
    'react/display-name': 'off',
  },
};
