const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

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
        new HtmlWebpackPlugin({
            template: './public/index.html', // Берем ваш index.html как шаблон
            filename: 'index.html' // Создаем новый index.html с подключенным скриптом
        }),
        new CopyWebpackPlugin({
            patterns: [{ 
                    from: 'public',
                    to: '.',
                    globOptions: {
                        ignore: ['**/index.html'] // Игнорируем index.html, т.к. его генерирует HtmlWebpackPlugin
                    }
                }
            ]
        })
    ]
};