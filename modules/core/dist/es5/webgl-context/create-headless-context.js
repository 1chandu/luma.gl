"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createHeadlessContext = createHeadlessContext;

var _webglTypes = require("../webgl-utils/webgl-types");

var ERR_HEADLESSGL_NOT_AVAILABLE = 'Failed to create WebGL context in Node.js, headless gl not available';
var ERR_HEADLESSGL_FAILED = 'Failed to create WebGL context in Node.js, headless gl returned null';

function createHeadlessContext(_ref) {
  var width = _ref.width,
      height = _ref.height,
      opts = _ref.opts,
      onError = _ref.onError;
  var webgl1 = opts.webgl1,
      webgl2 = opts.webgl2;

  if (webgl2 && !webgl1) {
    return onError('headless-gl does not support WebGL2');
  }

  if (!_webglTypes.headlessGL) {
    return onError(ERR_HEADLESSGL_NOT_AVAILABLE);
  }

  var gl = (0, _webglTypes.headlessGL)(width, height, opts);

  if (!gl) {
    return onError(ERR_HEADLESSGL_FAILED);
  }

  return gl;
}
//# sourceMappingURL=create-headless-context.js.map