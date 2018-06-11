# 概述
> webpack打包多页面项目Demo，使用webpack多target的方式，来达到分项目打包问题。

- 全局依赖：

  > 5.0 < node < 6.0  &&  npm > 5.0  && nodemon > 1.9
  
- 项目初始化

  安装依赖：npm run init

- 启动项目

  新增活动的时候，需要在package.json里添加目录名，多个以`,`隔开。
  `"pages": "page1,page2"` 
  
  开发模式启动：`npm run dev`
  测试环境：`npm run test`
  pre和线上环境：`npm run release`

- 更新依赖

  `npm run update`

# Q&A

