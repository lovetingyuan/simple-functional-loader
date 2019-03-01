
const webpack = require('webpack');
const memoryfs = require('memory-fs');
const { createLoader } = require('../index');
const fs = require('fs');
const path = require('path');
const resolve = p => path.resolve(__dirname, p);
const test = require('tape');

test('simple functional loader', function (t) {
  const markHTML = Date.now() + '_' + Math.random();
  const markTs = Date.now() + '_' + Math.random();
  const simple = function(source, map) {
    t.equal(source, fs.readFileSync(resolve('test.ts'), 'utf8'));
    t.equal('resource' in this, true);
    t.equal(this.webpack, true);
    t.equal(this.loaderIndex, 1);
    this.callback(null, source.replace(/:\s*\w+? /g, ' ') + `/*${markTs}*/`, map, { foo: 'bar' })
  }
  const compiler = webpack({
    entry: resolve('main.js'),
    module: {
      rules: [{
        test: /\.html$/,
        use: createLoader(function(source) {
          t.equal(source, fs.readFileSync(resolve('test.html'), 'utf8'));
          t.equal('resourceQuery' in this, true);
          t.equal(this.webpack, true);
          t.equal(this.loaderIndex, 0);
          return `module.exports = ${JSON.stringify(source.trim() + `<!--${markHTML}-->`)}`;
        })
      }, {
        test: /.ts$/,
        use: [createLoader(function(source, map, meta) {
          t.equal(source.indexOf(markTs) > 0, true);
          t.equal('resourcePath' in this, true);
          t.equal(this.webpack, true);
          t.equal(this.loaderIndex, 0);
          t.equal(meta.foo, 'bar');
          return source;
        }), createLoader(simple)]
      }]
    }
  });
  compiler.outputFileSystem = new memoryfs();
  compiler.run((err, stats) => {
    if (err || stats.hasErrors()) {
      t.fail(err || stats.compilation.errors);
    } else {
      const fs = compiler.outputFileSystem;
      const result = fs.readFileSync(path.join(compiler.outputPath, 'main.js'), 'utf8');
      t.equal(result.indexOf(markHTML) > 0, true);
      t.equal(result.indexOf('functional loader') > 0, true);
      t.end();
    }
  });
});

test('show throw error', t => {
  const errorTest = /simple-functional-loader: parameter passed to "createLoader" must be an ES5 function/
  t.throws(() => {
    createLoader(() => {
      t.fail('should not call this')
    })
  }, errorTest)
  t.throws(() => {
    createLoader(class {
      constructor() {
        t.fail('should not call this')
      }
    })
  }, errorTest)
  t.throws(() => {
    createLoader(this)
  }, errorTest)
  t.end()
})
