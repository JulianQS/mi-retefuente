## ADDED Requirements

### Requirement: Optional cesantías input
The system SHALL provide an optional input for the cesantías amount paid in the year, as shown on the declaración de renta. The input SHALL be blank by default.

#### Scenario: Blank input uses the estimate
- **WHEN** the user leaves the cesantías input blank
- **THEN** the system SHALL compute cesantías as `salario mensual × factor_cesantias` for the entered year

#### Scenario: Entered value is used exactly
- **WHEN** the user enters a non-negative cesantías amount
- **THEN** the system SHALL use that amount as cesantías in place of the estimate, without applying `factor_cesantias`

#### Scenario: Invalid input is rejected
- **WHEN** the user enters a negative number or non-numeric text
- **THEN** the system SHALL NOT use the value and SHALL show that the entry is invalid, falling back to the estimate

### Requirement: Interest on cesantías derived from the entered amount
The system SHALL compute intereses de cesantías as 12% of the entered cesantías amount, and SHALL NOT compute interest when the cesantías input is blank.

#### Scenario: Interest derived from entered cesantías
- **WHEN** the user enters a cesantías amount
- **THEN** the system SHALL show intereses de cesantías equal to `cesantías × 0.12`

#### Scenario: No interest without entered cesantías
- **WHEN** the cesantías input is blank
- **THEN** the system SHALL show no interest value and SHALL NOT estimate interest

### Requirement: Estimate disclosure
The system SHALL tell the user when cesantías are an estimate, and SHALL state that the figure is based on the entered year's figures and may differ from the declaración de renta.

#### Scenario: Estimate note shown when blank
- **WHEN** the cesantías input is blank and results are shown
- **THEN** the system SHALL display a note stating that cesantías are estimated from this year's figures and may differ from the amount in the declaración de renta

#### Scenario: Note hidden when a value is entered
- **WHEN** the user enters a cesantías amount
- **THEN** the system SHALL NOT display the estimate note

### Requirement: Unchanged results when blank
The system SHALL produce the same results as before this change for every strategy when the cesantías input is blank.

#### Scenario: Default example unchanged
- **WHEN** the cesantías input is blank and the salary is the default example
- **THEN** every strategy result SHALL match the result before this change
