## ADDED Requirements

### Requirement: Occasional gains are taxed on a separate flat-rate track
The engine SHALL accept an optional `gananciasOcasionales` amount and compute `impuestoGananciaOcasional = topes.tarifa_ganancia_ocasional × gananciasOcasionales`, independently of the cédula general tax and of the selected strategy.

#### Scenario: Occasional gains produce flat-rate tax
- **WHEN** a `gananciasOcasionales` amount is provided
- **THEN** `impuestoGananciaOcasional` equals `tarifa_ganancia_ocasional × gananciasOcasionales`

#### Scenario: No occasional gains
- **WHEN** `gananciasOcasionales` is blank or zero
- **THEN** `impuestoGananciaOcasional` is `0`

#### Scenario: Occasional-gains tax is strategy-independent
- **WHEN** the same `gananciasOcasionales` is applied across different strategies
- **THEN** `impuestoGananciaOcasional` is identical for every strategy

### Requirement: Total tax burden includes occasional gains
The engine SHALL expose `impuestoTotal = impuesto + impuestoGananciaOcasional`. The strategy card SHALL display the occasional-gains tax and the total separately when occasional gains are present. `retefuenteMensual` and `netoMensual` SHALL remain based on the cédula general (occasional gains are not withheld on monthly salary).

#### Scenario: Card shows occasional-gains tax and total
- **WHEN** a strategy card is rendered with `gananciasOcasionales > 0`
- **THEN** the card shows an "Impuesto ganancia ocasional" row and an "Impuesto total anual" row equal to `impuesto + impuestoGananciaOcasional`

#### Scenario: Withholding and net are unaffected by occasional gains
- **WHEN** `gananciasOcasionales` is changed
- **THEN** `retefuenteMensual` and `netoMensual` do not change

#### Scenario: No occasional-gains rows when absent
- **WHEN** a strategy card is rendered with `gananciasOcasionales` blank or zero
- **THEN** no occasional-gains or total-tax rows are shown
