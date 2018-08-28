import 'babel-polyfill';
import { document, window } from 'global';
import { Buffer, createGLContext, Program, setParameters, assembleShaders, registerShaderModules, fp64 } from 'luma.gl';
var BUFFER_DATA = new Float32Array([1, 1, -1, 1, 1, -1, -1, -1]);

function glEnumToString(gl, value) {
  if (value === 0) {
    return "NO_ERROR";
  }

  for (var p in gl) {
    if (gl[p] == value) {
      return p;
    }
  }

  return "0x" + value.toString(16);
}

;

function addSpan(contents, div) {
  if (div == undefined) {
    var divs = document.body.getElementsByClassName("testInfo");
    var lastDiv = divs[divs.length - 1];
    div = lastDiv;
  }

  var span = document.createElement("span");
  div.appendChild(span);
  span.innerHTML = contents + '<br />';
}

function addDiv(contents) {
  var testInfoDiv = document.createElement("div");
  document.body.appendChild(testInfoDiv);
  testInfoDiv.setAttribute("class", "testInfo");
  return testInfoDiv;
}

function logToConsole(msg) {
  if (window.console) window.console.log(msg);
}

function escapeHTML(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;");
}

function testPassed(msg) {
  addSpan('<span><span class="pass" style="color:green">PASS</span> ' + escapeHTML(msg) + '</span>');
  logToConsole('PASS ' + msg);
}

function testFailed(msg) {
  addSpan('<span><span class="fail" style="color:red">FAIL</span> ' + escapeHTML(msg) + '</span>');
  logToConsole('FAIL ' + msg);
}

function glErrorShouldBe(gl, glErrors, opt_msg) {
  if (!glErrors.length) {
    glErrors = [glErrors];
  }

  opt_msg = opt_msg || "";
  var err = gl.getError();
  var ndx = glErrors.indexOf(err);
  var errStrs = [];

  for (var ii = 0; ii < glErrors.length; ++ii) {
    errStrs.push(glEnumToString(gl, glErrors[ii]));
  }

  var expected = errStrs.join(" or ");

  if (ndx < 0) {
    var msg = "getError expected" + (glErrors.length > 1 ? " one of: " : ": ");
    testFailed(msg + expected + ". Was " + glEnumToString(gl, err) + " : " + opt_msg);
  } else {}
}

;

function fp64ify(a) {
  var a_hi = Math.fround(a);
  var a_lo = a - Math.fround(a);
  return new Float32Array([a_hi, a_lo]);
}

function getFloat64() {
  var upper = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 256;
  return Math.random() * Math.pow(2.0, (Math.random() - 0.5) * upper);
}

function getVec4Float64() {
  return [getFloat64(), getFloat64(), getFloat64(), getFloat64()];
}

function getMat4Float64() {
  var result = [];

  for (var i = 0; i < 16; i++) {
    result.push(getFloat64());
  }

  return result;
}

function initializeGL(canvas) {
  var gl = createGLContext(canvas);
  setParameters(gl, {
    viewport: [0, 0, canvas.width, canvas.height],
    clearColor: [0, 0, 0, 1],
    clearDepth: 1
  });
  gl.clear(16384 | 256);
  return gl;
}

function initializeTexTarget(gl) {
  var framebuffer = gl.createFramebuffer();
  gl.bindFramebuffer(36160, framebuffer);
  framebuffer.width = 10;
  framebuffer.height = 10;
  var tex = gl.createTexture();
  gl.bindTexture(3553, tex);
  gl.texParameteri(3553, 10240, 9728);
  gl.texParameteri(3553, 10241, 9728);
  gl.texImage2D(3553, 0, 34836, framebuffer.width, framebuffer.height, 0, 6408, 5126, null);
  var renderbuffer = gl.createRenderbuffer();
  gl.bindRenderbuffer(36161, renderbuffer);
  gl.renderbufferStorage(36161, 33189, framebuffer.width, framebuffer.height);
  gl.framebufferTexture2D(36160, 36064, 3553, tex, 0);
  gl.framebufferRenderbuffer(36160, 36096, 36161, renderbuffer);
}

