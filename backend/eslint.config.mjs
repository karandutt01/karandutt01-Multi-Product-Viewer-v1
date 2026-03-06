import js from '@eslint/js';
import globals from 'globals';

export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
        ...globals.jest
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    
    rules: {
      // ===== CRITICAL FORMATTING RULES =====
      'semi': ['error', 'always'], // Enforce semicolons
      'quotes': ['error', 'single', { 'avoidEscape': true }], // Single quotes
      'indent': ['error', 2, { 'SwitchCase': 1 }], // 2-space indentation
      'comma-dangle': ['error', 'never'], // No trailing commas
      'no-trailing-spaces': 'error', // No trailing whitespace
      'eol-last': ['error', 'always'], // Newline at end of file
      'object-curly-spacing': ['error', 'always'], // Spaces in object literals
      'array-bracket-spacing': ['error', 'never'], // No spaces in arrays
      'computed-property-spacing': ['error', 'never'],
      'func-call-spacing': ['error', 'never'],
      'key-spacing': ['error', { 'beforeColon': false, 'afterColon': true }],
      'keyword-spacing': ['error', { 'before': true, 'after': true }],
      'space-before-blocks': ['error', 'always'],
      'space-before-function-paren': ['error', {
        'anonymous': 'always',
        'named': 'never',
        'asyncArrow': 'always'
      }],
      'space-in-parens': ['error', 'never'],
      'space-infix-ops': 'error',
      'space-unary-ops': ['error', { 'words': true, 'nonwords': false }],
      'spaced-comment': ['error', 'always'],
      'brace-style': ['error', '1tbs', { 'allowSingleLine': true }],

      // ===== CODE QUALITY RULES =====
      'no-console': 'warn', // Warn on console statements
      'no-debugger': 'error', // No debugger statements
      'no-alert': 'error', // No alert/confirm/prompt
      'no-unused-vars': ['warn', {
        'vars': 'all',
        'varsIgnorePattern': '^_',
        'args': 'after-used',
        'argsIgnorePattern': '^_'
      }],
      'no-var': 'error', // Use let/const instead of var
      'prefer-const': 'error', // Prefer const when possible
      'prefer-arrow-callback': 'error', // Prefer arrow functions for callbacks
      'arrow-spacing': ['error', { 'before': true, 'after': true }],

      // ===== ERROR PREVENTION =====
      'no-undef': 'error', // No undefined variables
      'no-unreachable': 'error', // No unreachable code
      'no-duplicate-case': 'error', // No duplicate switch cases
      'no-empty': 'error', // No empty blocks
      'no-extra-boolean-cast': 'error', // No unnecessary boolean casts
      'no-extra-semi': 'error', // No extra semicolons
      'no-func-assign': 'error', // No function reassignment
      'no-inner-declarations': 'error', // No inner function declarations
      'no-invalid-regexp': 'error', // No invalid regex
      'no-irregular-whitespace': 'error', // No irregular whitespace
      'no-obj-calls': 'error', // No calling global objects as functions
      'no-sparse-arrays': 'error', // No sparse arrays
      'no-unexpected-multiline': 'error', // No unexpected multiline
      'use-isnan': 'error', // Use isNaN() to check for NaN
      'valid-typeof': 'error', // Valid typeof comparisons

      // ===== BEST PRACTICES =====
      'eqeqeq': ['error', 'always'], // Strict equality
      'no-eval': 'error', // No eval()
      'no-implied-eval': 'error', // No implied eval
      'no-new-func': 'error', // No Function constructor
      'no-script-url': 'error', // No script URLs
      'no-self-compare': 'error', // No self comparison
      'no-sequences': 'error', // No comma operator
      'no-throw-literal': 'error', // No throwing literals
      'no-with': 'error', // No with statements
      'radix': 'error', // Require radix parameter
      'wrap-iife': ['error', 'any'], // Wrap IIFEs
      'yoda': 'error', // No yoda conditions
      'no-delete-var': 'error', // No delete operator on variables
      'no-label-var': 'error', // No labels that share names with variables
      'no-shadow': 'error', // No variable shadowing
      'no-shadow-restricted-names': 'error', // No shadowing restricted names
      'no-undef-init': 'error', // No initializing to undefined
      'no-use-before-define': ['error', { 'functions': false, 'classes': true }]
    }
  },
  {
    files: ['**/*.test.js', '**/*.test.mjs', '**/*.spec.js', '**/*.spec.mjs'],
    languageOptions: {
      globals: {
        ...globals.jest
      }
    },
    rules: {
      'no-console': 'off'
    }
  }
];