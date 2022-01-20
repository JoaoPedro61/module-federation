const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const mf = require("@angular-architects/module-federation/webpack");
const path = require("path");
const http = require('http');
const share = mf.share;



const sharedMappings = new mf.SharedMappings();

sharedMappings.register(path.join(__dirname, '../../tsconfig.json'), [
]);


module.exports = new Promise((resolve) => {
  /* 
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
      sharedMappings.getPlugin()
    ],
  };

  const options = {
    hostname: "localhost",
    port: 3000,
    path: '/available/shell',
    method: 'GET',
    json: true,
  };

  const req = http.request(options, (res,) => {
    res.on('data', d => {
      const parsed = JSON.parse(d) || [];

      const plugin = new ModuleFederationPlugin({

        // For remotes (please adjust)
        // name: "shell",
        // filename: "remoteEntry.js",
        // exposes: {
        //     './Component': './projects/shell/src/app/app.component.ts',
        // },

        // For hosts (please adjust)
        // remotes: {
        //     "mfe1": "http://localhost:3000/remoteEntry.js",
        // },

        remotes: parsed.reduce((o, i) => {
          return {
            ...o,
            [i.name]: `${i.name}@${i.urlEntry}`,
          };
        }, {}),

        shared: share({
          "@angular/core": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
          "@angular/common": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
          "@angular/common/http": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
          "@angular/router": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
          "rxjs": { singleton: true, strictVersion: true, requiredVersion: 'auto' },

          ...sharedMappings.getDescriptors()
        })

      });

      baseConfig.plugins.unshift(plugin);
      resolve(baseConfig);
    });
  });

  req.on('error', error => {
    console.error(error);

    resolve(baseConfig);
  });
  
  req.end();

 */

  const baseConfig = {
    output: {
      publicPath: 'http://localhost:4200/',
      uniqueName: 'shell',
    },
    optimization: {
      runtimeChunk: false,
    },
    plugins: [
      new ModuleFederationPlugin({
        shared: share({
          "@angular/core": { requiredVersion: 'auto' },
          "@angular/common": { requiredVersion: 'auto' },
          "@angular/router": { requiredVersion: 'auto' },
          "@angular/common/http": { requiredVersion: 'auto' },

          // Uncomment for sharing lib of an Angular CLI or Nx workspace
          ...sharedMappings.getDescriptors()
        })
      }),
    ],
  };

  resolve(baseConfig);
});
