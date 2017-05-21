module.exports = {
    main: {
        entry: './dist/main.js',
        output: {
            path: 'pack/',
            filename: 'main.js',
            libraryTarget: 'commonjs2'
        },
        module: {
            loaders: [{
                test: /\.js$/,
                exclude: /(src|node_modules|ScreepsAutocomplete)/,
                loader: 'babel-loader',
                query: {
                    presets: [
                        require.resolve('babel-preset-es2016')
                    ]
                }
            }]
        }
    }
};
