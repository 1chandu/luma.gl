"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "global", {
  enumerable: true,
  get: function get() {
    return _globals.global;
  }
});
exports.default = void 0;

var _isBrowser = _interopRequireDefault(require("./utils/is-browser"));

var _globals = require("./utils/globals");

var _log = _interopRequireDefault(require("./utils/log"));

require("./webgl1");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var VERSION = typeof "6.1.0-beta.2" !== 'undefined' ? "6.1.0-beta.2" : 'untranspiled source';
var STARTUP_MESSAGE = 'set luma.log.priority=1 (or higher) to trace rendering';

if (_globals.global.luma && _globals.global.luma.VERSION !== VERSION) {
  throw new Error("luma.gl - multiple VERSIONs detected: ".concat(_globals.global.luma.VERSION, " vs ").concat(VERSION));
}

if (!_globals.global.luma) {
  if (_isBrowser.default) {
    _log.default.log(0, "luma.gl ".concat(VERSION, " - ").concat(STARTUP_MESSAGE))();
  }

  _globals.global.luma = _globals.global.luma || {
    VERSION: VERSION,
    version: VERSION,
    log: _log.default,
    stats: {},
    globals: {
      modules: {},
      nodeIO: {}
    }
  };
}

var _default = _globals.global.luma;
exports.default = _default;
//# sourceMappingURL=init.js.map