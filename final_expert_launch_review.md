# Final Expert Launch Review

Review date: 2026-05-31  
Artifact reviewed: Polished Disbursing Readiness Simulator PWA prototype  
Audience under consideration: unit testers, Air Force finance leaders, career field manager  
Expert panel stance: app product team, mobile UX lead, learning development expert, Air Force disbursing SME, TCCC-aware training reviewer, senior-leader pitch reviewer.

## Executive Verdict

**Go for controlled unit demonstration. Not yet go for career-field-wide launch.**

The polished app is now strong enough to show as a serious concept and early working prototype. It communicates the vision clearly: an offline-first disbursing readiness simulator where Air Force finance members learn the concepts, execute a mission, handle friction, close out funds, and receive an AAR.

It is not yet ready to be represented as a final training product. It is ready to be shown as:

```text
Working prototype for feedback and SME validation.
```

It should not yet be shown as:

```text
Complete Air Force-ready training app.
```

## What The Expert Panel Likes

### 1. The Intent Is Clear

The app finally reads as a disbursing readiness tool, not a generic quiz app. The flow from Brief to Train to Mission to Inject to Closeout to AAR matches the learning intent.

### 2. The Learn-First Path Is Now Visible

The home screen now includes a "Learn before you deploy" path. This matters because the original intent included giving members knowledge before pushing them into scenarios.

### 3. Mobile-First Direction Is Much Better

The polished version feels closer to a phone app than the earlier web prototype:

- bottom navigation
- large touch targets
- cards
- step-based screens
- one main task per area

### 4. The Accountability Stack Is A Strong Design Signature

The "Money, Documents, Authority, Explanation" stack is memorable and useful. It should become the app's core mental model.

### 5. Mission Decisions Are Relevant

The current mission decisions reflect real disbursing judgment:

- supported payment
- wrong currency
- FRAGO rate application
- missing receipt
- budget/authority confusion

### 6. Closeout Is Moving In The Right Direction

The Closeout Table includes:

- cash count
- voucher packet
- DD 1081-style fields
- DD 2665-style fields
- structured findings

This is the strongest candidate for the app's signature experience.

### 7. TCCC Is Framed Correctly

The app does not try to certify TCCC. It frames TCCC injects as operational disruption tied to life, communication, funds security, document control, and accountability recovery.

### 8. AAR Is More Than A Score

The AAR gives readiness status, critical findings, remediation, and decision history. That is the right direction.

### 9. PWA Strategy Is The Correct Low-Cost Launch Path

For a first unit review, PWA is the right option:

- free or near-free
- phone accessible
- no app store approval
- no PII needed
- easy to iterate

### 10. It Is Explainable To Leadership

The product can now be pitched simply:

```text
This gives finance Airmen disbursing repetitions before the stakes are real.
```

## Major Concerns Before Unit Demo

### 1. It Needs Clear Prototype Labeling

Every tester must understand this is not official policy, not Silver Flag content, and not TCCC certification.

Recommended visible language:

```text
Prototype for training concept review. Uses fictional scenarios and simplified form logic. Does not replace official policy, local SOP, instructor judgment, or TCCC certification.
```

### 2. Scenario Content Is Still Too Thin

Operation Market Run is usable as a demo mission. The app is not yet scenario-rich.

For unit feedback, that is acceptable. For career-field manager review, be clear that this is the first mission pattern, not the full content library.

### 3. DD 1081/DD 2665 Are Still Training Abstractions

The app uses simplified form logic. That is fine for MVP, but SMEs may ask why the exact form layout is not replicated.

Recommended answer:

```text
V1 teaches form logic and accountability flow. Exact form replication comes after SME validation so we do not accidentally teach incorrect field behavior.
```

### 4. AAR Scoring Still Needs SME Rubric Review

The structured AAR is much better, but it should be validated by disbursing SMEs before being treated as authoritative.

### 5. Team Mode Is Still Early

The app supports the idea of same-device team training but does not yet fully create separate role experiences.

Do not overclaim team functionality.

