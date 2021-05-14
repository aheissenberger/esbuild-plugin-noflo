import * as fbpManifest from 'fbp-manifest'

function loadManifest(options) {
  return fbpManifest.load.load(options.baseDir, options.manifest);
}

async function findGraphDependencies(manifestModules, options) {
  const filtered = await fbpManifest.dependencies.find(manifestModules, options.graph, options)
  const nofloMain = manifestModules.filter((m) => m.name === '');
  return filtered.concat(nofloMain);
}

async function filterDependencies(manifestModules, options) {
  const compatibleModules = manifestModules.filter((m) => {
    if (options.runtimes.indexOf(m.runtime) === -1) {
      return false;
    }
    return true;
  });
  if (!options.graph) {
    // Return all compatible modules
    return Promise.resolve(compatibleModules);
  }
  return findGraphDependencies(compatibleModules, options);
}

async function discoverModules(options) {
  const manifest = await loadManifest(options)
  return filterDependencies(manifest.modules, options)
}

export default discoverModules;
