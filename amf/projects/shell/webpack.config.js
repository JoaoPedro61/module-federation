const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const mf = require("@angular-architects/module-federation/webpack");
const path = require("path");
const share = mf.share;



const sharedMappings = new mf.SharedMappings();

sharedMappings.register(path.join(__dirname, '../../tsconfig.json'), [
]);


module.exports = new Promise((resolve) => {
  const baseConfig = {
    output: {
      uniqueName: "shell",
      publicPath: "http://localhost:4200/",
      scriptType: 'text/javascript',
    },
    optimization: {
      runtimeChunk: false
    },
    resolve: {
      alias: {
        ...sharedMappings.getAliases(),
      }
    },
    experiments: {
      outputModule: true
    },
    plugins: [
      new ModuleFederationPlugin({
        library: { type: 'module' },

        remotes: {
          'auth': "auth@http://localhost:4201/remoteEntry.js"
        },

        shared: share({
          '@angular/core': { eager: true, singleton: true },
          '@angular/common': { eager: true, singleton: true },
          '@angular/router': { eager: true, singleton: true },
          "@angular/common/http": { eager: true, singleton: true },

          // Uncomment for sharing lib of an Angular CLI or Nx workspace
          ...sharedMappings.getDescriptors()
        })
      }),
      sharedMappings.getPlugin()
    ],
  };

  resolve(baseConfig);
});
