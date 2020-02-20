const os = require('os');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const baseConfig = require('./webpack.base');

module.exports = merge(baseConfig, {
    target: 'web',
    mode: 'development',
    devtool: 'cheap-module-eval-source-map',
    entry: './src/entry-client',
    devServer: {
        host: getIP(),
        port: 9000,
        hot: true,
        historyApiFallback: true,
        proxy: {}
    },
    module: {
        rules: [{
            test: /\.vue$/,
            use: [{
                loader: 'vue-loader',
                options: {
                    hot: true
                }
            }]
        },
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader'
                ]
            }, {
                test: /\.scss$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    'sass-loader'
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
            }]
    },
    plugins: [
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'public/index.html',
            favicon: 'public/favicon.ico',
            templateParameters: {
                title: 'ele-front-ssr'
            }
        })
    ]
});

function getIP() {
    let interfaces = os.networkInterfaces();
    for (let device in interfaces) {
        let iface = interfaces[device];
        for (let i = 0; i < iface.length; i++) {
            let face = iface[i];
            if (face.family === 'IPv4' && face.address !== '127.0.0.1' && !face.internal) {
                return face.address;
            }
        }
    }
}