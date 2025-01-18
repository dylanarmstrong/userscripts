import eslint from '@dylanarmstrong/eslint-config';
import globals from 'globals';

export default [
  ...eslint,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
];
