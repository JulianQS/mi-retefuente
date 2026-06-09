## 1. Config parameters

- [x] 1.1 Add `tarifa_ganancia_ocasional: 0.15` to `ET_2022.topes` in `config.js`
- [x] 1.2 Add `aporte_voluntario_pension_obligatoria: { pct_maximo_ingreso: 0.25, tope_uvt: 2500 }` to `ET_2022` in `config.js`

## 2. Engine — cédula general inputs

- [x] 2.1 Add an `adicionales` parameter to `calcularEstrategia` with safe defaults: `{ aporteAFCManualMensual = null, avpoMensual = 0, rendimientosFinancieros = 0, componenteInflacionarioPct = 0, gananciasOcasionales = 0 }`
- [x] 2.2 Compute `rendimientoGravable = rendimientosFinancieros * (1 - componenteInflacionarioPct)` and `cedulaGeneralBruta = ingresos.total + rendimientoGravable`
- [x] 2.3 Compute `avpoAplicado = min(avpoMensual * 12, 0.25 * cedulaGeneralBruta, avpoConfig.tope_uvt * uvt)` and form `rl1 = cedulaGeneralBruta - segSocial.total - avpoAplicado`
- [x] 2.4 Change `maxVoluntario` base from `ingresos.total` to `cedulaGeneralBruta` (still capped at `tope_uvt * uvt`)
- [x] 2.5 Apply the AFC override: `voluntaryExemptApplied = aporteAFCManualMensual != null ? min(aporteAFCManualMensual * 12, maxVoluntario) : maxVoluntario`; use it in `rentasExentas = max(cesantiasExentas, voluntaryExemptApplied)`
- [x] 2.6 Compute `aporteAFCAplicadoMensual` (override if provided and capped, else the optimal `aporteMensualAFC`) and subtract it from `netoMensual` instead of the optimal
- [x] 2.7 Add `avpoAplicado`, `rendimientoGravable`, `aporteAFCAplicadoMensual` to the return object

## 3. Engine — ganancias ocasionales

- [x] 3.1 Compute `impuestoGananciaOcasional = topes.tarifa_ganancia_ocasional * gananciasOcasionales` and `impuestoTotal = impuesto + impuestoGananciaOcasional`; add both to the return object

## 4. UI

- [x] 4.1 Add optional input fields to the inputs panel: AVPO mensual, AFC/FPV override mensual, rendimientos financieros (anual), componente inflacionario %, ganancias ocasionales (anual) — all blank/zero by default
- [x] 4.2 Read the new fields, build the `adicionales` object, and pass it into `calcularEstrategia` in the render loop; wire all fields to `recalcular`
- [x] 4.3 Add card rows: applied AFC amount when overridden; "Impuesto ganancia ocasional" and "Impuesto total anual" rows when `gananciasOcasionales > 0`

## 5. Documentation

- [x] 5.1 Update `DESIGN.md` (data model entries, cédula general engine steps, known limitations) and `README.md` (new optional inputs)
