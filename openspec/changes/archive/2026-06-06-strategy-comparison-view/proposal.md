## Why

The current UI always shows all 7 strategies at once, which is overwhelming and makes it hard to focus on the one or two scenarios that matter to a specific user. Users need a way to pin a primary strategy and optionally compare it against a second one, without the noise of the other five.

## What Changes

- The app gains a **focused view**: the user selects one primary strategy from a dropdown (or similar selector) and only that strategy's card is shown by default.
- The user can optionally add a **comparison strategy** (a second selector appears), showing two cards side by side.
- The existing "show all" grid remains accessible — either as a default before any selection is made, or via a toggle/link — so users who want the full overview can still get it.
- No changes to the calculation engine; this is purely a UI/display change.

## Capabilities

### New Capabilities

- `strategy-selection`: UI controls that let the user pick a primary strategy (and optionally a second one for comparison), filtering the card display to show only the selected one or two cards.

### Modified Capabilities

_(none — no existing specs are changing behavior)_

## Impact

- `index.html`: UI section — strategy card rendering logic and the input controls area.
- No changes to `config.js`, calculation functions, or `ESTRATEGIAS` array.
