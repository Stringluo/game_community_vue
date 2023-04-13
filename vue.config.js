const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 10242,
    proxy: {
      '/api': {
        //target: 'http://124.220.194.48:10241',
        target: 'http://localhost:10241',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
})
