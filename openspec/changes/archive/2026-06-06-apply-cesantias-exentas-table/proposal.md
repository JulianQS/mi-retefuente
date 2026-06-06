## Why

The `cesantias_exentas` table in `config.js` defines salary-graduated partial exemptions for cesantías, but the calculation engine ignores it — all cesantías are currently treated as 100% exempt regardless of salary level. This overstates the exempt amount for higher earners and underestimates their tax burden.

## What Changes

- The calculation engine will read the `cesantias_exentas` table from the statute and apply the correct exemption percentage to cesantías based on the employee's salary in UVT.
- The exempt cesantías amount will replace the current hardcoded full exemption in Step 4 of the engine.
- Higher-salary scenarios will show higher taxable income and higher withholding than before.

## Capabilities

### New Capabilities

- `cesantias-exentas-calculation`: Compute the exempt portion of cesantías by looking up the employee's salary (in UVT) against the `cesantias_exentas` bracket table, returning a partial exemption percentage instead of always using 100%.

### Modified Capabilities

_(none — no existing spec files exist yet)_

## Impact

- `index.html`: `calcularEstrategia` function, Step 4 (exempt income calculation).
- `config.js`: No changes needed — the table is already present and correct.
- Results will change for salaries above 350 UVT/month (~17.4M COP in 2025). Lower salaries are unaffected (90% or 80% exempt still applies).
- The "Known Limitations" note in `CLAUDE.md` and `DESIGN.md` should be removed once implemented.
