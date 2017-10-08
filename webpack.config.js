/**
 * Created by matt on 2/19/17.
 */
const path = require('path');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const ETP = require('extract-text-webpack-plugin');
const PurifyCSSPlugin = require('purifycss-webpack');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')

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
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                loader: 'file?name=public/fonts/[name].[ext]'
            },

            {
                test: /\.(jpe?g|png|gif|svg)$/,
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
            }
        ]
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
            minify: {
                removeComments: true,
                collapseWhitespace: true
            },
            filename: 'index.html'
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src', 'index.ejs'),
            title: 'Project Demo_about',
            inject: 'body',
            excludeChunks: ['home'],
            minify: {
                removeComments: true,
                collapseWhitespace: true
            },
            filename: './about/index.html'
        }),
        new webpack.HotModuleReplacementPlugin(),

        new webpack.optimize.CommonsChunkPlugin({
            name: 'common'
        }),
        new FaviconsWebpackPlugin({
    // Your source logo
    logo: './logo.png',
    // The prefix for all image files (might be a folder or a name)
    prefix: 'icons-[hash]/',
    // Emit all stats of the generated icons
    emitStats: false,
    // The name of the json containing all favicon information
    statsFilename: 'iconstats-[hash].json',
    // Generate a cache file with control hashes and
    // don't rebuild the favicons until those hashes change
    persistentCache: true,
    // Inject the html into the html-webpack-plugin
    inject: true,
    // favicon background color (see https://github.com/haydenbleasel/favicons#usage)
    background: '#fff',
    // favicon app title (see https://github.com/haydenbleasel/favicons#usage)
    title: 'Webpack App',

    // which icons should be generated (see https://github.com/haydenbleasel/favicons#usage)
    icons: {
      android: true,
      appleIcon: true,
      appleStartup: false,
      coast: false,
      favicons: true,
      firefox: false,
      opengraph: false,
      twitter: false,
      yandex: false,
      windows: false
    }
  }),

        // new ETP('styles.css'),
        new ETP({
            filename: './assets/css/[name].styles.css?[hash]',
            allChunks: true
        }),
        new PurifyCSSPlugin({
            // Give paths to parse for rules. These should be absolute!
            paths: glob.sync(path.join(__dirname, 'src/*.html')),
            purifyOptions: {
                minify: true
            }
        }),
    ]
};
