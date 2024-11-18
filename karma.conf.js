module.exports = function (config) {
    config.set({
        frameworks: ['jasmine'],
        files: ['src/**/*.spec.ts'],
        preprocessors: {
            'src/**/*.spec.ts': ['webpack'],
        },
        webpack: {
            // Configuration Webpack
        },
        browsers: ['Chrome'],
        singleRun: false,
    })
}
