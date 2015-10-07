module.exports = function(obj, name, value) {
  Object.defineProperty(obj, name, {
    value: value,
    writable: false,
    enumerable: true,
    configurable: false,
  });
}
