const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const DashboardPlugin = require('webpack-dashboard/plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

const {
  entry,
  output,
  resolve,
  module: { rules },
  plugins,
  views,
  paths,
} = require('./base');
const viewData = require(path.join(paths.view, '/data.json'));

const appendRules = [
  {
    test: /\.tsx?$/,
    exclude: /node_modules/,
    loader: [
      {
        loader: 'babel-loader',
        options: {
          babelrc: false,
          plugins: ['react-hot-loader/babel'],
          // exclude: /node_modules/,
        },
      },
      // loader: 'awesome-typescript-loader',
      'ts-loader',
    ],
  },
  { test: /\.js$/, use: 'source-map-loader', enforce: 'pre' },
  {
    test: /\.css$/,
    use: [
      'style-loader',
      {
        loader: 'css-loader',
        options: {
          modules: true,
          localIdentName: '[name]__[local]--[hash:base64:5]',
          importLoaders: 1,
          sourceMap: true,
        },
      },
      {
        loader: 'postcss-loader',
        options: {
          sourceMap: true,
        },
      },
    ],
  },
];

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: Object.entries(entry).reduce((tmp, [key, value]) => {
    tmp[key] = [
      'webpack-dev-server/client?http://localhost:13000',
      'webpack/hot/only-dev-server',
      ...(typeof value === 'string' ? [value] : value),
    ];
    return tmp;
  }, {}),
  output,
  resolve,
  plugins: [
    ...plugins,
    new webpack.NamedModulesPlugin(),
    ...views.map(
      ({ template, filename }) =>
        new HtmlWebpackPlugin({
          template,
          filename: `${filename}.html`,
          inject: false,
          conf: Object.assign(
            { viewPath: paths.view, isProduction: false },
            viewData.common,
            viewData[filename] ? viewData[filename] : {},
          ),
        }),
    ),
    new DashboardPlugin(),
    new BrowserSyncPlugin(
      {
        host: 'localhost',
        port: 3000,
        files: ['src/views/**/*.hbs', 'assets/**/*'],
        proxy: 'http://localhost:13000',
      },
      {
        reload: false,
      },
    ),
  ],
  module: {
    rules: [...rules, ...appendRules],
  },
  devServer: {
    publicPath: output.publicPath,
    contentBase: [paths.assets],
    port: 13000,
  },
};
