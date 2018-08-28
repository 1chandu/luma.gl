"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _resource = _interopRequireDefault(require("./resource"));

var _texture = _interopRequireDefault(require("./texture"));

var _framebuffer = _interopRequireDefault(require("./framebuffer"));

var _uniforms = require("./uniforms");

var _shader = require("./shader");

var _programConfiguration = _interopRequireDefault(require("./program-configuration"));

var _contextState = require("../webgl-context/context-state");

var _uniforms2 = require("../webgl/uniforms");

var _webglUtils = require("../webgl-utils");

var _attributeUtils = require("../webgl-utils/attribute-utils");

var _constantsToKeys = require("../webgl-utils/constants-to-keys");

var _utils = require("../utils");

var _assert = _interopRequireDefault(require("../utils/assert"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

var LOG_PROGRAM_PERF_PRIORITY = 4;
var GL_SEPARATE_ATTRIBS = 0x8C8D;

var Program = function (_Resource) {
  _inherits(Program, _Resource);

  function Program(gl) {
    var _this;

    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Program);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Program).call(this, gl, opts));

    _this.stubRemovedMethods('Program', 'v6.0', ['setVertexArray', 'setAttributes', 'setBuffers', 'unsetBuffers', 'use', 'getUniformCount', 'getUniformInfo', 'getUniformLocation', 'getUniformValue', 'getVarying', 'getFragDataLocation', 'getAttachedShaders', 'getAttributeCount', 'getAttributeLocation', 'getAttributeInfo']);

    _this._isCached = false;

    _this.initialize(opts);

    Object.seal(_assertThisInitialized(_assertThisInitialized(_this)));

    _this._setId(opts.id);

    return _this;
  }

  _createClass(Program, [{
    key: "initialize",
    value: function initialize() {
      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var vs = props.vs,
          fs = props.fs,
          varyings = props.varyings,
          _props$bufferMode = props.bufferMode,
          bufferMode = _props$bufferMode === void 0 ? GL_SEPARATE_ATTRIBS : _props$bufferMode;
      this.vs = typeof vs === 'string' ? new _shader.VertexShader(this.gl, {
        id: "".concat(props.id, "-vs"),
        source: vs
      }) : vs;
      this.fs = typeof fs === 'string' ? new _shader.FragmentShader(this.gl, {
        id: "".concat(props.id, "-fs"),
        source: fs
      }) : fs;
      (0, _assert.default)(this.vs instanceof _shader.VertexShader);
      (0, _assert.default)(this.fs instanceof _shader.FragmentShader);
      this.uniforms = {};
      this.samplers = {};

      if (varyings) {
        (0, _webglUtils.assertWebGL2Context)(this.gl);
        this.varyings = varyings;
        this.gl.transformFeedbackVaryings(this.handle, varyings, bufferMode);
      }

      this._compileAndLink();

      this._readUniformLocationsFromLinkedProgram();

      this.configuration = new _programConfiguration.default(this);
      return this.setProps(props);
    }
  }, {
    key: "delete",
    value: function _delete() {
      var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (this._isCached) {
        return this;
      }

      return _get(_getPrototypeOf(Program.prototype), "delete", this).call(this, opts);
    }
  }, {
    key: "setProps",
    value: function setProps(props) {
      if ('uniforms' in props) {
        this.setUniforms(props.uniforms, props.samplers);
      }

      return this;
    }
  }, {
    key: "draw",
    value: function draw(_ref) {
      var _this2 = this;

      var logPriority = _ref.logPriority,
          _ref$drawMode = _ref.drawMode,
          drawMode = _ref$drawMode === void 0 ? 4 : _ref$drawMode,
          vertexCount = _ref.vertexCount,
          _ref$offset = _ref.offset,
          offset = _ref$offset === void 0 ? 0 : _ref$offset,
          start = _ref.start,
          end = _ref.end,
          _ref$isIndexed = _ref.isIndexed,
          isIndexed = _ref$isIndexed === void 0 ? false : _ref$isIndexed,
          _ref$indexType = _ref.indexType,
          indexType = _ref$indexType === void 0 ? 5123 : _ref$indexType,
          _ref$isInstanced = _ref.isInstanced,
          isInstanced = _ref$isInstanced === void 0 ? false : _ref$isInstanced,
          _ref$instanceCount = _ref.instanceCount,
          instanceCount = _ref$instanceCount === void 0 ? 0 : _ref$instanceCount,
          _ref$vertexArray = _ref.vertexArray,
          vertexArray = _ref$vertexArray === void 0 ? null : _ref$vertexArray,
          transformFeedback = _ref.transformFeedback,
          framebuffer = _ref.framebuffer,
          _ref$parameters = _ref.parameters,
          parameters = _ref$parameters === void 0 ? {} : _ref$parameters,
          _ref$uniforms = _ref.uniforms,
          uniforms = _ref$uniforms === void 0 ? {} : _ref$uniforms,
          _ref$samplers = _ref.samplers,
          samplers = _ref$samplers === void 0 ? {} : _ref$samplers;

      if (logPriority !== undefined) {
        var fb = framebuffer ? framebuffer.id : 'default';
        var message = "mode=".concat((0, _constantsToKeys.getKey)(this.gl, drawMode), " verts=").concat(vertexCount, " ") + "instances=".concat(instanceCount, " indexType=").concat((0, _constantsToKeys.getKey)(this.gl, indexType), " ") + "isInstanced=".concat(isInstanced, " isIndexed=").concat(isIndexed, " ") + "Framebuffer=".concat(fb);

        _utils.log.log(logPriority, message)();
      }

      this.gl.useProgram(this.handle);
      (0, _assert.default)(vertexArray);
      vertexArray.bindForDraw(vertexCount, function () {
        if (uniforms) {
          _utils.log.deprecated('Program.draw({uniforms})', 'Program.setUniforms(uniforms)');

          _this2.setUniforms(uniforms, samplers);
        }

        if (framebuffer !== undefined) {
          parameters = Object.assign({}, parameters, {
            framebuffer: framebuffer
          });
        }

        if (transformFeedback) {
          var primitiveMode = (0, _attributeUtils.getPrimitiveDrawMode)(drawMode);
          transformFeedback.begin(primitiveMode);
        }

        (0, _contextState.withParameters)(_this2.gl, parameters, function () {
          if (isIndexed && isInstanced) {
            _this2.gl.drawElementsInstanced(drawMode, vertexCount, indexType, offset, instanceCount);
          } else if (isIndexed && (0, _webglUtils.isWebGL2)(_this2.gl) && !isNaN(start) && !isNaN(end)) {
            _this2.gl.drawRangeElements(drawMode, start, end, vertexCount, indexType, offset);
          } else if (isIndexed) {
            _this2.gl.drawElements(drawMode, vertexCount, indexType, offset);
          } else if (isInstanced) {
            _this2.gl.drawArraysInstanced(drawMode, offset, vertexCount, instanceCount);
          } else {
            _this2.gl.drawArrays(drawMode, offset, vertexCount);
          }
        });

        if (transformFeedback) {
          transformFeedback.end();
        }
      });
      return this;
    }
  }, {
    key: "setSamplers",
    value: function setSamplers(samplers) {
      Object.assign(this.samplers, samplers);
    }
  }, {
    key: "setUniforms",
    value: function setUniforms() {
      var uniforms = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var samplers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var _onChangeCallback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};

      var somethingChanged = false;

      for (var key in uniforms) {
        if (!(0, _uniforms2.areUniformsEqual)(this.uniforms[key], uniforms[key])) {
          somethingChanged = true;
          break;
        }
      }

      if (somethingChanged) {
        _onChangeCallback();

        (0, _uniforms2.checkUniformValues)(uniforms, this.id, this._uniformSetters);
        Object.assign(this.uniforms, uniforms);
        Object.assign(this.samplers, samplers);
      }

      this._setUniforms(this.uniforms, this.samplers);

      return this;
    }
  }, {
    key: "_setUniforms",
    value: function _setUniforms(uniforms) {
      var samplers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      this.gl.useProgram(this.handle);

      for (var uniformName in uniforms) {
        var uniform = uniforms[uniformName];
        var uniformSetter = this._uniformSetters[uniformName];
        var sampler = samplers[uniformName];

        if (uniformSetter) {
          if (uniform instanceof _framebuffer.default) {
            uniform = uniform.texture;
          }

          if (uniform instanceof _texture.default) {
            if (uniformSetter.textureIndex === undefined) {
              uniformSetter.textureIndex = this._textureIndexCounter++;
            }

            var texture = uniform;
            var textureIndex = uniformSetter.textureIndex;
            texture.bind(textureIndex);

            if (sampler) {
              sampler.bind(textureIndex);
            }

            uniformSetter(textureIndex);
          } else {
            uniformSetter(uniform);
          }
        }
      }

      return this;
    }
  }, {
    key: "_createHandle",
    value: function _createHandle() {
      return this.gl.createProgram();
    }
  }, {
    key: "_deleteHandle",
    value: function _deleteHandle() {
      this.gl.deleteProgram(this.handle);
    }
  }, {
    key: "_getOptionsFromHandle",
    value: function _getOptionsFromHandle(handle) {
      var shaderHandles = this.gl.getAttachedShaders(handle);
      var opts = {};
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = shaderHandles[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var shaderHandle = _step.value;
          var type = this.gl.getShaderParameter(this.handle, 35663);

          switch (type) {
            case 35633:
              opts.vs = new _shader.VertexShader({
                handle: shaderHandle
              });
              break;

            case 35632:
              opts.fs = new _shader.FragmentShader({
                handle: shaderHandle
              });
              break;

            default:
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return opts;
    }
  }, {
    key: "_getParameter",
    value: function _getParameter(pname) {
      return this.gl.getProgramParameter(this.handle, pname);
    }
  }, {
    key: "_setId",
    value: function _setId(id) {
      if (!id) {
        var programName = this._getName();

        this.id = (0, _utils.uid)(programName);
      }
    }
  }, {
    key: "_getName",
    value: function _getName() {
      var programName = this.vs.getName() || this.fs.getName();
      programName = programName.replace(/shader/i, '');
      programName = programName ? "".concat(programName, "-program") : 'program';
      return programName;
    }
  }, {
    key: "_compileAndLink",
    value: function _compileAndLink() {
      var gl = this.gl;
      gl.attachShader(this.handle, this.vs.handle);
      gl.attachShader(this.handle, this.fs.handle);

      _utils.log.time(LOG_PROGRAM_PERF_PRIORITY, "linkProgram for ".concat(this._getName()))();

      gl.linkProgram(this.handle);

      _utils.log.timeEnd(LOG_PROGRAM_PERF_PRIORITY, "linkProgram for ".concat(this._getName()))();

      if (gl.debug || _utils.log.priority > 0) {
        gl.validateProgram(this.handle);
        var linked = gl.getProgramParameter(this.handle, 35714);

        if (!linked) {
          throw new Error("Error linking: ".concat(gl.getProgramInfoLog(this.handle)));
        }
      }
    }
  }, {
    key: "_readUniformLocationsFromLinkedProgram",
    value: function _readUniformLocationsFromLinkedProgram() {
      var gl = this.gl;
      this._uniformSetters = {};
      this._uniformCount = this._getParameter(35718);

      for (var i = 0; i < this._uniformCount; i++) {
        var info = this.gl.getActiveUniform(this.handle, i);

        var _parseUniformName = (0, _uniforms.parseUniformName)(info.name),
            name = _parseUniformName.name,
            isArray = _parseUniformName.isArray;

        var location = gl.getUniformLocation(this.handle, name);
        this._uniformSetters[name] = (0, _uniforms.getUniformSetter)(gl, location, info, isArray);
      }

      this._textureIndexCounter = 0;
    }
  }, {
    key: "reset",
    value: function reset() {}
  }, {
    key: "getActiveUniforms",
    value: function getActiveUniforms(uniformIndices, pname) {
      return this.gl.getActiveUniforms(this.handle, uniformIndices, pname);
    }
  }, {
    key: "getUniformBlockIndex",
    value: function getUniformBlockIndex(blockName) {
      return this.gl.getUniformBlockIndex(this.handle, blockName);
    }
  }, {
    key: "getActiveUniformBlockParameter",
    value: function getActiveUniformBlockParameter(blockIndex, pname) {
      return this.gl.getActiveUniformBlockParameter(this.handle, blockIndex, pname);
    }
  }, {
    key: "uniformBlockBinding",
    value: function uniformBlockBinding(blockIndex, blockBinding) {
      this.gl.uniformBlockBinding(this.handle, blockIndex, blockBinding);
    }
  }]);

  return Program;
}(_resource.default);

exports.default = Program;
//# sourceMappingURL=program.js.map