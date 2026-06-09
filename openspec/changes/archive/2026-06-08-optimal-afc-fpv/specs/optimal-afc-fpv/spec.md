## ADDED Requirements

### Requirement: Engine computes optimal monthly AFC/FPV contribution
For strategies that use voluntary contributions (`usaAportesVoluntarios: true`), the engine SHALL compute `aporteMensualAFC` as `max(0, maxVoluntario - cesantiasExentas) / 12`, where `maxVoluntario = afcConfig.pct_maximo_ingreso * rl1`. For strategies where `usaAportesVoluntarios` is `false`, `aporteMensualAFC` SHALL be `0`.

#### Scenario: Contribution computed for voluntary strategy
- **WHEN** a strategy result is calculated with `usaAportesVoluntarios: true`
- **THEN** `aporteMensualAFC` equals `max(0, (afcConfig.pct_maximo_ingreso * rl1) - cesantiasExentas) / 12`

#### Scenario: Contribution is zero for non-voluntary strategy
- **WHEN** a strategy result is calculated with `usaAportesVoluntarios: false`
- **THEN** `aporteMensualAFC` is `0`

#### Scenario: Cesantías already cover the full bucket
- **WHEN** `cesantiasExentas >= maxVoluntario`
- **THEN** `aporteMensualAFC` is `0` (no additional voluntary contribution provides benefit)

### Requirement: Strategy card displays AFC/FPV contribution for voluntary strategies
The strategy card SHALL display a "Aporte AFC/FPV mensual" metric row for strategies where `usaAportesVoluntarios` is `true`. The row SHALL NOT appear on cards for strategies where `usaAportesVoluntarios` is `false`.

#### Scenario: Row present on voluntary strategy card
- **WHEN** a strategy card is rendered for a strategy with `usaAportesVoluntarios: true`
- **THEN** a row labelled "Aporte AFC/FPV mensual" shows `aporteMensualAFC` formatted as currency

#### Scenario: Row absent on non-voluntary strategy card
- **WHEN** a strategy card is rendered for a strategy with `usaAportesVoluntarios: false`
- **THEN** no "Aporte AFC/FPV mensual" row appears on the card
