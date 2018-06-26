import * as webpack from 'webpack';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import ImageminPlugin from 'imagemin-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import UglifyJSPlugin from 'uglifyjs-webpack-plugin';
import LicenseInfoWebpackPlugin from 'license-info-webpack-plugin';
import imageminMozjpeg from 'imagemin-mozjpeg';

import { entry, output, resolve, rules, plugins, views, paths, imageMin } from './base';

const appendRules: webpack.Rule[] = [
  {
    test: /\.tsx?$/,
    exclude: /node_modules/,
    use: [
      {
        loader: 'awesome-typescript-loader',
        options: {
          configFileName: 'tsconfig.production.json',
        },
      },
    ],
  },
  {
    test: /\.css$/,
    use: [
      MiniCssExtractPlugin.loader,
      {
        loader: 'css-loader',
        options: {
          importLoaders: 1,
          modules: true,
          localIdentName: '[name]__[local]--[hash:base64:5]',
        },
      },
      'postcss-loader',
    ],
  },
];

export default {
  mode: 'production',
  entry,
  output,
  resolve,
  plugins: [
    ...plugins,
    new CopyWebpackPlugin([{ from: paths.assets }], { ignore: ['.DS_Store'] }),
    new ImageminPlugin({
      test: /.{jpg,gif,png}$/,
      optipng: null,
      jpegtran: null,
      gifsicle: imageMin.gif,
      pngquant: imageMin.png,
      plugins: [imageminMozjpeg(imageMin.jpg)],
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      chunkFilename: 'css/[id].css',
    }),
    ...views.map(
      ({ template, filename }) =>
        new HtmlWebpackPlugin({
          template,
          filename: `${filename}.html`,
          inject: false,
          minify: {
            html5: true,
            includeAutoGeneratedTags: true,
            collapseWhitespace: true,
          },
        }),
    ),
    new LicenseInfoWebpackPlugin({
      glob: '{LICENSE,license,License}*',
    }),
  ],
  module: {
    rules: [...rules, ...appendRules],
  },
  optimization: {
    minimizer: [
      new UglifyJSPlugin({
        uglifyOptions: {
          output: { comments: /^\**!|@preserve|@license|@cc_on/ },
        },
      }),
    ],
  },
} as webpack.Configuration;
