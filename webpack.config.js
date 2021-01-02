const CopyWebpackPlugin = require('copy-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const path = require('path');
const fs = require('fs');
const localIP = '192.168.178.38'

module.exports = {
    entry: './src/index.ts',
    mode: 'development',
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                options: {
                    // disable type checker - we will use it in fork plugin
                    transpileOnly: true
                }
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [
        new ForkTsCheckerWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                { from: "public" },
            ]
        })
    ],
    devServer: {
        contentBase: path.resolve(__dirname, "dist"),
        host: localIP,
        compress: false,
        port: 9000,
        historyApiFallback: true,
        hot: true,
        https: {
            key: fs.readFileSync(path.resolve(__dirname, '../certs/localhost+2-key.pem')),
            cert: fs.readFileSync(path.resolve(__dirname, '../certs/localhost+2.pem')),
        },
    },
    output: {
        //filename: '[name].js',
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        //chunkFilename: '[id].js'
    },
    optimization: {
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: false,
        runtimeChunk: false
        // splitChunks: {
        //     chunks: 'all',
        // },
    },
};