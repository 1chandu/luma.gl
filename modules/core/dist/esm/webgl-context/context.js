import { WebGLRenderingContext, WebGL2RenderingContext } from '../webgl-utils';
import { createHeadlessContext } from './create-headless-context';
import { getCanvas } from './create-canvas';
import { createBrowserContext } from './create-browser-context';
import trackContextState from './track-context-state';
import { makeDebugContext } from './debug-context';
import { glGetDebugInfo } from './context-limits';
import queryManager from '../webgl-utils/query-manager';
import { log as _log, isBrowser } from '../utils';
import assert from '../utils/assert';
var GL_ARRAY_BUFFER = 0x8892;
var GL_TEXTURE_BINDING_3D = 0x806A;
export var ERR_CONTEXT = 'Invalid WebGLRenderingContext';
export var ERR_WEBGL = ERR_CONTEXT;
export var ERR_WEBGL2 = 'Requires WebGL2';
export function isWebGL(gl) {
  return Boolean(gl && (gl instanceof WebGLRenderingContext || 34962 === GL_ARRAY_BUFFER));
}
export function isWebGL2(gl) {
  return Boolean(gl && (gl instanceof WebGL2RenderingContext || 32874 === GL_TEXTURE_BINDING_3D));
}
export function assertWebGLContext(gl) {
  assert(isWebGL(gl), ERR_CONTEXT);
}
export function assertWebGL2Context(gl) {
  assert(isWebGL2(gl), ERR_WEBGL2);
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
export function setContextDefaults() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  Object.assign(contextDefaults, {
    width: 1,
    height: 1
  }, opts);
}
export function createGLContext() {
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

  if (isBrowser) {
    var targetCanvas = getCanvas({
      canvas: canvas,
      width: width,
      height: height,
      onError: onError
    });
    gl = createBrowserContext({
      canvas: targetCanvas,
      opts: opts
    });
  } else {
    gl = createHeadlessContext({
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
    trackContextState(gl, {
      copyState: false,
      log: function log() {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return _log.log.apply(_log, [1].concat(args))();
      }
    });
  }

  if (isBrowser && debug) {
    gl = makeDebugContext(gl, {
      debug: debug
    });
    _log.priority = Math.max(_log.priority, 1);
  }

  logInfo(gl);
  return gl;
}
export function destroyGLContext(gl) {
  var ext = gl.getExtension('STACKGL_destroy_context');

  if (ext) {
    ext.destroy();
  }
}
export function resizeGLContext(gl) {
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
export function pollGLContext(gl) {
  queryManager.poll(gl);
}

function logInfo(gl) {
  var webGL = isWebGL2(gl) ? 'WebGL2' : 'WebGL1';
  var info = glGetDebugInfo(gl);
  var driver = info ? "(".concat(info.vendor, ",").concat(info.renderer, ")") : '';
  var debug = gl.debug ? ' debug' : '';

  _log.once(0, "".concat(webGL).concat(debug, " context ").concat(driver))();
}
//# sourceMappingURL=context.js.map