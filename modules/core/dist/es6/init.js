import isBrowser from './utils/is-browser';
import { global } from './utils/globals';
import log from './utils/log';
import './webgl1';
const VERSION = typeof "6.1.0-beta.2" !== 'undefined' ? "6.1.0-beta.2" : 'untranspiled source';
const STARTUP_MESSAGE = 'set luma.log.priority=1 (or higher) to trace rendering';

if (global.luma && global.luma.VERSION !== VERSION) {
  throw new Error(`luma.gl - multiple VERSIONs detected: ${global.luma.VERSION} vs ${VERSION}`);
}

if (!global.luma) {
  if (isBrowser) {
    log.log(0, `luma.gl ${VERSION} - ${STARTUP_MESSAGE}`)();
  }

  global.luma = global.luma || {
    VERSION,
    version: VERSION,
    log,
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