import ShaderModuleRegistry from './shader-module-registry';
const shaderModuleRegistry = new ShaderModuleRegistry();
export function setDefaultShaderModules(modules) {
  shaderModuleRegistry.setDefaultShaderModules(modules);
}
export function registerShaderModules(shaderModuleList, {
  ignoreMultipleRegistrations = false
} = {}) {
  shaderModuleRegistry.registerShaderModules(shaderModuleList, {
    ignoreMultipleRegistrations
  });
}
export function resolveModules(modules) {
  modules = modules.concat(shaderModuleRegistry.defaultShaderModules);
  modules = shaderModuleRegistry.resolveModules(modules);
  return getShaderDependencies(modules);
}
export function getShaderModule(moduleOrName) {
  return shaderModuleRegistry.getShaderModule(moduleOrName);
}

function getShaderDependencies(modules) {
  const moduleMap = {};
  const moduleDepth = {};
  getDependencyGraph({
    modules,
    level: 0,
    moduleMap,
    moduleDepth
  });
  return Object.keys(moduleDepth).sort((a, b) => moduleDepth[b] - moduleDepth[a]).map(name => moduleMap[name]);
}

function getDependencyGraph({
  modules,
  level,
  moduleMap,
  moduleDepth
}) {
  if (level >= 5) {
    throw new Error('Possible loop in shader dependency graph');
  }

  for (const module of modules) {
    moduleMap[module.name] = module;

    if (moduleDepth[module.name] === undefined || moduleDepth[module.name] < level) {
      moduleDepth[module.name] = level;
    }
  }

  for (const module of modules) {
    if (module.dependencies) {
      getDependencyGraph({
        modules: module.dependencies,
        level: level + 1,
        moduleMap,
        moduleDepth
      });
    }
  }
}

export const TEST_EXPORTS = {
  getShaderDependencies,
  getDependencyGraph
};
//# sourceMappingURL=resolve-modules.js.map