
const webpack = require('webpack');
const memoryfs = require('memory-fs');
const { createLoader } = require('../index');
const fs = require('fs');
const resolve = p => require('path').resolve(__dirname, p);
const test = require('tape');

test('simple functional loader', function (t) {
  const compiler = webpack({
    entry: resolve('main.js'),
    module: {
      rules: [{
        test: /\.html$/,
        use: createLoader(function(source) {
          t.equal(source, fs.readFileSync(resolve('test.html'), 'utf8'));
          return `module.exports = ${JSON.stringify(source.trim())}`;
        })
      }, {
        test: /.ts$/,
        use: createLoader(function(source) {
          t.equal(source, fs.readFileSync(resolve('test.ts'), 'utf8'));
          return source.replace(/:\s*\w+? /g, ' ');
        })
      }]
    }
  });
  compiler.outputFileSystem = new memoryfs();
  compiler.run((err, stats) => {
    if (err || stats.hasErrors()) {
      t.fail(err || 'webpack has errors.');
    } else {
      t.end();
    }
  });
});
