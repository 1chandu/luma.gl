import transpileShader from 'luma.gl/shadertools/src/lib/transpile-shader';
import test from 'tape-catch';
var VS_GLSL_300 = "#version 300 es\n\nin vec4 positions;\nuniform sampler2D sampler;\nuniform samplerCube sCube;\nout vec4 vColor;\n\nvoid f(out float a, in float b) {}\n\nvoid main(void) {\n  gl_Position = positions;\n  vec4 texColor = texture(sampler, texCoord);\n  vec4 texCubeColor = textureCube(sCube, cubeCoord);\n  vColor = vec4(1., 0., 0., 1.);\n}\n";
var VS_GLSL_300_transpiled = "#version 300 es\n\nin vec4 positions;\nuniform sampler2D sampler;\nuniform samplerCube sCube;\nout vec4 vColor;\n\nvoid f(out float a, in float b) {}\n\nvoid main(void) {\n  gl_Position = positions;\n  vec4 texColor = texture(sampler, texCoord);\n  vec4 texCubeColor = texture(sCube, cubeCoord);\n  vColor = vec4(1., 0., 0., 1.);\n}\n";
var VS_GLSL_100 = "#version 300 es\n\nattribute vec4 positions;\nuniform sampler2D sampler;\nuniform samplerCube sCube;\nvarying vec4 vColor;\n\nvoid f(out float a, in float b) {}\n\nvoid main(void) {\n  gl_Position = positions;\n  vec4 texColor = texture2D(sampler, texCoord);\n  vec4 texCubeColor = textureCube(sCube, cubeCoord);\n  vColor = vec4(1., 0., 0., 1.);\n}\n";
var FS_GLSL_300 = "#version 300 es\n\nprecision highp float;\n\nout vec4 fragmentColor;\nuniform sampler2D sampler;\nuniform samplerCube sCube;\nin vec4 vColor;\n\nvoid f(out float a, in float b) {}\n\nvoid main(void) {\n  vec4 texColor = texture(sampler, texCoord);\n  vec4 texCubeColor = textureCube(sCube, cubeCoord);\n  fragmentColor = vColor;\n}\n";
var FS_GLSL_300_transpiled = "#version 300 es\n\nprecision highp float;\n\nout vec4 fragmentColor;\nuniform sampler2D sampler;\nuniform samplerCube sCube;\nin vec4 vColor;\n\nvoid f(out float a, in float b) {}\n\nvoid main(void) {\n  vec4 texColor = texture(sampler, texCoord);\n  vec4 texCubeColor = texture(sCube, cubeCoord);\n  fragmentColor = vColor;\n}\n";
var FS_GLSL_100 = "#version 300 es\n\nprecision highp float;\n\nout vec4 fragmentColor;\nuniform sampler2D sampler;\nuniform samplerCube sCube;\nvarying vec4 vColor;\n\nvoid f(out float a, in float b) {}\n\nvoid main(void) {\n  vec4 texColor = texture2D(sampler, texCoord);\n  vec4 texCubeColor = textureCube(sCube, cubeCoord);\n  fragmentColor = vColor;\n}\n";
test('transpileShader#import', function (t) {
  t.ok(transpileShader !== undefined, 'transpileShader import successful');
  t.end();
});
test('transpileShader#versions', function (t) {
  var assembleResult;
  assembleResult = transpileShader(VS_GLSL_300, 100, true);
  t.equal(assembleResult, VS_GLSL_100, 'correctly transpiled');
  assembleResult = transpileShader(FS_GLSL_300, 100, false);
  t.equal(assembleResult, FS_GLSL_100, 'correctly transpiled');
  assembleResult = transpileShader(VS_GLSL_100, 300, true);
  t.equal(assembleResult, VS_GLSL_300_transpiled, 'correctly transpiled');
  assembleResult = transpileShader(FS_GLSL_100, 300, false);
  t.equal(assembleResult, FS_GLSL_300_transpiled, 'correctly transpiled');
  assembleResult = transpileShader(VS_GLSL_300, 300, true);
  t.equal(assembleResult, VS_GLSL_300_transpiled, 'correctly transpiled');
  assembleResult = transpileShader(FS_GLSL_300, 300, false);
  t.equal(assembleResult, FS_GLSL_300_transpiled, 'correctly transpiled');
  t.end();
});
//# sourceMappingURL=transpile-shader.spec.js.map