const loaderUtils = require('loader-utils')
const name = require('./package.json').name

module.exports = function simpleFunctionalLoader(...args) {
  const { processor } = loaderUtils.getOptions(this)
  return processor.call(this, ...args)
}

module.exports.createLoader = function createLoader(processor) {
  if (
    typeof processor !== 'function' ||
    Function.prototype.toString.call(processor).indexOf('function')
  ) {
    throw new Error(name + ': parameter passed to "createLoader" must be an ES5 function.\n' + processor)
  }
  return {
    loader: __filename,
    options: { processor },
    ident: name + '-' + Math.random()
  }
}
