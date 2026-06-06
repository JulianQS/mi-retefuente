# Mi Retefuente — Design Document

## Purpose

Standalone web tool for Colombian income tax planning. Given a monthly salary and tax year, it computes withholding tax (retención en la fuente) and annual income tax (impuesto de renta) under multiple planning strategies, letting the user compare outcomes side by side.

The tool is aimed at salaried employees in Colombia who want to understand how voluntary contributions, dependent deductions, and voluntary health insurance affect their effective tax rate.

---

## Architecture

```
mi-retefuente/
├── config.js     ← tax parameters (data layer, edited by hand)
├── index.html    ← calculation engine + UI (application layer)
├── DESIGN.md     ← this file
└── README.md     ← usage instructions
```

Single-page app, zero build step, no framework dependencies. The HTML loads `config.js` via a `<script>` tag — opens directly from the filesystem, no server needed.

---

## Data Model — config.js

The file exports a single `const CONFIG` with two top-level objects: `estatutos` and `anos`.

### estatutos

Keyed by reform identifier (e.g. `ET_2022`). Each entry encodes everything that comes from a specific tax reform law and remains constant across the years that reform governs.

```
estatutos.<ID>
├── nombre: string               # human-readable law reference
├── vigencia_desde: number        # first year this statute applies
│
├── tabla_renta[]                 # marginal tax brackets
│   ├── desde_uvt: number
│   ├── hasta_uvt: number | null  # null = unbounded upper end
│   └── tarifa: number            # marginal rate (0.00–0.39)
│
├── topes                         # exemption and deduction caps
│   ├── exento_25pct_tope_uvt          # cap on the 25% exempt amount (790)
│   ├── total_rentas_exentas_uvt       # global exemptions cap (1340)
│   ├── uvt_adicional_por_dependiente  # UVT added to cap per dependent (72)
│   ├── max_dependientes               # maximum dependents allowed (4)
│   ├── limite_rentas_exentas_pct      # percentage cap on exemptions (0.40)
│   ├── factor_exento_25pct            # the 25% factor itself (0.25)
│   ├── factor_cesantias               # cesantías multiplier (1.12)
│   ├── base_max_cotizacion_smlv       # social security contribution ceiling in SMLV (25)
│   └── aporte_salud_pension_empleado_pct  # employee health+pension rate (0.08)
│
├── solidaridad                   # pension solidarity fund rules
│   ├── umbral_aplica_smlv             # min salary to contribute (1× SMLV)
│   ├── umbral_tarifa_alta_smlv        # threshold for higher rate (20× SMLV)
│   ├── tarifa_baja                    # rate below threshold (0.01)
│   ├── tarifa_alta                    # rate at/above threshold (0.02)
│   └── tope_maximo_factor_smlv        # max contribution as factor of SMLV (0.50)
│
├── cesantias_exentas[]           # partial exemption table for cesantías
│   ├── hasta_uvt: number | null
│   └── pct_exento: number
│
├── deduccion_dependientes        # dependent child deduction rules
│   ├── pct_ingreso_por_dependiente    # 10% of gross income per dependent
│   └── tope_mensual_uvt_por_dependiente  # monthly cap in UVT per dependent (32)
│
├── deduccion_medicina_prepagada   # voluntary health insurance deduction
│   └── tope_mensual_uvt               # monthly cap in UVT (16)
│
└── aporte_voluntario_pension_afc  # voluntary pension / AFC contributions
    └── pct_maximo_ingreso             # max as % of net income (0.20)
```

### anos

Keyed by tax year string. Each entry binds a year to its UVT value, SMLV value, and which statute governs it.

```
anos.<YEAR>
├── uvt: number        # UVT value in COP for that year
├── smlv: number       # monthly minimum wage in COP
└── estatuto: string   # key into estatutos (e.g. "ET_2022")
```

### Adding a new year

Add an entry to `anos` pointing to the existing statute:

```js
2027: { uvt: 55000, smlv: 1900000, estatuto: "ET_2022" },
```

### Adding a new tax reform

Create a new key under `estatutos` with all its tables and topes, then point affected years to it:

```js
estatutos: {
  ET_2022: { ... },
  ET_2028: { nombre: "...", tabla_renta: [...], topes: {...}, ... }
},
anos: {
  2029: { uvt: 60000, smlv: 2100000, estatuto: "ET_2028" },
}
```

---

## Calculation Engine

All monetary amounts are annual unless noted. The engine is pure-functional: `(salary, uvt, smlv, estatuto, strategy) → result`.

### Step 1 — Gross Income

```
salarioAnual = 12 × salarioMensual
prima        = salarioMensual                        // 1 month
cesantias    = salarioMensual × topes.factor_cesantias  // salary × 1.12
ingresos     = salarioAnual + prima + cesantias
```

### Step 2 — Social Security (employee portion)

**Health + Pension** — 8% of salary, capped at 25× SMLV base:

```
baseMensual   = min(salarioMensual, topes.base_max_cotizacion_smlv × smlv)
saludPension  = topes.aporte_salud_pension_empleado_pct × 12 × baseMensual
```

**Solidarity Fund** — tiered by salary vs SMLV:

```
if salario < 1× SMLV         → solidaridadMensual = 0
if 1× SMLV ≤ salario < 20× SMLV → solidaridadMensual = tarifa_baja × salario
if salario ≥ 20× SMLV        → solidaridadMensual = min(tarifa_alta × salario, 0.5 × SMLV)

solidaridadAnual = 12 × solidaridadMensual
segSocial        = saludPension + solidaridadAnual
```

### Step 3 — Net Taxable Income (Renta Líquida 1)

```
RL1 = ingresos − segSocial
```

### Step 4 — Exempt Income (Rentas Exentas)

Varies by strategy. Three components, each with its own cap:

**a) Base exemption:**

```
if strategy.usaAportesVoluntarios:
    rentasExentas = max(cesantias, pct_maximo_ingreso × RL1)
else:
    rentasExentas = cesantias
```

The voluntary contribution bucket subsumes cesantías — the total of AFC + pension voluntario + cesantías cannot exceed 20% of RL1, and if cesantías alone exceed 20%, they become the floor.

**b) Dependent deduction:**

```
deduccionPorDep  = min(pct_ingreso_por_dependiente × ingresos, tope_mensual_uvt × 12 × UVT)
totalDependientes = nDependientes × deduccionPorDep
```

**c) Voluntary health insurance:**

```
deduccionSalud = tope_mensual_uvt × 12 × UVT   (if strategy.usaSaludPrepagada)
```

**d) Combined gross exemptions:**

```
totalExentasBrutas = rentasExentas + totalDependientes + deduccionSalud
```

### Step 5 — 25% Additional Exemption

Applied to the remainder after gross exemptions, with its own UVT cap:

```
RL2          = max(RL1 − totalExentasBrutas, 0)
exento25     = min(factor_exento_25pct × RL2, exento_25pct_tope_uvt × UVT)
```

### Step 6 — Apply Global Caps (triple cap)

Three caps applied in sequence — the binding one wins:

```
totalConPct  = totalExentasBrutas + exento25

// Cap 1: 40% of RL1
totalConPct  = min(totalConPct, limite_rentas_exentas_pct × RL1)

// Cap 2: UVT absolute ceiling (increases with dependents)
topeUVT      = (total_rentas_exentas_uvt + nDep × uvt_adicional_por_dependiente) × UVT
totalFinal   = min(totalConPct, topeUVT)
```

### Step 7 — Taxable Income and Tax

```
rlGravable = max(RL1 − totalFinal, 0)

impuesto = Σ over brackets:
    base = min(rlGravable, bracket.hasta_uvt × UVT) − bracket.desde_uvt × UVT
    base × bracket.tarifa    (if rlGravable > bracket.desde_uvt × UVT)
```

