"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadTexture = loadTexture;
exports.loadFiles = loadFiles;
exports.loadImages = loadImages;
exports.loadTextures = loadTextures;
exports.loadProgram = loadProgram;
exports.loadModel = loadModel;
exports.parseModel = parseModel;

var _assert = _interopRequireDefault(require("../utils/assert"));

var _browserLoad = require("./browser-load");

var _webgl = require("../webgl");

var _core = require("../core");

var _geometry = require("../geometry");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function noop() {}

function loadTexture(gl, url) {
  var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var urls = opts.urls,
      _opts$onProgress = opts.onProgress,
      onProgress = _opts$onProgress === void 0 ? noop : _opts$onProgress;
  (0, _assert.default)(typeof url === 'string', 'loadTexture: url must be string');
  return loadImages(Object.assign({
    urls: urls,
    onProgress: onProgress
  }, opts)).then(function (images) {
    return images.map(function (img, i) {
      return new _webgl.Texture2D(gl, Object.assign({
        id: urls[i]
      }, opts, {
        data: img
      }));
    });
  });
}

function loadFiles() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var urls = opts.urls,
      _opts$onProgress2 = opts.onProgress,
      onProgress = _opts$onProgress2 === void 0 ? noop : _opts$onProgress2;
  (0, _assert.default)(urls.every(function (url) {
    return typeof url === 'string';
  }), 'loadImages: {urls} must be array of strings');
  var count = 0;
  return Promise.all(urls.map(function (url) {
    var promise = (0, _browserLoad.loadFile)(Object.assign({
      url: url
    }, opts));
    promise.then(function (file) {
      return onProgress({
        progress: ++count / urls.length,
        count: count,
        total: urls.length,
        url: url
      });
    });
    return promise;
  }));
}

function loadImages() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var urls = opts.urls,
      _opts$onProgress3 = opts.onProgress,
      onProgress = _opts$onProgress3 === void 0 ? noop : _opts$onProgress3;
  (0, _assert.default)(urls.every(function (url) {
    return typeof url === 'string';
  }), 'loadImages: {urls} must be array of strings');
  var count = 0;
  return Promise.all(urls.map(function (url) {
    var promise = (0, _browserLoad.loadImage)(url, opts);
    promise.then(function (file) {
      return onProgress({
        progress: ++count / urls.length,
        count: count,
        total: urls.length,
        url: url
      });
    });
    return promise;
  }));
}

function loadTextures(gl) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var urls = opts.urls,
      _opts$onProgress4 = opts.onProgress,
      onProgress = _opts$onProgress4 === void 0 ? noop : _opts$onProgress4;
  (0, _assert.default)(urls.every(function (url) {
    return typeof url === 'string';
  }), 'loadTextures: {urls} must be array of strings');
  return loadImages(Object.assign({
    urls: urls,
    onProgress: onProgress
  }, opts)).then(function (images) {
    return images.map(function (img, i) {
      var params = Array.isArray(opts.parameters) ? opts.parameters[i] : opts.parameters;
      params = params === undefined ? {} : params;
      return new _webgl.Texture2D(gl, Object.assign({
        id: urls[i]
      }, params, {
        data: img
      }));
    });
  });
}

function loadProgram(gl) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var vs = opts.vs,
      fs = opts.fs,
      _opts$onProgress5 = opts.onProgress,
      onProgress = _opts$onProgress5 === void 0 ? noop : _opts$onProgress5;
  return loadFiles(Object.assign({
    urls: [vs, fs],
    onProgress: onProgress
  }, opts)).then(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        vsText = _ref2[0],
        fsText = _ref2[1];

    return new _webgl.Program(gl, Object.assign({
      vs: vsText,
      fs: fsText
    }, opts));
  });
}

function loadModel(gl) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var url = opts.url,
      _opts$onProgress6 = opts.onProgress,
      onProgress = _opts$onProgress6 === void 0 ? noop : _opts$onProgress6;
  return loadFiles(Object.assign({
    urls: [url],
    onProgress: onProgress
  }, opts)).then(function (_ref3) {
    var _ref4 = _slicedToArray(_ref3, 1),
        file = _ref4[0];

    return parseModel(gl, Object.assign({
      file: file
    }, opts));
  });
}

function parseModel(gl) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var file = opts.file,
      _opts$program = opts.program,
      program = _opts$program === void 0 ? new _webgl.Program(gl) : _opts$program;
  var json = typeof file === 'string' ? parseJSON(file) : file;
  var attributes = {};
  var modelOptions = {};

  for (var key in json) {
    var value = json[key];

    if (Array.isArray(value)) {
      attributes[key] = key === 'indices' ? new Uint16Array(value) : new Float32Array(value);
    } else {
      modelOptions[key] = value;
    }
  }

  return new _core.Model(gl, Object.assign({
    program: program,
    geometry: new _geometry.Geometry({
      attributes: attributes
    })
  }, modelOptions, opts));
}

function parseJSON(file) {
  try {
    return JSON.parse(file);
  } catch (error) {
    throw new Error("Failed to parse JSON: ".concat(error));
  }
}
//# sourceMappingURL=load-files.js.map