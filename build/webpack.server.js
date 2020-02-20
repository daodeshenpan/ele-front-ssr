const merge = require('webpack-merge');
const baseConfig = require('./webpack.base');
const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const nodeExternals = require('webpack-node-externals');
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');

module.exports = merge(baseConfig, {
    mode: 'production',

    entry: './src/entry-server',

    target: 'node',

    devtool: 'source-map',

    output: {
        filename: '[name].js',
        path: path.join(__dirname, '../server'),
        libraryTarget: 'commonjs2',
        publicPath: '/'
    },

    module: {
        rules: [
            {
                test: /\.vue$/,
                use: ['vue-loader']
            },
            {
                test: /\.css$/,
                use: [
                    'css-loader'
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.sass$/,
                use: [
                    'css-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            sassOptions: {
                                indentedSyntax: true
                            }
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpe?g|gif)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        esModule: false,
                    }
                }]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        esModule: false
                    }
                }]
            }
        ]
    },

    plugins: [
        new VueLoaderPlugin(),
        new VueSSRServerPlugin()
    ],

    externals: nodeExternals({
        whitelist: /\.css$/
    })
});