function render(gl) {
  gl.drawArrays(5, 0, 4);
  glErrorShouldBe(gl, 0, "no error from draw");
}

function getGPUOutput(gl) {
  var width = gl.canvas.width;
  var height = gl.canvas.height;
  var buf = new Float32Array(width * height * 4);
  gl.readPixels(0, 0, width, height, 6408, 5126, buf);
  return buf;
}

function checkError(result, reference) {
  var currentDiv = addDiv();
  var line;
  addSpan("------------------------", currentDiv);
  var referece64 = reference[0] + reference[1];
  var result64 = result[0] + result[1];
  line = 'CPU output: (' + reference[0].toString() + ',' + reference[1].toString() + ') = ' + referece64.toString() + '<br>';
  addSpan(line, currentDiv);
  line = "GPU output: (" + result[0].toString() + ',' + result[1].toString() + ',' + result[2].toString() + ',' + result[3].toString() + ') = ' + result64.toString() + '<br>';
  addSpan(line, currentDiv);
  line = "error: " + Math.abs((referece64 - result64) / referece64) + '<br>';
  addSpan(line, currentDiv);
}

function test_float_add(gl, testName) {
  var currentDiv = addDiv();
  addSpan(testName, currentDiv);
  var float0 = getFloat64();
  var float1 = getFloat64();
  var float_ref = float0 + float1;
  var float0_vec2 = fp64ify(float0);
  var float1_vec2 = fp64ify(float1);
  var float_ref_vec2 = fp64ify(float_ref);
  var program = new Program(gl, assembleShaders(gl, {
    vs: require('./vs_float_add.glsl'),
    fs: require('./fs.glsl'),
    modules: ['fp64']
  }));
  program.setBuffers({
    positions: new Buffer(gl, {
      target: 34962,
      data: BUFFER_DATA,
      size: 2
    })
  }).setUniforms({
    a: float0_vec2,
    b: float1_vec2,
    ONE: 1.0
  });
  var line;
  line = "(" + float0_vec2.toString() + ') + (' + float1_vec2.toString() + ')<br>';
  addSpan(line, currentDiv);
  return float_ref_vec2;
}

function test_float_sub(gl, testName) {
  var currentDiv = addDiv();
  addSpan(testName, currentDiv);
  var float0 = getFloat64();
  var float1 = getFloat64();
  var float_ref = float0 - float1;
  var float0_vec2 = fp64ify(float0);
  var float1_vec2 = fp64ify(float1);
  var float_ref_vec2 = fp64ify(float_ref);
  var program = new Program(gl, assembleShaders(gl, {
    vs: require('./vs_float_sub.glsl'),
    fs: require('./fs.glsl'),
    modules: ['fp64']
  }));
  program.setBuffers({
    positions: new Buffer(gl, {
      target: 34962,
      data: BUFFER_DATA,
      size: 2
    })
  }).setUniforms({
    a: float0_vec2,
    b: float1_vec2,
    ONE: 1.0
  });
  var line;
  line = "(" + float0_vec2.toString() + ') - (' + float1_vec2.toString() + ')<br>';
  addSpan(line, currentDiv);
  return float_ref_vec2;
}

function test_float_mul(gl, testName) {
  var currentDiv = addDiv();
  addSpan(testName, currentDiv);
  var float0 = getFloat64(128);
  var float1 = getFloat64(128);
  var float_ref = float0 * float1;
  var float0_vec2 = fp64ify(float0);
  var float1_vec2 = fp64ify(float1);
  var float_ref_vec2 = fp64ify(float_ref);
  var program = new Program(gl, assembleShaders(gl, {
    vs: require('./vs_float_mul.glsl'),
    fs: require('./fs.glsl'),
    modules: ['fp64']
  }));
  program.setBuffers({
    positions: new Buffer(gl, {
      target: 34962,
      data: BUFFER_DATA,
      size: 2
    })
  }).setUniforms({
    a: float0_vec2,
    b: float1_vec2,
    ONE: 1.0
  });
  var line;
  line = "(" + float0_vec2.toString() + ') * (' + float1_vec2.toString() + ')<br>';
  addSpan(line, currentDiv);
  return float_ref_vec2;
}

