const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: { main: './src/index.js' },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[chunkhash].js'
    },

    module: {
        
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            // SCSS Files
            {
                test: /\.scss$/,
                use:  [ 
                    'style-loader', 
                    MiniCssExtractPlugin.loader, 
                    'css-loader',
                    'clean-css-loader',
                    'sass-loader'
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin('dist', {} ),
        new MiniCssExtractPlugin( { filename: 'style.[contenthash].css' } ),
        new HtmlWebPackPlugin({
            inject: false,
            hash: true,
            template: './src/index.html',
            filename: 'index.html'
        }),
        new WebpackMd5Hash()
    ],

    // Development Tools (Map Errors To Source File)
    devtool: 'source-map',
  };
  