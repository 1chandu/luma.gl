function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

import { clear, isWebGL } from '../webgl';
import Group from './group';
import assert from '../utils/assert';

function getDevicePixelRatio() {
  return typeof window !== 'undefined' ? window.devicePixelRatio : 1;
}

export default function pickModels(gl, props) {
  const models = props.models,
        position = props.position,
        _props$uniforms = props.uniforms,
        uniforms = _props$uniforms === void 0 ? {} : _props$uniforms,
        _props$parameters = props.parameters,
        parameters = _props$parameters === void 0 ? {} : _props$parameters,
        settings = props.settings,
        _props$useDevicePixel = props.useDevicePixels,
        useDevicePixels = _props$useDevicePixel === void 0 ? true : _props$useDevicePixel,
        framebuffer = props.framebuffer,
        context = props.context;
  assert(isWebGL(gl) && framebuffer && position);

  const _position = _slicedToArray(position, 2),
        x = _position[0],
        y = _position[1];

  framebuffer.resize({
    width: gl.canvas.width,
    height: gl.canvas.height
  });
  const dpr = useDevicePixels ? getDevicePixelRatio() : 1;
  const deviceX = x * dpr;
  const deviceY = gl.canvas.height - y * dpr;
  const group = new Group({
    children: models
  });
  return group.traverseReverse(model => {
    if (model.pickable) {
      clear(gl, {
        framebuffer,
        color: true,
        depth: true
      });
      model.setUniforms({
        picking_uActive: 1
      });
      model.draw(Object.assign({}, props, {
        uniforms,
        parameters,
        settings,
        framebuffer,
        context
      }));
      model.setUniforms({
        picking_uActive: 0
      });
      const color = framebuffer.readPixels({
        x: deviceX,
        y: deviceY,
        width: 1,
        height: 1,
        format: 6408,
        type: 5121
      });
      const isPicked = color[0] !== 0 || color[1] !== 0 || color[2] !== 0;

      if (isPicked) {
        return {
          model,
          color,
          x,
          y,
          deviceX,
          deviceY
        };
      }
    }

    return null;
  });
}
//# sourceMappingURL=pick-models.js.map