const path = require('path')
const webpack = require('webpack')
const offlinePlugin = require('offline-plugin')
const cleanWebpackPlugin = require('clean-webpack-plugin')
const htmlWebpackPlugin = require('html-webpack-plugin')
const copyWebpackPlugin = require('copy-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'build.js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            css: ExtractTextPlugin.extract({
              use: ['css-loader']
            }),
            less: ExtractTextPlugin.extract({
              use: ['css-loader', 'less-loader']
            })
          }
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  devServer: {
    host: '0.0.0.0',
    historyApiFallback: true,
    noInfo: true
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map'
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  module.exports.output = {
    path: path.resolve(__dirname, './docs'),
    filename: '[name].[hash].js'
  }
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.optimize.ModuleConcatenationPlugin(),
    new ExtractTextPlugin({
      filename: '[name].[contenthash:8].css',
      allChunks: true
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    new htmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.tpl',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      },
      chunks: ['main'],
      chunksSortMode: 'dependency'
    }),
    new cleanWebpackPlugin(['docs']),
    new copyWebpackPlugin([
      { from: 'favicons' }
    ]),
    new offlinePlugin({
      Caches: {
        main: [
          'index.html',
          '**.js',
          '**.css'
        ]
      },
      ServiceWorker: {
        events: true
      },
      AppCache: null
    })
  ])
}
