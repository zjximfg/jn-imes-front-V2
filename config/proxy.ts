/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
export default {
  dev: {
    '/api/company': {
      target: 'http://localhost:9001',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
    '/api/system': {
      // target: 'http://182.92.194.48:9002',
      target: 'http://localhost:9002',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
    '/api/device': {
      // target: 'http://182.92.194.48:9003',
      target: 'http://localhost:9003',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
    '/api/project': {
      // target: 'http://182.92.194.48:9004',
      target: 'http://localhost:9004',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
    '/api/warehouse': {
      // target: 'http://182.92.194.48:9005',
      target: 'http://localhost:9005',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
    // '/api/socket': {
    //   // target: 'http://182.92.194.48:9002',
    //   target: 'http://localhost:10001',
    //   changeOrigin: true,
    //   pathRewrite: { '^/api': '' },
    // },
  },
  test: {
    '/api/': {
      target: 'https://preview.pro.ant.design',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  pre: {
    '/api/': {
      target: 'your pre url',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
};


// export const deviceWebsocketUrl = "http://localhost:10001";
