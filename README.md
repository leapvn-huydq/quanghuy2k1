qc-ai-agent — AI-driven QC workspace (Cursor)
This folder is the single workspace a QC engineer opens in Cursor to:

Author markdown test specs under each product's specs/, and
Execute UI tests by prompting the AI ("test the login screen on UAT"), which clarifies the request, scaffolds the spec if needed, drives the browser via Playwright MCP, and appends a run summary to the spec.
There is no application code, package.json, or tracked automation source in this directory — execution happens at runtime through MCP servers configured locally.

Quick start for the QC engineer
Cursor setup: docs/CURSOR-IDE-SETUP-FOR-QC.md — rules, skills, extensions, MCP (safe mcp.json shape). Playwright MCP is required.
Env file: environments/LOCAL.md holds the real URLs and credentials per env/account. It is tracked in this repo so the tester gets working logins on first clone — the AI reads it at runtime and logs in automatically. Add new rows (Prep, Prod, additional accounts) directly to that file.
Day-one prompts: docs/PROMPT-COOKBOOK.md — copy-pasteable starter prompts for smoke tests, regressions, bug repro, and exploration.
Repository layout
qc-ai-agent/
├── README.md                           # This file
├── docs/
│   └── CURSOR-IDE-SETUP-FOR-QC.md      # Rules, skills, plugins, MCP for QC
├── environments/
│   ├── README.md                       # How to use placeholders
│   └── TEST-ENVIRONMENTS.md            # UAT / Prep / Prod URL & account placeholders
├── .cursor/
│   ├── rules/                          # qc-spec-authoring, qc-ide-and-mcp, qc-ai-execution
│   ├── skills/
│   │   ├── qc-engineer/SKILL.md       # spec authoring workflow
│   │   └── qc-test-runner/SKILL.md    # AI-driven test execution workflow
│   └── mcp.json.example               # MCP server shapes — NO secrets
├── _templates/
│   └── testcase.md
├── booking1a/
│   ├── README.md
│   └── specs/
│       ├── common/
│       └── clients/<client-id>/
└── visa-top-ten/
    ├── README.md
    └── specs/
        └── common/
Test environments
Tracked placeholders (no real secrets): environments/TEST-ENVIRONMENTS.md.

For real URLs and credentials, use a local gitignored file (see environments/README.md) or your team vault.

Test case IDs and filenames
Pattern: TC-<PRODUCT>-<AREA>-<NNN>.md (example: TC-B1A-AUTH-001.md).
PRODUCT short codes: e.g. B1A for booking1a, VTT for visa-top-ten (align with your team glossary).
Copy new cases from _templates/testcase.md.
Product indexes
booking1a/README.md
visa-top-ten/README.md
How AI execution works (fully automatic)
When you prompt "test the login screen on UAT", the AI runs end-to-end with no confirmation gates:

Resolves silently — product, env (UAT default; UAT/Prep/Prod all auto-execute), account (default row in environments/LOCAL.md), browser (Chromium). Real URLs and credentials are read straight from environments/LOCAL.md.
Locates or scaffolds the test case under specs/common/ or specs/clients/<id>/ using _templates/testcase.md and TC-<PRODUCT>-<AREA>-<NNN>.md — saved without a "is this plan ok?" pause.
Executes via Playwright MCP, including destructive steps if the prompt asks for them. Screenshots/traces land in results/<date>/<TC-id>/ (gitignored).
Records a ### Run YYYY-MM-DD … block at the top of the spec's ## Notes. Failures are logged with actual vs expected — the spec is never rewritten to match a regression.
The AI only stops to ask if environments/LOCAL.md is missing a URL or credential row for the requested run — fabricated values would just produce false passes.

Full rules: .cursor/rules/qc-ai-execution.mdc. Worked examples: .cursor/skills/qc-test-runner/SKILL.md.
