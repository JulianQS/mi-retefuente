## Context

The calculation engine in `index.html` computes cesantías as fully exempt income in Step 4 of `calcularEstrategia`. The statute already carries a `cesantias_exentas` bracket table that applies a salary-graduated partial exemption: employees earning above ~350 UVT/month have only a fraction of their cesantías treated as exempt, down to 0% above 590 UVT/month. The table has been inert since the app was written.

## Goals / Non-Goals

**Goals:**
- Apply `cesantias_exentas` bracket lookup to compute the exempt portion of cesantías based on monthly salary in UVT.
- Keep the interaction with voluntary contributions correct: the capped bucket (`max(cesantíasExentas, 20% × RL1)`) uses the partial amount, not the full cesantías.
- Affect only higher earners (>350 UVT/month ≈ 17.4M COP in 2025); lower salaries are unaffected.

**Non-Goals:**
- Allowing users to input actual cesantías amounts — the engine still derives cesantías from salary × 1.12.
- Any changes to `config.js` — the table is already correct.

## Decisions

### Bracket lookup key: monthly salary in UVT

The `cesantias_exentas` table brackets are in UVT and correspond to the employee's monthly salary, not the cesantías amount. Lookup: `salarioMensual / uvt` compared against each `hasta_uvt` in order, first match wins (`null` = unbounded).

**Alternative considered**: use annual cesantías in UVT as the key. Rejected — the table is defined per-month in the statute (ET Art. 206 num. 4), and the config comment aligns with salary-level thresholds.

### New helper function: `calcularExencionCesantias`

Isolate the bracket lookup in a pure helper:
```
calcularExencionCesantias(salarioMensual, uvt, cesantias, cesantiasExentasTable)
  → cesantias × pct_exento
```

This keeps `calcularEstrategia` readable and the lookup independently testable.

### Partial exemption replaces full exemption in Step 4

Current:
```
rentasExentas = cesantias                            // else branch
rentasExentas = max(cesantias, 0.20 × RL1)          // voluntary branch
```

After:
```
cesantiasExentas = calcularExencionCesantias(...)
rentasExentas = cesantiasExentas                     // else branch
rentasExentas = max(cesantiasExentas, 0.20 × RL1)   // voluntary branch
```

The rest of the pipeline (global caps, 25% exemption, brackets) is unchanged.

## Risks / Trade-offs

- **Results change for high earners** → Expected and correct. Withheld tax increases for salaries above 350 UVT/month. Users may be surprised; no mitigation needed — the old results were wrong.
- **Bracket order assumption** → The table must be ordered ascending by `hasta_uvt` (null last). The current config satisfies this; a future misconfigured statute could break silently. Mitigation: the lookup function iterates in array order and stops at first match, which is safe as long as the config is correct (same assumption the tax bracket table already makes).
