'use strict';
const { readFileSync, writeFileSync, mkdirSync } = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const catalog = [
  ['API core / booking', 'tests/api/booking.test.js'],
  ['Payment and webhook', 'tests/api/payment.test.js'],
  ['Partner integration', 'tests/api/partner.test.js'],
  ['Domain unit', 'tests/domain/domain.test.js'],
  ['Playwright UI', 'tests/ui/booking-flow.test.js'],
];
const rules = {
  API: 'BR-18', OFF: 'BR-01', BOOK: 'BR-02 / BR-04', PAY: 'BR-07 / BR-09',
  PARTNER: 'BR-15', UNIT: 'BR-02 / BR-09', UI: 'BR-16',
};
let md = `# Automated test case matrix\n\nThis document is generated from runnable test definitions using \`node scripts/generate-case-matrix.js\`. It indexes **authored** cases; verified pass counts are stated only in [the execution report](test-execution-report.md).\n\n`;
let total = 0;
for (const [title, file] of catalog) {
  const code = readFileSync(path.join(root, file), 'utf8');
  const found = [...code.matchAll(/(?:\btc|\bui|\btest)\('(?<id>TC-[A-Z]+-\d+)(?: \|)?',\s*'(?<title>[^']+)'/g)];
  // Unit tests use test('TC-UNIT-001 | description') single literal.
  const units = [...code.matchAll(/\btest\('(TC-UNIT-\d+) \| ([^']+)'/g)].map(x => ({ id: x[1], title: x[2] }));
  const rows = [...found.map(x => x.groups), ...units];
  const seen = new Set();
  const unique = rows.filter(r => !seen.has(r.id) && seen.add(r.id));
  md += `## ${title} (${unique.length})\n\n| ID | Scenario / assertion | Requirement | Source |\n| --- | --- | --- | --- |\n`;
  for (const row of unique) {
    const cat = row.id.split('-')[1];
    md += `| ${row.id} | ${row.title.replaceAll('|', '/')} | ${rules[cat] || 'BR-18'} | \`${file}\` |\n`;
  }
  md += '\n';
  total += unique.length;
}
md += `**Total automated scenarios authored: ${total}.** API/domain pass result and UI execution status are tracked separately.\n`;
writeFileSync(path.join(root, 'docs/test-case-matrix.md'), md);
console.log(`Generated ${total} case IDs in docs/test-case-matrix.md`);
