var _GL_PARAMETER_DEFAULT, _GL_PARAMETER_SETTERS, _GL_PARAMETER_GETTERS;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { isWebGL2 } from '../webgl-utils';
import assert from '../utils/assert';
export var GL_PARAMETER_DEFAULTS = (_GL_PARAMETER_DEFAULT = {}, _defineProperty(_GL_PARAMETER_DEFAULT, 3042, false), _defineProperty(_GL_PARAMETER_DEFAULT, 32773, new Float32Array([0, 0, 0, 0])), _defineProperty(_GL_PARAMETER_DEFAULT, 32777, 32774), _defineProperty(_GL_PARAMETER_DEFAULT, 34877, 32774), _defineProperty(_GL_PARAMETER_DEFAULT, 32969, 1), _defineProperty(_GL_PARAMETER_DEFAULT, 32968, 0), _defineProperty(_GL_PARAMETER_DEFAULT, 32971, 1), _defineProperty(_GL_PARAMETER_DEFAULT, 32970, 0), _defineProperty(_GL_PARAMETER_DEFAULT, 3106, new Float32Array([0, 0, 0, 0])), _defineProperty(_GL_PARAMETER_DEFAULT, 3107, [true, true, true, true]), _defineProperty(_GL_PARAMETER_DEFAULT, 2884, false), _defineProperty(_GL_PARAMETER_DEFAULT, 2885, 1029), _defineProperty(_GL_PARAMETER_DEFAULT, 2929, false), _defineProperty(_GL_PARAMETER_DEFAULT, 2931, 1), _defineProperty(_GL_PARAMETER_DEFAULT, 2932, 513), _defineProperty(_GL_PARAMETER_DEFAULT, 2928, new Float32Array([0, 1])), _defineProperty(_GL_PARAMETER_DEFAULT, 2930, true), _defineProperty(_GL_PARAMETER_DEFAULT, 3024, true), _defineProperty(_GL_PARAMETER_DEFAULT, 36006, null), _defineProperty(_GL_PARAMETER_DEFAULT, 2886, 2305), _defineProperty(_GL_PARAMETER_DEFAULT, 33170, 4352), _defineProperty(_GL_PARAMETER_DEFAULT, 2849, 1), _defineProperty(_GL_PARAMETER_DEFAULT, 32823, false), _defineProperty(_GL_PARAMETER_DEFAULT, 32824, 0), _defineProperty(_GL_PARAMETER_DEFAULT, 10752, 0), _defineProperty(_GL_PARAMETER_DEFAULT, 32938, 1.0), _defineProperty(_GL_PARAMETER_DEFAULT, 32939, false), _defineProperty(_GL_PARAMETER_DEFAULT, 3089, false), _defineProperty(_GL_PARAMETER_DEFAULT, 3088, new Int32Array([0, 0, 1024, 1024])), _defineProperty(_GL_PARAMETER_DEFAULT, 2960, false), _defineProperty(_GL_PARAMETER_DEFAULT, 2961, 0), _defineProperty(_GL_PARAMETER_DEFAULT, 2968, 0xFFFFFFFF), _defineProperty(_GL_PARAMETER_DEFAULT, 36005, 0xFFFFFFFF), _defineProperty(_GL_PARAMETER_DEFAULT, 2962, 519), _defineProperty(_GL_PARAMETER_DEFAULT, 2967, 0), _defineProperty(_GL_PARAMETER_DEFAULT, 2963, 0xFFFFFFFF), _defineProperty(_GL_PARAMETER_DEFAULT, 34816, 519), _defineProperty(_GL_PARAMETER_DEFAULT, 36003, 0), _defineProperty(_GL_PARAMETER_DEFAULT, 36004, 0xFFFFFFFF), _defineProperty(_GL_PARAMETER_DEFAULT, 2964, 7680), _defineProperty(_GL_PARAMETER_DEFAULT, 2965, 7680), _defineProperty(_GL_PARAMETER_DEFAULT, 2966, 7680), _defineProperty(_GL_PARAMETER_DEFAULT, 34817, 7680), _defineProperty(_GL_PARAMETER_DEFAULT, 34818, 7680), _defineProperty(_GL_PARAMETER_DEFAULT, 34819, 7680), _defineProperty(_GL_PARAMETER_DEFAULT, 2978, new Int32Array([0, 0, 1024, 1024])), _defineProperty(_GL_PARAMETER_DEFAULT, 3333, 4), _defineProperty(_GL_PARAMETER_DEFAULT, 3317, 4), _defineProperty(_GL_PARAMETER_DEFAULT, 37440, false), _defineProperty(_GL_PARAMETER_DEFAULT, 37441, false), _defineProperty(_GL_PARAMETER_DEFAULT, 37443, 37444), _defineProperty(_GL_PARAMETER_DEFAULT, 35723, 4352), _defineProperty(_GL_PARAMETER_DEFAULT, 36010, null), _defineProperty(_GL_PARAMETER_DEFAULT, 35977, false), _defineProperty(_GL_PARAMETER_DEFAULT, 3330, 0), _defineProperty(_GL_PARAMETER_DEFAULT, 3332, 0), _defineProperty(_GL_PARAMETER_DEFAULT, 3331, 0), _defineProperty(_GL_PARAMETER_DEFAULT, 3314, 0), _defineProperty(_GL_PARAMETER_DEFAULT, 32878, 0), _defineProperty(_GL_PARAMETER_DEFAULT, 3316, 0), _defineProperty(_GL_PARAMETER_DEFAULT, 3315, 0), _defineProperty(_GL_PARAMETER_DEFAULT, 32877, 0), _GL_PARAMETER_DEFAULT);

