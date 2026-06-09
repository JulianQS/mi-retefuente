## Why

The current `tasaEfectiva` divides monthly withholding by monthly salary, which overstates the rate because prima and cesantías are excluded from the denominator even though they are taxed. Additionally, social security contributions (salud + pensión + solidaridad) are a significant mandatory deduction with no representation as a rate metric, leaving users without a complete picture of their total mandatory burden.

## What Changes

- **`tasaEfectiva` redefined**: changes from `retefuenteMensual / salarioMensual` to `impuesto / ingresos.total` — annual tax divided by total annual income (salary × 12 + prima + cesantías). This is the standard definition used in Colombian tax literature.
- **New metric `tasaSegSocial`**: `segSocial.total / ingresos.total` — total annual social security contributions as a percentage of total annual income. Added to the engine output and displayed on each card.
- Both rates are displayed on the strategy card so users can see tax burden and contribution burden side by side.

## Capabilities

### New Capabilities

- `effective-rate-metrics`: Defines how `tasaEfectiva` is computed (denominator = total annual income) and introduces `tasaSegSocial` as a first-class output metric alongside it.

### Modified Capabilities

_(none — no existing specs cover rate computation)_

## Impact

- `index.html`: `calcularEstrategia` (engine output), strategy card template (display).
- Results for `tasaEfectiva` will change for all strategies — values will be slightly lower than before because the denominator is larger. This is a **breaking display change** (same underlying tax, different rate shown).
