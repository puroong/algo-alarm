module.exports = {
    entry: {
        background: './src/background.ts',
        popup: './src/popup.ts'
    },
    output: {
        filename: '[name].js',
		path: __dirname + '/dist'
    },
    devtool: "source-map",
    resolve: {
		extensions: ['.ts']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: [
                    {
						loader: 'ts-loader'
                    }
                ]
            },
            {
                enforce: 'pre',
                test: /\.js$/,
				loader: 'source-map-loader'
            }
        ]
    },
    externals: {
		"chrome": "chrome"
    }
}