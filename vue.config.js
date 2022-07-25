// const { defineConfig } = require('@vue/cli-service')
const webpack = require("webpack");
const CopyWebpackPlugin = require('copy-webpack-plugin')

const path = require('path')
const cesiumSource = "./node_modules/cesium/Source"
// vant
const { VantResolver } = require('unplugin-vue-components/resolvers');
const ComponentsPlugin = require('unplugin-vue-components/webpack');

module.exports = {
  publicPath: "./",
  lintOnSave: false,
  transpileDependencies: true,
  configureWebpack: {
    amd: {
      // Enable webpack-friendly use of require in Cesium
      // Tells Cesium that the version of AMD webpack uses to evaluate require statements is not compliant with the standard toUrl function
      toUrlUndefined: true
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          use: {
            loader: '@open-wc/webpack-import-meta-loader'
          }
          // include: path.resolve(__dirname, 'node_modules/cesium/Source')
        }
      ],
      unknownContextCritical: false
    },
    plugins: [
      // jQuery配置
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery'
       }),
      // vant配置
      ComponentsPlugin({
        resolvers: [VantResolver()],
      }),

      new CopyWebpackPlugin({
        patterns: [
          { from: path.join(cesiumSource, 'Workers'), to: 'Workers' },
        ]
      }),
      new CopyWebpackPlugin({
        patterns: [
          { from: path.join(cesiumSource, 'Assets'), to: 'Assets' },
        ]
      }),
      new CopyWebpackPlugin({
        patterns: [
          { from: path.join(cesiumSource, 'Widgets'), to: 'Widgets' },
        ]
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.join(cesiumSource, "ThirdParty/Workers"),
            to: "ThirdParty/Workers",
          }
        ]
      }),
      // 解决：Unable to determine Cesium base URL automatically,…efining a global variable called CESIUM_BASE_URL.
      new webpack.DefinePlugin({
        // Define relative base path in cesium for loading assets
        CESIUM_BASE_URL: JSON.stringify('./'),
      }),
    ]
  },
//   devServer: {
//     proxy: { // 配置跨域
//     '/api':{
//         target:'', //请求后台接口
//         changeOrigin:true, // 允许跨域
//         pathRewrite:{
//             '^/api' : '' // 重写请求
//         }
//     }
//   },
// }
}
