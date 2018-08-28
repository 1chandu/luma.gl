"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _accessor = _interopRequireDefault(require("./accessor"));

var _webglUtils = require("../webgl-utils");

var _attributeUtils = require("../webgl-utils/attribute-utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ProgramConfiguration = function () {
  function ProgramConfiguration(program) {
    _classCallCheck(this, ProgramConfiguration);

    this.id = program.id;
    this.attributeInfos = [];
    this.attributeInfosByName = {};
    this.varyingInfos = [];
    this.varyingInfosByName = {};
    Object.seal(this);

    this._readAttributesFromProgram(program);

    this._readVaryingsFromProgram(program);
  }

  _createClass(ProgramConfiguration, [{
    key: "getAttributeInfo",
    value: function getAttributeInfo(locationOrName) {
      var location = Number(locationOrName);

      if (Number.isFinite(location)) {
        return this.attributeInfos[location];
      }

      return this.attributeInfosByName[locationOrName] || null;
    }
  }, {
    key: "getAttributeLocation",
    value: function getAttributeLocation(locationOrName) {
      var attributeInfo = this.getAttributeInfo(locationOrName);
      return attributeInfo ? attributeInfo.location : -1;
    }
  }, {
    key: "getAttributeAccessor",
    value: function getAttributeAccessor(locationOrName) {
      var attributeInfo = this.getAttributeInfo(locationOrName);
      return attributeInfo ? attributeInfo.accessor : null;
    }
  }, {
    key: "getVaryingInfo",
    value: function getVaryingInfo(locationOrName) {
      var location = Number(locationOrName);

      if (Number.isFinite(location)) {
        return this.varyingInfos[location];
      }

      return this.varyingInfosByName[locationOrName] || null;
    }
  }, {
    key: "getVaryingIndex",
    value: function getVaryingIndex(locationOrName) {
      var varying = this.getVaryingInfo();
      return varying ? varying.location : -1;
    }
  }, {
    key: "getVaryingAccessor",
    value: function getVaryingAccessor(locationOrName) {
      var varying = this.getVaryingInfo();
      return varying ? varying.accessor : null;
    }
  }, {
    key: "_readAttributesFromProgram",
    value: function _readAttributesFromProgram(program) {
      var gl = program.gl;
      var count = gl.getProgramParameter(program.handle, 35721);

      for (var index = 0; index < count; index++) {
        var _gl$getActiveAttrib = gl.getActiveAttrib(program.handle, index),
            name = _gl$getActiveAttrib.name,
            type = _gl$getActiveAttrib.type,
            size = _gl$getActiveAttrib.size;

        var location = gl.getAttribLocation(program.handle, name);

        this._addAttribute(location, name, type, size);
      }

      this.attributeInfos.sort(function (a, b) {
        return a.location - b.location;
      });
    }
  }, {
    key: "_readVaryingsFromProgram",
    value: function _readVaryingsFromProgram(program) {
      var gl = program.gl;

      if (!(0, _webglUtils.isWebGL2)(gl)) {
        return;
      }

      var count = gl.getProgramParameter(program.handle, 35971);

      for (var location = 0; location < count; location++) {
        var _gl$getTransformFeedb = gl.getTransformFeedbackVarying(program.handle, location),
            name = _gl$getTransformFeedb.name,
            type = _gl$getTransformFeedb.type,
            size = _gl$getTransformFeedb.size;

        this._addVarying(location, name, type, size);
      }

      this.varyingInfos.sort(function (a, b) {
        return a.location - b.location;
      });
    }
  }, {
    key: "_addAttribute",
    value: function _addAttribute(location, name, compositeType, size) {
      var _decomposeCompositeGL = (0, _attributeUtils.decomposeCompositeGLType)(compositeType),
          type = _decomposeCompositeGL.type,
          components = _decomposeCompositeGL.components;

      var accessor = {
        type: type,
        size: size * components
      };

      this._inferProperties(location, name, accessor);

      var attributeInfo = {
        location: location,
        name: name,
        accessor: new _accessor.default(accessor)
      };
      this.attributeInfos.push(attributeInfo);
      this.attributeInfosByName[attributeInfo.name] = attributeInfo;
    }
  }, {
    key: "_inferProperties",
    value: function _inferProperties(location, name, accessor) {
      if (/instance/i.test(name)) {
        accessor.divisor = 1;
      }
    }
  }, {
    key: "_addVarying",
    value: function _addVarying(location, name, compositeType, size) {
      var _decomposeCompositeGL2 = (0, _attributeUtils.decomposeCompositeGLType)(compositeType),
          type = _decomposeCompositeGL2.type,
          components = _decomposeCompositeGL2.components;

      var accessor = new _accessor.default({
        type: type,
        size: size * components
      });
      var varying = {
        location: location,
        name: name,
        accessor: accessor
      };
      this.varyingInfos.push(varying);
      this.varyingInfosByName[varying.name] = varying;
    }
  }]);

  return ProgramConfiguration;
}();

exports.default = ProgramConfiguration;
//# sourceMappingURL=program-configuration.js.map