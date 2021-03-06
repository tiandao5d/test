const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry: {
        main: './index.js'
    },
    output: {
        filename: './js/[name].builde.[hash:6].js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.(png|svg|jpg|gif)$/, use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 5000,
                        outputPath: 'imgs',
                        name: '[name].[hash:7].[ext]'
                    }
                }]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/, use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 5000,
                        outputPath: 'fonts',
                        name: '[name].[hash:7].[ext]'
                    }
                }]
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env', '@babel/preset-react']
                        }
                    }
                ]
            },
            {
                test: /abc\.html$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: './htmlloader.js'
                    }
                ]
            },
            { test: /\.css$/, use: ['style-loader', 'css-loader'] },
            { test: /\.less$/, use: ['style-loader', 'css-loader', 'less-loader'] }
        ]
    },
    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        }
    },
    mode: 'development', // development  production
    devServer: {
        contentBase: './dist',
        hot: true,
        port: 9091,
        host: '0.0.0.0',
        noInfo: true,
        open: true
    },
    watchOptions: {
        ignored: [/ng_plugin/, /node_modules/]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({ template: './index.html' }),
        new CleanWebpackPlugin({ cleanAfterEveryBuildPatterns: ['dist'] })
    ]
};
