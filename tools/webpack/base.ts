import path from 'path';
import globby from 'globby';
import * as webpack from 'webpack';

import viewData from '../../src/views/data.json';

export const paths = {
  build: path.join(process.cwd(), 'build'),
  assets: path.join(process.cwd(), 'assets'),
  script: path.join(process.cwd(), 'src', 'scripts'),
  view: path.join(process.cwd(), 'src', 'views'),
};

export const imageMin = {
  png: {
    // クオリティ 0(やり過ぎ) ~ 100(ほぼそのまま) -で繋いで2つ書くとmin-maxという意味合いらしいがよくわかりません
    quality: '65-80',
    // 処理速度を指定 1(じっくり) ~ 10(最速) 5％くらい質に違いが出るらしい
    speed: 1,
    // ディザリングを設定 0(無効) ~ 1(最大)
    floyd: 0,
    // フロイド-スタインバーグ・ディザリングを無効化するか
    // https://ja.wikipedia.org/wiki/%E3%83%95%E3%83%AD%E3%82%A4%E3%83%89-%E3%82%B9%E3%82%BF%E3%82%A4%E3%83%B3%E3%83%90%E3%83%BC%E3%82%B0%E3%83%BB%E3%83%87%E3%82%A3%E3%82%B6%E3%83%AA%E3%83%B3%E3%82%B0
    nofs: false,
  },
  jpg: {
    // クオリティ 0(やり過ぎ) ~ 100(ほぼそのまま)
    quality: 80,
    // プログレッシブjpegを作成するか falseにするとベースラインjpeg
    progressive: true,
  },
  gif: {
    // 最適化レベル 1(ちょっと)-3(そこそこ)で指定
    optimizationLevel: 3,
  },
};

export const entry: webpack.Entry = {
  index: path.join(paths.script, 'index.ts'),
};

export const output: webpack.Output = {
  path: paths.build,
  filename: 'js/[name].js',
  publicPath: '/',
};

export const resolve: webpack.Resolve = {
  modules: ['node_modules'],
  extensions: ['json', '.tsx', '.ts', '.css', '.js'],
};

export const rules: webpack.Rule[] = [
  {
    test: /\.hbs$/,
    loader: 'handlebars-loader',
    options: {
      helperDirs: path.join(paths.view, 'helpers'),
      precompileOptions: {
        knownHelpersOnly: false,
      },
    },
  },
  {
    test: /\.(jpg|png|gif)$/,
    use: [
      {
        loader: 'url-loader',
        options: {
          name: '[name].[ext]',
        },
      },
      {
        loader: 'image-webpack-loader',
        options: {
          // bypassOnDebug: true,
          mozjpeg: imageMin.jpg,
          optipng: { enabled: false },
          pngquant: imageMin.png,
          gifsicle: imageMin.gif,
        },
      },
    ],
  },
  {
    test: /\.svg$/,
    use: 'svg-inline-loader',
  },
  {
    test: /\.(txt|md)$/,
    use: 'raw-loader',
  },
];

export const plugins: webpack.Plugin[] = [
  new webpack.DefinePlugin({
    NODE_ENV: JSON.stringify(process.env.NODE_ENV),
  }),
];

export const views = globby
  .sync([path.join(paths.view, '**', '*.hbs'), path.join('!', paths.view, '**', '_*.hbs')])
  .map((template: string) => ({
    template,
    filename: template.replace(`${paths.view}/`, '').replace(/\.hbs$/, ''),
  })) as Array<{ template: string; filename: string }>;

export default {
  viewData,
};
