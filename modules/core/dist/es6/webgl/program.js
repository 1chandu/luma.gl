import Resource from './resource';
import Texture from './texture';
import Framebuffer from './framebuffer';
import { parseUniformName, getUniformSetter } from './uniforms';
import { VertexShader, FragmentShader } from './shader';
import ProgramConfiguration from './program-configuration';
import { withParameters } from '../webgl-context/context-state';
import { checkUniformValues, areUniformsEqual } from '../webgl/uniforms';
import { assertWebGL2Context, isWebGL2 } from '../webgl-utils';
import { getPrimitiveDrawMode } from '../webgl-utils/attribute-utils';
import { getKey } from '../webgl-utils/constants-to-keys';
import { log, uid } from '../utils';
import assert from '../utils/assert';
const LOG_PROGRAM_PERF_PRIORITY = 4;
const GL_SEPARATE_ATTRIBS = 0x8C8D;
export default class Program extends Resource {
  constructor(gl, opts = {}) {
    super(gl, opts);
    this.stubRemovedMethods('Program', 'v6.0', ['setVertexArray', 'setAttributes', 'setBuffers', 'unsetBuffers', 'use', 'getUniformCount', 'getUniformInfo', 'getUniformLocation', 'getUniformValue', 'getVarying', 'getFragDataLocation', 'getAttachedShaders', 'getAttributeCount', 'getAttributeLocation', 'getAttributeInfo']);
    this._isCached = false;
    this.initialize(opts);
    Object.seal(this);

    this._setId(opts.id);
  }

  initialize(props = {}) {
    const vs = props.vs,
          fs = props.fs,
          varyings = props.varyings,
          _props$bufferMode = props.bufferMode,
          bufferMode = _props$bufferMode === void 0 ? GL_SEPARATE_ATTRIBS : _props$bufferMode;
    this.vs = typeof vs === 'string' ? new VertexShader(this.gl, {
      id: `${props.id}-vs`,
      source: vs
    }) : vs;
    this.fs = typeof fs === 'string' ? new FragmentShader(this.gl, {
      id: `${props.id}-fs`,
      source: fs
    }) : fs;
    assert(this.vs instanceof VertexShader);
    assert(this.fs instanceof FragmentShader);
    this.uniforms = {};
    this.samplers = {};

    if (varyings) {
      assertWebGL2Context(this.gl);
      this.varyings = varyings;
      this.gl.transformFeedbackVaryings(this.handle, varyings, bufferMode);
    }

    this._compileAndLink();

    this._readUniformLocationsFromLinkedProgram();

    this.configuration = new ProgramConfiguration(this);
    return this.setProps(props);
  }

  delete(opts = {}) {
    if (this._isCached) {
      return this;
    }

    return super.delete(opts);
  }

  setProps(props) {
    if ('uniforms' in props) {
      this.setUniforms(props.uniforms, props.samplers);
    }

    return this;
  }

  draw({
    logPriority,
    drawMode = 4,
    vertexCount,
    offset = 0,
    start,
    end,
    isIndexed = false,
    indexType = 5123,
    isInstanced = false,
    instanceCount = 0,
    vertexArray = null,
    transformFeedback,
    framebuffer,
    parameters = {},
    uniforms = {},
    samplers = {}
  }) {
    if (logPriority !== undefined) {
      const fb = framebuffer ? framebuffer.id : 'default';
      const message = `mode=${getKey(this.gl, drawMode)} verts=${vertexCount} ` + `instances=${instanceCount} indexType=${getKey(this.gl, indexType)} ` + `isInstanced=${isInstanced} isIndexed=${isIndexed} ` + `Framebuffer=${fb}`;
      log.log(logPriority, message)();
    }

    this.gl.useProgram(this.handle);
    assert(vertexArray);
    vertexArray.bindForDraw(vertexCount, () => {
      if (uniforms) {
        log.deprecated('Program.draw({uniforms})', 'Program.setUniforms(uniforms)');
        this.setUniforms(uniforms, samplers);
      }

      if (framebuffer !== undefined) {
        parameters = Object.assign({}, parameters, {
          framebuffer
        });
      }

      if (transformFeedback) {
        const primitiveMode = getPrimitiveDrawMode(drawMode);
        transformFeedback.begin(primitiveMode);
      }

      withParameters(this.gl, parameters, () => {
        if (isIndexed && isInstanced) {
          this.gl.drawElementsInstanced(drawMode, vertexCount, indexType, offset, instanceCount);
        } else if (isIndexed && isWebGL2(this.gl) && !isNaN(start) && !isNaN(end)) {
          this.gl.drawRangeElements(drawMode, start, end, vertexCount, indexType, offset);
        } else if (isIndexed) {
          this.gl.drawElements(drawMode, vertexCount, indexType, offset);
        } else if (isInstanced) {
          this.gl.drawArraysInstanced(drawMode, offset, vertexCount, instanceCount);
        } else {
          this.gl.drawArrays(drawMode, offset, vertexCount);
        }
      });

      if (transformFeedback) {
        transformFeedback.end();
      }
    });
    return this;
  }

