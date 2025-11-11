/* eslint-disable no-console */
const { WEBPACK_ELECTRON_PORT } = require('../config');
const chalk = require('chalk');
const webpack = require('webpack');
const merge = require('webpack-merge');
const middleware = require('webpack-dev-middleware');
const express = require('express');
const app = express();

console.log(
  chalk.magenta(`Compiling ${chalk.underline('main')} and ${chalk.underline('render')}, this will take a while.`)
);

let [mainConfig, renderConfig] = require('../webpack.electron.config.js');

renderConfig = merge(renderConfig, {
  entry: { ui: ['webpack-hot-middleware/client'] },
  plugins: [new webpack.HotModuleReplacementPlugin()],
  resolve: {
    alias: { 'react-dom': '@hot-loader/react-dom' },
    symlinks: false,
  },

});

const mainCompiler = webpack(mainConfig);
const mainInstance = middleware(mainCompiler, {
  logLevel: 'warn',
  writeToDisk: filename => {
    // console.log(`Writing '${filename}'.`);
    return true;
  },
});

const renderCompiler = webpack(renderConfig);
const renderInstance = middleware(renderCompiler, {
  logLevel: 'warn',
  publicPath: '/',
});
app.use(require('webpack-hot-middleware')(renderCompiler));
app.use(renderInstance);
app.use(express.static('dist/electron/static'));

app.listen(WEBPACK_ELECTRON_PORT, () => {
  console.log(chalk.yellow.bold(`Renderer listening on port ${WEBPACK_ELECTRON_PORT} (still compiling)`));
});

mainInstance.waitUntilValid(() => {
  console.log(chalk.green(`${chalk.underline('main')} compilation complete.`));
});

renderInstance.waitUntilValid(() => {
  console.log(chalk.green(`${chalk.underline('render')} compilation complete.`));
  console.log('');
  console.log(chalk.cyan.bold('===================================='));
  console.log(chalk.cyan.bold('  Dev server ready!'));
  console.log(chalk.cyan.bold('===================================='));
  console.log('');
  console.log(chalk.yellow('To start Electron, run in a new terminal:'));
  console.log('');
  console.log(chalk.green('  yarn electron'));
  console.log('');
  console.log(chalk.gray('or directly:'));
  console.log('');
  console.log(chalk.green('  electron ./dist/electron/webpack/main.js'));
  console.log('');
});

process.on('SIGINT', function() {
  console.log('\nShutting down dev server...');
  process.exit();
});
/* eslint-enable no-console */
