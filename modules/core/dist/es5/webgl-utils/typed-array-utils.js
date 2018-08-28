"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getGLTypeFromTypedArray = getGLTypeFromTypedArray;
exports.getTypedArrayFromGLType = getTypedArrayFromGLType;
exports.flipRows = flipRows;
exports.scalePixels = scalePixels;
var ERR_TYPE_DEDUCTION = 'Failed to deduce GL constant from typed array';

function getGLTypeFromTypedArray(arrayOrType) {
  var type = ArrayBuffer.isView(arrayOrType) ? arrayOrType.constructor : arrayOrType;

  switch (type) {
    case Float32Array:
      return 5126;

    case Uint16Array:
      return 5123;

    case Uint32Array:
      return 5125;

    case Uint8Array:
      return 5121;

    case Uint8ClampedArray:
      return 5121;

    case Int8Array:
      return 5120;

    case Int16Array:
      return 5122;

    case Int32Array:
      return 5124;

    default:
      throw new Error(ERR_TYPE_DEDUCTION);
  }
}

function getTypedArrayFromGLType(glType) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$clamped = _ref.clamped,
      clamped = _ref$clamped === void 0 ? true : _ref$clamped;

  switch (glType) {
    case 5126:
      return Float32Array;

    case 5123:
    case 33635:
    case 32819:
    case 32820:
      return Uint16Array;

    case 5125:
      return Uint32Array;

    case 5121:
      return clamped ? Uint8ClampedArray : Uint8Array;

    case 5120:
      return Int8Array;

    case 5122:
      return Int16Array;

    case 5124:
      return Int32Array;

    default:
      throw new Error('Failed to deduce typed array type from GL constant');
  }
}

function flipRows(_ref2) {
  var data = _ref2.data,
      width = _ref2.width,
      height = _ref2.height,
      _ref2$bytesPerPixel = _ref2.bytesPerPixel,
      bytesPerPixel = _ref2$bytesPerPixel === void 0 ? 4 : _ref2$bytesPerPixel,
      temp = _ref2.temp;
  var bytesPerRow = width * bytesPerPixel;
  temp = temp || new Uint8Array(bytesPerRow);

  for (var y = 0; y < height / 2; ++y) {
    var topOffset = y * bytesPerRow;
    var bottomOffset = (height - y - 1) * bytesPerRow;
    temp.set(data.subarray(topOffset, topOffset + bytesPerRow));
    data.copyWithin(topOffset, bottomOffset, bottomOffset + bytesPerRow);
    data.set(temp, bottomOffset);
  }
}

function scalePixels(_ref3) {
  var data = _ref3.data,
      width = _ref3.width,
      height = _ref3.height;
  var newWidth = Math.round(width / 2);
  var newHeight = Math.round(height / 2);
  var newData = new Uint8Array(newWidth * newHeight * 4);

  for (var y = 0; y < newHeight; y++) {
    for (var x = 0; x < newWidth; x++) {
      for (var c = 0; c < 4; c++) {
        newData[(y * newWidth + x) * 4 + c] = data[(y * 2 * width + x * 2) * 4 + c];
      }
    }
  }

  return {
    data: newData,
    width: newWidth,
    height: newHeight
  };
}
//# sourceMappingURL=typed-array-utils.js.map