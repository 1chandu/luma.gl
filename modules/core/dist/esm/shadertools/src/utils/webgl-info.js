import isOldIE from './is-old-ie';
import assert from './assert';
var GL_TEXTURE_BINDING_3D = 0x806A;
var GL_VENDOR = 0x1F00;
var GL_RENDERER = 0x1F01;
var GL_VERSION = 0x1F02;
var GL_SHADING_LANGUAGE_VERSION = 0x8B8C;
var WEBGL_FEATURES = {
  GLSL_FRAG_DATA: ['WEBGL_draw_buffers', true],
  GLSL_FRAG_DEPTH: ['EXT_frag_depth', true],
  GLSL_DERIVATIVES: ['OES_standard_derivatives', true],
  GLSL_TEXTURE_LOD: ['EXT_shader_texture_lod', true]
};
var FEATURES = {};
Object.keys(WEBGL_FEATURES).forEach(function (key) {
  FEATURES[key] = key;
});
export { FEATURES };

function isWebGL2(gl) {
  return Boolean(gl && (typeof WebGL2RenderingContext !== 'undefined' && gl instanceof WebGL2RenderingContext || 32874 === GL_TEXTURE_BINDING_3D));
}

export function getContextInfo(gl) {
  var info = gl.getExtension('WEBGL_debug_renderer_info');
  var vendor = gl.getParameter(info && info.UNMASKED_VENDOR_WEBGL || GL_VENDOR);
  var renderer = gl.getParameter(info && info.UNMASKED_RENDERER_WEBGL || GL_RENDERER);
  var gpuVendor = identifyGPUVendor(vendor, renderer);
  var gpuInfo = {
    gpuVendor: gpuVendor,
    vendor: vendor,
    renderer: renderer,
    version: gl.getParameter(GL_VERSION),
    shadingLanguageVersion: gl.getParameter(GL_SHADING_LANGUAGE_VERSION)
  };
  return gpuInfo;
}

function identifyGPUVendor(vendor, renderer) {
  if (vendor.match(/NVIDIA/i) || renderer.match(/NVIDIA/i)) {
    return 'NVIDIA';
  }

  if (vendor.match(/INTEL/i) || renderer.match(/INTEL/i)) {
    return 'INTEL';
  }

  if (vendor.match(/AMD/i) || renderer.match(/AMD/i) || vendor.match(/ATI/i) || renderer.match(/ATI/i)) {
    return 'AMD';
  }

  return 'UNKNOWN GPU';
}

var compiledGlslExtensions = {};
export function canCompileGLGSExtension(gl, cap) {
  var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var feature = WEBGL_FEATURES[cap];
  assert(feature, cap);

  if (!isOldIE(opts)) {
    return true;
  }

  if (cap in compiledGlslExtensions) {
    return compiledGlslExtensions[cap];
  }

  var extensionName = feature[0];
  var source = "#extension GL_".concat(extensionName, " : enable\nvoid main(void) {}");
  var shader = gl.createShader(35633);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  var canCompile = gl.getShaderParameter(shader, 35713);
  gl.deleteShader(shader);
  compiledGlslExtensions[cap] = canCompile;
  return canCompile;
}

function getFeature(gl, cap) {
  var feature = WEBGL_FEATURES[cap];
  assert(feature, cap);
  var extensionName = isWebGL2(gl) ? feature[1] || feature[0] : feature[0];
  var value = typeof extensionName === 'string' ? Boolean(gl.getExtension(extensionName)) : extensionName;
  assert(value === false || value === true);
  return value;
}

export function hasFeatures(gl, features) {
  features = Array.isArray(features) ? features : [features];
  return features.every(function (feature) {
    return getFeature(gl, feature);
  });
}
//# sourceMappingURL=webgl-info.js.map