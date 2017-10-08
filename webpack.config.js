/**
 * Created by matt on 2/19/17.
 */
const path = require('path');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const ETP = require('extract-text-webpack-plugin');
const PurifyCSSPlugin = require('purifycss-webpack');

module.exports = {
    context: path.join(__dirname, 'src'),
    entry: {
        home: './app/home',
        about: './app/about'
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: './assets/scripts/[name].bundle.js?[hash]'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            loader: 'babel-loader',
            include: path.join(__dirname, 'src')
        }, {
            test: /\.(css|scss|sass)$/,
            // loader: ETP.extract('style-loader', 'css-loader!sass-loader'),
            loader: ETP.extract({
                fallback: 'style-loader',
                use: 'css-loader!postcss-loader!sass-loader'
            }),
            include: path.join(__dirname, 'src')
        }, {
            test: /\.(png|jpg)$/,
            loader: 'srcset-loader',
            options: {
                sizes: ['200w', '320w', '420w', '512w', '640w', '720w', '800w', '960w', '1024w', '1166w', '1280w', '1400w'],
            },
            loader: 'file-loader',
            options: {
                hash: 'sha512',
                digest: 'hex',
                outputPath: './images/',
                name: '[name].[hash].[ext]',
            },
            loader: 'image-webpack-loader',
            options: {
                mozjpeg: {
                    quality: 65,
                },
                pngquant: {
                    quality: '65-90',
                    speed: 4,
                },
                svgo: {
                    plugins: [{
                        removeViewBox: false,
                    }, {
                        removeEmptyAttrs: false,
                    }],
                }
            },

            include: path.join(__dirname, 'src')
        }]
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        inline: true,
        hot: true,
        historyApiFallback: true,

    },
    resolve: {

        alias: {
            'styles': path.resolve(__dirname, 'src/styles'),
            'images': path.resolve(__dirname, 'src/assets')
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src', 'index.ejs'),
            title: 'Project Demo_index',
            inject: 'body',
            excludeChunks: ['about'],
            filename: 'index.html'
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src', 'index.ejs'),
            title: 'Project Demo_about',
            inject: 'body',
            excludeChunks: ['home'],
            filename: './about/index.html'
        }),
        new webpack.HotModuleReplacementPlugin(),

        new webpack.optimize.CommonsChunkPlugin({
            name: 'common'
        }),

        // new ETP('styles.css'),
        new ETP({
            filename: './assets/css/[name].styles.css?[hash]',
            allChunks: true
        }),
        new PurifyCSSPlugin({
            // Give paths to parse for rules. These should be absolute!
            paths: glob.sync(path.join(__dirname, 'src/*.html')),
        })
    ]
};
