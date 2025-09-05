const webpack = require('webpack');

module.exports = {
  webpack: {
    configure: {
      resolve: {
        fallback: {
          util: require.resolve("util/"),
          stream: require.resolve("stream-browserify"),
          buffer: require.resolve("buffer/"),
          process: require.resolve("process/browser"),
          zlib: require.resolve("browserify-zlib")
        }
      }
    },
    plugins: {
      add: [
        new webpack.ProvidePlugin({
          process: 'process/browser',
          Buffer: ['buffer', 'Buffer']
        })
      ]
    }
  }
};