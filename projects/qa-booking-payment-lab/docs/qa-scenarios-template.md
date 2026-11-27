# New scenario template

| Scenario ID | BR ID | Title | Priority | Technique | Preconditions | Test data | Steps | Expected | Automated ID | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SC-DEMO-XX | BR-XX | Describe action and outcome | P1 | BVA/EP/State/etc | Mock server clean | Synthetic | Atomic actions | Measurable assertion | TC-XX-000 | NOT RUN |

## Review checklist

- Does the scenario answer a business requirement?
- Are both happy and failure paths considered?
- Are boundaries, idempotency and data consistency explicit where relevant?
- Are any real client names, values, URLs or credentials present? If yes, remove them.
- Is the expected result independent of the current implementation?