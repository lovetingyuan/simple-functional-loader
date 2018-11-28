const loadersMap = Object.create(null);
const Err = msg => new Error('simple-functional-loader: ' + msg);
const LOADER_CALLBACK = '__loadercallbackid__';

module.exports = function simpleFunctionalLoader(...args) {
  const id = this.query[LOADER_CALLBACK];
  return loadersMap[id].call(this, ...args);
};

module.exports.createLoader = function createLoader(processor) {
  if (typeof processor !== 'function') {
    throw Err('Parameter passed to "createLoader" must be a (es5) function.\n' + processor);
  }
  if (processor.toString().indexOf('function')) {
    throw Err('Parameter passed to "createLoader" can not be arrow function or class.\n' + processor);
  }
  const id = Date.now() + '_' + Math.random();
  loadersMap[id] = processor;
  return {
    loader: __filename,
    options: {
      [LOADER_CALLBACK]: id
    }
  };
};
