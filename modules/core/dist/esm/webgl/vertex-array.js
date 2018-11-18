function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

import Accessor from './accessor';
import Buffer from './buffer';
import VertexArrayObject from './vertex-array-object';
import { log, assert } from '../utils';
import { stubRemovedMethods } from '../utils';
var ERR_ATTRIBUTE_TYPE = 'VertexArray: attributes must be Buffers or constants (i.e. typed array)';

var VertexArray = function () {
  function VertexArray(gl) {
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, VertexArray);

    var id = opts.id || opts.program && opts.program.id;
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

  _createClass(VertexArray, [{
    key: "delete",
    value: function _delete() {
      if (this.buffer) {
        this.buffer.delete();
      }
    }
  }, {
    key: "initialize",
    value: function initialize() {
      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      this.reset();
      this.configuration = null;
      this.bindOnUse = false;
      return this.setProps(props);
    }
  }, {
    key: "reset",
    value: function reset() {
      this.elements = null;
      var MAX_ATTRIBUTES = this.vertexArrayObject.MAX_ATTRIBUTES;
      this.values = new Array(MAX_ATTRIBUTES).fill(null);
      this.accessors = new Array(MAX_ATTRIBUTES).fill(null);
      this.unused = {};
      this.drawParams = null;
      return this;
    }
  }, {
    key: "setProps",
    value: function setProps(props) {
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
  }, {
    key: "clearDrawParams",
    value: function clearDrawParams() {
      this.drawParams = null;
    }
  }, {
    key: "getDrawParams",
    value: function getDrawParams(appParameters) {
      this.drawParams = this.drawParams || this._updateDrawParams();
      var drawParams = Object.assign({}, this.drawParams, appParameters);

      this._updateAttributeZeroBuffer(drawParams);

      return drawParams;
    }
  }, {
    key: "setAttributes",
    value: function setAttributes(attributes) {
      var _this = this;

      this.vertexArrayObject.bind(function () {
        for (var locationOrName in attributes) {
          var value = attributes[locationOrName];

          if (value instanceof Buffer) {
            _this.setBuffer(locationOrName, value);
          } else if (Array.isArray(value) && value.length && value[0] instanceof Buffer) {
            var buffer = value[0];
            var accessor = value[1];

            _this.setBuffer(locationOrName, buffer, accessor);
          } else if (ArrayBuffer.isView(value) || Array.isArray(value)) {
            _this.setConstant(locationOrName, value);
          } else {
            throw new Error(ERR_ATTRIBUTE_TYPE);
          }
        }

        _this.gl.bindBuffer(34962, null);
      });
      return this;
    }
  }, {
    key: "setElementBuffer",
    value: function setElementBuffer() {
      var elementBuffer = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var accessor = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      this.elements = elementBuffer;
      this.clearDrawParams();

      if (!this.vertexArrayObject.isDefaultArray) {
        this.vertexArrayObject.setElementBuffer(elementBuffer, accessor);
      }

      return this;
    }
  }, {
    key: "setBuffer",
    value: function setBuffer(locationOrName, buffer) {
      var appAccessor = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      if (buffer.target === 34963) {
        return this.setElementBuffer(buffer);
      }

      var _this$_resolveLocatio = this._resolveLocationAndAccessor(locationOrName, buffer, buffer.accessor, appAccessor),
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
  }, {
    key: "setConstant",
    value: function setConstant(locationOrName, arrayValue) {
      var appAccessor = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      var _this$_resolveLocatio2 = this._resolveLocationAndAccessor(locationOrName, arrayValue, appAccessor),
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
  }, {
    key: "unbindBuffers",
    value: function unbindBuffers() {
      var _this2 = this;

      this.vertexArrayObject.bind(function () {
        if (_this2.elements) {
          _this2.setElementBuffer(null);
        }

        _this2.buffer = _this2.buffer || new Buffer(_this2.gl, {
          size: 4
        });

        for (var location = 0; location < _this2.vertexArrayObject.MAX_ATTRIBUTES; location++) {
          if (_this2.values[location] instanceof Buffer) {
            _this2.gl.disableVertexAttribArray(location);

            _this2.gl.bindBuffer(34962, _this2.buffer.handle);

            _this2.gl.vertexAttribPointer(location, 1, 5126, false, 0, 0);
          }
        }
      });
      return this;
    }
  }, {
    key: "bindBuffers",
    value: function bindBuffers() {
      var _this3 = this;

      this.vertexArrayObject.bind(function () {
        if (_this3.elements) {
          _this3.setElementBuffer(_this3.elements);
        }

        for (var location = 0; location < _this3.vertexArrayObject.MAX_ATTRIBUTES; location++) {
          var buffer = _this3.values[location];

          if (buffer instanceof Buffer) {
            _this3.setBuffer(location, buffer);
          }
        }
      });
      return this;
    }
  }, {
    key: "bindForDraw",
    value: function bindForDraw(vertexCount, func) {
      var _this4 = this;

      var value;
      this.vertexArrayObject.bind(function () {
        _this4._setConstantAttributes(vertexCount);

        if (!_this4.vertexArrayObject.hasVertexArrays) {
          _this4.bindBuffers();
        }

        value = func();

        if (!_this4.vertexArrayObject.hasVertexArrays) {
          _this4.unbindBuffers();
        }
      });
      return value;
    }
  }, {
    key: "_resolveLocationAndAccessor",
    value: function _resolveLocationAndAccessor(locationOrName, value, valueAccessor, appAccessor) {
      var _this5 = this;

      var location = this._getAttributeIndex(locationOrName);

      if (!Number.isFinite(location) || location < 0) {
        this.unused[locationOrName] = value;
        log.once(3, function () {
          return "unused value ".concat(locationOrName, " in ").concat(_this5.id);
        })();
        return this;
      }

      var accessInfo = this._getAttributeInfo(locationOrName);

      var accessor = Accessor.resolve(accessInfo.accessor, valueAccessor, appAccessor);
      var size = accessor.size,
          type = accessor.type;
      assert(Number.isFinite(size) && Number.isFinite(type));
      return {
        location: location,
        accessor: accessor
      };
    }
  }, {
    key: "_getAttributeInfo",
    value: function _getAttributeInfo(attributeName) {
      return this.configuration && this.configuration.getAttributeInfo(attributeName);
    }
  }, {
    key: "_getAttributeIndex",
    value: function _getAttributeIndex(locationOrName) {
      if (this.configuration) {
        return this.configuration.getAttributeLocation(locationOrName);
      }

      var location = Number(locationOrName);

      if (Number.isFinite(location)) {
        return location;
      }

      return -1;
    }
  }, {
    key: "_setConstantAttributes",
    value: function _setConstantAttributes(vertexCount) {
      var constant = this.values[0];

      if (ArrayBuffer.isView(constant)) {
        this._setConstantAttributeZero(constant, vertexCount);
      }

      for (var location = 1; location < this.vertexArrayObject.MAX_ATTRIBUTES; location++) {
        constant = this.values[location];

        if (ArrayBuffer.isView(constant)) {
          this._setConstantAttribute(location, constant);
        }
      }
    }
  }, {
    key: "_setConstantAttributeZero",
    value: function _setConstantAttributeZero(constant, vertexCount) {
      if (VertexArrayObject.isSupported(this.gl, {
        constantAttributeZero: true
      })) {
        this._setConstantAttribute(0, constant);

        return;
      }

      var buffer = this.vertexArrayObject.getConstantBuffer(vertexCount);
      this.vertexArrayObject.setBuffer(0, buffer, this.accessors[0]);
    }
  }, {
    key: "_setConstantAttribute",
    value: function _setConstantAttribute(location, constant) {
      VertexArrayObject.setConstant(this.gl, location, constant);

      if (this.vertexArrayObject.isDefault) {
        this.vertexArrayObject.enable(location, false);
      }
    }
  }, {
    key: "_updateAttributeZeroBuffer",
    value: function _updateAttributeZeroBuffer(_ref) {
      var vertexCount = _ref.vertexCount,
          instanceCount = _ref.instanceCount;
      var elementCount = Math.max(vertexCount | 0, instanceCount | 0);
      var constant = this.values[0];

      if (ArrayBuffer.isView(constant)) {
        var size = elementCount;
        this.buffer = this.buffer || new Buffer(this.gl, {
          size: size
        });
      }
    }
  }, {
    key: "_updateDrawParams",
    value: function _updateDrawParams() {
      var drawParams = {
        isIndexed: false,
        isInstanced: false,
        indexCount: Infinity,
        vertexCount: Infinity,
        instanceCount: Infinity
      };

      for (var location = 0; location < this.vertexArrayObject.MAX_ATTRIBUTES; location++) {
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
  }, {
    key: "_updateDrawParamsForLocation",
    value: function _updateDrawParamsForLocation(drawParams, location) {
      var value = this.values[location];
      var accessor = this.accessors[location];

      if (!value) {
        return;
      }

      var divisor = accessor.divisor;
      var isInstanced = divisor > 0;
      drawParams.isInstanced = drawParams.isInstanced || isInstanced;

      if (value instanceof Buffer) {
        var buffer = value;

        if (isInstanced) {
          var instanceCount = buffer.getVertexCount(accessor);
          drawParams.instanceCount = Math.min(drawParams.instanceCount, instanceCount);
        } else {
          var vertexCount = buffer.getVertexCount(accessor);
          drawParams.vertexCount = Math.min(drawParams.vertexCount, vertexCount);
        }
      }
    }
  }, {
    key: "setElements",
    value: function setElements() {
      var elementBuffer = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var accessor = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      log.deprecated('setElements', 'setElementBuffer');
      return this.setElementBuffer(elementBuffer, accessor);
    }
  }]);

  return VertexArray;
}();

export { VertexArray as default };
//# sourceMappingURL=vertex-array.js.map