function test_float_div(gl, testName) {
  var currentDiv = addDiv();
  addSpan(testName, currentDiv);
  var float0 = getFloat64(128);
  var float1 = getFloat64(128);
  var float_ref = float0 / float1;
  var float0_vec2 = fp64ify(float0);
  var float1_vec2 = fp64ify(float1);
  var float_ref_vec2 = fp64ify(float_ref);
  var program = new Program(gl, assembleShaders(gl, {
    vs: require('./vs_float_div.glsl'),
    fs: require('./fs.glsl'),
    modules: ['fp64']
  }));
  program.setBuffers({
    positions: new Buffer(gl, {
      target: 34962,
      data: BUFFER_DATA,
      size: 2
    })
  }).setUniforms({
    a: float0_vec2,
    b: float1_vec2,
    ONE: 1.0
  });
  var line;
  line = "(" + float0_vec2.toString() + ') / (' + float1_vec2.toString() + ')<br>';
  addSpan(line, currentDiv);
  return float_ref_vec2;
}

function test_float_sqrt(gl, testName) {
  var currentDiv = addDiv();
  addSpan(testName, currentDiv);
  var float0 = getFloat64(128);
  var float_ref = Math.sqrt(float0);
  var float0_vec2 = fp64ify(float0);
  var float_ref_vec2 = fp64ify(float_ref);
  var program = new Program(gl, assembleShaders(gl, {
    vs: require('./vs_float_sqrt.glsl'),
    fs: require('./fs.glsl'),
    modules: ['fp64']
  }));
  program.setBuffers({
    positions: new Buffer(gl, {
      target: 34962,
      data: BUFFER_DATA,
      size: 2
    })
  }).setUniforms({
    a: float0_vec2,
    ONE: 1.0
  });
  var line;
  line = "sqrt(" + float0_vec2.toString() + ')<br>';
  addSpan(line, currentDiv);
  return float_ref_vec2;
}

function test_float_exp(gl, testName) {
  var currentDiv = addDiv();
  addSpan(testName, currentDiv);
  var float0 = getFloat64(6);
  var float_ref = Math.exp(float0);
  var float0_vec2 = fp64ify(float0);
  var float_ref_vec2 = fp64ify(float_ref);
  var program = new Program(gl, assembleShaders(gl, {
    vs: require('./vs_float_exp.glsl'),
    fs: require('./fs.glsl'),
    modules: ['fp64']
  }));
  program.setBuffers({
    positions: new Buffer(gl, {
      target: 34962,
      data: BUFFER_DATA,
      size: 2
    })
  }).setUniforms({
    a: float0_vec2,
    ONE: 1.0
  });
  var line;
  line = "exp(" + float0_vec2.toString() + ')<br>';
  addSpan(line, currentDiv);
  return float_ref_vec2;
}

function test_float_log(gl, testName) {
  var currentDiv = addDiv();
  addSpan(testName, currentDiv);
  var float0 = getFloat64(24);
  var float_ref = Math.log(float0);
  var float0_vec2 = fp64ify(float0);
  var float_ref_vec2 = fp64ify(float_ref);
  var program = new Program(gl, assembleShaders(gl, {
    vs: require('./vs_float_log.glsl'),
    fs: require('./fs.glsl'),
    modules: ['fp64']
  }));
  program.setBuffers({
    positions: new Buffer(gl, {
      target: 34962,
      data: BUFFER_DATA,
      size: 2
    })
  }).setUniforms({
    a: float0_vec2,
    ONE: 1.0
  });
  var line;
  line = "log(" + float0_vec2.toString() + ')<br>';
  addSpan(line, currentDiv);
  return float_ref_vec2;
}

function test_float_sin(gl, testName) {
  var currentDiv = addDiv();
  addSpan(testName, currentDiv);
  var float0 = getFloat64(8);
  var float_ref = Math.sin(float0);
  var float0_vec2 = fp64ify(float0);
  var float_ref_vec2 = fp64ify(float_ref);
  var program = new Program(gl, assembleShaders(gl, {
    vs: require('./vs_float_sin.glsl'),
    fs: require('./fs.glsl'),
    modules: ['fp64']
  }));
  program.setBuffers({
    positions: new Buffer(gl, {
      target: 34962,
      data: BUFFER_DATA,
      size: 2
    })
  }).setUniforms({
    a: float0_vec2,
    ONE: 1.0
  });
  var line;
  line = "sin(" + float0_vec2.toString() + ')<br>';
  addSpan(line, currentDiv);
  return float_ref_vec2;
}

