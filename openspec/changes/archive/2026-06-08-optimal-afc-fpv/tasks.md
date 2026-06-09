## 1. Update calculation engine

- [x] 1.1 In `calcularEstrategia`, after `cesantiasExentas` is computed and before the `if (estrategia.usaAportesVoluntarios)` block, add: `const maxVoluntario = afcConfig.pct_maximo_ingreso * rl1;`
- [x] 1.2 After the voluntary-contributions block, compute: `const aporteMensualAFC = estrategia.usaAportesVoluntarios ? Math.max(0, maxVoluntario - cesantiasExentas) / 12 : 0;`
- [x] 1.3 Add `aporteMensualAFC` to the return object of `calcularEstrategia`

## 2. Update card display

- [x] 2.1 In the strategy card template, add a conditional "Aporte AFC/FPV mensual" metric row that renders only when the strategy uses voluntary contributions — place it between the "Tasa seg. social" row and the "Impuesto anual" row
- [x] 2.2 Pass `usaAportesVoluntarios` through the card render context so the template can conditionally show the row (use the strategy's `params.usaAportesVoluntarios` flag already available in the render loop)
