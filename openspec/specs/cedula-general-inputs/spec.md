## ADDED Requirements

### Requirement: Voluntary contributions to mandatory pension are treated as INCRNGO
The engine SHALL accept an optional monthly aporte voluntario a pensión obligatoria (AVPO) and subtract its annualized value from cédula general income as INCRNGO — before the 40% / 1,340 UVT exempt cap — limited to `min(avpoMensual × 12, 0.25 × cedulaGeneralBruta, tope_uvt × uvt)`, where `tope_uvt` comes from the statute's `aporte_voluntario_pension_obligatoria`. AVPO SHALL NOT consume the general exempt cap.

#### Scenario: AVPO within cap is fully subtracted
- **WHEN** an AVPO amount below 25% of cédula general income and below the UVT cap is provided
- **THEN** the full annualized AVPO is subtracted when forming RL1, lowering taxable income

#### Scenario: AVPO above cap is limited
- **WHEN** an AVPO amount exceeds `min(0.25 × cedulaGeneralBruta, tope_uvt × uvt)`
- **THEN** only the capped amount is subtracted

#### Scenario: AVPO does not consume the exempt cap
- **WHEN** AVPO is applied
- **THEN** the 40% / 1,340 UVT exempt cap is computed on the AVPO-reduced RL1, and the AFC/FPV exempt bucket is unaffected by the AVPO amount

### Requirement: Financial yields enter the cédula general with an optional inflationary component
The engine SHALL accept optional `rendimientosFinancieros` and add the taxable portion `rendimientosFinancieros × (1 − componenteInflacionarioPct)` to cédula general gross income, where `componenteInflacionarioPct` defaults to `0` when not provided.

#### Scenario: Yields with no inflationary component
- **WHEN** `rendimientosFinancieros` is provided and `componenteInflacionarioPct` is blank
- **THEN** the full yield amount is added to cédula general gross income

#### Scenario: Yields with an inflationary component
- **WHEN** both `rendimientosFinancieros` and a non-zero `componenteInflacionarioPct` are provided
- **THEN** only `rendimientosFinancieros × (1 − componenteInflacionarioPct)` is added to the taxable base

#### Scenario: No yields entered
- **WHEN** `rendimientosFinancieros` is blank or zero
- **THEN** cédula general gross income equals labor income, as before

### Requirement: AFC/FPV contribution can be manually overridden
The engine SHALL accept an optional monthly AFC/FPV contribution override. When provided, the engine SHALL use `min(override × 12, maxVoluntario)` as the voluntary exempt contribution and subtract the applied monthly amount from net cash. When the override is blank, the engine SHALL use the computed optimal contribution and the existing voluntary-exempt behavior.

#### Scenario: Override below optimal increases tax
- **WHEN** a manual AFC/FPV amount smaller than the optimal is provided
- **THEN** the exempt bucket uses the override amount and the resulting income tax is higher than with the optimal

#### Scenario: Blank override preserves existing behavior
- **WHEN** no manual AFC/FPV amount is provided for a strategy that uses voluntary contributions
- **THEN** the engine output is identical to the prior optimal-based behavior

#### Scenario: Override above statutory maximum is capped
- **WHEN** a manual AFC/FPV amount above the 30% / 3,800 UVT statutory maximum is provided
- **THEN** the applied contribution is capped at `maxVoluntario`

### Requirement: All cédula general inputs are optional and backward-compatible
The engine SHALL default every new cédula general input to zero/blank, producing results identical to the prior salary-only behavior when none are provided.

#### Scenario: Empty inputs reproduce prior results
- **WHEN** AVPO, financial yields, inflationary component, and the AFC override are all blank
- **THEN** every output field matches the engine's prior salary-only result
