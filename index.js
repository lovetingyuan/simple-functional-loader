const loaderUtils = require('loader-utils')
const loaderFuncsMap = Object.create(null);

module.exports = function simpleFunctionalLoader(...args) {
  const { id } = loaderUtils.getOptions(this)
  return loaderFuncsMap[id].call(this, ...args);
};

module.exports.createLoader = function createLoader(processor) {
  if (
    typeof processor !== 'function' ||
    Function.prototype.toString.call(processor).indexOf('function')
  ) {
    throw new Error('simple-functional-loader: parameter passed to "createLoader" must be an ES5 function.\n' + processor);
  }
  const id = Date.now() + '_' + Math.random();
  loaderFuncsMap[id] = processor;
  return {
    loader: __filename,
    options: { id },
    ident: 'simple-functional-loader-' + id
  };
};
