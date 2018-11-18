import assert from './assert';
var uidCounters = {};
export function uid() {
  var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'id';
  uidCounters[id] = uidCounters[id] || 1;
  var count = uidCounters[id]++;
  return "".concat(id, "-").concat(count);
}
export function isPowerOfTwo(n) {
  assert(typeof n === 'number', 'Input must be a number');
  return n && (n & n - 1) === 0;
}
export function isObjectEmpty(obj) {
  var isEmpty = true;

  for (var key in obj) {
    isEmpty = false;
    break;
  }

  return isEmpty;
}
//# sourceMappingURL=utils.js.map