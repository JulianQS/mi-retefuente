## Purpose

Defines how effective rate metrics (tax rate and social security rate) are computed and displayed. Both rates use total annual income as a common denominator so they are directly comparable and addable on the strategy card.

## Requirements

### Requirement: Effective tax rate uses total annual income as denominator
The engine SHALL compute `tasaEfectiva` as `impuesto / ingresos.total`, where `ingresos.total` is annual salary + prima + cesantías. The previous definition (`retefuenteMensual / salarioMensual`) SHALL be replaced.

#### Scenario: Rate computed against total income
- **WHEN** a strategy result is calculated
- **THEN** `tasaEfectiva` equals `impuesto` divided by `ingresos.total`

#### Scenario: Rate is lower than the previous salary-only definition
- **WHEN** prima and cesantías are non-zero (always true for salaried employees)
- **THEN** `tasaEfectiva` is strictly lower than `impuesto / (salarioMensual * 12)` for any positive tax

#### Scenario: Zero salary edge case
- **WHEN** `ingresos.total` is zero
- **THEN** `tasaEfectiva` is 0

### Requirement: Social security rate is a first-class engine output
The engine SHALL compute and return `tasaSegSocial` as `segSocial.total / ingresos.total` — total annual social security contributions as a percentage of total annual income.

#### Scenario: Social security rate computed
- **WHEN** a strategy result is calculated
- **THEN** `tasaSegSocial` equals `segSocial.total` divided by `ingresos.total`

#### Scenario: Social security rate is consistent with tax rate denominator
- **WHEN** both `tasaEfectiva` and `tasaSegSocial` are computed
- **THEN** both use `ingresos.total` as denominator, making them directly addable

### Requirement: Both rates are displayed on the strategy card
The strategy card SHALL display `tasaEfectiva` and `tasaSegSocial` as separate labelled metric rows, replacing the single previous "Tasa efectiva" row.

#### Scenario: Card shows tax rate row
- **WHEN** a strategy card is rendered
- **THEN** a row labelled "Tasa impuesto" shows `tasaEfectiva` as a percentage

#### Scenario: Card shows social security rate row
- **WHEN** a strategy card is rendered
- **THEN** a row labelled "Tasa seg. social" shows `tasaSegSocial` as a percentage
