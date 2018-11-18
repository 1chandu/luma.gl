import { decomposeCompositeGLType } from '../webgl-utils/attribute-utils';
import assert from '../utils/assert';
const ERR_ARGUMENT = 'UniformBufferLayout illegal argument';
const GL_FLOAT = 0x1406;
const GL_INT = 0x1404;
const GL_UNSIGNED_INT = 0x1405;
export default class UniformBufferLayout {
  constructor(layout) {
    this.layout = {};
    this.size = 0;

    for (const key in layout) {
      this._addUniform(key, layout[key]);
    }

    const data = new Float32Array(this.size);
    this.typedArray = {
      [GL_FLOAT]: data,
      [GL_INT]: new Int32Array(data.buffer),
      [GL_UNSIGNED_INT]: new Uint32Array(data.buffer)
    };
  }

  getBytes() {
    return this.size * 4;
  }

  getData() {
    return this.typedArray[GL_FLOAT];
  }

  getSubData(index) {
    let data;
    let offset;

    if (index === undefined) {
      data = this.data;
      offset = 0;
    } else {
      const begin = this.offsets[index];
      const end = begin + this.sizes[index];
      data = this.data.subarray(begin, end);
      offset = begin * 4;
    }

    return {
      data,
      offset
    };
  }

  setUniforms(values) {
    for (const key in values) {
      this._setValue(key, values[key]);
    }

    return this;
  }

  _setValue(key, value) {
    const layout = this.layout[key];
    assert(layout, 'UniformLayoutStd140 illegal argument');
    const typedArray = this.typedArray[layout.type];

    if (layout.size === 1) {
      typedArray[layout.offset] = value;
    } else {
      typedArray.set(value, layout.offset);
    }
  }

  _addUniform(key, uniformType) {
    const typeAndComponents = decomposeCompositeGLType(uniformType);
    assert(typeAndComponents, ERR_ARGUMENT);
    const type = typeAndComponents.type,
          count = typeAndComponents.components;
    this.size = this._alignTo(this.size, count);
    const offset = this.size;
    this.size += count;
    this.layout[key] = {
      type,
      size: count,
      offset
    };
  }

  _alignTo(size, count) {
    switch (count) {
      case 1:
        return size;

      case 2:
        return size + size % 2;

      default:
        return size + (4 - size % 4) % 4;
    }
  }

}
//# sourceMappingURL=uniform-buffer-layout.js.map