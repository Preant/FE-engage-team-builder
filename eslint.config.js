import tsParser from '@typescript-eslint/parser';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import importPlugin from 'eslint-plugin-import';

export default [
    {
        files: ['**/*.ts', '**/*.tsx'],
        ignores: ['plugins/*'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module'
            },
            globals: {
                browser: true
            }
        },
        plugins: {
            '@typescript-eslint': typescriptPlugin,
            'import': importPlugin
        },
        rules: {
            // Typescript specific rules
            '@typescript-eslint/no-unused-vars': ['warn', {
                varsIgnorePattern: '^_',
                argsIgnorePattern: '^_'
            }],
            '@typescript-eslint/naming-convention': [
                'error',
                {
                    selector: 'parameter',
                    leadingUnderscore: 'forbid',
                    format: null
                },
                {
                    selector: 'parameter',
                    leadingUnderscore: 'allow',
                    format: null,
                    modifiers: ['unused']
                }
            ],
            '@typescript-eslint/typedef': [
                'warn',
                {
                    arrayDestructuring: true,
                    arrowParameter: true,
                    memberVariableDeclaration: true,
                    objectDestructuring: true,
                    parameter: true,
                    propertyDeclaration: true,
                    variableDeclaration: true,
                    variableDeclarationIgnoreFunction: false
                }
            ],

            // General rules
            'camelcase': 'error',
            'complexity': 'warn',
            'curly': 'error',
            'default-case': 'error',
            'dot-notation': 'error',
            'max-depth': ['warn', {max: 4}],
            'max-params': ['warn', 5],
            'no-else-return': 'error',
            'no-lonely-if': 'warn',
            'no-magic-numbers': ['warn', {ignore: [0, 1, 2, -1]}],
            'no-nested-ternary': 'error',
            'no-unneeded-ternary': 'error',
            'no-unused-expressions': 'warn',
            'no-warning-comments': 'error',
            'no-var': 'error',
            'operator-assignment': 'warn',
            'prefer-const': 'error',

            // Styling rules
            'array-bracket-spacing': 'error',
            'arrow-spacing': 'error',
            'comma-spacing': 'error',
            'eol-last': 'error',
            'func-call-spacing': 'error',
            'key-spacing': 'error',
            'keyword-spacing': 'error',
            'no-trailing-spaces': 'error',
            'semi-spacing': 'error',
            'semi': 'error',
            'space-in-parens': 'error',
            'switch-colon-spacing': 'error',
            'object-curly-spacing': ['error', 'always'],
            'indent': ['error', 2, {SwitchCase: 1}],
            'quotes': ['error', 'single', {
                avoidEscape: true,
                allowTemplateLiterals: true
            }],

            // Import rules
            'import/no-relative-parent-imports': 'error',
            'import/order': ['error', {
                groups: [
                    'builtin',
                    'external',
                    'internal',
                    ['parent', 'sibling'],
                    'index',
                    'object',
                    'type'
                ],
                'newlines-between': 'always',
                alphabetize: {
                    order: 'asc',
                    caseInsensitive: true
                },
                pathGroups: [
                    {
                        pattern: '@/src/**',
                        group: 'internal',
                        position: 'after'
                    }
                ],
                pathGroupsExcludedImportTypes: ['builtin']
            }]
        }
    }
];
