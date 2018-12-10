
const webpack = require('webpack');
const memoryfs = require('memory-fs');
const { createLoader } = require('../index');
const fs = require('fs');
const path = require('path');
const resolve = p => path.resolve(__dirname, p);
const test = require('tape');

test('simple functional loader', function (t) {
  const mark = Date.now() + '_' + Math.random();
  const compiler = webpack({
    entry: resolve('main.js'),
    module: {
      rules: [{
        test: /\.html$/,
        use: createLoader(function(source) {
          t.equal(source, fs.readFileSync(resolve('test.html'), 'utf8'));
          return `module.exports = ${JSON.stringify(source.trim() + `<!--${mark}-->`)}`;
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
      const fs = compiler.outputFileSystem;
      const result = fs.readFileSync(path.join(compiler.outputPath, 'main.js'), 'utf8');
      t.equal(result.indexOf(mark) > 0, true);
      t.equal(result.indexOf('functional loader') > 0, true);
      t.end();
    }
  });
});
