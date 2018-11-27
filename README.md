# simple-functional-loader
use function as webpak loader option

## install
```bash
npm install simple-functional-loader --save-dev
```

## usage
```
// webpack.config.js
const { createLoader } = require('simple-functional-loader')
module.exports = {
  //...
  module: {
    rules: [
      {
        test: /.html$/,
        use: createLoader(function(source) { // must be an es5 function, can not be arrow function or class.
          return processSource(source)
        })
      }
    ]
  }
}
```

## license
MIT