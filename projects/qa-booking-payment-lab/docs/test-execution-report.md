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
| Playwright UI execution | **NOT EXECUTED successfully** due to Chromium administrator URL blocking in the current environment |

### What was validated

Offer contract and availability, booking creation and negative data, pricing ownership, inventory exhaustion/release, payment webhook signatures, replay/idempotency, amount mismatches, lifecycle transitions, simulated refund, and deterministic partner failure handling.

### Defect summary

No failing API/domain checks were observed in the verified run. This does **not** mean the whole system has zero bugs; exploratory and UI coverage remain independent responsibilities.

### Environment limitations

The current sandbox uses a managed Chromium with a URLBlocklist policy. Browser navigation to the local test server returned `net::ERR_BLOCKED_BY_ADMINISTRATOR`. This is an environment policy, not a verified application defect. UI scripts are committed for execution on an unrestricted local machine / GitHub Actions.

### Recommendation

Accept the API/domain regression baseline for portfolio demonstration only. Rerun Playwright UI scripts in CI and attach the actual browser results before using the phrase "full E2E suite passed." No real flight booking or payment has occurred.

### Repeatable evidence generation

Run `npm run test:report` to create `reports/last-run.json` and `reports/last-run.txt`. These runtime files are gitignored; the CI workflow uploads the report as an artifact when GitHub Actions runs.