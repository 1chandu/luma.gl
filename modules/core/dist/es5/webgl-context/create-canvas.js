"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPageLoadPromise = getPageLoadPromise;
exports.createCanvas = createCanvas;
exports.getCanvas = getCanvas;
exports.pageLoadPromise = void 0;

var _utils = require("../utils");

var isPage = _utils.isBrowser && typeof document !== 'undefined';
var isPageLoaded = isPage && document.readyState === 'complete';
var pageLoadPromise = isPage ? new Promise(function (resolve, reject) {
  if (isPageLoaded) {
    resolve(document);
    return;
  }

  window.onload = function () {
    isPageLoaded = true;
    resolve(document);
  };
}) : Promise.resolve({});
exports.pageLoadPromise = pageLoadPromise;

function getPageLoadPromise() {
  return pageLoadPromise;
}

function createCanvas(_ref) {
  var _ref$width = _ref.width,
      width = _ref$width === void 0 ? 800 : _ref$width,
      _ref$height = _ref.height,
      height = _ref$height === void 0 ? 600 : _ref$height,
      _ref$id = _ref.id,
      id = _ref$id === void 0 ? 'gl-canvas' : _ref$id,
      _ref$insert = _ref.insert,
      insert = _ref$insert === void 0 ? true : _ref$insert;
  var canvas = document.createElement('canvas');
  canvas.id = id;
  canvas.style.width = Number.isFinite(width) ? "".concat(width, "px") : '100%';
  canvas.style.height = Number.isFinite(height) ? "".concat(height, "px") : '100%';

  if (insert) {
    var body = document.body;
    body.insertBefore(canvas, body.firstChild);
  }

  return canvas;
}

function getCanvas(_ref2) {
  var canvas = _ref2.canvas,
      width = _ref2.width,
      height = _ref2.height,
      _ref2$onError = _ref2.onError,
      onError = _ref2$onError === void 0 ? function () {} : _ref2$onError;
  var targetCanvas;

  if (typeof canvas === 'string') {
    if (!isPageLoaded) {
      onError("createGLContext called on canvas '".concat(canvas, "' before page was loaded"));
    }

    targetCanvas = document.getElementById(canvas);
  } else if (canvas) {
    targetCanvas = canvas;
  } else {
    targetCanvas = createCanvas({
      id: 'lumagl-canvas',
      width: width,
      height: height,
      onError: onError
    });
  }

  return targetCanvas;
}
//# sourceMappingURL=create-canvas.js.map