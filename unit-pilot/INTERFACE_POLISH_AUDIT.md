# Interface Polish Audit

## Changes

- Standardized 44-pixel touch targets.
- Added visible keyboard focus treatment.
- Added stable mobile padding above the fixed bottom navigation.
- Added safeguards for long labels, status text, and form content.
- Added horizontal containment for denomination and ledger workbenches.
- Added single-column phone actions.
- Added reduced-motion behavior.
- Added print rules for mission packets, facilitator records, and AAR material.
- Added safe-area support for installed mobile PWAs.

## Automated Checks Defined

1. Bottom-navigation labels remain inside their controls at 390 x 844.
2. Visible buttons, inputs, and selects meet the touch-height threshold.
3. Reduced-motion preferences suppress transitions.
4. Facilitator tools remain inside the phone viewport.

## Manual Checks Required

1. Inspect Academy module headings at 320, 390, and 430 pixels wide.
2. Complete each form practical without zooming.
3. Confirm signed negative numbers remain visible after entry.
4. Confirm the bottom navigation does not cover response feedback.
5. Print one mission packet and one AAR summary.
6. Test portrait and landscape orientation on an iPhone and Android device.

These checks are defined for GitHub Actions because local browser execution remains blocked by Windows Device Guard.
