import * as webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import DashboardPlugin from 'webpack-dashboard/plugin';
import BrowserSyncPlugin from 'browser-sync-webpack-plugin';

import { entry, output, resolve, rules, plugins, views, paths } from './base';

const appendRules: webpack.Rule[] = [
  {
    test: /\.tsx?$/,
    exclude: /node_modules/,
    loader: [
      {
        loader: 'babel-loader',
        options: {
          babelrc: false,
          plugins: ['react-hot-loader/babel'],
        },
      },
      'awesome-typescript-loader',
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

export default {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: Object.entries(entry).reduce(
    (tmp, [key, value]) => {
      tmp[key] = [
        'webpack-dev-server/client?http://localhost:13000',
        'webpack/hot/only-dev-server',
        ...(value instanceof Array ? value : [value]),
      ];
      return tmp;
    },
    {} as { [key: string]: string[] },
  ),
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
        }),
    ),
    new DashboardPlugin(),
    new BrowserSyncPlugin(
      {
        host: 'localhost',
        port: 3000,
        files: ['src/views/**/*.ejs', 'assets/**/*'],
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
} as webpack.Configuration;
