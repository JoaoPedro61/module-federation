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
    const name = fileData.name;
    const filename = fileData.filename;
    const remoteEntry = fileData.remoteEntry;

    const url = `${serverUrl}${serverUrl.endsWith('/') ? '' : '/'}register`;

    scheme
      .validate(fileData)
      .then(() => {
        if ((fileData.exposes && Object.keys(fileData.exposes).length) || (fileData.remotes && Object.keys(fileData.remotes).length)) {
          const remoteEntryParsed = `${remoteEntry}${remoteEntry.endsWith('/') ? '' : '/'}${filename.startsWith('/') ? filename.substr(1) : filename}`;

          const remoteUrl = remoteEntryParsed;

          let applications = (fileData.exposes.applications ?? []).map(i => {

            i.name = name;
            i.remoteEntry = remoteEntryParsed;

            return i;
          });
          let components = (fileData.exposes.components ?? []).map(i => {

            i.name = name;
            i.remoteEntry = remoteEntryParsed;

            return i;
          });
          let common = (fileData.exposes.common ?? []).map(i => {

            i.name = name;
            i.remoteEntry = remoteEntryParsed;

            return i;
          });

          const data = {
            [name]: {
              name,
              filename,
              remoteEntry,
              remoteUrl,

              applications,
              components,
              common,
            },
          };

          axios
            .post(url, data)
            .then(() => console.log(`[SYNC]: synchronized!`))
            .catch(console.error);
        } else {
          console.log(`[SYNC]: skipped, no data!`);
        }
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
