const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const mf = require("@angular-architects/module-federation/webpack");
const path = require("path");
const share = mf.share;

const sharedMappings = new mf.SharedMappings();
sharedMappings.register(path.join(__dirname, '../../tsconfig.json'), [
]);

module.exports = {
  output: {
    uniqueName: "auth",
    publicPath: "http://localhost:4201/",
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
      name: "auth",
      filename: "remoteEntry.js",
      exposes: {
        'AuthModule': './projects/auth/src/app/auth/auth.module.ts',
      },

      shared: share({
        '@angular/core': { eager: true, singleton: true },
        '@angular/common': { eager: true, singleton: true },
        '@angular/router': { eager: true, singleton: true },

        ...sharedMappings.getDescriptors()
      })

    }),
    sharedMappings.getPlugin()
  ],
};

/* 
module.exports = {
  output: {
    publicPath: 'http://localhost:4201/',
    uniqueName: 'auth',
  },
  optimization: {
    runtimeChunk: false,
  },
  plugins: [
    new ModuleFederationPlugin({
      library: { type: 'var', name: 'auth' },
      name: "auth",
      filename: "remoteEntry.js",
      exposes: {
        'AuthModule': './projects/auth/src/app/auth/auth.module.ts',
      },

      shared: {
        '@angular/core': { eager: true, singleton: true },
        '@angular/common': { eager: true, singleton: true },
        '@angular/router': { eager: true, singleton: true },
      },

    }),
  ],
};
 */