var enable = function enable(gl, value, key) {
  return value ? gl.enable(key) : gl.disable(key);
};

var hint = function hint(gl, value, key) {
  return gl.hint(key, value);
};

var pixelStorei = function pixelStorei(gl, value, key) {
  return gl.pixelStorei(key, value);
};

var drawFramebuffer = function drawFramebuffer(gl, value) {
  var target = isWebGL2(gl) ? 36009 : 36160;
  return gl.bindFramebuffer(target, value);
};

var readFramebuffer = function readFramebuffer(gl, value) {
  return gl.bindFramebuffer(36008, value);
};

export var GL_PARAMETER_SETTERS = (_GL_PARAMETER_SETTERS = {}, _defineProperty(_GL_PARAMETER_SETTERS, 3042, enable), _defineProperty(_GL_PARAMETER_SETTERS, 32773, function (gl, value) {
  return gl.blendColor.apply(gl, _toConsumableArray(value));
}), _defineProperty(_GL_PARAMETER_SETTERS, 32777, 'blendEquation'), _defineProperty(_GL_PARAMETER_SETTERS, 34877, 'blendEquation'), _defineProperty(_GL_PARAMETER_SETTERS, 32969, 'blendFunc'), _defineProperty(_GL_PARAMETER_SETTERS, 32968, 'blendFunc'), _defineProperty(_GL_PARAMETER_SETTERS, 32971, 'blendFunc'), _defineProperty(_GL_PARAMETER_SETTERS, 32970, 'blendFunc'), _defineProperty(_GL_PARAMETER_SETTERS, 3106, function (gl, value) {
  return gl.clearColor.apply(gl, _toConsumableArray(value));
}), _defineProperty(_GL_PARAMETER_SETTERS, 3107, function (gl, value) {
  return gl.colorMask.apply(gl, _toConsumableArray(value));
}), _defineProperty(_GL_PARAMETER_SETTERS, 2884, enable), _defineProperty(_GL_PARAMETER_SETTERS, 2885, function (gl, value) {
  return gl.cullFace(value);
}), _defineProperty(_GL_PARAMETER_SETTERS, 2929, enable), _defineProperty(_GL_PARAMETER_SETTERS, 2931, function (gl, value) {
  return gl.clearDepth(value);
}), _defineProperty(_GL_PARAMETER_SETTERS, 2932, function (gl, value) {
  return gl.depthFunc(value);
}), _defineProperty(_GL_PARAMETER_SETTERS, 2928, function (gl, value) {
  return gl.depthRange.apply(gl, _toConsumableArray(value));
}), _defineProperty(_GL_PARAMETER_SETTERS, 2930, function (gl, value) {
  return gl.depthMask(value);
}), _defineProperty(_GL_PARAMETER_SETTERS, 3024, enable), _defineProperty(_GL_PARAMETER_SETTERS, 35723, hint), _defineProperty(_GL_PARAMETER_SETTERS, 36006, drawFramebuffer), _defineProperty(_GL_PARAMETER_SETTERS, 2886, function (gl, value) {
  return gl.frontFace(value);
}), _defineProperty(_GL_PARAMETER_SETTERS, 33170, hint), _defineProperty(_GL_PARAMETER_SETTERS, 2849, function (gl, value) {
  return gl.lineWidth(value);
}), _defineProperty(_GL_PARAMETER_SETTERS, 32823, enable), _defineProperty(_GL_PARAMETER_SETTERS, 32824, 'polygonOffset'), _defineProperty(_GL_PARAMETER_SETTERS, 10752, 'polygonOffset'), _defineProperty(_GL_PARAMETER_SETTERS, 35977, enable), _defineProperty(_GL_PARAMETER_SETTERS, 32938, 'sampleCoverage'), _defineProperty(_GL_PARAMETER_SETTERS, 32939, 'sampleCoverage'), _defineProperty(_GL_PARAMETER_SETTERS, 3089, enable), _defineProperty(_GL_PARAMETER_SETTERS, 3088, function (gl, value) {
  return gl.scissor.apply(gl, _toConsumableArray(value));
}), _defineProperty(_GL_PARAMETER_SETTERS, 2960, enable), _defineProperty(_GL_PARAMETER_SETTERS, 2961, function (gl, value) {
  return gl.clearStencil(value);
}), _defineProperty(_GL_PARAMETER_SETTERS, 2968, function (gl, value) {
  return gl.stencilMaskSeparate(1028, value);
}), _defineProperty(_GL_PARAMETER_SETTERS, 36005, function (gl, value) {
  return gl.stencilMaskSeparate(1029, value);
}), _defineProperty(_GL_PARAMETER_SETTERS, 2962, 'stencilFuncFront'), _defineProperty(_GL_PARAMETER_SETTERS, 2967, 'stencilFuncFront'), _defineProperty(_GL_PARAMETER_SETTERS, 2963, 'stencilFuncFront'), _defineProperty(_GL_PARAMETER_SETTERS, 34816, 'stencilFuncBack'), _defineProperty(_GL_PARAMETER_SETTERS, 36003, 'stencilFuncBack'), _defineProperty(_GL_PARAMETER_SETTERS, 36004, 'stencilFuncBack'), _defineProperty(_GL_PARAMETER_SETTERS, 2964, 'stencilOpFront'), _defineProperty(_GL_PARAMETER_SETTERS, 2965, 'stencilOpFront'), _defineProperty(_GL_PARAMETER_SETTERS, 2966, 'stencilOpFront'), _defineProperty(_GL_PARAMETER_SETTERS, 34817, 'stencilOpBack'), _defineProperty(_GL_PARAMETER_SETTERS, 34818, 'stencilOpBack'), _defineProperty(_GL_PARAMETER_SETTERS, 34819, 'stencilOpBack'), _defineProperty(_GL_PARAMETER_SETTERS, 2978, function (gl, value) {
  return gl.viewport.apply(gl, _toConsumableArray(value));
}), _defineProperty(_GL_PARAMETER_SETTERS, 3333, pixelStorei), _defineProperty(_GL_PARAMETER_SETTERS, 3317, pixelStorei), _defineProperty(_GL_PARAMETER_SETTERS, 37440, pixelStorei), _defineProperty(_GL_PARAMETER_SETTERS, 37441, pixelStorei), _defineProperty(_GL_PARAMETER_SETTERS, 37443, pixelStorei), _defineProperty(_GL_PARAMETER_SETTERS, 3330, pixelStorei), _defineProperty(_GL_PARAMETER_SETTERS, 3332, pixelStorei), _defineProperty(_GL_PARAMETER_SETTERS, 3331, pixelStorei), _defineProperty(_GL_PARAMETER_SETTERS, 36010, readFramebuffer), _defineProperty(_GL_PARAMETER_SETTERS, 3314, pixelStorei), _defineProperty(_GL_PARAMETER_SETTERS, 32878, pixelStorei), _defineProperty(_GL_PARAMETER_SETTERS, 3316, pixelStorei), _defineProperty(_GL_PARAMETER_SETTERS, 3315, pixelStorei), _defineProperty(_GL_PARAMETER_SETTERS, 32877, pixelStorei), _GL_PARAMETER_SETTERS);
var COMPOSITE_GL_PARAMETER_SETTERS = {
  blendEquation: function blendEquation(gl, values) {
    return gl.blendEquationSeparate(values[32777], values[34877]);
  },
  blendFunc: function blendFunc(gl, values) {
    return gl.blendFuncSeparate(values[32969], values[32968], values[32971], values[32970]);
  },
  polygonOffset: function polygonOffset(gl, values) {
    return gl.polygonOffset(values[32824], values[10752]);
  },
  sampleCoverage: function sampleCoverage(gl, values) {
    return gl.sampleCoverage(values[32938], values[32939]);
  },
  stencilFuncFront: function stencilFuncFront(gl, values) {
    return gl.stencilFuncSeparate(1028, values[2962], values[2967], values[2963]);
  },
  stencilFuncBack: function stencilFuncBack(gl, values) {
    return gl.stencilFuncSeparate(1029, values[34816], values[36003], values[36004]);
  },
  stencilOpFront: function stencilOpFront(gl, values) {
    return gl.stencilOpSeparate(1028, values[2964], values[2965], values[2966]);
  },
  stencilOpBack: function stencilOpBack(gl, values) {
    return gl.stencilOpSeparate(1029, values[34817], values[34818], values[34819]);
  }
};

