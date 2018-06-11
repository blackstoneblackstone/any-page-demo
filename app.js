//本地开发测试专用
const fs = require('fs')
const path = require('path')
//获取所有的page
const webpack_config = require('./webpack.config.js')('dev')
const express = require('express')
const webpack = require('webpack')
const proxy = require('http-proxy-middleware')
const port = 9999
const browserSyncState = true
const browserSync = require('browser-sync').create()
const reload = browserSync.reload
const app = express()
const compiler = webpack(webpack_config)

compiler.watch({
  aggregateTimeout: 100
}, function (err, stats) {
  if (browserSyncState) {
    reload();
  }
})

app.use(function (req, res, next) {
  console.log('%s %s - %s', new Date().toISOString(), req.method, req.url)
  return next()
})
//配置哪个环境
const env = "a15-"
//服务器代理转发,一定记得配置本机host 啊啊啊
const proxyTable = {
  '/rest/wechat': {
    target: `http://${env}activity.XXX.com.cn`,
    changeOrigin: true,
    logLevel: 'debug',
    pathRewrite: {
      '^/rest/wechat': '/'
    }
  }
}

Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = {
      target: options,
    }
  }
  app.use(proxy(context, options))
})

// static file service
app.use(express.static(path.join(__dirname, "./output")))
app.listen(port, function () {
  console.log([
    'Listening on port ' + port + ',',
  ].join('\n'))
})

if (browserSyncState) {
  browserSync.init({
    host: "localhost",
    open: "external",
    port: 8092,
    proxy: {
      target: `localhost:${port}/`
    }
  });
}
