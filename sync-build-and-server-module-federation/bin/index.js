#!/usr/bin/env node
const arg = require('arg');

const { watchAndSyncFile } = require('./../src');

function parseArgumentsIntoOptions(rawArgs) {
  const args = arg(
    {
      '--watch': Boolean,
      '--server-url': String,
      '--file': String,
      '--skip-server-requests': Boolean,

      '-f': '--file',
      '-s': '--serverUrl',
      '-w': '--watch',
      '-sk': '--skip-server-requests',
    },
    {
      argv: rawArgs.slice(2),
    }
  );
  return {
    watch: args['--watch'] || false,
    serverUrl: args['--server-url'] || '',
    file: args['--file'] || 'module.federation.json',
    skipServerRequests: args['--skip-server-requests'] || false,
  };
}

const options = parseArgumentsIntoOptions(process.argv);

watchAndSyncFile(options);
