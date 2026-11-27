'use strict';
const { spawnSync } = require('node:child_process');
const { mkdirSync, writeFileSync } = require('node:fs');
const path = require('node:path');

const projectRoot = path.resolve(__dirname, '..');
const reportsDir = path.join(projectRoot, 'reports');
mkdirSync(reportsDir, { recursive: true });
const start = new Date();
const suite = spawnSync(process.execPath, ['--test', '--test-reporter=spec', 'tests/api/booking.test.js', 'tests/api/payment.test.js', 'tests/api/partner.test.js', 'tests/domain/domain.test.js'], { cwd: projectRoot, encoding: 'utf8', timeout: 120000 });
const output = `${suite.stdout || ''}${suite.stderr || ''}`;
process.stdout.write(output);
writeFileSync(path.join(reportsDir, 'last-run.txt'), output, 'utf8');
const count = text => { const re = new RegExp('(?:^|\\n)(?:\\u2139\\s+|#\\s+)?' + text + '\\s+(\\d+)', 'm'); const m = output.match(re); return m ? Number(m[1]) : null; };
const report = {
  suite: 'Native Node.js API and domain automated regression',
  environment: 'Local synthetic mock server (127.0.0.1; isolated per test)',
  startedAt: start.toISOString(), finishedAt: new Date().toISOString(),
  tests: count('tests'), passed: count('pass'), failed: count('fail'), skipped: count('skipped'),
  status: suite.status === 0 ? 'PASS' : 'FAIL',
  note: 'UI / Playwright tests are a separate suite; this summary does not count them.',
};
writeFileSync(path.join(reportsDir, 'last-run.json'), JSON.stringify(report, null, 2) + '\n', 'utf8');
console.log(`Test report: reports/last-run.json`);
process.exit(suite.status === null ? 1 : suite.status);
