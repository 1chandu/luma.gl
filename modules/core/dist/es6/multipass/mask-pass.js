import Pass from './pass';
export default class MaskPass extends Pass {
  constructor(gl, props) {
    super(gl, Object.assign({
      id: 'mask-pass'
    }, props));
    this.inverse = false;
    this.clearStencil = true;
  }

  _renderPass({
    gl
  }) {
    let writeValue = 1;
    let clearValue = 0;

    if (this.inverse) {
      writeValue = 0;
      clearValue = 1;
    }

    gl.colorMask(false, false, false, false);
    gl.depthMask(false);
    gl.enable(2960);
    gl.stencilOp(7681, 7681, 7681);
    gl.stencilFunc(519, writeValue, 0xffffffff);
    gl.clearStencil(clearValue);
    gl.colorMask(true, true, true, true);
    gl.depthMask(true);
    gl.stencilFunc(514, 1, 0xffffffff);
    gl.stencilOp(7680, 7680, 7680);
  }

}
//# sourceMappingURL=mask-pass.js.map