import {WebGLRenderingContext} from './webgl-types';
import {glGet, assertWebGL2} from './context';

import assert from 'assert';

const ERR_CONTEXT = 'Invalid WebGLRenderingContext';

export default class Renderbuffer {

  static makeFrom(gl, object = {}) {
    return object instanceof Renderbuffer ? object :
      // Use .handle (e.g from stack.gl's gl-buffer), else use buffer directly
      new Renderbuffer(gl, {handle: object.handle || object});
  }

  constructor(gl, opts = {}) {
    assert(gl instanceof WebGLRenderingContext, ERR_CONTEXT);

    this.gl = gl;
    this.handle = gl.createRenderbuffer();
    if (!this.handle) {
      throw new Error('Failed to create WebGL Renderbuffer');
    }
  }

  delete() {
    const {gl} = this;
    gl.deleteRenderbuffer(this.handle);
    return this;
  }

  bind() {
    const {gl} = this;
    gl.bindRenderbuffer(gl.RENDERBUFFER, this.handle);
    return this;
  }

  unbind() {
    const {gl} = this;
    gl.bindRenderbuffer(gl.RENDERBUFFER, this.handle);
    return this;
  }

  /**
   * Creates and initializes a renderbuffer object's data store
   *
   * @param {GLenum} opt.internalFormat -
   * @param {GLint} opt.width -
   * @param {GLint} opt.height
   * @param {Boolean} opt.autobind=true - method call will bind/unbind object
   * @returns {Renderbuffer} returns itself to enable chaining
   */
  storage({internalFormat, width, height}) {
    const {gl} = this;
    assert(internalFormat, 'Needs internalFormat');
    this.bind();
    gl.renderbufferStorage(
      gl.RENDERBUFFER, glGet(gl, internalFormat), width, height
    );
    this.unbind();
    return this;
  }

  // @param {Boolean} opt.autobind=true - method call will bind/unbind object
  // @returns {GLenum|GLint} - depends on pname
  getParameter(pname) {
    const {gl} = this;
    this.bind();
    const value =
      gl.getRenderbufferParameter(gl.RENDERBUFFER, glGet(gl, pname));
    this.unbind();
    return value;
  }

  // @returns {GLint} - width of the image of the currently bound renderbuffer.
  get width() {
    return this.getParameter(this.gl.RENDERBUFFER_WIDTH);
  }

  // @returns {GLint} - height of the image of the currently bound renderbuffer.
  get height() {
    return this.getParameter(this.gl.RENDERBUFFER_HEIGHT);
  }

  // @returns {GLenum} internal format of the currently bound renderbuffer.
  // The default is gl.RGBA4. Possible return values:
  // gl.RGBA4: 4 red bits, 4 green bits, 4 blue bits 4 alpha bits.
  // gl.RGB565: 5 red bits, 6 green bits, 5 blue bits.
  // gl.RGB5_A1: 5 red bits, 5 green bits, 5 blue bits, 1 alpha bit.
  // gl.DEPTH_COMPONENT16: 16 depth bits.
  // gl.STENCIL_INDEX8: 8 stencil bits.
  get internalFormat() {
    return this.getParameter(this.gl.RENDERBUFFER_INTERNAL_FORMAT);
  }

  //  @returns {GLint} - resolution size (in bits) for the green color.
  get greenSize() {
    return this.getParameter(this.gl.RENDERBUFFER_GREEN_SIZE);
  }

  // @returns {GLint} - resolution size (in bits) for the blue color.
  get blueSize() {
    return this.getParameter(this.gl.RENDERBUFFER_BLUE_SIZE);
  }

  // @returns {GLint} - resolution size (in bits) for the red color.
  get redSize() {
    return this.getParameter(this.gl.RENDERBUFFER_RED_SIZE);
  }

  // @returns {GLint} - resolution size (in bits) for the alpha component.
  get alphaSize() {
    return this.getParameter(this.gl.RENDERBUFFER_ALPHA_SIZE);
  }

  // @returns {GLint} - resolution size (in bits) for the depth component.
  get depthSize() {
    return this.getParameter(this.gl.RENDERBUFFER_DEPTH_SIZE);
  }

  // @returns {GLint} - resolution size (in bits) for the stencil component.
  get stencilSize() {
    return this.getParameter(this.gl.RENDERBUFFER_STENCIL_SIZE);
  }

  // When using a WebGL 2 context, the following value is available
  get samples() {
    return this.getParameter(this.gl.RENDERBUFFER_SAMPLES);
  }

  // WEBGL2 METHODS

  // (OpenGL ES 3.0.4 §4.4.2)
  storageMultisample({
    samples,
    internalformat,
    width,
    height
  } = {}) {
    const {gl} = this;
    assertWebGL2(gl);
    gl.renderbufferStorageMultisample(
      gl.RENDERBUFFER, samples, internalformat, width, height
    );
    return this;
  }

  // (OpenGL ES 3.0.4 §6.1.15)
  getInternalformatParameter({internalformat, pname = 'SAMPLES'}) {
    const {gl} = this;
    assertWebGL2(gl);
    return gl.getInternalformatParameter(
      gl.RENDERBUFFER, internalformat, pname
    );
  }
}
