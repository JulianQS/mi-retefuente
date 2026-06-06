## 1. Add bracket lookup helper

- [x] 1.1 Add `calcularExencionCesantias(salarioMensual, uvt, cesantias, cesantiasExentasTable)` function in `index.html` before `calcularEstrategia` — iterates the table in order, returns `cesantias × pct_exento` for the first bracket where `salarioMensual / uvt <= hasta_uvt` (or `hasta_uvt === null`)

## 2. Wire into calculation engine

- [x] 2.1 In `calcularEstrategia`, after computing `cesantias` (Step 1), call the helper with `estatuto.cesantias_exentas` to get `cesantiasExentas`
- [x] 2.2 Replace both uses of `cesantias` in Step 4 (the `else` branch and the `max(cesantias, ...)` voluntary branch) with `cesantiasExentas`

## 3. Documentation cleanup

- [x] 3.1 Remove the cesantías known-limitation bullet from `CLAUDE.md`
- [x] 3.2 Remove the cesantías known-limitation bullet from `DESIGN.md` and mark the limitation as resolved
