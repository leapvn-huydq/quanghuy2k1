'use strict';
const { spawnSync } = require('node:child_process');
const { readdirSync, statSync } = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const dirs = ['src', 'tests', 'scripts'];
let count = 0;
for (const dir of dirs) {
  const walk = folder => {
    for (const entry of readdirSync(folder)) {
      const full = path.join(folder, entry);
      if (statSync(full).isDirectory()) walk(full);
      else if (entry.endsWith('.js')) {
        const result = spawnSync(process.execPath, ['--check', full], { stdio: 'inherit' });
        if (result.status !== 0) process.exit(result.status || 1);
        count++;
      }
    }
  };
  walk(path.join(root, dir));
}
console.log(`JavaScript syntax verified: ${count} files`);
