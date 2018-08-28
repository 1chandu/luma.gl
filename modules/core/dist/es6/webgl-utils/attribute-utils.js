function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

import assert from '../utils/assert';
const GL_BYTE = 0x1400;
const GL_UNSIGNED_BYTE = 0x1401;
const GL_SHORT = 0x1402;
const GL_UNSIGNED_SHORT = 0x1403;
const GL_POINTS = 0x0;
const GL_LINES = 0x1;
const GL_LINE_LOOP = 0x2;
const GL_LINE_STRIP = 0x3;
const GL_TRIANGLES = 0x4;
const GL_TRIANGLE_STRIP = 0x5;
const GL_TRIANGLE_FAN = 0x6;
const GL_FLOAT = 0x1406;
const GL_FLOAT_VEC2 = 0x8B50;
const GL_FLOAT_VEC3 = 0x8B51;
const GL_FLOAT_VEC4 = 0x8B52;
const GL_INT = 0x1404;
const GL_INT_VEC2 = 0x8B53;
const GL_INT_VEC3 = 0x8B54;
const GL_INT_VEC4 = 0x8B55;
const GL_UNSIGNED_INT = 0x1405;
const GL_UNSIGNED_INT_VEC2 = 0x8DC6;
const GL_UNSIGNED_INT_VEC3 = 0x8DC7;
const GL_UNSIGNED_INT_VEC4 = 0x8DC8;
const GL_BOOL = 0x8B56;
const GL_BOOL_VEC2 = 0x8B57;
const GL_BOOL_VEC3 = 0x8B58;
const GL_BOOL_VEC4 = 0x8B59;
const GL_FLOAT_MAT2 = 0x8B5A;
const GL_FLOAT_MAT3 = 0x8B5B;
const GL_FLOAT_MAT4 = 0x8B5C;
const GL_FLOAT_MAT2x3 = 0x8B65;
const GL_FLOAT_MAT2x4 = 0x8B66;
const GL_FLOAT_MAT3x2 = 0x8B67;
const GL_FLOAT_MAT3x4 = 0x8B68;
const GL_FLOAT_MAT4x2 = 0x8B69;
const GL_FLOAT_MAT4x3 = 0x8B6A;
const COMPOSITE_GL_TYPES = {
  [GL_FLOAT]: [GL_FLOAT, 1, 'float'],
  [GL_FLOAT_VEC2]: [GL_FLOAT, 2, 'vec2'],
  [GL_FLOAT_VEC3]: [GL_FLOAT, 3, 'vec3'],
  [GL_FLOAT_VEC4]: [GL_FLOAT, 4, 'vec4'],
  [GL_INT]: [GL_INT, 1, 'int'],
  [GL_INT_VEC2]: [GL_INT, 2, 'ivec2'],
  [GL_INT_VEC3]: [GL_INT, 3, 'ivec3'],
  [GL_INT_VEC4]: [GL_INT, 4, 'ivec4'],
  [GL_UNSIGNED_INT]: [GL_UNSIGNED_INT, 1, 'uint'],
  [GL_UNSIGNED_INT_VEC2]: [GL_UNSIGNED_INT, 2, 'uvec2'],
  [GL_UNSIGNED_INT_VEC3]: [GL_UNSIGNED_INT, 3, 'uvec3'],
  [GL_UNSIGNED_INT_VEC4]: [GL_UNSIGNED_INT, 4, 'uvec4'],
  [GL_BOOL]: [GL_FLOAT, 1, 'bool'],
  [GL_BOOL_VEC2]: [GL_FLOAT, 2, 'bvec2'],
  [GL_BOOL_VEC3]: [GL_FLOAT, 3, 'bvec3'],
  [GL_BOOL_VEC4]: [GL_FLOAT, 4, 'bvec4'],
  [GL_FLOAT_MAT2]: [GL_FLOAT, 8, 'mat2'],
  [GL_FLOAT_MAT2x3]: [GL_FLOAT, 8, 'mat2x3'],
  [GL_FLOAT_MAT2x4]: [GL_FLOAT, 8, 'mat2x4'],
  [GL_FLOAT_MAT3]: [GL_FLOAT, 12, 'mat3'],
  [GL_FLOAT_MAT3x2]: [GL_FLOAT, 12, 'mat3x2'],
  [GL_FLOAT_MAT3x4]: [GL_FLOAT, 12, 'mat3x4'],
  [GL_FLOAT_MAT4]: [GL_FLOAT, 16, 'mat4'],
  [GL_FLOAT_MAT4x2]: [GL_FLOAT, 16, 'mat4x2'],
  [GL_FLOAT_MAT4x3]: [GL_FLOAT, 16, 'mat4x3']
};
export function getPrimitiveDrawMode(drawMode) {
  switch (drawMode) {
    case GL_POINTS:
      return GL_POINTS;

    case GL_LINES:
      return GL_LINES;

    case GL_LINE_STRIP:
      return GL_LINES;

    case GL_LINE_LOOP:
      return GL_LINES;

    case GL_TRIANGLES:
      return GL_TRIANGLES;

    case GL_TRIANGLE_STRIP:
      return GL_TRIANGLES;

    case GL_TRIANGLE_FAN:
      return GL_TRIANGLES;

    default:
      assert(false);
      return 0;
  }
}
export function getPrimitiveCount({
  drawMode,
  vertexCount
}) {
  switch (drawMode) {
    case GL_POINTS:
    case GL_LINE_LOOP:
      return vertexCount;

    case GL_LINES:
      return vertexCount / 2;

    case GL_LINE_STRIP:
      return vertexCount - 1;

    case GL_TRIANGLES:
      return vertexCount / 3;

    case GL_TRIANGLE_STRIP:
    case GL_TRIANGLE_FAN:
      return vertexCount - 2;

    default:
      assert(false);
      return 0;
  }
}
export function getVertexCount({
  drawMode,
  vertexCount
}) {
  const primitiveCount = getPrimitiveCount({
    drawMode,
    vertexCount
  });

  switch (getPrimitiveDrawMode(drawMode)) {
    case GL_POINTS:
      return primitiveCount;

    case GL_LINES:
      return primitiveCount * 2;

    case GL_TRIANGLES:
      return primitiveCount * 3;

    default:
      assert(false);
      return 0;
  }
}
export function decomposeCompositeGLType(compositeGLType) {
  const typeAndSize = COMPOSITE_GL_TYPES[compositeGLType];

  if (!typeAndSize) {
    return null;
  }

  const _typeAndSize = _slicedToArray(typeAndSize, 2),
        type = _typeAndSize[0],
        components = _typeAndSize[1];

  return {
    type,
    components
  };
}
export function getCompositeGLType(type, components) {
  switch (type) {
    case GL_BYTE:
    case GL_UNSIGNED_BYTE:
    case GL_SHORT:
    case GL_UNSIGNED_SHORT:
      type = GL_FLOAT;
      break;

    default:
  }

  for (const glType in COMPOSITE_GL_TYPES) {
    const _COMPOSITE_GL_TYPES$g = _slicedToArray(COMPOSITE_GL_TYPES[glType], 3),
          compType = _COMPOSITE_GL_TYPES$g[0],
          compComponents = _COMPOSITE_GL_TYPES$g[1],
          name = _COMPOSITE_GL_TYPES$g[2];

    if (compType === type && compComponents === components) {
      return {
        glType,
        name
      };
    }
  }

  return null;
}
//# sourceMappingURL=attribute-utils.js.map