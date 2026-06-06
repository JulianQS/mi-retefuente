# Mi Retefuente

Comparador de estrategias de planificación tributaria para retención en la fuente e impuesto de renta en Colombia.

## Quick Start

Open `index.html` in any browser. That's it — no server needed.

## How to Use

1. **Select the tax year** from the dropdown. UVT, SMLV, and other tax parameters for that year are shown in the info bar below the inputs.

2. **Enter your monthly salary** (base salary before any deductions). The app formats it automatically with thousand separators and shows the equivalent in UVT/month.

3. **Pick a strategy** from the **Estrategia** dropdown to focus on a single card. By default the app opens with *Sin planificación* selected.

4. **Add a comparison** using the **Comparar con** dropdown to see a second strategy side by side. By default *Máxima planificación* is pre-selected here. Leave it on *Sin comparación* to see just one card, or clear both dropdowns to see all 7 strategies at once.

5. **Each card shows:**
   - **Retefuente mensual** — the ideal monthly withholding tax.
   - **Tasa efectiva** — withholding as a percentage of your salary.
   - **Impuesto anual** — total income tax for the year.
   - **Neto mensual** — take-home pay after tax and social security.
   - **Ahorro vs sin planificación** — how much you save compared to doing nothing.

6. **Look for the green badge** (✦ Menor carga) — it marks the strategy with the lowest tax burden across all 7, regardless of which ones are currently visible.

7. **Click "Ver detalle"** on any card to see the full calculation breakdown: income components, social security, exemptions, caps applied, and final taxable income.

## Strategies Explained

| Strategy | What it assumes |
|----------|----------------|
| **Sin planificación** | You do nothing. Only mandatory cesantías count as exempt income. |
| **Máxima planificación** | You contribute the maximum to AFC or voluntary pension funds (up to 20% of net income). |
| **1 hijo** | Max voluntary contributions + you declare 1 dependent child. |
| **1 hijo + salud** | Same as above + you have voluntary health insurance (medicina prepagada). |
| **2 hijos** | Max voluntary contributions + 2 dependent children. |
| **2 hijos + salud** | 2 children + voluntary health insurance. |
| **Solo salud** | Max voluntary contributions + health insurance, no dependents. |

## Editing Tax Parameters

All tax tables, caps, rates, UVT, and SMLV values live in `config.js` — they are read-only in the UI. No code changes needed for:

### Updating UVT or SMLV for a new year

Add a line to the `anos` object in `config.js`:

```js
2027: { uvt: 55000, smlv: 1900000, estatuto: "ET_2022" },
```

### Adding a new tax reform

Create a new entry under `estatutos` with its own brackets and topes, then point years to it:

```js
estatutos: {
  ET_2022: { ... },
  ET_2028: {
    nombre: "Reforma Tributaria 2028",
    tabla_renta: [ ... ],
    topes: { ... },
    ...
  }
},
anos: {
  2029: { uvt: 60000, smlv: 2100000, estatuto: "ET_2028" },
}
```

## File Structure

```
mi-retefuente/
├── config.js      Tax parameters: UVT/SMLV per year, brackets, caps, deduction rules
├── index.html     Calculation engine (vanilla JS) + comparison UI
├── DESIGN.md      Architecture, data model, equations, and spec for changes
└── README.md      This file
```

## Important Notes

- **UVT and SMLV values are approximate.** Verify against official DIAN resolutions and Ministry of Labor decrees before relying on results.
- **This is a planning tool, not tax advice.** The calculations model an idealized scenario. Actual withholding may differ based on employer procedures, payment timing, and other income sources.
- **Strategies assume maximum deductions.** The "1 hijo" strategy assumes you claim the full dependent deduction. The "salud" strategies assume you spend up to the deduction cap on voluntary health insurance. Your actual amounts may be lower.
