const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const axios = require("axios");

const scheme = require('./scheme');

function formatDeclareModule(module) {
  return module.replace(/^\.\/|\//gm, '');
}

function syncServerToProject(options) {
  return new Promise((resolve, reject) => {
    if (!options) {
      throw new Error('Options is undefined!');
    }
    if (!options.serverUrl && !options.skipServerRequests) {
      throw new Error('Server URL is undefined!');
    }
    const {
      serverUrl,
      file = 'module.federation.json',
    } = options;

    const filePathResolved = path.resolve(file);
    const filePathDeclarationsResolved = path.resolve('declarations.d.ts');
    const fileExists = fs.existsSync(filePathResolved);

    if (!fileExists) {
      throw new Error("File config does not found!");
    }

    const fileDataStr = fs.readFileSync(filePathResolved, {
      encoding: 'utf-8',
    }) || '{}';

    const fileData = JSON.parse(fileDataStr);

    let name = fileData.name;
    let filename = fileData.filename;
    let remoteEntry = fileData.remoteEntry;
    const url = `${serverUrl}${serverUrl.endsWith('/') ? '' : '/'}get-remotes`;

    scheme
      .validate(fileData)
      .then(() => {
        if (fileData.exposes || fileData.remotes) {
          let applicationsExposed = fileData.exposes.applications ? Array.isArray(fileData.exposes.applications) ? fileData.exposes.applications : [fileData.exposes.applications] : [];
          let componentsExposed = fileData.exposes.components ? Array.isArray(fileData.exposes.components) ? fileData.exposes.components : [fileData.exposes.components] : [];
          let commonExposed = fileData.exposes.common ? Array.isArray(fileData.exposes.common) ? fileData.exposes.common : [fileData.exposes.common] : [];

          const finalObject = {
            library: { type: "module" },

            name,
            filename,
            remoteEntry,

            remotes: {},

            exposes: {
              ...applicationsExposed.reduce((obj, value) => {
                obj[value.exposedModule] = value.exposedFile;
                return obj;
              }, {}),
              ...componentsExposed.reduce((obj, value) => {
                obj[value.exposedModule] = value.exposedFile;
                return obj;
              }, {}),
              ...commonExposed.reduce((obj, value) => {
                obj[value.exposedModule] = value.exposedFile;
                return obj;
              }, {}),
            },
          };

          if (fileData.remotes && Object.keys(fileData.remotes).length) {
            axios
              .get(url, {
                params: { remotes: fileData.remotes },
              })
              .then(response => response.data)
              .then((data) => {
                let moduleDeclaration = `/* Automatic generated */\n`;
                for (let i = 0, l = data.length; i < l; i++) {
                  const element = data[i];
                  if (element.common.length || element.components.length) {
                    finalObject['remotes'][element.name] = element.remoteUrl;

                    (element.common || []).forEach((c) => {
                      moduleDeclaration += `declare module '${element.name}/${formatDeclareModule(c.exposedModule)}';\n`;
                    });
                    (element.components || []).forEach((c) => {
                      moduleDeclaration += `declare module '${element.name}/${formatDeclareModule(c.exposedModule)}';\n`;
                    });
                  }
                }

                if (moduleDeclaration.length) {
                  fs.writeFile(filePathDeclarationsResolved, moduleDeclaration, (err, data) => {
                    if (err) {
                      reject(err);
                    }
                    resolve(finalObject);
                  })
                } else {
                  resolve(finalObject);
                }
              })
              .catch(reject);
          } else {
            resolve(finalObject);
          }
        }
      })
      .catch((error) => {
        console.log(`[VALIDATE]: `, error.errors.join('').replace(/\n/gm, '\n\t'));
        reject(error.errors);
      });
  });
}

module.exports = syncServerToProject;