### 6. No Instructor Dashboard Yet

For unit demo, local AAR is enough. For career-field scaling, instructors will want:

- roster
- attempts
- common errors
- exports
- scenario assignment

### 7. No Real SME Approval Workflow Yet

The app does not yet include built-in scenario approval statuses:

- draft
- finance SME reviewed
- TCCC reviewed
- approved
- retired

This is needed before wider adoption.

### 8. Visual Quality Is Good For Prototype, Not Final

The polished app looks dramatically better, but a final mobile product should still be rebuilt in a modern framework with smoother transitions and reusable components.

### 9. Phone Install Still Requires Hosting

The app is PWA-ready, but users cannot install it cleanly from a local file. It must be hosted over HTTPS.

### 10. Testing Must Be Controlled

Do not send broadly yet. Test with a small group first.

Recommended first group:

- 1 new Airman
- 1 SrA/NCO
- 1 disbursing-experienced SME
- 1 instructor/cadre type
- 1 senior leader or SEL reviewer

## Go / No-Go Assessment

### Controlled Unit Feedback Demo

Status: **GO**

Conditions:

- Present as prototype.
- Use fictional scenario disclaimer.
- Ask for feedback, not endorsement.
- Observe testers using it.
- Capture where they get confused.

### Career Field Manager Concept Brief

Status: **GO WITH CAUTION**

Conditions:

- Show as proof of concept.
- Lead with the problem and readiness gap.
- Demo one mission only.
- Be transparent about what remains to build.
- Ask for SME review support or pilot approval, not full adoption.

### Public PWA Release

Status: **NOT YET**

Required before release:

- disclaimer screen
- SME review of mission logic
- TCCC reviewer feedback
- hosted test link
- feedback capture plan
- at least 3 complete missions or clear labeling as single-mission demo

### App Store Release

Status: **NO-GO**

Reason:

- Not enough validated content yet.
- No formal review workflow.
- Needs native/PWA packaging decision.
- Needs privacy/support documents.

## Recommended Demo Script

Use this sequence for unit/career-field-manager review:

1. Show Briefing Room.
2. Point out "Learn before you deploy."
3. Tap Training Bay and show the Accountability Stack lesson.
4. Go to Mission.
5. Mark briefing reviewed.
6. Make correct Vendor A/B decisions.
7. Show FRAGO rate decision.
8. Show Vendor C missing support pressure.
9. Show Inject screen.
10. Go to Closeout.
11. Show voucher packet, DD 1081, DD 2665, and structured findings.
12. Submit AAR.
13. Explain readiness/remediation.

Do not click through every lesson. The point is to show the learning loop.

## Recommended Talking Points

### Problem

Finance Airmen often get limited disbursing repetitions before deployment, especially with manual balancing, forms, foreign currency, documentation, and mission disruption.

### Solution

An offline-first simulator that gives safe, repeatable, measurable reps.

### Differentiator

This is not CBT. It is a mission simulator centered on accountability.

### Why It Matters

Disbursing errors can create cash loss, audit risk, mission delay, and reduced confidence in deployed finance operations.

### Ask

Approve a controlled SME/user feedback pilot and help identify disbursing/TCCC reviewers.

## Highest Priority Fixes After Demo

1. Add a required disclaimer screen.
2. Host the PWA on a free HTTPS platform.
3. Build two more complete missions.
4. Add exact SME review notes to each scenario.
5. Improve DD 1081/DD 2665 form fidelity.
6. Build role rotation for same-device team mode.
7. Add instructor test script.
8. Improve AAR rubric with SME validation.
9. Add exportable feedback package.
10. Create a one-page leadership brief.

## Final Expert Recommendation

Show it to your unit as a prototype.

Show it to the career field manager only if you frame it correctly:

```text
This is a working prototype demonstrating a proposed Disbursing Readiness Simulator. It is not final training content. I am seeking SME feedback, pilot support, and guidance on whether this solves a real career-field readiness gap.
```

The concept is strong enough to start the conversation.

