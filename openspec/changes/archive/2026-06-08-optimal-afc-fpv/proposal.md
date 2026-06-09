## Why

The "Máxima planificación" card shows how much tax you save by maxing out AFC/FPV contributions, but never tells the user what monthly amount to actually contribute. Without a concrete number, the result is informative but not actionable — users still have to do the back-calculation themselves (or overshoot with a rough estimate).

## What Changes

- **New engine output `aporteMensualAFC`**: For strategies that use `usaAportesVoluntarios`, the engine calculates and returns the exact monthly contribution amount that fills the voluntary renta exenta bucket up to the statutory maximum — accounting for the portion already covered by the cesantías exemption.
- **New metric row on strategy cards**: Cards for strategies with `usaAportesVoluntarios: true` display "Aporte AFC/FPV mensual" so users see an immediately actionable number.
- The metric is `0` (and hidden or shown as "—") for strategies that don't use voluntary contributions.

## Capabilities

### New Capabilities

- `optimal-afc-fpv`: Defines how the engine computes the optimal monthly AFC/FPV contribution, and the display rule for showing it on strategy cards.

### Modified Capabilities

_(none)_

## Impact

- `index.html`: `calcularEstrategia` (add `aporteMensualAFC` to result object), strategy card template (add metric row for strategies with voluntary contributions).
- No changes to `config.js` — the parameters needed (`pct_maximo_ingreso`, `limite_rentas_exentas_pct`) are already present.