### Step 8 — Output Metrics

```
retefuenteMensual = impuesto / 12
tasaEfectiva      = retefuenteMensual / salarioMensual
netoMensual       = salarioMensual − retefuenteMensual − segSocial / 12
```

---

## Strategy Presets

Each strategy is a named combination of three boolean/numeric parameters:

| ID | Name | Aportes Vol. | Dependientes | Salud |
|----|------|:---:|:---:|:---:|
| `sin_plan` | Sin planificación | ✗ | 0 | ✗ |
| `max_plan` | Máxima planificación | ✓ | 0 | ✗ |
| `hijo1` | 1 hijo | ✓ | 1 | ✗ |
| `hijo1_salud` | 1 hijo + salud | ✓ | 1 | ✓ |
| `hijo2` | 2 hijos | ✓ | 2 | ✗ |
| `hijo2_salud` | 2 hijos + salud | ✓ | 2 | ✓ |
| `solo_salud` | Solo salud | ✓ | 0 | ✓ |

All strategies are computed independently (not chained). Each uses the same RL1 as input and applies its own set of deductions.

---

## Validation

The engine was validated against the reference spreadsheet (`Retencion_en_la_fuente_salarial.xlsx`) for the "Sin planificación" and "Máxima planificación" strategies using UVT=49,799 / SMLV=1,300,000:

| Salary | Strategy | Expected RL Gravable | Engine RL Gravable | Match |
|--------|----------|---------------------:|-------------------:|:-----:|
| 10M | Sin plan | 89,400,000 | 89,400,000 | ✓ |
| 10M | Máx plan | 78,240,000 | 78,240,000 | ✓ |
| 10M | Sin plan imp. | 7,099,380.1 | 7,099,380.1 | ✓ |
| 10M | Máx plan imp. | 4,552,227.1 | 4,552,227.1 | ✓ |

---

## Differences from Reference Spreadsheet

The spreadsheet uses a **cascading model** where some strategies (1 hijo, 2 hijos + salud, etc.) compute their exemptions as 20% of the *previous* strategy's taxable income, capped by the previous strategy's tax amount. This creates a dependency tree between strategies.

This app uses an **independent model** where each strategy is computed from RL1 directly, with its own deductions summed and capped. This is easier to reason about, extend, and audit. Results will differ from the spreadsheet for the cascaded strategies (1 hijo, 1 hijo + salud, 2 hijos, 2 hijos + salud, solo salud). The two base strategies (sin plan, máx plan) match exactly.

If the cascading behavior is desired, the engine would need a `calcularEstrategiaCascada(parentResult)` function that takes a parent strategy's `rlGravable` and `impuesto` as the exemption base and cap respectively.

---

## Known Limitations

- **Health deduction uses maximum.** The `deduccion_medicina_prepagada` always uses the UVT cap as the deduction amount, not an actual premium paid by the user. A future version could let the user input their actual premium.
- **No intereses de vivienda.** Housing loan interest deduction (up to 100 UVT/month) is not modeled.
- **No GMF deduction.** The 50% GMF (4×1000 tax) deduction is not modeled.
- **Single income type.** Only models salaried employment income. Does not handle honorarios, dividends, rental income, or capital gains.
- **No declaración threshold check.** Does not verify whether the person is required to file a return (declarar renta) based on income/patrimonio thresholds.

---

## Possible Future Changes

- Add user-editable deduction amounts (actual health premium, actual housing interest, actual voluntary contribution) instead of using maximums.
- Add a custom strategy builder where the user toggles individual deductions.
- Add a chart showing effective tax rate vs salary across strategies.
- Add support for non-salaried income (honorarios, independent contractors with 40% costs).
- Apply the `cesantias_exentas` partial exemption table.
- Implement the cascading model as an alternative calculation mode.
- Export results to PDF or copy-pasteable table.
- Add declaración de renta threshold validation.