var isEnabled = function isEnabled(gl, key) {
  return gl.isEnabled(key);
};

export var GL_PARAMETER_GETTERS = (_GL_PARAMETER_GETTERS = {}, _defineProperty(_GL_PARAMETER_GETTERS, 3042, isEnabled), _defineProperty(_GL_PARAMETER_GETTERS, 2884, isEnabled), _defineProperty(_GL_PARAMETER_GETTERS, 2929, isEnabled), _defineProperty(_GL_PARAMETER_GETTERS, 3024, isEnabled), _defineProperty(_GL_PARAMETER_GETTERS, 32823, isEnabled), _defineProperty(_GL_PARAMETER_GETTERS, 32926, isEnabled), _defineProperty(_GL_PARAMETER_GETTERS, 32928, isEnabled), _defineProperty(_GL_PARAMETER_GETTERS, 3089, isEnabled), _defineProperty(_GL_PARAMETER_GETTERS, 2960, isEnabled), _defineProperty(_GL_PARAMETER_GETTERS, 35977, isEnabled), _GL_PARAMETER_GETTERS);

var deepArrayEqual = function deepArrayEqual(x, y) {
  if (x === y) {
    return true;
  }

  var isArrayX = Array.isArray(x) || ArrayBuffer.isView(x);
  var isArrayY = Array.isArray(y) || ArrayBuffer.isView(y);

  if (isArrayX && isArrayY && x.length === y.length) {
    for (var i = 0; i < x.length; ++i) {
      if (x[i] !== y[i]) {
        return false;
      }
    }

    return true;
  }

  return false;
};

