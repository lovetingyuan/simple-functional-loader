const loadersMap = Object.create(null);
const Err = msg => new Error('simple-functional-loader: ' + msg);

module.exports = function simpleFunctionalLoader(...args) {
  const id = this.query.__loadercallbackid;
  return loadersMap[id].call(this, ...args);
};

module.exports.createLoader = function createLoader(processor) {
  if (typeof processor !== 'function') {
    throw Err('argument passed to createLoader must be a (es5) function.\n' + processor);
  }
  if (processor.toString().indexOf('function')) {
    throw Err('argument passed to createLoader can not be arrow function or class.\n' + processor);
  }
  const id = Math.random();
  loadersMap[id] = processor;
  return {
    loader: __filename,
    options: {
      __loadercallbackid: id
    }
  };
};
