## 1. Update calculation engine

- [x] 1.1 In `calcularEstrategia`, redefine `tasaEfectiva` as `impuesto / ingresos.total` (replacing `retefuenteMensual / salarioMensual`); guard for zero with `ingresos.total > 0 ? ... : 0`
- [x] 1.2 Add `tasaSegSocial = ingresos.total > 0 ? segSocial.total / ingresos.total : 0` after `tasaEfectiva`
- [x] 1.3 Add `tasaSegSocial` to the return object of `calcularEstrategia`

## 2. Update card display

- [x] 2.1 Replace the single "Tasa efectiva" metric row in the card template with two rows: "Tasa impuesto" (`r.tasaEfectiva`) and "Tasa seg. social" (`r.tasaSegSocial`)
- [x] 2.2 Review and adjust (or remove) the `> 0.20` warn threshold on `tasaEfectiva` — values will be lower with the new denominator
