"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = require("../utils");

var _math = require("math.gl");

var _assert = _interopRequireDefault(require("../utils/assert"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Object3D = function () {
  function Object3D(_ref) {
    var id = _ref.id,
        _ref$display = _ref.display,
        display = _ref$display === void 0 ? true : _ref$display;

    _classCallCheck(this, Object3D);

    this.position = new _math.Vector3();
    this.rotation = new _math.Vector3();
    this.scale = new _math.Vector3(1, 1, 1);
    this.matrix = new _math.Matrix4();
    this.id = id || (0, _utils.uid)(this.constructor.name);
    this.display = true;
    this.userData = {};
  }

  _createClass(Object3D, [{
    key: "setPosition",
    value: function setPosition(position) {
      (0, _assert.default)(position.length === 3, 'setPosition requires vector argument');
      this.position = position;
      return this;
    }
  }, {
    key: "setRotation",
    value: function setRotation(rotation) {
      (0, _assert.default)(rotation.length === 3, 'setRotation requires vector argument');
      this.rotation = rotation;
      return this;
    }
  }, {
    key: "setScale",
    value: function setScale(scale) {
      (0, _assert.default)(scale.length === 3, 'setScale requires vector argument');
      this.scale = scale;
      return this;
    }
  }, {
    key: "setMatrixComponents",
    value: function setMatrixComponents(_ref2) {
      var position = _ref2.position,
          rotation = _ref2.rotation,
          scale = _ref2.scale,
          _ref2$update = _ref2.update,
          update = _ref2$update === void 0 ? true : _ref2$update;

      if (position) {
        this.setPosition(position);
      }

      if (rotation) {
        this.setRotation(rotation);
      }

      if (scale) {
        this.setScale(scale);
      }

      if (update) {
        this.updateMatrix();
      }

      return this;
    }
  }, {
    key: "updateMatrix",
    value: function updateMatrix() {
      var pos = this.position;
      var rot = this.rotation;
      var scale = this.scale;
      this.matrix.identity();
      this.matrix.translate(pos);
      this.matrix.rotateXYZ(rot);
      this.matrix.scale(scale);
      return this;
    }
  }, {
    key: "update",
    value: function update() {
      var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          position = _ref3.position,
          rotation = _ref3.rotation,
          scale = _ref3.scale;

      if (position) {
        this.setPosition(position);
      }

      if (rotation) {
        this.setRotation(rotation);
      }

      if (scale) {
        this.setScale(scale);
      }

      this.updateMatrix();
      return this;
    }
  }, {
    key: "getCoordinateUniforms",
    value: function getCoordinateUniforms(viewMatrix, modelMatrix) {
      (0, _assert.default)(viewMatrix);
      modelMatrix = modelMatrix || this.matrix;
      var worldMatrix = new _math.Matrix4(viewMatrix).multiplyRight(modelMatrix);
      var worldInverse = worldMatrix.invert();
      var worldInverseTranspose = worldInverse.transpose();
      return {
        viewMatrix: viewMatrix,
        modelMatrix: modelMatrix,
        objectMatrix: modelMatrix,
        worldMatrix: worldMatrix,
        worldInverseMatrix: worldInverse,
        worldInverseTransposeMatrix: worldInverseTranspose
      };
    }
  }, {
    key: "transform",
    value: function transform() {
      if (!this.parent) {
        this.endPosition.set(this.position);
        this.endRotation.set(this.rotation);
        this.endScale.set(this.scale);
      } else {
        var parent = this.parent;
        this.endPosition.set(this.position.add(parent.endPosition));
        this.endRotation.set(this.rotation.add(parent.endRotation));
        this.endScale.set(this.scale.add(parent.endScale));
      }

      var ch = this.children;

      for (var i = 0; i < ch.length; ++i) {
        ch[i].transform();
      }

      return this;
    }
  }]);

  return Object3D;
}();

exports.default = Object3D;
//# sourceMappingURL=object-3d.js.map