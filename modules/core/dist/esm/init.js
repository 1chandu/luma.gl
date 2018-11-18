import isBrowser from './utils/is-browser';
import { global } from './utils/globals';
import log from './utils/log';
import './webgl1';
var VERSION = typeof "6.1.0-beta.2" !== 'undefined' ? "6.1.0-beta.2" : 'untranspiled source';
var STARTUP_MESSAGE = 'set luma.log.priority=1 (or higher) to trace rendering';

if (global.luma && global.luma.VERSION !== VERSION) {
  throw new Error("luma.gl - multiple VERSIONs detected: ".concat(global.luma.VERSION, " vs ").concat(VERSION));
}

if (!global.luma) {
  if (isBrowser) {
    log.log(0, "luma.gl ".concat(VERSION, " - ").concat(STARTUP_MESSAGE))();
  }

  global.luma = global.luma || {
    VERSION: VERSION,
    version: VERSION,
    log: log,
    stats: {},
    globals: {
      modules: {},
      nodeIO: {}
    }
  };
}

export { global };
export default global.luma;
//# sourceMappingURL=init.js.map