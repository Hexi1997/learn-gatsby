const webpack = require('webpack');

exports.onCreatePage = async ({ page, actions }) => {
  const { createPage } = actions;
  if (page.path.match(/^\/user/)) {
    page.matchPath = `/user/:menu`;
    createPage(page);
  }
  if (page.path.match(/^\/detail/)) {
    page.matchPath = `/detail/:tokenId`;
    createPage(page);
  }
};

exports.onCreateWebpackConfig = ({ actions, getConfig }) => {
  const config = getConfig();

  actions.setWebpackConfig({
    plugins: [
      new webpack.ProvidePlugin({
        Buffer: [require.resolve('buffer/'), 'Buffer']
      })
    ],
    resolve: {
      fallback: {
        Buffer: require.resolve("buffer"),
        stream: require.resolve('stream-browserify'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        url: require.resolve('url/'),
        os: require.resolve('os-browserify/browser'),
        util: require.resolve('util/'),
        assert: require.resolve('assert/')
      }
    }
  });

  if (config.mode === 'production') {
    // Turn off source maps in production
    actions.setWebpackConfig({
      devtool: false
    });
  }
};
