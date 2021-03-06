const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

const config = {
    entry: {
        'src/main.js': ['babel-polyfill', './src/main.js'],
    },

    output:
        process.env.NODE_ENV === 'production'
            ? {
                  path: path.resolve(__dirname, 'dist'),
                  filename: '[name][chunkhash].js',
              }
            : {
                  path: '/',
                  filename: '[name]',
              },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: [
                    /(node_modules)/,
                    /(packages\/react-accessible-tooltip)/,
                ],
                use: ['babel-loader', 'eslint-loader'],
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins() {
                                return [autoprefixer, cssnano];
                            },
                        },
                    },
                    'sass-loader',
                ],
            },
            {
                test: /\.html$/,
                loader: 'html-loader',
            },
        ],
    },

    plugins: (() => {
        // Generate a root HTML file with a <script> appended to the <body> tag.
        let plugins = [
            new HtmlWebpackPlugin({
                template: 'src/index.html',
                inject: 'body',
            }),
        ];

        if (process.env.NODE_ENV === 'production') {
            // When we're not in DEV mode set some vars so React knows we're in prod.
            plugins = plugins.concat([
                new webpack.DefinePlugin({
                    'process.env': {
                        NODE_ENV: JSON.stringify('production'),
                    },
                }),
            ]);
        } else {
            // Add webpack HMR stuff when we're in DEV mode.
            plugins = plugins.concat([
                new webpack.HotModuleReplacementPlugin(),
            ]);
        }

        return plugins;
    })(),

    devtool: 'source-map',

    devServer: {
        host: '0.0.0.0',
        port: 3000,
        hot: true,
    },
};

module.exports = config;