function test_float_cos(gl, testName) {
  var currentDiv = addDiv();
  addSpan(testName, currentDiv);
  var float0 = getFloat64(8);
  var float_ref = Math.cos(float0);
  var float0_vec2 = fp64ify(float0);
  var float_ref_vec2 = fp64ify(float_ref);
  var program = new Program(gl, assembleShaders(gl, {
    vs: require('./vs_float_cos.glsl'),
    fs: require('./fs.glsl'),
    modules: ['fp64']
  }));
  program.setBuffers({
    positions: new Buffer(gl, {
      target: 34962,
      data: BUFFER_DATA,
      size: 2
    })
  }).setUniforms({
    a: float0_vec2,
    ONE: 1.0
  });
  var line;
  line = "cos(" + float0_vec2.toString() + ')<br>';
  addSpan(line, currentDiv);
  return float_ref_vec2;
}

function test_float_tan(gl, testName) {
  var currentDiv = addDiv();
  addSpan(testName, currentDiv);
  var float0 = getFloat64(8);
  var float_ref = Math.tan(float0);
  var float0_vec2 = fp64ify(float0);
  var float_ref_vec2 = fp64ify(float_ref);
  var program = new Program(gl, assembleShaders(gl, {
    vs: require('./vs_float_tan.glsl'),
    fs: require('./fs.glsl'),
    modules: ['fp64']
  }));
  program.setBuffers({
    positions: new Buffer(gl, {
      target: 34962,
      data: BUFFER_DATA,
      size: 2
    })
  }).setUniforms({
    a: float0_vec2,
    ONE: 1.0
  });
  var line;
  line = "tan(" + float0_vec2.toString() + ')<br>';
  addSpan(line, currentDiv);
  return float_ref_vec2;
}

function test_float_radians(gl, testName) {
  var currentDiv = addDiv();
  addSpan(testName, currentDiv);
  var float0 = getFloat64(16);
  var float_ref = float0 * Math.PI / 180.0;
  var float0_vec2 = fp64ify(float0);
  var float_ref_vec2 = fp64ify(float_ref);
  var program = new Program(gl, assembleShaders(gl, {
    vs: require('./vs_float_radians.glsl'),
    fs: require('./fs.glsl'),
    modules: ['fp64']
  }));
  program.setBuffers({
    positions: new Buffer(gl, {
      target: 34962,
      data: BUFFER_DATA,
      size: 2
    })
  }).setUniforms({
    a: float0_vec2,
    ONE: 1.0
  });
  var line;
  line = "tan(" + float0_vec2.toString() + ')<br>';
  addSpan(line, currentDiv);
  return float_ref_vec2;
}

