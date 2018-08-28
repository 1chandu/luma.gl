"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = "#define LIGHT_MAX 4\n\n/*\n// lighting configuration\nuniform bool enableLights;\nuniform vec3 ambientColor;\nuniform vec3 directionalColor;\nuniform vec3 lightingDirection;\n\n// point lights configuration\nuniform vec3 pointLocation[LIGHT_MAX];\nuniform vec3 pointColor[LIGHT_MAX];\nuniform int numberPoints;\n\n// reflection / refraction configuration\nuniform bool useReflection;\n*/\n\nuniform bool lighting_uEnableLights;\nuniform vec3 lighting_uAmbientColor;\nuniform vec3 lighting_uDirection;\nuniform vec3 lighting_uDirectionalColor;\n\n// point lights configuration\nuniform int  lighting_uPointCount;\nuniform vec3 lighting_uPointLocation[LIGHT_MAX];\nuniform vec3 lighting_uPointColor[LIGHT_MAX];\n\n// reflection / refraction configuration\nuniform bool lighting_uEnableReflections;\n\n// varyings\nvarying vec4 lighting_vPosition;\nvarying vec4 lighting_vNormal;\nvarying vec3 lighting_vColor;\nvarying vec3 lighting_vLightWeighting;\nvarying vec3 lighting_vReflection;\n\nvoid lighting_setPositionAndNormal(vec3 position, vec3 normal) {\n  lighting_vPosition = worldMatrix * vec4(position, 1.);\n  lighting_vNormal = worldInverseTransposeMatrix * vec4(normal, 1.);;\n}\n\nvoid lighting__getLightWeigting() {\n  float directionalLightWeighting = max(dot(lighting_vNormal.xyz, lighting_uDirection), 0.);\n  vec3 pointWeight = vec3(0., 0., 0.);\n  for (int i = 0; i < LIGHT_MAX; i++) {\n    if (i < numberPoints) {\n      vec4 mvLightPosition = viewMatrix * vec4(lighting_uPointLocation[i], 1.);\n      vec3 pointLightDirection = normalize(mvLightPosition.xyz - lighting_vPosition.xyz);\n      pointWeight += max(dot(lighting_vNormal.xyz, pointLightDirection), 0.) * pointColor[i];\n     } else {\n       break;\n     }\n   }\n   return ambientColor + (directionalColor * directionalLightWeighting) + pointWeight;\n}\n\nvoid lighting_apply(vec3 position, vec3 normal) {\n  lighting_setPositionAndNormal(position, normal);\n\n  // lighting code\n  if(!lighting_uEnableLights) {\n    lighting_vLightWeighting = vec3(1., 1., 1.);\n  } else {\n    lighting_vLightWeighting = lighting__getLightWeighting();\n  }\n}\n\nvoid lighting_set_reflection(vec3 position) {\n    // refraction / reflection code\n  if (lighting_uEnableReflections) {\n    lighting_vReflection = (viewInverseMatrix[3] - (worldMatrix * vec4(position, 1.))).xyz;\n  } else {\n    lighting_vReflection = vec3(1., 1., 1.);\n  }\n}\n";
exports.default = _default;
//# sourceMappingURL=lighting-vertex.glsl.js.map