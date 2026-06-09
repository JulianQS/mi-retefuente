## Context

The engine currently computes `tasaEfectiva = retefuenteMensual / salarioMensual`. This uses monthly salary as the denominator, which excludes prima (1 month) and cesantías (~1.12 months) — income that is received and taxed annually. The result overstates the effective rate by roughly the ratio of total income to salary-only income (~18% overstated at typical salaries). There is no rate representation of social security at all.

## Goals / Non-Goals

**Goals:**
- Redefine `tasaEfectiva` to use total annual income as denominator.
- Add `tasaSegSocial` (social security as % of total annual income) as a new engine output field.
- Display both rates on the strategy card.

**Non-Goals:**
- Showing a combined total-burden rate (tax + social security together) — the two rates are more informative kept separate.
- Changing how `netoMensual` is computed — it already correctly subtracts both.
- Changing the 20% warn threshold — will reassess after seeing new values.

## Decisions

### Denominator: `ingresos.total` (annual), not annualised salary

Both `tasaEfectiva` and `tasaSegSocial` use the same denominator: `ingresos.total` (= salary × 12 + prima + cesantías). This makes the two rates directly comparable and additive — `tasaEfectiva + tasaSegSocial` gives the total mandatory deduction rate on total income.

**Alternative considered**: use `salarioMensual × 12` (annual salary only) to keep it simpler. Rejected — prima and cesantías are taxable income; excluding them from the denominator misrepresents the rate.

### `tasaSegSocial` denominator: same `ingresos.total`

Social security is computed on the monthly salary base (capped at 25× SMLV), but expressing it as a rate of `ingresos.total` keeps both rates on the same scale and makes them addable.

**Alternative considered**: `segSocial.total / (salarioMensual * 12)`. Rejected — inconsistent denominator with `tasaEfectiva` breaks additivity.

### Card display: two separate metric rows

Show `tasaEfectiva` and `tasaSegSocial` as distinct labelled rows on the card. Labels: "Tasa impuesto" and "Tasa seg. social". Replace the existing single "Tasa efectiva" row.

**Alternative considered**: a single combined row showing both percentages inline (e.g. "5.0% + 8.2%"). Rejected — two labelled rows are easier to scan and compare across cards.

## Risks / Trade-offs

- **`tasaEfectiva` values will visibly drop** across all strategies (~15–18% lower values than before). This is correct — the old values were inflated. → Expected and intentional.
- **The 20% warn threshold on `tasaEfectiva`** may no longer trigger at realistic salaries given the lower values. Assess after implementation; may need adjustment or removal.
