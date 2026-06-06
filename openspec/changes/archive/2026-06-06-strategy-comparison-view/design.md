## Context

`renderApp` in `index.html` currently renders all 7 strategy cards into a CSS grid on every `recalcular` call. There is no selection state — every card is always visible. Adding a focused view requires introducing a selection layer between the calculation results and the card rendering, plus the UI controls to drive it.

## Goals / Non-Goals

**Goals:**
- Let the user select one primary strategy and see only that card.
- Let the user optionally pick a second strategy to compare side by side.
- Default to showing all 7 cards (no selection) so the existing overview is preserved.

**Non-Goals:**
- Comparing more than 2 strategies at once.
- Persisting the selection across page reloads.
- Any changes to the calculation engine or `ESTRATEGIAS` array.

## Decisions

### Two `<select>` dropdowns, always visible

A primary `<select>` with options "Todas las estrategias" (value `""`) + one option per strategy. A secondary `<select>` with "Sin comparación" (value `""`) + the same 7 options, always rendered but visually hidden/muted when primary is empty.

**Alternative considered**: Show secondary selector only after primary is chosen (toggle visibility). Rejected — simpler to always show both, avoids layout shift, and the label "Sin comparación" is self-explanatory when primary is blank.

**Alternative considered**: Radio buttons or cards as selectors. Rejected — 7 options in a dropdown is compact and consistent with the existing year selector control style.

### Filter applied inside `recalcular`, not in a separate render pass

`recalcular` already calls `calcularEstrategia` for all strategies and then renders all cards. The filter is applied at the render step: collect `selected = [primary, secondary].filter(Boolean)`, then if `selected` is non-empty, only render cards whose `id` is in `selected`.

**Alternative considered**: Skip computing unselected strategies. Rejected — computation is cheap and the code stays simpler with a single full-compute + filter-at-render pattern.

### Layout: single card centered, two cards side by side

When one strategy is active: render the card in a single-column centered container (max-width ~480px). When two: a two-column flex row (same as the existing two-column breakpoint). When none selected (all shown): existing grid unchanged.

The layout mode is driven by a CSS class on the cards container (`data-mode="single" | "compare" | "all"`), keeping the layout logic in CSS rather than JS.

## Risks / Trade-offs

- **"Menor carga" badge** — the green badge marks the strategy with the lowest burden across all 7. When only 1–2 are shown, the badge still reflects the global winner, which may or may not be one of the visible cards. This is correct behavior (the badge reflects reality, not just the visible set) but could confuse a user who only sees the badge appear on one of their two selected cards. → Acceptable for now; the badge logic is unchanged.
- **Detail panel state** — the "Ver detalle" toggle on each card opens an inline detail panel. Switching strategies while a detail is open will re-render and close it (since `recalcular` replaces innerHTML). → Expected behavior, no mitigation needed.
