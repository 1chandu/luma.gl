function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

import { decomposeCompositeGLType } from '../webgl-utils/attribute-utils';
import assert from '../utils/assert';
var ERR_ARGUMENT = 'UniformBufferLayout illegal argument';
var GL_FLOAT = 0x1406;
var GL_INT = 0x1404;
var GL_UNSIGNED_INT = 0x1405;

var UniformBufferLayout = function () {
  function UniformBufferLayout(layout) {
    var _this$typedArray;

    _classCallCheck(this, UniformBufferLayout);

    this.layout = {};
    this.size = 0;

    for (var key in layout) {
      this._addUniform(key, layout[key]);
    }

    var data = new Float32Array(this.size);
    this.typedArray = (_this$typedArray = {}, _defineProperty(_this$typedArray, GL_FLOAT, data), _defineProperty(_this$typedArray, GL_INT, new Int32Array(data.buffer)), _defineProperty(_this$typedArray, GL_UNSIGNED_INT, new Uint32Array(data.buffer)), _this$typedArray);
  }

  _createClass(UniformBufferLayout, [{
    key: "getBytes",
    value: function getBytes() {
      return this.size * 4;
    }
  }, {
    key: "getData",
    value: function getData() {
      return this.typedArray[GL_FLOAT];
    }
  }, {
    key: "getSubData",
    value: function getSubData(index) {
      var data;
      var offset;

      if (index === undefined) {
        data = this.data;
        offset = 0;
      } else {
        var begin = this.offsets[index];
        var end = begin + this.sizes[index];
        data = this.data.subarray(begin, end);
        offset = begin * 4;
      }

      return {
        data: data,
        offset: offset
      };
    }
  }, {
    key: "setUniforms",
    value: function setUniforms(values) {
      for (var key in values) {
        this._setValue(key, values[key]);
      }

      return this;
    }
  }, {
    key: "_setValue",
    value: function _setValue(key, value) {
      var layout = this.layout[key];
      assert(layout, 'UniformLayoutStd140 illegal argument');
      var typedArray = this.typedArray[layout.type];

      if (layout.size === 1) {
        typedArray[layout.offset] = value;
      } else {
        typedArray.set(value, layout.offset);
      }
    }
  }, {
    key: "_addUniform",
    value: function _addUniform(key, uniformType) {
      var typeAndComponents = decomposeCompositeGLType(uniformType);
      assert(typeAndComponents, ERR_ARGUMENT);
      var type = typeAndComponents.type,
          count = typeAndComponents.components;
      this.size = this._alignTo(this.size, count);
      var offset = this.size;
      this.size += count;
      this.layout[key] = {
        type: type,
        size: count,
        offset: offset
      };
    }
  }, {
    key: "_alignTo",
    value: function _alignTo(size, count) {
      switch (count) {
        case 1:
          return size;

        case 2:
          return size + size % 2;

        default:
          return size + (4 - size % 4) % 4;
      }
    }
  }]);

  return UniformBufferLayout;
}();

export { UniformBufferLayout as default };
//# sourceMappingURL=uniform-buffer-layout.js.map