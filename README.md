# simple-functional-loader
use function as webpak loader option

[![npm version](https://img.shields.io/npm/v/simple-functional-loader.svg)](https://www.npmjs.com/package/simple-functional-loader)
[![Build Status](https://travis-ci.org/lovetingyuan/simple-functional-loader.svg?branch=master)](https://travis-ci.org/lovetingyuan/simple-functional-loader)

## install
```bash
npm install simple-functional-loader --save-dev
```

## usage
```javascript
// webpack.config.js
const { createLoader } = require('simple-functional-loader')
module.exports = {
  //...
  module: {
    rules: [
      {
        test: /\.html$/,
        use: createLoader(function(source, map) { // must be an "ES5" function!
          // use "this" as loaderContext
          return processHTML(source, map)
        })
      }
    ]
  }
}
```

## license
MIT
