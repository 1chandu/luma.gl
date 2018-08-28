"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isWebGL = isWebGL;
exports.isWebGL2 = isWebGL2;
exports.assertWebGLContext = assertWebGLContext;
exports.assertWebGL2Context = assertWebGL2Context;
exports.setContextDefaults = setContextDefaults;
exports.createGLContext = createGLContext;
exports.destroyGLContext = destroyGLContext;
exports.resizeGLContext = resizeGLContext;
exports.pollGLContext = pollGLContext;
exports.ERR_WEBGL2 = exports.ERR_WEBGL = exports.ERR_CONTEXT = void 0;

var _webglUtils = require("../webgl-utils");

var _createHeadlessContext = require("./create-headless-context");

var _createCanvas = require("./create-canvas");

var _createBrowserContext = require("./create-browser-context");

var _trackContextState = _interopRequireDefault(require("./track-context-state"));

var _debugContext = require("./debug-context");

var _contextLimits = require("./context-limits");

var _queryManager = _interopRequireDefault(require("../webgl-utils/query-manager"));

var _utils = require("../utils");

var _assert = _interopRequireDefault(require("../utils/assert"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GL_ARRAY_BUFFER = 0x8892;
var GL_TEXTURE_BINDING_3D = 0x806A;
var ERR_CONTEXT = 'Invalid WebGLRenderingContext';
exports.ERR_CONTEXT = ERR_CONTEXT;
var ERR_WEBGL = ERR_CONTEXT;
exports.ERR_WEBGL = ERR_WEBGL;
var ERR_WEBGL2 = 'Requires WebGL2';
exports.ERR_WEBGL2 = ERR_WEBGL2;

function isWebGL(gl) {
  return Boolean(gl && (gl instanceof _webglUtils.WebGLRenderingContext || 34962 === GL_ARRAY_BUFFER));
}

function isWebGL2(gl) {
  return Boolean(gl && (gl instanceof _webglUtils.WebGL2RenderingContext || 32874 === GL_TEXTURE_BINDING_3D));
}

function assertWebGLContext(gl) {
  (0, _assert.default)(isWebGL(gl), ERR_CONTEXT);
}

function assertWebGL2Context(gl) {
  (0, _assert.default)(isWebGL2(gl), ERR_WEBGL2);
}

var contextDefaults = {
  webgl2: true,
  webgl1: true,
  throwOnFailure: true,
  manageState: true,
  canvas: null,
  debug: false,
  width: 800,
  height: 600
};

function setContextDefaults() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  Object.assign(contextDefaults, {
    width: 1,
    height: 1
  }, opts);
}

function createGLContext() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  opts = Object.assign({}, contextDefaults, opts);
  var _opts = opts,
      canvas = _opts.canvas,
      width = _opts.width,
      height = _opts.height,
      throwOnError = _opts.throwOnError,
      manageState = _opts.manageState,
      debug = _opts.debug;

  function onError(message) {
    if (throwOnError) {
      throw new Error(message);
    }

    return null;
  }

  var gl;

  if (_utils.isBrowser) {
    var targetCanvas = (0, _createCanvas.getCanvas)({
      canvas: canvas,
      width: width,
      height: height,
      onError: onError
    });
    gl = (0, _createBrowserContext.createBrowserContext)({
      canvas: targetCanvas,
      opts: opts
    });
  } else {
    gl = (0, _createHeadlessContext.createHeadlessContext)({
      width: width,
      height: height,
      opts: opts,
      onError: onError
    });
  }

  if (!gl) {
    return null;
  }

  if (manageState) {
    (0, _trackContextState.default)(gl, {
      copyState: false,
      log: function log() {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return _utils.log.log.apply(_utils.log, [1].concat(args))();
      }
    });
  }

  if (_utils.isBrowser && debug) {
    gl = (0, _debugContext.makeDebugContext)(gl, {
      debug: debug
    });
    _utils.log.priority = Math.max(_utils.log.priority, 1);
  }

  logInfo(gl);
  return gl;
}

function destroyGLContext(gl) {
  var ext = gl.getExtension('STACKGL_destroy_context');

  if (ext) {
    ext.destroy();
  }
}

function resizeGLContext(gl) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (gl.canvas) {
    var devicePixelRatio = opts.useDevicePixels ? window.devicePixelRatio || 1 : 1;
    var width = "width" in opts ? opts.width : gl.canvas.clientWidth;
    var height = "height" in opts ? opts.height : gl.canvas.clientHeight;
    gl.canvas.width = width * devicePixelRatio;
    gl.canvas.height = height * devicePixelRatio;
    return;
  }

  var ext = gl.getExtension('STACKGL_resize_drawingbuffer');

  if (ext && "width" in opts && "height" in opts) {
    ext.resize(opts.width, opts.height);
  }
}

function pollGLContext(gl) {
  _queryManager.default.poll(gl);
}

function logInfo(gl) {
  var webGL = isWebGL2(gl) ? 'WebGL2' : 'WebGL1';
  var info = (0, _contextLimits.glGetDebugInfo)(gl);
  var driver = info ? "(".concat(info.vendor, ",").concat(info.renderer, ")") : '';
  var debug = gl.debug ? ' debug' : '';

  _utils.log.once(0, "".concat(webGL).concat(debug, " context ").concat(driver))();
}
//# sourceMappingURL=context.js.map