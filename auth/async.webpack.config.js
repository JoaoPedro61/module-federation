const { syncServerToProject } = require('sync-build-and-server-module-federation/src');

syncServerToProject({
  file: 'module.federation.json',
  serverUrl: 'http://localhost:3010',
})
  .then((pluginConfig) => {
    delete pluginConfig.remoteEntry;
    process.stdout.write(JSON.stringify(pluginConfig));
  });
