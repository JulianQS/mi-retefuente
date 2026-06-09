## Why

The tool models a single salaried-income source. Many filers also make voluntary pension contributions, earn financial yields, or realise occasional gains — all of which materially change their tax. Today none of these can be entered, so the planning picture is incomplete for anyone beyond a pure salary earner.

## What Changes

All new inputs are **optional and global** (they apply to every strategy) and default to zero/blank, so existing results are unchanged when left empty.

- **Aportes voluntarios a pensión obligatoria (AVPO)** — treated as INCRNGO (Art. 55 ET): subtracted from cédula general income *before* the 40% / 1,340 UVT exempt cap, with its own limit of 25% of income capped at 2,500 UVT/year. Does **not** consume the general exempt cap, making it a distinct lever from AFC/FPV.
- **Custom AFC/FPV contribution override** — an optional monthly amount. When blank, the engine keeps computing and using the optimal. When provided, the entered amount drives the exempt bucket and net cash, capped at the existing 30% / 3,800 UVT statutory limit.
- **Rendimientos financieros** — financial yields added to the cédula general, with an optional *componente inflacionario* percentage (Art. 38 ET) that is INCRNGO and reduces the taxable portion.
- **Ganancias ocasionales** — occasional gains taxed on a **separate flat-rate track** (15% general under Ley 2277), added to the total tax burden and computed independently of the chosen strategy.

Strategy cards gain rows for the new components (applied AFC amount, occasional-gains tax, total tax).

## Capabilities

### New Capabilities

- `cedula-general-inputs`: optional inputs that feed the income-tax (cédula general) calculation — AVPO as INCRNGO, a custom AFC/FPV contribution override, and rendimientos financieros with an optional componente inflacionario.
- `ganancias-ocasionales`: a separate flat-rate tax on occasional gains, added to the total tax burden and independent of the selected planning strategy.

### Modified Capabilities

_(none — existing `optimal-afc-fpv` behavior is preserved; the override and the displayed optimal both remain)_

## Impact

- `index.html`: `calcularEstrategia` gains an `adicionales` inputs object; RL1 composition changes (adds taxable financial yields, subtracts AVPO as INCRNGO); new ganancias-ocasionales track; new card rows; `renderApp` adds the input fields and wiring.
- `config.js`: add `tarifa_ganancia_ocasional` and an `aporte_voluntario_pension_obligatoria` cap (`pct_maximo_ingreso`, `tope_uvt`) to `ET_2022`.
- `DESIGN.md` / `README.md`: document the new inputs and the extended cédula-general model.
