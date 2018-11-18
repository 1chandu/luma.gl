import isOldIE from './is-old-ie';
import assert from './assert';
const GL_TEXTURE_BINDING_3D = 0x806A;
const GL_VENDOR = 0x1F00;
const GL_RENDERER = 0x1F01;
const GL_VERSION = 0x1F02;
const GL_SHADING_LANGUAGE_VERSION = 0x8B8C;
const WEBGL_FEATURES = {
  GLSL_FRAG_DATA: ['WEBGL_draw_buffers', true],
  GLSL_FRAG_DEPTH: ['EXT_frag_depth', true],
  GLSL_DERIVATIVES: ['OES_standard_derivatives', true],
  GLSL_TEXTURE_LOD: ['EXT_shader_texture_lod', true]
};
const FEATURES = {};
Object.keys(WEBGL_FEATURES).forEach(key => {
  FEATURES[key] = key;
});
export { FEATURES };

function isWebGL2(gl) {
  return Boolean(gl && (typeof WebGL2RenderingContext !== 'undefined' && gl instanceof WebGL2RenderingContext || 32874 === GL_TEXTURE_BINDING_3D));
}

export function getContextInfo(gl) {
  const info = gl.getExtension('WEBGL_debug_renderer_info');
  const vendor = gl.getParameter(info && info.UNMASKED_VENDOR_WEBGL || GL_VENDOR);
  const renderer = gl.getParameter(info && info.UNMASKED_RENDERER_WEBGL || GL_RENDERER);
  const gpuVendor = identifyGPUVendor(vendor, renderer);
  const gpuInfo = {
    gpuVendor,
    vendor,
    renderer,
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

const compiledGlslExtensions = {};
export function canCompileGLGSExtension(gl, cap, opts = {}) {
  const feature = WEBGL_FEATURES[cap];
  assert(feature, cap);

  if (!isOldIE(opts)) {
    return true;
  }

  if (cap in compiledGlslExtensions) {
    return compiledGlslExtensions[cap];
  }

  const extensionName = feature[0];
  const source = `#extension GL_${extensionName} : enable\nvoid main(void) {}`;
  const shader = gl.createShader(35633);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  const canCompile = gl.getShaderParameter(shader, 35713);
  gl.deleteShader(shader);
  compiledGlslExtensions[cap] = canCompile;
  return canCompile;
}

function getFeature(gl, cap) {
  const feature = WEBGL_FEATURES[cap];
  assert(feature, cap);
  const extensionName = isWebGL2(gl) ? feature[1] || feature[0] : feature[0];
  const value = typeof extensionName === 'string' ? Boolean(gl.getExtension(extensionName)) : extensionName;
  assert(value === false || value === true);
  return value;
}

export function hasFeatures(gl, features) {
  features = Array.isArray(features) ? features : [features];
  return features.every(feature => getFeature(gl, feature));
}
//# sourceMappingURL=webgl-info.js.map