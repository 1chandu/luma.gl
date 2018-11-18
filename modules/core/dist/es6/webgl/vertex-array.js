import Accessor from './accessor';
import Buffer from './buffer';
import VertexArrayObject from './vertex-array-object';
import { log, assert } from '../utils';
import { stubRemovedMethods } from '../utils';
const ERR_ATTRIBUTE_TYPE = 'VertexArray: attributes must be Buffers or constants (i.e. typed array)';
export default class VertexArray {
  constructor(gl, opts = {}) {
    const id = opts.id || opts.program && opts.program.id;
    this.id = id;
    this.gl = gl;
    this.configuration = null;
    this.elements = null;
    this.values = null;
    this.accessors = null;
    this.unused = null;
    this.drawParams = null;
    this.buffer = null;
    this.vertexArrayObject = VertexArrayObject.isSupported(gl) ? new VertexArrayObject(gl) : VertexArrayObject.getDefaultArray(gl);
    stubRemovedMethods(this, 'VertexArray', 'v6.0', ['setBuffers', 'setGeneric', 'clearBindings', 'setLocations', 'setGenericValues', 'setDivisor', 'enable', 'disable']);
    this.initialize(opts);
    Object.seal(this);
  }

  delete() {
    if (this.buffer) {
      this.buffer.delete();
    }
  }

  initialize(props = {}) {
    this.reset();
    this.configuration = null;
    this.bindOnUse = false;
    return this.setProps(props);
  }

  reset() {
    this.elements = null;
    const MAX_ATTRIBUTES = this.vertexArrayObject.MAX_ATTRIBUTES;
    this.values = new Array(MAX_ATTRIBUTES).fill(null);
    this.accessors = new Array(MAX_ATTRIBUTES).fill(null);
    this.unused = {};
    this.drawParams = null;
    return this;
  }

  setProps(props) {
    if ('program' in props) {
      this.configuration = props.program && props.program.configuration;
    }

    if ('configuration' in props) {
      this.configuration = props.configuration;
    }

    if ('attributes' in props) {
      this.setAttributes(props.attributes);
    }

    if ('elements' in props) {
      this.setElementBuffer(props.elements);
    }

    if ('bindOnUse' in props) {
      props = props.bindOnUse;
    }

    return this;
  }

  clearDrawParams() {
    this.drawParams = null;
  }

  getDrawParams(appParameters) {
    this.drawParams = this.drawParams || this._updateDrawParams();
    const drawParams = Object.assign({}, this.drawParams, appParameters);

    this._updateAttributeZeroBuffer(drawParams);

    return drawParams;
  }

  setAttributes(attributes) {
    this.vertexArrayObject.bind(() => {
      for (const locationOrName in attributes) {
        const value = attributes[locationOrName];

        if (value instanceof Buffer) {
          this.setBuffer(locationOrName, value);
        } else if (Array.isArray(value) && value.length && value[0] instanceof Buffer) {
          const buffer = value[0];
          const accessor = value[1];
          this.setBuffer(locationOrName, buffer, accessor);
        } else if (ArrayBuffer.isView(value) || Array.isArray(value)) {
          this.setConstant(locationOrName, value);
        } else {
          throw new Error(ERR_ATTRIBUTE_TYPE);
        }
      }

      this.gl.bindBuffer(34962, null);
    });
    return this;
  }

  setElementBuffer(elementBuffer = null, accessor = {}) {
    this.elements = elementBuffer;
    this.clearDrawParams();

    if (!this.vertexArrayObject.isDefaultArray) {
      this.vertexArrayObject.setElementBuffer(elementBuffer, accessor);
    }

    return this;
  }

  setBuffer(locationOrName, buffer, appAccessor = {}) {
    if (buffer.target === 34963) {
      return this.setElementBuffer(buffer);
    }

    const _this$_resolveLocatio = this._resolveLocationAndAccessor(locationOrName, buffer, buffer.accessor, appAccessor),
          location = _this$_resolveLocatio.location,
          accessor = _this$_resolveLocatio.accessor;

    if (location >= 0) {
      this.values[location] = buffer;
      this.accessors[location] = accessor;
      this.clearDrawParams();

      if (!this.vertexArrayObject.isDefaultArray) {
        this.vertexArrayObject.setBuffer(location, buffer, accessor);
      }
    }

    return this;
  }

  setConstant(locationOrName, arrayValue, appAccessor = {}) {
    const _this$_resolveLocatio2 = this._resolveLocationAndAccessor(locationOrName, arrayValue, appAccessor),
          location = _this$_resolveLocatio2.location,
          accessor = _this$_resolveLocatio2.accessor;

    if (location >= 0) {
      arrayValue = this.vertexArrayObject._normalizeConstantArrayValue(arrayValue, accessor);
      this.values[location] = arrayValue;
      this.accessors[location] = accessor;
      this.clearDrawParams();

      if (!this.vertexArrayObject.isDefaultArray) {
        this.vertexArrayObject.enable(location, false);
      }
    }

    return this;
  }

  unbindBuffers() {
    this.vertexArrayObject.bind(() => {
      if (this.elements) {
        this.setElementBuffer(null);
      }

      this.buffer = this.buffer || new Buffer(this.gl, {
        size: 4
      });

      for (let location = 0; location < this.vertexArrayObject.MAX_ATTRIBUTES; location++) {
        if (this.values[location] instanceof Buffer) {
          this.gl.disableVertexAttribArray(location);
          this.gl.bindBuffer(34962, this.buffer.handle);
          this.gl.vertexAttribPointer(location, 1, 5126, false, 0, 0);
        }
      }
    });
    return this;
  }

