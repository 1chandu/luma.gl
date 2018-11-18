import assert from '../utils/assert';
var GL_ALPHA = 0x1906;
var GL_RGB = 0x1907;
var GL_RGBA = 0x1908;
var GL_UNSIGNED_BYTE = 0x1401;
var GL_UNSIGNED_SHORT_4_4_4_4 = 0x8033;
var GL_UNSIGNED_SHORT_5_5_5_1 = 0x8034;
var GL_UNSIGNED_SHORT_5_6_5 = 0x8363;
var GL_FLOAT = 0x1406;
export function glFormatToComponents(format) {
  switch (format) {
    case GL_ALPHA:
      return 1;

    case GL_RGB:
      return 3;

    case GL_RGBA:
      return 4;

    default:
      assert(false);
      return 0;
  }
}
export function glTypeToBytes(type) {
  switch (type) {
    case GL_UNSIGNED_BYTE:
      return 1;

    case GL_UNSIGNED_SHORT_5_6_5:
    case GL_UNSIGNED_SHORT_4_4_4_4:
    case GL_UNSIGNED_SHORT_5_5_5_1:
      return 2;

    case GL_FLOAT:
      return 4;

    default:
      assert(false);
      return 0;
  }
}
//# sourceMappingURL=format-utils.js.map