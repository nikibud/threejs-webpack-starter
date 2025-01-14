const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')
const express = require('express')
const app = express()

// Serve static files from the "dist" directory
app.use(express.static('src'))

// Serve the "img" directory
app.use('../src/img', express.static(path.join(__dirname, 'img')))

// Start the server
app.listen(8080, function() {
  console.log('Server started on port 8080')
})

module.exports = {
    entry: { 
        map: path.resolve(__dirname, '../src/script.js'),
        login: path.resolve(__dirname, '../src/login.js'),
        car: path.resolve(__dirname, '../src/car.js'),
        home: path.resolve(__dirname, '../src/home.js'),
    },
    output:
    {
        filename: 'bundle.[contenthash].js',
        path: path.resolve(__dirname, '../dist')
    },
    devtool: 'source-map',
    devServer: {
        contentBase: path.join(__dirname, ''),
        compress: true,
        port: 8080
    },    
    plugins:
    [
        new CopyWebpackPlugin({
            patterns: [
                { from: path.resolve(__dirname, '../static') }
            ]
        }),
        new HtmlWebpackPlugin({
            filename:'index.html',
            template: path.resolve(__dirname, '../src/index.html'),
            minify: true,
            chunks:['map']
        }),
        new HtmlWebpackPlugin({
            filename:'home.html',
            template: path.resolve(__dirname, '../src/home.html'),
            chunks:['home']
        }),
        new HtmlWebpackPlugin({
            filename:'car.html',
            template: path.resolve(__dirname, '../src/car.html'),
            chunks:['car']
        }),
        new HtmlWebpackPlugin({
            filename:'login.html',
            template: path.resolve(__dirname, '../src/login.html'),
            chunks:['login']
        }),

        new MiniCSSExtractPlugin()
    ],
    module:
    {
        rules:
        [
            // HTML
            {
                test: /\.(html)$/,
                use: ['html-loader']
            },

            // JS
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use:
                [
                    'babel-loader'
                ]
            },

            // CSS
            {
                test: /\.css$/,
                use:
                [
                    MiniCSSExtractPlugin.loader,
                    'css-loader'
                ]
            },

            // Images
            {
                test: /\.(jpg|png|gif|svg)$/,
                use:
                [
                    {
                        loader: 'file-loader',
                        options:
                        {
                            outputPath: 'assets/images/'
                        }
                    }
                ]
            },

            // Fonts
            {
                test: /\.(ttf|eot|woff|woff2)$/,
                use:
                [
                    {
                        loader: 'file-loader',
                        options:
                        {
                            outputPath: 'assets/fonts/'
                        }
                    }
                ]
            }
        ]
    }
}
