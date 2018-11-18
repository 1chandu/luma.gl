import Resource from './resource';
import Buffer from './buffer';
import { isWebGL2 } from '../webgl-utils';
import { getScratchArray, fillArray } from '../utils/array-utils-flat';
import { assert } from '../utils';
import { isMobile, getBrowser } from 'probe.gl';
const OES_vertex_array_object = 'OES_vertex_array_object';
const ERR_ELEMENTS = 'elements must be GL.ELEMENT_ARRAY_BUFFER';
export default class VertexArrayObject extends Resource {
  static isSupported(gl, options = {}) {
    if (options.constantAttributeZero) {
      return isWebGL2(gl) || isMobile() || getBrowser() === 'Chrome';
    }

    return isWebGL2(gl) || gl.getExtension(OES_vertex_array_object);
  }

  static getDefaultArray(gl) {
    gl.luma = gl.luma || {};

    if (!gl.luma.defaultVertexArray) {
      gl.luma.defaultVertexArray = new VertexArrayObject(gl, {
        handle: null
      });
    }

    return gl.luma.defaultVertexArray;
  }

  static getMaxAttributes(gl) {
    VertexArrayObject.MAX_ATTRIBUTES = VertexArrayObject.MAX_ATTRIBUTES || gl.getParameter(34921);
    return VertexArrayObject.MAX_ATTRIBUTES;
  }

  static setConstant(gl, location, array) {
    switch (array.constructor) {
      case Float32Array:
        VertexArrayObject._setConstantFloatArray(gl, location, array);

        break;

      case Int32Array:
        VertexArrayObject._setConstantIntArray(gl, location, array);

        break;

      case Uint32Array:
        VertexArrayObject._setConstantUintArray(gl, location, array);

        break;

      default:
        assert(false);
    }
  }

  constructor(gl, opts = {}) {
    const id = opts.id || opts.program && opts.program.id;
    super(gl, Object.assign({}, opts, {
      id
    }));
    this.hasVertexArrays = VertexArrayObject.isSupported(gl);
    this.buffer = null;
    this.bufferValue = null;
    this.initialize(opts);
    Object.seal(this);
  }

  delete() {
    super.delete();

    if (this.buffer) {
      this.buffer.delete();
    }
  }

  get MAX_ATTRIBUTES() {
    return VertexArrayObject.getMaxAttributes(this.gl);
  }

  initialize(props = {}) {
    return this.setProps(props);
  }

  setProps(props) {
    return this;
  }

  setElementBuffer(elementBuffer = null, opts = {}) {
    assert(!elementBuffer || elementBuffer.target === 34963, ERR_ELEMENTS);
    this.bind(() => {
      this.gl.bindBuffer(34963, elementBuffer ? elementBuffer.handle : null);
    });
    return this;
  }

  setBuffer(location, buffer, accessor) {
    if (buffer.target === 34963) {
      return this.setElementBuffer(buffer, accessor);
    }

    const size = accessor.size,
          type = accessor.type,
          stride = accessor.stride,
          offset = accessor.offset,
          normalized = accessor.normalized,
          integer = accessor.integer,
          divisor = accessor.divisor;
    const gl = this.gl;
    location = Number(location);
    this.bind(() => {
      gl.bindBuffer(34962, buffer.handle);

      if (integer) {
        assert(isWebGL2(gl));
        gl.vertexAttribIPointer(location, size, type, stride, offset);
      } else {
        gl.vertexAttribPointer(location, size, type, normalized, stride, offset);
      }

      gl.enableVertexAttribArray(location);
      gl.vertexAttribDivisor(location, divisor || 0);
    });
    return this;
  }

  enable(location, enable = true) {
    const disablingAttributeZero = !enable && location === 0 && !VertexArrayObject.isSupported(this.gl, {
      constantAttributeZero: true
    });

    if (!disablingAttributeZero) {
      location = Number(location);
      this.bind(() => enable ? this.gl.enableVertexAttribArray(location) : this.gl.disableVertexAttribArray(location));
    }

    return this;
  }

  getConstantBuffer(elementCount, value, accessor) {
    const constantValue = this._normalizeConstantArrayValue(value, accessor);

    const byteLength = constantValue.byteLength * elementCount;
    const length = constantValue.length * elementCount;
    let updateNeeded = !this.buffer;
    this.buffer = this.buffer || new Buffer(this.gl, byteLength);
    updateNeeded = updateNeeded || this.buffer.setByteLength(byteLength);
    updateNeeded = updateNeeded || !this._compareConstantArrayValues(constantValue, this.bufferValue);

    if (updateNeeded) {
      const typedArray = getScratchArray(value.constructor, length);
      fillArray({
        target: typedArray,
        source: constantValue,
        start: 0,
        count: length
      });
      this.buffer.subData(typedArray);
      this.bufferValue = value;
    }

    return this.buffer;
  }

  _normalizeConstantArrayValue(arrayValue, accessor) {
    if (Array.isArray(arrayValue)) {
      return new Float32Array(arrayValue);
    }

    return arrayValue;
  }

  _compareConstantArrayValues(v1, v2) {
    if (!v1 || !v2 || v1.length !== v2.length || v1.constructor !== v2.constructor) {
      return false;
    }

    for (let i = 0; i < v1.length; ++i) {
      if (v1[i] !== v2[i]) {
        return false;
      }
    }

    return true;
  }

  static _setConstantFloatArray(gl, location, array) {
    switch (array.length) {
      case 1:
        gl.vertexAttrib1fv(location, array);
        break;

      case 2:
        gl.vertexAttrib2fv(location, array);
        break;

      case 3:
        gl.vertexAttrib3fv(location, array);
        break;

      case 4:
        gl.vertexAttrib4fv(location, array);
        break;

      default:
        assert(false);
    }
  }

  static _setConstantIntArray(gl, location, array) {
    assert(isWebGL2(gl));

    switch (array.length) {
      case 1:
        gl.vertexAttribI1iv(location, array);
        break;

      case 2:
        gl.vertexAttribI2iv(location, array);
        break;

      case 3:
        gl.vertexAttribI3iv(location, array);
        break;

      case 4:
        gl.vertexAttribI4iv(location, array);
        break;

      default:
        assert(false);
    }
  }

  static _setConstantUintArray(gl, location, array) {
    assert(isWebGL2(gl));

    switch (array.length) {
      case 1:
        gl.vertexAttribI1uiv(location, array);
        break;

      case 2:
        gl.vertexAttribI2uiv(location, array);
        break;

      case 3:
        gl.vertexAttribI3uiv(location, array);
        break;

      case 4:
        gl.vertexAttribI4uiv(location, array);
        break;

      default:
        assert(false);
    }
  }

  _createHandle() {
    this.hasVertexArrays = VertexArrayObject.isSupported(this.gl);

    if (this.hasVertexArrays) {
      return this.gl.createVertexArray();
    }

    return null;
  }

  _deleteHandle(handle) {
    if (this.hasVertexArrays) {
      this.gl.deleteVertexArray(handle);
    }

    return [this.elements];
  }

  _bindHandle(handle) {
    if (this.hasVertexArrays) {
      this.gl.bindVertexArray(handle);
    }
  }

  _getParameter(pname, {
    location
  }) {
    assert(Number.isFinite(location));
    return this.bind(() => {
      switch (pname) {
        case 34373:
          return this.gl.getVertexAttribOffset(location, pname);

        default:
          return this.gl.getVertexAttrib(location, pname);
      }
    });
  }

}
//# sourceMappingURL=vertex-array-object.js.map