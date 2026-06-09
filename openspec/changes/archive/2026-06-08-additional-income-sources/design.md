## Context

The engine signature is `calcularEstrategia(salarioMensual, uvt, smlv, estatuto, estrategia) → result`, and the only income is labor income: `RL1 = ingresos.total − segSocial.total`. The exempt bucket (cesantías + AFC/FPV) is then limited by the 40% / 1,340 UVT global cap, and tax comes from the marginal table.

Colombian tax uses a **cedular** system. The cédula general combines rentas de trabajo, de capital, and no laborales; INCRNGO items (mandatory social security, voluntary contributions to mandatory pension) are subtracted *before* the exempt/deduction cap, which is applied to the resulting net (RL1). Ganancias ocasionales are taxed on a **separate flat-rate track**, not as part of the cédula general and not subject to monthly salary withholding.

This change extends the engine to that broader model while keeping all new inputs optional, so the salary-only case is unaffected.

## Goals / Non-Goals

**Goals:**
- Accept optional global inputs: AVPO, custom AFC/FPV override, rendimientos financieros (+ componente inflacionario), ganancias ocasionales.
- Integrate them with correct tax mechanics: AVPO and componente inflacionario as INCRNGO; financial yields into the cédula general; ganancias ocasionales on a separate flat-rate track.
- Preserve existing behavior exactly when all new inputs are empty.

**Non-Goals:**
- Ingresos no laborales (rentas no laborales) — deferred.
- Multiple ganancias-ocasionales rates or per-type exemptions (lottery 20%, home-sale / inheritance exemptions). Single configurable rate only.
- Modeling cost/expense deductions for rentas de capital, or the real withholding (retención) on financial yields. Yields are entered as gross with an optional inflationary exempt fraction.
- Changing the strategy presets — new inputs are global and feed every strategy.

## Decisions

### Inputs passed as a single `adicionales` object

`calcularEstrategia(..., estrategia, adicionales)` gains a sixth parameter with safe defaults:
`{ aporteAFCManualMensual, avpoMensual, rendimientosFinancieros, componenteInflacionarioPct, gananciasOcasionales }`. Strategy presets stay untouched; the object is global and applies to every card.

**Alternative considered**: extend each strategy preset with the new fields. Rejected — these are user-entered, not strategy-defined; they belong to the input panel, not the preset table.

### Cédula general recomposition

```
rendimientoGravable = rendimientosFinancieros × (1 − componenteInflacionarioPct)   // pct default 0
cedulaGeneralBruta  = ingresos.total + rendimientoGravable
avpoAplicado        = min(avpoMensual × 12, 0.25 × cedulaGeneralBruta, avpoConfig.tope_uvt × uvt)
RL1                 = cedulaGeneralBruta − segSocial.total − avpoAplicado
```

AVPO is subtracted as INCRNGO **before** the 40% / 1,340 UVT exempt cap, so it lowers RL1 and the cap is computed on the lowered RL1 — it never consumes the exempt cap. The `maxVoluntario` base for AFC/FPV becomes `cedulaGeneralBruta` (the 30% applies to total cédula-general income, not labor only).

### Custom AFC/FPV override

```
voluntaryExemptApplied = aporteAFCManualMensual != null
    ? min(aporteAFCManualMensual × 12, maxVoluntario)
    : maxVoluntario
rentasExentas          = max(cesantiasExentas, voluntaryExemptApplied)
aporteAFCAplicadoMensual = aporteAFCManualMensual != null
    ? min(aporteAFCManualMensual, maxVoluntario / 12)
    : aporteMensualAFC   // the computed optimal
netoMensual subtracts aporteAFCAplicadoMensual (the real contribution), not the optimal.
```

The optimal (`aporteMensualAFC`) is still computed and displayed as a suggestion. When the override is **blank**, behavior is identical to today (the downstream 40%/1,340 cap binds, so using `maxVoluntario` in the bucket matches the optimal result). When the override is **below** optimal, the exempt bucket shrinks and tax rises correctly.

**Alternative considered**: always require a manual amount. Rejected in clarification — the optimal-as-default guidance is the tool's main value.

### Ganancias ocasionales — separate flat-rate track

```
impuestoGananciaOcasional = topes.tarifa_ganancia_ocasional × gananciasOcasionales
impuestoTotal             = impuesto + impuestoGananciaOcasional
```

GO is **strategy-independent** (planning levers don't touch it) and is **not** withheld on monthly salary, so `retefuenteMensual` and `netoMensual` stay based on the cédula general. The card shows the GO tax and the combined total as separate informational lines; `ahorro vs sin planificación` stays based on the cédula-general `impuesto` so the strategy comparison remains clean.

## Risks / Trade-offs

- **GO simplification** → single flat rate, no per-type exemptions (home sale, inheritance, lottery). Documented as a known limitation; a future change can add typed GO.
- **Componente inflacionario is user-entered** → the real fraction is set annually by decree (Art. 38). We don't hardcode it; the user supplies the percentage. Acceptable for a planning tool; note in README.
- **No retención on yields modeled** → financial yields join the annual tax base but their own withholding (e.g. 7% over threshold) is not separately tracked. Out of scope; the annual income-tax effect is still captured.
- **maxVoluntario base now includes financial yields** → slightly higher AFC headroom when yields are present; matches "30% of cédula-general income" reading of Art. 126-1.