window.onload = function () {
  var canvas = document.createElement('canvas');
  document.body.appendChild(canvas);
  canvas.width = 16;
  canvas.height = 16;
  var gl = initializeGL(canvas);
  initializeTexTarget(gl);
  registerShaderModules([fp64]);
  var idx0;
  var test_no = 0;
  var loop = 100;

  for (idx0 = 0; idx0 < loop; idx0++) {
    var currentDiv = addDiv();
    addSpan("------------------------", currentDiv);
    addSpan("Loop No. " + test_no++, currentDiv);
    var cpu_result = test_float_add(gl, "Float addition test");
    render(gl);
    var gpu_result = getGPUOutput(gl);
    checkError(gpu_result, cpu_result);
    addSpan("------------------------", currentDiv);
  }

  for (idx0 = 0; idx0 < loop; idx0++) {
    var currentDiv = addDiv();
    addSpan("------------------------", currentDiv);
    addSpan("Loop No. " + test_no++, currentDiv);
    var cpu_result = test_float_sub(gl, "Float subtraction test");
    render(gl);
    var gpu_result = getGPUOutput(gl);
    checkError(gpu_result, cpu_result);
    addSpan("------------------------", currentDiv);
  }

  for (idx0 = 0; idx0 < loop; idx0++) {
    var currentDiv = addDiv();
    addSpan("------------------------", currentDiv);
    addSpan("Loop No. " + test_no++, currentDiv);
    var cpu_result = test_float_mul(gl, "Float multiplication test");
    render(gl);
    var gpu_result = getGPUOutput(gl);
    checkError(gpu_result, cpu_result);
    addSpan("------------------------", currentDiv);
  }

  for (idx0 = 0; idx0 < loop; idx0++) {
    var currentDiv = addDiv();
    addSpan("------------------------", currentDiv);
    addSpan("Loop No. " + test_no++, currentDiv);
    var cpu_result = test_float_div(gl, "Float division test");
    render(gl);
    var gpu_result = getGPUOutput(gl);
    checkError(gpu_result, cpu_result);
    addSpan("------------------------", currentDiv);
  }

  for (idx0 = 0; idx0 < loop; idx0++) {
    var currentDiv = addDiv();
    addSpan("------------------------", currentDiv);
    addSpan("Loop No. " + test_no++, currentDiv);
    var cpu_result = test_float_sqrt(gl, "Float sqrt test");
    render(gl);
    var gpu_result = getGPUOutput(gl);
    checkError(gpu_result, cpu_result);
    addSpan("------------------------", currentDiv);
  }

  for (idx0 = 0; idx0 < loop; idx0++) {
    var currentDiv = addDiv();
    addSpan("------------------------", currentDiv);
    addSpan("Loop No. " + test_no++, currentDiv);
    var cpu_result = test_float_exp(gl, "Float exp test");
    render(gl);
    var gpu_result = getGPUOutput(gl);
    checkError(gpu_result, cpu_result);
    addSpan("------------------------", currentDiv);
  }

  for (idx0 = 0; idx0 < loop; idx0++) {
    var currentDiv = addDiv();
    addSpan("------------------------", currentDiv);
    addSpan("Loop No. " + test_no++, currentDiv);
    var cpu_result = test_float_log(gl, "Float log test");
    render(gl);
    var gpu_result = getGPUOutput(gl);
    checkError(gpu_result, cpu_result);
    addSpan("------------------------", currentDiv);
  }

  for (idx0 = 0; idx0 < loop; idx0++) {
    var currentDiv = addDiv();
    addSpan("------------------------", currentDiv);
    addSpan("Loop No. " + test_no++, currentDiv);
    var cpu_result = test_float_sin(gl, "Float sin test");
    render(gl);
    var gpu_result = getGPUOutput(gl);
    checkError(gpu_result, cpu_result);
    addSpan("------------------------", currentDiv);
  }

  for (idx0 = 0; idx0 < loop; idx0++) {
    var currentDiv = addDiv();
    addSpan("------------------------", currentDiv);
    addSpan("Loop No. " + test_no++, currentDiv);
    var cpu_result = test_float_cos(gl, "Float cos test");
    render(gl);
    var gpu_result = getGPUOutput(gl);
    checkError(gpu_result, cpu_result);
    addSpan("------------------------", currentDiv);
  }

  for (idx0 = 0; idx0 < loop; idx0++) {
    var currentDiv = addDiv();
    addSpan("------------------------", currentDiv);
    addSpan("Loop No. " + test_no++, currentDiv);
    var cpu_result = test_float_tan(gl, "Float tan test");
    render(gl);
    var gpu_result = getGPUOutput(gl);
    checkError(gpu_result, cpu_result);
    addSpan("------------------------", currentDiv);
  }

  for (idx0 = 0; idx0 < loop; idx0++) {
    var currentDiv = addDiv();
    addSpan("------------------------", currentDiv);
    addSpan("Loop No. " + test_no++, currentDiv);
    var cpu_result = test_float_radians(gl, "Float radians test");
    render(gl);
    var gpu_result = getGPUOutput(gl);
    checkError(gpu_result, cpu_result);
    addSpan("------------------------", currentDiv);
  }
};
//# sourceMappingURL=fp64-shader.spec.js.map