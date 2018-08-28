import { VertexShader, FragmentShader } from '../webgl/shader';
import Program from '../webgl/program';
import assert from '../utils/assert';
export default class ShaderCache {
  constructor({
    gl,
    _cachePrograms = false
  } = {}) {
    assert(gl);
    this.gl = gl;
    this.vertexShaders = {};
    this.fragmentShaders = {};
    this.programs = {};
    this._cachePrograms = _cachePrograms;
  }

  delete() {
    return this;
  }

  getVertexShader(gl, source) {
    assert(typeof source === 'string');
    assert(this._compareContexts(gl, this.gl));
    let shader = this.vertexShaders[source];

    if (!shader) {
      shader = new VertexShader(gl, source);
      this.vertexShaders[source] = shader;
    }

    return shader;
  }

  getFragmentShader(gl, source) {
    assert(typeof source === 'string');
    assert(this._compareContexts(gl, this.gl));
    let shader = this.fragmentShaders[source];

    if (!shader) {
      shader = new FragmentShader(gl, source);
      this.fragmentShaders[source] = shader;
    }

    return shader;
  }

  getProgram(gl, opts) {
    assert(this._compareContexts(gl, this.gl));
    assert(typeof opts.vs === 'string');
    assert(typeof opts.fs === 'string');
    assert(typeof opts.id === 'string');

    const cacheKey = this._getProgramKey(opts);

    let program = this.programs[cacheKey];

    if (program) {
      this._resetProgram(program);

      return program;
    }

    program = this._createNewProgram(gl, opts);

    if (this._cachePrograms && this._checkProgramProp(program)) {
      program._isCached = true;
      this.programs[cacheKey] = program;
    }

    return program;
  }

  _getProgramKey(opts) {
    return `${opts.id}-${opts.vs}-${opts.fs}`;
  }

  _checkProgramProp(program) {
    return !program.varyings;
  }

  _createNewProgram(gl, opts) {
    const vs = opts.vs,
          fs = opts.fs;
    const vertexShader = this.getVertexShader(gl, vs);
    const fragmentShader = this.getFragmentShader(gl, fs);
    return new Program(this.gl, Object.assign({}, opts, {
      vs: vertexShader,
      fs: fragmentShader
    }));
  }

  _resetProgram(program, opts) {
    program.reset();
  }

  _compareContexts(gl1, gl2) {
    return (gl1.gl || gl1) === (gl2.gl || gl2);
  }

}
//# sourceMappingURL=shader-cache.js.map