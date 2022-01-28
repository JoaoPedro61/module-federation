const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const mf = require("@angular-architects/module-federation/webpack");
const path = require("path");
const { spawnSync } = require('child_process');
const share = mf.share;


const { stdout: pluginConfigStr, error } = spawnSync(process.argv0, [
  path.resolve(__dirname, 'async.webpack.config.js')
]);

let pluginConfig = {};

if (!error) {
  pluginConfig = JSON.parse(pluginConfigStr);
}

const sharedMappings = new mf.SharedMappings();
sharedMappings.register(path.join(__dirname, 'tsconfig.json'), [/* mapped paths to share */]);

const config = {
  output: {
    uniqueName: "auth",
    publicPath: "auto"
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
      ...pluginConfig,

      shared: share({
        "@angular/core": { singleton: false, strictVersion: false, requiredVersion: 'auto' },
        "@angular/common": { singleton: false, strictVersion: false, requiredVersion: 'auto' },
        "@angular/common/http": { singleton: false, strictVersion: false, requiredVersion: 'auto' },
        "@angular/router": { singleton: false, strictVersion: false, requiredVersion: 'auto' },
        ...sharedMappings.getDescriptors()
      })
    }),
    sharedMappings.getPlugin()
  ],
};

module.exports = config;
