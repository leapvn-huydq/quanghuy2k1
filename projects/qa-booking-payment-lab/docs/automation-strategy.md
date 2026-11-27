# Automation strategy

## Testing pyramid

1. **Domain-unit tests** - fast checks for validation, state transitions and HMAC without network.
2. **API integration tests** - HTTP assertions for booking, payment, inventory and partner simulator, using fresh localhost server instances.
3. **Playwright UI journey tests** - key user workflows, not exhaustive UI snapshots. Use stable `data-testid` attributes rather than brittle DOM paths.
4. **Manual/exploratory checks** - accessibility, usability, ambiguous business acceptance criteria, risk and evidence review.

## Automation selection

Prioritize high-risk repeatable flows: booking creation, fare tampering, payment callback integrity, duplicate events, refunds/cancellations, stock and negative API contracts. Avoid automating unclear requirements before BA/PM clarification.

## Regression profiles

| Profile | Command | Purpose | Verified status |
| --- | --- | --- | --- |
| API smoke | `npm run test:smoke` | Quick health, offer, booking, payment, partner | Scripted, included in larger verified API suite |
| API/domain regression | `npm run test:api` | Broad validation and negative coverage | 55 tests passed locally |
| Browser UI | `npm run test:ui` | UI flows and visible state assertions | 8 authored; needs browser-permitted runtime |
| Full | `npm test` | API plus browser | Depends on Playwright environment; not claimed verified |

## Maintainability standards

- Give each test a stable TC ID linked to business rules.
- Make expected assertions specific; never rely on "no crash" alone.
- Reset state for each test, use unique event IDs and synthetic data.
- Separate transport from business rules to reduce debugging effort.
- Capture stdout, JSON status and test environment in reports.
- Never silently convert real failures to green CI jobs (`continue-on-error` must not hide failures).
- Keep test failures independent of real payment, third-party availability or external credentials.

## AI-assisted execution protocol

Use Claude Code/Cursor for drafting scenarios and boilerplate, asking for edge cases, refactoring maintainable helpers and analyzing sanitized failure logs. Use Playwright MCP only against local sandbox when it is configured. Human QA reviews business expectations, sensitive data, code changes and test results before making claims. The repo includes no real MCP connection or live AI service runtime.