const merge = require('webpack-merge')
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
var common = (page) => {
  return {
    entry: {
      vendor: [
        'vue',
        'cookies-js',
        'form-urlencoded',
      ],
      main: `src/page/${page}/main.js`
    },
    module: {
      loaders: [{
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          extractCSS: true,
          esModule: false
        }
      }, {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      }, {
        test: /\.css$/,
        loader: 'css-loader',
        options: {
          minimize: true
        }
      }, {
        test: /\.(png|jpg|gif|svg)$/,
        loader: `file-loader?name=img/[name]-[hash].[ext]`
      }, {
        test: /\.(wav|mp3)$/,
        loader: `file-loader?name=media/[name]-[hash].[ext]`
      }, {
        test: /\.html$/,
        loader: 'html-loader'
      }]
    },
    resolve: {
      alias: {
        'oaxios': path.join(__dirname, '/node_modules/axios/index.js'),
        'axios': path.join(__dirname, '/src/common/lib/vkaxios.js'),
        'src': path.join(__dirname, '/src')
      }
    },
    plugins: [
      //去除重复的css
      new OptimizeCSSPlugin({
        cssProcessorOptions: {
          safe: false
        }
      }),
      new HtmlWebpackPlugin({
        template: './src/index.html',
        filename: 'index.html'
      }),
      /**
       使用HashedModuleIdsPlugin 保证对库代码进行散列的时候，
       如果库代码没有进行更新，库代码不变，保证hash值不变
       */
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
      }),
      /**
       * 使用[hash]会使用相同的哈希散列值，不会针对每一个chunk进行哈希散列。无法对vendor进行有效的长期缓存
       * 对output使用chunkhash进行哈希值计算，加上runtime manifest的单独提取，能够保证 vendor库没有更新的情况下，vendor的hash不变
       * 而减少一次请求，从缓存中读取，最多就是浏览器刷新的情况下多一个304请求。
       * */
      // new webpack.optimize.CommonsChunkPlugin({
      //   name: 'vendor',
      // }),

      //将各个模块的runtime和mainifest单独提取出来，依赖联系直接的js单独提取出来
      // new webpack.optimize.CommonsChunkPlugin({
      //   name: 'manifest',
      //   chunks: ['vendor']
      // }),
    ]
  }
}

//开发环境
var devConfig = (page) => {
  return {
    output: {
      path: path.join(__dirname, `/output/${page}`),
      filename: 'js/[name].js',
      publicPath: `/${page}/`
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: '"development"'
        }
      }),
      // 去除hash，用于开发时不会出现多个文件
      new ExtractTextPlugin({
        filename: 'css/style.css'
      })
    ]
  }
}

//测试环境
var testConfig = (page) => {
  return {
    output: {
      path: path.join(__dirname, `/dist/learning-effect/${page}`),
      filename: 'js/[name]-[hash].js',
      publicPath: `/learning-effect/${page}/`
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: '"production"'
        }
      }),
      // 去除hash，用于开发时不会出现多个文件
      new ExtractTextPlugin({
        filename: 'css/style-[hash].css'
      }),
      //压缩js
      new webpack.optimize.UglifyJsPlugin()
    ]
  }
}

//线上环境
var propConfig = (page) => {
  return {
    output: {
      path: path.join(__dirname, `/output/${page}`),
      filename: 'js/[name]-[hash].js',
      publicPath: `//s.vipkidstatic.com/fe-static/mobile/learning-effect/${page}/`
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: '"production"'
        }
      }),
      // 去除hash，用于开发时不会出现多个文件
      new ExtractTextPlugin({
        filename: 'css/style-[hash].css'
      }),
      new webpack.optimize.UglifyJsPlugin()
    ]
  }
}

module.exports = function (env) {
  let currentConfig = {}
  if (env == "dev") {
    currentConfig = devConfig
  }
  if (env == "test") {
    currentConfig = testConfig
  }
  if (env == "prod") {
    currentConfig = propConfig
  }
  const configs = []
  process.env.npm_package_pages.split(",").forEach(
    (page) => {
      configs.push(merge(common(page), currentConfig(page)))
    }
  )
  return configs
}
