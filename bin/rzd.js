#!/usr/bin/env node

const cmd = process.argv[2];

if (cmd === 'init') {
  require('./rzd-init');
} else if (cmd === 'build') {
  require('./rzd-build');
} else {
  console.log('Usage: rzd <init|build>');
}
