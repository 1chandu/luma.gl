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
const GL_ARRAY_BUFFER = 0x8892;
const GL_TEXTURE_BINDING_3D = 0x806A;
export const ERR_CONTEXT = 'Invalid WebGLRenderingContext';
export const ERR_WEBGL = ERR_CONTEXT;
export const ERR_WEBGL2 = 'Requires WebGL2';
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
const contextDefaults = {
  webgl2: true,
  webgl1: true,
  throwOnFailure: true,
  manageState: true,
  canvas: null,
  debug: false,
  width: 800,
  height: 600
};
export function setContextDefaults(opts = {}) {
  Object.assign(contextDefaults, {
    width: 1,
    height: 1
  }, opts);
}
export function createGLContext(opts = {}) {
  opts = Object.assign({}, contextDefaults, opts);
  const _opts = opts,
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

  let gl;

  if (isBrowser) {
    const targetCanvas = getCanvas({
      canvas,
      width,
      height,
      onError
    });
    gl = createBrowserContext({
      canvas: targetCanvas,
      opts
    });
  } else {
    gl = createHeadlessContext({
      width,
      height,
      opts,
      onError
    });
  }

  if (!gl) {
    return null;
  }

  if (manageState) {
    trackContextState(gl, {
      copyState: false,
      log: (...args) => _log.log(1, ...args)()
    });
  }

  if (isBrowser && debug) {
    gl = makeDebugContext(gl, {
      debug
    });
    _log.priority = Math.max(_log.priority, 1);
  }

  logInfo(gl);
  return gl;
}
export function destroyGLContext(gl) {
  const ext = gl.getExtension('STACKGL_destroy_context');

  if (ext) {
    ext.destroy();
  }
}
export function resizeGLContext(gl, opts = {}) {
  if (gl.canvas) {
    const devicePixelRatio = opts.useDevicePixels ? window.devicePixelRatio || 1 : 1;
    const width = `width` in opts ? opts.width : gl.canvas.clientWidth;
    const height = `height` in opts ? opts.height : gl.canvas.clientHeight;
    gl.canvas.width = width * devicePixelRatio;
    gl.canvas.height = height * devicePixelRatio;
    return;
  }

  const ext = gl.getExtension('STACKGL_resize_drawingbuffer');

  if (ext && `width` in opts && `height` in opts) {
    ext.resize(opts.width, opts.height);
  }
}
export function pollGLContext(gl) {
  queryManager.poll(gl);
}

function logInfo(gl) {
  const webGL = isWebGL2(gl) ? 'WebGL2' : 'WebGL1';
  const info = glGetDebugInfo(gl);
  const driver = info ? `(${info.vendor},${info.renderer})` : '';
  const debug = gl.debug ? ' debug' : '';

  _log.once(0, `${webGL}${debug} context ${driver}`)();
}
//# sourceMappingURL=context.js.map