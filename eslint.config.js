import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'; // For Prettier integration
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default tseslint.config(
  // Global ignores
  { ignores: ['dist/', 'node_modules/', 'build/'] },

  // Base configuration for all TypeScript files (shared)
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // Configuration for Client (React / Vite)
  {
    files: ['client/**/*.{ts,tsx}', 'src/**/*.{ts,tsx}'], // Assuming src might also be client-related based on initial ls
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'no-unused-vars': ['warn', { 'argsIgnorePattern': '^_' }],
      '@typescript-eslint/no-unused-vars': ['warn', { 'argsIgnorePattern': '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn'
    },
  },

  // Configuration for Server (Node.js / Express)
  {
    files: ['server/**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'no-unused-vars': ['warn', { 'argsIgnorePattern': '^_' }],
      '@typescript-eslint/no-unused-vars': ['warn', { 'argsIgnorePattern': '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn', // Warn about explicit 'any'
      '@typescript-eslint/interface-name-prefix': 'off', // Common convention to prefix interfaces with 'I'
      'no-console': 'off', // Allow console.log in server code for now
    },
  },
  
  // Prettier configuration - should be last to override other styling rules
  // Apply Prettier to all relevant files
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    ...eslintPluginPrettierRecommended,
    rules: {
        ...eslintPluginPrettierRecommended.rules,
        "prettier/prettier": ["warn", { // Show Prettier issues as warnings
            "endOfLine": "auto" 
        }], 
    }
  }
);


