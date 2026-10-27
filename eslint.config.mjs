import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';

const eslintConfig = [
  ...nextCoreWebVitals,
  {
    rules: {
      // Keep the existing effect-based initialization patterns unchanged during this framework upgrade.
      'react-hooks/set-state-in-effect': 'off',
    },
  },
];

export default eslintConfig;
