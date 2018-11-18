import { withParameters, setParameters } from '../webgl-context';
import Pass from './pass';

function getMask(indices = [], bits = 8) {
  let mask = 0;
  indices.forEach(index => {
    mask = mask & 1 >> index;
  });
  return mask;
}

export default class StencilPass extends Pass {
  constructor(gl, props = {}) {
    super(gl, Object.assign({
      id: 'simple-outline-pass',
      swap: false
    }, props));
    this.props = Object.assign({}, props);
    this.setProps(props);
  }

  _renderPass({
    gl,
    inputBuffer,
    outputBuffer,
    animationPropst
  }) {
    const stencilReadMask = getMask(this.props.stencils);
    const stencilWriteMask = getMask(this.props.updateStencil);
    withParameters(gl, {
      stencilTest: stencilReadMask !== 0 && stencilWriteMask !== 0,
      stencilOp: [7680, 7680, 7681]
    }, () => {
      if (stencilReadMask) {
        setParameters(gl, {
          stencilFunc: [514, 0, stencilReadMask]
        });
      }

      setParameters(gl, {
        stencilMask: stencilWriteMask
      });

      if (this.props.clearStencil) {
        gl.clear(1024);
      }

      for (const model of this.props.models) {
        model.setUniforms(this.props.normalUniforms);
        model.draw(this.props.drawParams);
      }

      setParameters(gl, {
        stencilFunc: [514, 0, stencilReadMask],
        stencilMask: 0x00
      });

      for (const model of this.props.models) {
        model.setUniforms(this.props.outlineUniforms);
        model.draw(this.props.drawParams);
        model.setUniforms(this.props.normalUniforms);
      }
    });
  }

}
//# sourceMappingURL=stencil-pass.js.map