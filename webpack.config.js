const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const fs = require('fs');

module.exports = {
    entry: './src/index.ts',
    mode: 'development',
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: "public" },
            ]
        })
    ],
    devServer: {
        contentBase: path.resolve(__dirname, "dist"),
        host: '192.168.178.39',
        compress: true,
        port: 9000,
        historyApiFallback: true,
        https: {
            key: fs.readFileSync(path.resolve(__dirname, '../certs/localhost+2-key.pem')),
            cert: fs.readFileSync(path.resolve(__dirname, '../certs/localhost+2.pem')),
        },
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
};