  setSamplers(samplers) {
    Object.assign(this.samplers, samplers);
  }

  setUniforms(uniforms = {}, samplers = {}, _onChangeCallback = () => {}) {
    let somethingChanged = false;

    for (const key in uniforms) {
      if (!areUniformsEqual(this.uniforms[key], uniforms[key])) {
        somethingChanged = true;
        break;
      }
    }

    if (somethingChanged) {
      _onChangeCallback();

      checkUniformValues(uniforms, this.id, this._uniformSetters);
      Object.assign(this.uniforms, uniforms);
      Object.assign(this.samplers, samplers);
    }

    this._setUniforms(this.uniforms, this.samplers);

    return this;
  }

  _setUniforms(uniforms, samplers = {}) {
    this.gl.useProgram(this.handle);

    for (const uniformName in uniforms) {
      let uniform = uniforms[uniformName];
      const uniformSetter = this._uniformSetters[uniformName];
      const sampler = samplers[uniformName];

      if (uniformSetter) {
        if (uniform instanceof Framebuffer) {
          uniform = uniform.texture;
        }

        if (uniform instanceof Texture) {
          if (uniformSetter.textureIndex === undefined) {
            uniformSetter.textureIndex = this._textureIndexCounter++;
          }

          const texture = uniform;
          const textureIndex = uniformSetter.textureIndex;
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

  _createHandle() {
    return this.gl.createProgram();
  }

  _deleteHandle() {
    this.gl.deleteProgram(this.handle);
  }

  _getOptionsFromHandle(handle) {
    const shaderHandles = this.gl.getAttachedShaders(handle);
    const opts = {};

    for (const shaderHandle of shaderHandles) {
      const type = this.gl.getShaderParameter(this.handle, 35663);

      switch (type) {
        case 35633:
          opts.vs = new VertexShader({
            handle: shaderHandle
          });
          break;

        case 35632:
          opts.fs = new FragmentShader({
            handle: shaderHandle
          });
          break;

        default:
      }
    }

    return opts;
  }

  _getParameter(pname) {
    return this.gl.getProgramParameter(this.handle, pname);
  }

  _setId(id) {
    if (!id) {
      const programName = this._getName();

      this.id = uid(programName);
    }
  }

  _getName() {
    let programName = this.vs.getName() || this.fs.getName();
    programName = programName.replace(/shader/i, '');
    programName = programName ? `${programName}-program` : 'program';
    return programName;
  }

  _compileAndLink() {
    const gl = this.gl;
    gl.attachShader(this.handle, this.vs.handle);
    gl.attachShader(this.handle, this.fs.handle);
    log.time(LOG_PROGRAM_PERF_PRIORITY, `linkProgram for ${this._getName()}`)();
    gl.linkProgram(this.handle);
    log.timeEnd(LOG_PROGRAM_PERF_PRIORITY, `linkProgram for ${this._getName()}`)();

    if (gl.debug || log.priority > 0) {
      gl.validateProgram(this.handle);
      const linked = gl.getProgramParameter(this.handle, 35714);

      if (!linked) {
        throw new Error(`Error linking: ${gl.getProgramInfoLog(this.handle)}`);
      }
    }
  }

  _readUniformLocationsFromLinkedProgram() {
    const gl = this.gl;
    this._uniformSetters = {};
    this._uniformCount = this._getParameter(35718);

    for (let i = 0; i < this._uniformCount; i++) {
      const info = this.gl.getActiveUniform(this.handle, i);

      const _parseUniformName = parseUniformName(info.name),
            name = _parseUniformName.name,
            isArray = _parseUniformName.isArray;

      const location = gl.getUniformLocation(this.handle, name);
      this._uniformSetters[name] = getUniformSetter(gl, location, info, isArray);
    }

    this._textureIndexCounter = 0;
  }

  reset() {}

  getActiveUniforms(uniformIndices, pname) {
    return this.gl.getActiveUniforms(this.handle, uniformIndices, pname);
  }

  getUniformBlockIndex(blockName) {
    return this.gl.getUniformBlockIndex(this.handle, blockName);
  }

  getActiveUniformBlockParameter(blockIndex, pname) {
    return this.gl.getActiveUniformBlockParameter(this.handle, blockIndex, pname);
  }

  uniformBlockBinding(blockIndex, blockBinding) {
    this.gl.uniformBlockBinding(this.handle, blockIndex, blockBinding);
  }

}
//# sourceMappingURL=program.js.map