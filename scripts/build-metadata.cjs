const fs = require('node:fs');
const cp = require('node:child_process');
const sha = process.env.GITHUB_SHA || cp.execFileSync('git', ['rev-parse', 'HEAD'], {encoding: 'utf8'}).trim();
fs.writeFileSync('dist/build-info.json', JSON.stringify({commit: sha}) + '\n');
