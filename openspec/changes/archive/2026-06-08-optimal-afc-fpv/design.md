## Context

The engine currently treats AFC/FPV contributions as a binary flag: either the full statutory maximum is applied (`usaAportesVoluntarios: true`) or nothing is. The maximum is `afcConfig.pct_maximo_ingreso * rl1` (20% of RL1 annually). However, cesantías already occupy part of that bucket (`cesantiasExentas`), so the incremental voluntary contribution needed is `maxVoluntario - cesantiasExentas`. Dividing by 12 gives the monthly amount the user should configure with their employer or directly into an AFC/FPV account.

## Goals / Non-Goals

**Goals:**
- Compute and return the exact monthly AFC/FPV contribution that maximizes the renta exenta benefit.
- Display that amount as a concrete, actionable metric on strategy cards for strategies with voluntary contributions.

**Non-Goals:**
- Computing the "effective" optimal contribution accounting for interactions with the 40% global cap and UVT cap — those constraints apply to the combined deduction total, not to the AFC bucket independently. The 20% of RL1 cap governs the AFC bucket itself and is the primary binding constraint for most salary levels.
- Suggesting a split between AFC (housing) vs FPV (voluntary pension) — both share the same statutory cap; the user decides the allocation.
- Showing the metric for strategies without voluntary contributions — zero is uninformative.

## Decisions

### Formula: `max(0, maxVoluntario - cesantiasExentas) / 12`

`maxVoluntario = afcConfig.pct_maximo_ingreso * rl1` is already computed inside `calcularEstrategia`. `cesantiasExentas` is also available. The incremental contribution is their positive difference. Dividing by 12 gives monthly pesos.

**Alternative considered**: account for the 40% global cap by finding the contribution where the global cap becomes binding. Rejected for now — the 40% cap only becomes binding when dependientes + salud + AFC together exceed 40% of RL1, which doesn't happen at typical salaries for the "max AFC alone" strategy. A future improvement could add this precision.

**Alternative considered**: expose the annual contribution and let the UI divide. Rejected — all other monetary metrics on cards are monthly; consistency matters more than saving one division.

### Display: new metric row, only for strategies with `usaAportesVoluntarios`

Show a "Aporte AFC/FPV mensual" row between the existing "Tasa seg. social" and "Impuesto anual" rows. Conditional on `r.estrategiaUsaAportesVoluntarios` (a boolean passed through the result, or we can conditionally omit the row using a helper).

**Alternative considered**: always show the row, with "—" for non-AFC strategies. Rejected — the row is only meaningful for AFC strategies; showing "—" adds visual noise without informational value.

## Risks / Trade-offs

- **Slight overstatement for strategies with many deductions**: At very high salary + dependientes + salud combos, the 40% cap may become binding before the full `maxVoluntario` is used. The displayed contribution would then be higher than the effective maximum. → Low impact; edge case at high salaries with multiple deductions; note as known limitation.
- **Cesantías interaction**: The engine computes `max(cesantiasExentas, maxVoluntario)`. If cesantías already equal or exceed `maxVoluntario`, `aporteMensualAFC` is 0 — meaning no additional AFC is beneficial. The guard `max(0, ...)` handles this correctly.
