const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackHotPlugin = require('html-webpack-hot-plugin')

let htmlHotPlugin = new HtmlWebpackHotPlugin({ hot: true });
let mode = process.argv[process.argv.indexOf('--mode') + 1];
console.log(`webpack mode is ${process.argv[process.argv.indexOf('--mode') + 1]}`)
if (mode === 'development') {
  htmlHotPlugin = new HtmlWebpackHotPlugin({ hot: true });
}
const commonConfig = {
  mode: mode,
  devtool: mode === 'production' ? "" : "source-map",
  node: {
    __dirname: false
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  devServer: {
    writeToDisk: true,
    before(app, server) {
      if (mode === 'development') {
        htmlHotPlugin.setDevServer(server)
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        enforce: 'pre',
        loader: 'tslint-loader',
        options: {
          typeCheck: true,
          emitErrors: true
        }
      },
      {
        test: /\.tsx?$/,
        loader: ['babel-loader', 'ts-loader']
      },
      {
        test: /\.js$/,
        enforce: 'pre',
        loader: 'standard-loader',
        options: {
          typeCheck: true,
          emitErrors: true
        }
      },
      {
        test: /\.jsx?$/,
        loader: ['babel-loader']
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          '@teamsupercell/typings-for-css-modules-loader',
          { loader: 'css-loader', options: { modules:true, sourceMap: true } },
          "less-loader"
        ]
      },
    ]
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.jsx', '.json', '.gif', '.png', '.jpg', '.jpeg', '.svg', '.less', '.css']
  }
}

module.exports = [
  Object.assign(
    {
      target: 'electron-main',
      entry: { main: './src/main.ts' },
      plugins: [
        mode === 'production' ? new CleanWebpackPlugin() : false,
      ].filter(Boolean)
    },
    commonConfig),

  Object.assign(
    {
      target: 'electron-renderer',
      entry: { gui: './src/gui.tsx' },
      plugins: [
        new HtmlWebpackPlugin({
          hash: true,
          filename: 'index.html',
          title: 'NosCoreLegend',
        }),
        mode === 'development' ? htmlHotPlugin : false].filter(Boolean)
    },
    commonConfig)
];