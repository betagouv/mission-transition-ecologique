const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');

module.exports = {
  output: {
    path: join(__dirname, '../../dist/apps/backend'),
  },
  devServer: {
    port: 3000,
  },
  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      optimization: process.env['NODE_ENV'] === 'production',
      outputHashing: process.env['NODE_ENV'] === 'production' ? 'all' : 'none',
    }),
  ],
};