  bindBuffers() {
    this.vertexArrayObject.bind(() => {
      if (this.elements) {
        this.setElementBuffer(this.elements);
      }

      for (let location = 0; location < this.vertexArrayObject.MAX_ATTRIBUTES; location++) {
        const buffer = this.values[location];

        if (buffer instanceof Buffer) {
          this.setBuffer(location, buffer);
        }
      }
    });
    return this;
  }

  bindForDraw(vertexCount, func) {
    let value;
    this.vertexArrayObject.bind(() => {
      this._setConstantAttributes(vertexCount);

      if (!this.vertexArrayObject.hasVertexArrays) {
        this.bindBuffers();
      }

      value = func();

      if (!this.vertexArrayObject.hasVertexArrays) {
        this.unbindBuffers();
      }
    });
    return value;
  }

  _resolveLocationAndAccessor(locationOrName, value, valueAccessor, appAccessor) {
    const location = this._getAttributeIndex(locationOrName);

    if (!Number.isFinite(location) || location < 0) {
      this.unused[locationOrName] = value;
      log.once(3, () => `unused value ${locationOrName} in ${this.id}`)();
      return this;
    }

    const accessInfo = this._getAttributeInfo(locationOrName);

    const accessor = Accessor.resolve(accessInfo.accessor, valueAccessor, appAccessor);
    const size = accessor.size,
          type = accessor.type;
    assert(Number.isFinite(size) && Number.isFinite(type));
    return {
      location,
      accessor
    };
  }

  _getAttributeInfo(attributeName) {
    return this.configuration && this.configuration.getAttributeInfo(attributeName);
  }

  _getAttributeIndex(locationOrName) {
    if (this.configuration) {
      return this.configuration.getAttributeLocation(locationOrName);
    }

    const location = Number(locationOrName);

    if (Number.isFinite(location)) {
      return location;
    }

    return -1;
  }

  _setConstantAttributes(vertexCount) {
    let constant = this.values[0];

    if (ArrayBuffer.isView(constant)) {
      this._setConstantAttributeZero(constant, vertexCount);
    }

    for (let location = 1; location < this.vertexArrayObject.MAX_ATTRIBUTES; location++) {
      constant = this.values[location];

      if (ArrayBuffer.isView(constant)) {
        this._setConstantAttribute(location, constant);
      }
    }
  }

  _setConstantAttributeZero(constant, vertexCount) {
    if (VertexArrayObject.isSupported(this.gl, {
      constantAttributeZero: true
    })) {
      this._setConstantAttribute(0, constant);

      return;
    }

    const buffer = this.vertexArrayObject.getConstantBuffer(vertexCount);
    this.vertexArrayObject.setBuffer(0, buffer, this.accessors[0]);
  }

  _setConstantAttribute(location, constant) {
    VertexArrayObject.setConstant(this.gl, location, constant);

    if (this.vertexArrayObject.isDefault) {
      this.vertexArrayObject.enable(location, false);
    }
  }

  _updateAttributeZeroBuffer({
    vertexCount,
    instanceCount
  }) {
    const elementCount = Math.max(vertexCount | 0, instanceCount | 0);
    const constant = this.values[0];

    if (ArrayBuffer.isView(constant)) {
      const size = elementCount;
      this.buffer = this.buffer || new Buffer(this.gl, {
        size
      });
    }
  }

  _updateDrawParams() {
    const drawParams = {
      isIndexed: false,
      isInstanced: false,
      indexCount: Infinity,
      vertexCount: Infinity,
      instanceCount: Infinity
    };

    for (let location = 0; location < this.vertexArrayObject.MAX_ATTRIBUTES; location++) {
      this._updateDrawParamsForLocation(drawParams, location);
    }

    if (this.elements) {
      drawParams.elementCount = this.elements.getElementCount(this.elements.accessor);
      drawParams.isIndexed = true;
      drawParams.indexType = this.elements.accessor.type;
    }

    if (drawParams.indexCount === Infinity) {
      drawParams.indexCount = 0;
    }

    if (drawParams.vertexCount === Infinity) {
      drawParams.vertexCount = 0;
    }

    if (drawParams.instanceCount === Infinity) {
      drawParams.instanceCount = 0;
    }

    return drawParams;
  }

  _updateDrawParamsForLocation(drawParams, location) {
    const value = this.values[location];
    const accessor = this.accessors[location];

    if (!value) {
      return;
    }

    const divisor = accessor.divisor;
    const isInstanced = divisor > 0;
    drawParams.isInstanced = drawParams.isInstanced || isInstanced;

    if (value instanceof Buffer) {
      const buffer = value;

      if (isInstanced) {
        const instanceCount = buffer.getVertexCount(accessor);
        drawParams.instanceCount = Math.min(drawParams.instanceCount, instanceCount);
      } else {
        const vertexCount = buffer.getVertexCount(accessor);
        drawParams.vertexCount = Math.min(drawParams.vertexCount, vertexCount);
      }
    }
  }

  setElements(elementBuffer = null, accessor = {}) {
    log.deprecated('setElements', 'setElementBuffer');
    return this.setElementBuffer(elementBuffer, accessor);
  }

}
//# sourceMappingURL=vertex-array.js.map