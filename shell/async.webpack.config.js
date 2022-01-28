const { syncServerToProject } = require('sync-build-and-server-module-federation/src');

syncServerToProject({
  file: 'module.federation.json',
  serverUrl: 'http://localhost:3010',
})
  .then((pluginConfig) => {
    if (Object.prototype.toString.call(pluginConfig) === '[object Object]') {
      delete pluginConfig.remoteEntry;
    }
    process.stdout.write(Object.prototype.toString.call(pluginConfig) === '[object Object]' ? JSON.stringify(pluginConfig) : JSON.stringify({}));
  }).catch((err) => {
    process.stderr.write(typeof err === 'string' ? JSON.stringify({ message: err }) : JSON.stringify(err));
  });
