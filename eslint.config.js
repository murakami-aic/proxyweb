import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
	globalIgnores(['dist']),
	{
		files: ['**/*.{js,jsx}'],
		extends: [
			js.configs.recommended,
			reactHooks.configs['recommended-latest'],
			reactRefresh.configs.vite,
		],
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.browser,
			parserOptions: {
				ecmaVersion: 'latest',
				ecmaFeatures: { jsx: true },
				sourceType: 'module',
			},
		},
		rules: {
			// Limpieza
			'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
			'no-console': 'warn',

			// Estilo que pediste
			'quotes': ['error', 'single'],           // ✅ comillas simples
			'semi': ['error', 'never'],              // ✅ sin punto y coma
			'indent': ['error', 'tab'],              // ✅ indentación con tab
			'object-curly-spacing': ['error', 'always'],
			'array-bracket-spacing': ['error', 'never'],
			'jsx-quotes': ['error', 'prefer-single'], // ✅ atributos JSX con comillas simples
		},
		settings: {
			react: {
				version: 'detect',
			},
		},
	},
])
