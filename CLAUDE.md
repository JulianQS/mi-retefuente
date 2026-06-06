# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the app

Open `index.html` directly in a browser — no build step, no server, no dependencies to install. The HTML loads `config.js` via a `<script>` tag.

## Architecture

Two files carry the entire application:

- **`config.js`** — data layer only. Exports a single `const CONFIG` with two keys: `estatutos` (tax brackets and caps keyed by reform ID, e.g. `ET_2022`) and `anos` (UVT + SMLV per year, pointing to a statute). Edit this file to add years or tax reforms.
- **`index.html`** — calculation engine (vanilla JS, ~300 lines) + UI. No framework.

`DESIGN.md` is the authoritative reference for the data model schema, calculation equations, strategy presets, known limitations, and future directions. Read it before making engine changes.

## Calculation engine (index.html)

The engine is pure-functional: `calcularEstrategia(salarioMensual, uvt, smlv, estatuto, estrategia) → result`. Key functions:

| Function | Purpose |
|---|---|
| `calcularIngresos` | Gross income: salary × 12 + prima + cesantías |
| `calcularSegSocial` | Health + pension (8%, capped at 25× SMLV) + solidarity fund |
| `calcularImpuestoRenta` | Applies marginal brackets to taxable income |
| `calcularEstrategia` | Orchestrates steps 1–8 for one strategy |
| `renderApp` | Mounts UI, wires inputs, calls `recalcular` on change |

Each strategy is computed independently from `RL1` (net income after social security), not cascaded from a parent strategy. This differs from the reference spreadsheet — see `DESIGN.md` "Differences from Reference Spreadsheet".

## Updating tax parameters

**New year only** — add to `anos` in `config.js`:
```js
2027: { uvt: 55000, smlv: 1900000, estatuto: "ET_2022" },
```

**New tax reform** — add to `estatutos` with all required keys (`tabla_renta`, `topes`, `solidaridad`, `cesantias_exentas`, `deduccion_dependientes`, `deduccion_medicina_prepagada`, `aporte_voluntario_pension_afc`), then point years to it.

## Known engine gaps

- Health deduction always uses the UVT cap maximum, not an actual user-entered premium.
- No housing loan interest, GMF, or non-salaried income modeled.
