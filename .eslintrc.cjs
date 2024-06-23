module.exports = {
    extends: ['eslint:recommended', 'prettier'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.json']
    },
    plugins: ['@typescript-eslint'],
    root: true,
    rules: {
        'no-console': 'error'
    }
};