export function setParameter(gl, key, value) {
  var getter = GL_PARAMETER_GETTERS[key];
  var prevValue = getter ? getter(gl, Number(key)) : gl.getParameter(Number(key));
  var setter = GL_PARAMETER_SETTERS[key];
  assert(typeof setter === 'function');
  setter(gl, value, Number(key));
  return prevValue;
}
export function setParameters(gl, values) {
  var compositeSetters = {};

  for (var key in values) {
    var glConstant = Number(key);
    var setter = GL_PARAMETER_SETTERS[key];

    if (setter) {
      if (typeof setter === 'string') {
        compositeSetters[setter] = true;
      } else {
        setter(gl, values[key], glConstant);
      }
    }
  }

  var cache = gl.state && gl.state.cache;

  if (cache) {
    var mergedValues = Object.assign({}, cache, values);

    for (var _key in compositeSetters) {
      var compositeSetter = COMPOSITE_GL_PARAMETER_SETTERS[_key];
      compositeSetter(gl, mergedValues);
    }
  }
}
export function getParameter(gl, key) {
  var getter = GL_PARAMETER_GETTERS[key];
  return getter ? getter(gl, Number(key)) : gl.getParameter(Number(key));
}
export function getParameters(gl, parameters) {
  parameters = parameters || GL_PARAMETER_DEFAULTS;
  var parameterKeys = Array.isArray(parameters) ? parameters : Object.keys(parameters);
  var state = {};
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = parameterKeys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var key = _step.value;
      state[key] = getParameter(gl, key);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return state;
}
export function getDefaultParameters(gl) {
  return Object.assign({}, GL_PARAMETER_DEFAULTS, {});
}
export function resetParameters(gl) {
  setParameters(gl, getDefaultParameters(gl));
}
export function getModifiedParameters(gl) {
  var values = getParameters(GL_PARAMETER_DEFAULTS);
  var modified = {};

  for (var key in GL_PARAMETER_DEFAULTS) {
    if (!deepArrayEqual(values[key], GL_PARAMETER_DEFAULTS[key])) {
      modified[key] = values[key];
    }
  }

  return modified;
}
//# sourceMappingURL=set-parameters.js.map