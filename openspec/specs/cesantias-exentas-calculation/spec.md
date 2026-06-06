## Purpose

Defines how the engine computes the exempt portion of cesantías (severance pay) using a salary-graduated bracket table from the active statute, and how that exempt amount integrates with voluntary contributions in the tax calculation.

## Requirements

### Requirement: Cesantías exempt amount is salary-graduated
The engine SHALL compute the exempt portion of cesantías by looking up the employee's monthly salary (in UVT) against the `cesantias_exentas` bracket table in the active statute, rather than treating the full cesantías amount as exempt.

The lookup SHALL find the first bracket whose `hasta_uvt` is greater than or equal to the employee's monthly salary in UVT (treating `null` as unbounded), and return `cesantias × pct_exento` for that bracket.

#### Scenario: Salary below first threshold (≤350 UVT) — 90% exempt
- **WHEN** the employee's monthly salary is at or below 350 UVT
- **THEN** the exempt cesantías amount is 90% of the total cesantías

#### Scenario: Salary in middle bracket (>410 UVT and ≤470 UVT) — 60% exempt
- **WHEN** the employee's monthly salary is above 410 UVT and at or below 470 UVT
- **THEN** the exempt cesantías amount is 60% of the total cesantías

#### Scenario: Salary above top threshold (>590 UVT) — 0% exempt
- **WHEN** the employee's monthly salary exceeds 590 UVT
- **THEN** the exempt cesantías amount is 0 (cesantías are fully taxable)

#### Scenario: Salary exactly on a threshold boundary
- **WHEN** the employee's monthly salary in UVT equals exactly a `hasta_uvt` boundary value
- **THEN** the bracket at that boundary applies (the boundary is inclusive on the upper end)

### Requirement: Partial cesantías exemption integrates correctly with voluntary contributions
The voluntary contributions cap SHALL use the partial cesantías exempt amount (not the full cesantías) as the floor value.

#### Scenario: Voluntary contributions with partial cesantías
- **WHEN** a strategy uses voluntary contributions (AFC / pension voluntario)
- **THEN** the exempt base is `max(cesantiasExentas, 20% × RL1)`, where `cesantiasExentas` is the salary-graduated exempt amount

#### Scenario: No voluntary contributions
- **WHEN** a strategy does not use voluntary contributions
- **THEN** the exempt base equals `cesantiasExentas` (the salary-graduated amount only)

### Requirement: Low-salary results are numerically stable
The lookup SHALL return a result for every salary, including edge cases at the top of the table.

#### Scenario: Salary converts to UVT that falls in the unbounded top bracket
- **WHEN** the employee's monthly salary divided by UVT exceeds 590
- **THEN** the function returns 0 (matching `pct_exento: 0.00` in the null-bounded bracket)
