# Unit Pilot Change Log Addendum

## 2026-06-09 - Facilitator Run-of-Show

### Training-Day Control

- Added a persistent 180-minute facilitator timer.
- Added four phases: Academy 60 minutes, Qualification 35 minutes, Team Ops 70 minutes, and AAR 15 minutes.
- Added start, pause, reset, complete, and advance controls.
- Added remaining-time and overtime status.
- Stored timer state locally so a refresh does not erase the event clock.

### Instructional Support

- Added phase-specific coaching prompts.
- Kept prompts focused on reasoning, evidence, accountability, and role ownership.
- Explicitly prevented the timer from changing learner scores or unlocking content.

### Mobile and Offline

- Added a two-column mobile phase selector and a single-column narrow-phone layout.
- Added the timer JavaScript and CSS to the PWA cache.
- Advanced the service-worker cache from `v2-1` to `v2-2`.

### Verification Added

- Added three Playwright checks for phase visibility, timer persistence, and phase-specific guidance.
- Tests are defined but not locally executed because Windows Device Guard blocks process creation in this workspace.

## 2026-06-09 - Seven-Route Assignment Board

### Team Launch

- Added a facilitator board for naming teams and recording experience mix.
- Added deterministic assignment across all seven mission routes.
- Prevented repeated missions when seven or fewer teams are named.
- Added an explicit warning when more than seven teams require repeated routes.
- Added a lock state so launch assignments cannot be changed accidentally.
- Added a copyable facilitator launch list with mission focus.

### Verification Added

- Added Playwright coverage for unique seven-team assignments, local persistence, board locking, and mission-focus display.
- Advanced the offline cache to include the assignment board assets.

## 2026-06-09 - Performance Evidence Rubric

### Facilitator Observation

- Added a five-dimension rubric for control of funds, form reasoning, calculation accuracy, role handoffs, and balance explanations.
- Added three performance levels: needs coaching, performs, and explains/adapts.
- Added required observed-evidence notes for behavior-based coaching.
- Added readiness logic that prevents a team from passing on a high total while weak in control of funds or explanation.
- Added team-specific records linked to the local assignment board.
- Added copyable observation summaries and targeted retraining decisions.

### Verification Added

- Added Playwright coverage for team loading, five-dimension completion, readiness calculation, persistence, and separate team records.
- Advanced the offline cache to include the observation rubric assets.

## 2026-06-09 - Unit Pilot Readiness Audit

### Release Hardening

- Added an in-app device and event readiness audit.
- Added checks for core views, practical work areas, seven mission routes, signed shortage input, local persistence, mobile configuration, and service-worker support.
- Added hosted asset checks for the PWA files required offline.
- Added assignment checks that detect named teams without missions and unnecessary repeated routes.
- Added observation checks that flag incomplete facilitator evidence records.
- Added a copyable audit report with pass, warning, and fail counts.

### Verification Added

- Added Playwright coverage for audit execution, assignment failures, and incomplete-observation warnings.
- Advanced the offline cache to include the readiness audit assets.

## 2026-06-09 - Mobile and Presentation Polish

### Interface Hardening

- Standardized touch targets and keyboard focus states.
- Added stable spacing above the fixed mobile navigation.
- Added overflow protection for module titles, labels, statuses, and constructed responses.
- Added contained horizontal scrolling for denomination and ledger workbenches.
- Added one-column phone actions and safe-area support for installed PWAs.
- Added reduced-motion and print layouts.

### Verification Added

- Added Playwright checks for phone-navigation label containment, touch-target height, reduced-motion behavior, and facilitator-tool viewport containment.
- Added the final polish stylesheet to the offline cache and readiness audit.

## 2026-06-09 - Structured Unit Pilot Feedback

### Pilot Learning Loop

- Added an anonymous local debrief to the AAR view.
- Added ratings for clarity, challenge, realism, form usefulness, and confidence gained.
- Required the exact confusion point and one recommended change.
- Added recurring-friction themes for navigation, forms, calculations, mission briefs, team handoffs, and technical issues.
- Added a local dashboard and copyable facilitator summary.
- Added explicit privacy instructions that prohibit names, units, and sensitive details.

### Verification Added

- Added Playwright coverage for required feedback, local dashboard updates, persistence, and absence of identity fields.
- Added feedback assets to the offline cache and readiness audit.
