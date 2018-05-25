import * as webpack from 'webpack';
import UglifyJSPlugin from 'uglifyjs-webpack-plugin';
import LicenseInfoWebpackPlugin from 'license-info-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

import { entry, output, resolve, rules, plugins } from './base';

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
      'style-loader',
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
    new LicenseInfoWebpackPlugin({ glob: '{LICENSE,license,License}*' }),
    new BundleAnalyzerPlugin(),
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
