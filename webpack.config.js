const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/main.js', 

    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.[contenthash].js',
        clean: true
    },

    devtool: 'source-map',

    module: {
        rules: [
        {
            test: /\.js$/,        
            exclude: /node_modules/, 
            use: {
            loader: 'babel-loader',
            options: {
                presets: ['@babel/preset-env']
            }
            }
        }
        ]
    },

    plugins: [
    new CopyWebpackPlugin({
        patterns: [
            { 
            from: 'public',  // откуда копируем
            to: '.'          // куда (корень build папки)
            }
        ]
        })
    ]
};