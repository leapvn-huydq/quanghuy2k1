# Test execution report - portfolio baseline

**System under test:** Fictional local booking/payment sandbox  
**Report type:** API and domain regression baseline  
**Test suite:** Node.js built-in test runner, localhost-only isolated mock instances  
**Result basis:** Actual automated execution during project assembly, not fabricated acceptance test evidence.

| Metric | Verified result |
| --- | --- |
| API + domain automated cases | **55** |
| Passed | **55** |
| Failed | **0** |
| Skipped | **0** |
| Execution status | **PASS** |
| Playwright UI scripts authored | 8 |
| Playwright UI execution | **8/8 PASS** on GitHub Actions Ubuntu 24.04, 2026-11-27 ([run evidence](https://github.com/leapvn-huydq/quanghuy2k1/actions/runs/45923262100)) |

### What was validated

Offer contract and availability, booking creation and negative data, pricing ownership, inventory exhaustion/release, payment webhook signatures, replay/idempotency, amount mismatches, lifecycle transitions, simulated refund, and deterministic partner failure handling.

### Defect summary

No failing API/domain or Playwright UI checks were observed in the verified CI run. This does **not** imply the fictional app has zero bugs or that manual exploratory testing is complete.

### Environment limitations

The original authoring sandbox blocked localhost browser navigation with `net::ERR_BLOCKED_BY_ADMINISTRATOR`. Initial GitHub-hosted browser installation then failed because the runner used Ubuntu 26.04, which Playwright 1.60.0 did not support. The workflow was pinned to Ubuntu 24.04; the following run confirmed all 8 UI scenarios pass.

### Recommendation

Both automated layers now have passing CI evidence for this fictional sandbox: 55/55 API/domain and 8/8 UI. Do not interpret these results as QA sign-off for any real airline, payment gateway, or client system. No real flight booking or payment has occurred.

### Repeatable evidence generation

Run `npm run test:report` to create `reports/last-run.json` and `reports/last-run.txt`. These runtime files are gitignored; the CI workflow uploads the report as an artifact when GitHub Actions runs.