import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended'
import eslintConfigPrettier from 'eslint-config-prettier'

export default tseslint.config(
    { ignores: ['dist', 'public'] },
    {
        extends: [js.configs.recommended, ...tseslint.configs.recommended, eslintConfigPrettier, eslintPluginPrettier],
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2022,
            globals: globals.node,
        },
        rules: {
            'prettier/prettier': "error"
        },
    },
)
