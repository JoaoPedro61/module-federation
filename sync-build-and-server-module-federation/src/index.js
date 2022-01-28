const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const axios = require("axios");

const scheme = require('./scheme');

async function watchAndSyncFile(options) {
  if (!options) {
    throw new Error('Options is undefined!');
  }
  if (!options.serverUrl && !options.skipServerRequests) {
    throw new Error('Server URL is undefined!');
  }

  const {
    watch,
    serverUrl,
    file = 'module.federation.json',
    skipServerRequests,
  } = options;

  const filePathResolved = path.resolve(file);
  const fileExists = fs.existsSync(filePathResolved);

  if (!fileExists) {
    throw new Error("File config does not found!");
  }

  function syncToServer() {
    console.log(`[SYNC]: ${skipServerRequests ? 'skipped' : 'synchronizing...'}`);
    if (skipServerRequests) {
      return void 0;
    }
    const fileDataStr = fs.readFileSync(filePathResolved, {
      encoding: 'utf-8',
    }) || '{}';

    const fileData = JSON.parse(fileDataStr);

    const url = `${serverUrl}${serverUrl.endsWith('/') ? '' : '/'}register`;

    scheme
      .validate(fileData)
      .then(() => {
        let applications = fileData.applications ? Array.isArray(fileData.applications) ? fileData.applications : [fileData.applications] : [];
        let components = fileData.components ? Array.isArray(fileData.components) ? fileData.components : [fileData.components] : [];
        let common = fileData.common ? Array.isArray(fileData.common) ? fileData.common : [fileData.common] : [];

        axios
          .post(url, {
            applications,
            components,
            common,
          })
          .then(() => console.log(`[SYNC]: synchronized!`))
          .catch(console.error);
      })
      .catch((error) => {
        console.log(`[VALIDATE]: `, error.errors.join('').replace(/\n/gm, '\n\t'));
      });
  }

  if (watch) {
    // Initialize watcher.
    const watcher = chokidar.watch(filePathResolved, { persistent: true });

    // More possible events.
    watcher
      .on('change', () => {
        console.log('[FILE]: File changed!');
        syncToServer();
      })
      .on('ready', () => {
        console.log('[FILE]: File ready to sync!');
        syncToServer();
      })
      .on('error', error => {
        throw new Error(error);
      });

    return watcher;
  } else {
    syncToServer();
  }
}

module.exports = watchAndSyncFile;
