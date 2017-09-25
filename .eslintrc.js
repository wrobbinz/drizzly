module.exports = {
    extends: 'airbnb',
    rules: {
        semi: [2, 'never']
    },
    globals: {
        describe: true,
        it: true,
        beforeEach: true,
        afterEach: true,
    },
    parser: 'babel-eslint'
}
