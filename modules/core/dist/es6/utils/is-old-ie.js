import { window } from './globals';
export default function isOldIE(opts = {}) {
  const navigator = window.navigator || {};
  const userAgent = opts.userAgent || navigator.userAgent || '';
  const isMSIE = userAgent.indexOf('MSIE ') !== -1;
  const isTrident = userAgent.indexOf('Trident/') !== -1;
  return isMSIE || isTrident;
}
//# sourceMappingURL=is-old-ie.js.map