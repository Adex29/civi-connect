# Civi-Tech Research Laboratory (`lab/`)

This directory is an isolated environment dedicated to exploratory research, disposable prototypes, bug reproductions, performance benchmarks, and architectural proofs of concept.

---

## Laboratory Purpose

The laboratory exists exclusively for:
- **Prototypes & Proofs of Concept**: Testing new UI interactions or multi-step algorithms before production integration.
- **Bug Reproduction Cases**: Creating minimal reproducible examples for complex issues.
- **Schema Experiments**: Testing migrations, constraint validation logic, and Zod transformations.
- **Performance Benchmarks**: Measuring latency, rendering overhead, or bundle impact.
- **Library Comparisons**: Evaluating competing packages (e.g. state management, chart libraries, AI SDKs).
- **External-System Simulations**: Testing external API integrations (e.g. Gemini AI prompt variations) in isolation.
- **Disposable Research Code**: Scratch scripts that must not pollute production source trees.

---

## Mandatory Laboratory Rules

1. **Strict Isolation**: Production code (`app/`, `components/`, `lib/`, `hooks/`) must **NEVER** import anything from `lab/`.
2. **Database Protection**: Lab experiments must **NEVER** write to or mutate development, staging, or production databases. Always use isolated in-memory stores, mocks, or disposable SQLite/JSON test fixtures.
3. **Data Anonymization**: Always use synthetic or generated data. Never store real student records, LRNs, or sensitive user information in `lab/`.
4. **Deliberate Promotion**: A working experiment is **NOT** a production implementation. Code must be deliberately re-implemented and tested in production modules; do not wire production to the lab.
5. **No Secrets**: Never commit API keys, secrets, or tokens to `lab/`.
6. **Artifact Cleanup**: Large generated artifacts, temporary dumps, or log files must be added to `.gitignore` and removed after experiments conclude.
7. **Knowledge Promotion**: Significant architectural or debugging findings must be summarized and promoted into [`decisions.md`](file:///d:/Admin/Music/Janella/civi-connect/decisions.md) or [`learnings.md`](file:///d:/Admin/Music/Janella/civi-connect/learnings.md).

---

## Experiment Structure Template

Every experiment created inside `lab/` should reside in its own subfolder (e.g. `lab/exp-gemini-rubrics/`) and contain a `README.md` following this structure:

```markdown
# [Experiment Title]

- **Date**: YYYY-MM-DD
- **Experimenter**: [Agent Name / Developer]
- **Status**: [Draft | In Progress | Completed | Abandoned]

## Question
What specific technical or product uncertainty is being investigated?

## Hypothesis
What do we expect will happen and why?

## Method
How was the experiment constructed? (Dependencies, isolated test data, setup steps).

## Reproduction Command
Exact command(s) to execute and reproduce the experiment:
\`\`\`bash
node lab/exp-example/run.mjs
\`\`\`

## Expected Result
What output or metric confirms the hypothesis?

## Actual Result
What was actually observed during execution?

## Conclusion
Did the experiment validate or disprove the hypothesis? What was learned?

## Production Impact
Does this warrant changes to production code?

## Related Decision / Learning
Links to corresponding stable IDs:
- Decision: \`D-YYYYMMDD-NNN\`
- Learning: \`L-YYYYMMDD-NNN\`
```
