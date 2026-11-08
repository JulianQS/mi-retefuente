## Why

The app estimates cesantías as `salario mensual × 1.12` for the year entered. The declaración de renta reports the cesantías the employer actually paid during that year, which are based on the previous year's service. For the same year, the form and the app can therefore show different numbers.

## What Changes

- **Optional cesantías input**: a new field where the user can enter the cesantías amount exactly as shown on their declaración de renta. It is left blank by default.
- **Precise override**: when the field is filled, the engine uses the entered value instead of the `salario × factor_cesantias` estimate.
- **Derived interest**: when the cesantías value is entered, the intereses de cesantías are computed from it at the legal 12% annual rate (Ley 52 de 1975). They are not estimated when the field is blank.
- **Estimate disclosure**: when the field is blank, the UI states that cesantías (and interest) are an estimate based on the entered year's figures, not the amount from the renta.
- **BREAKING**: none. Existing results are unchanged when the field is left blank.

## Capabilities

### New Capabilities

- `manual-cesantias-input`: Defines the optional cesantías override, the derived interest on cesantías, and the estimate disclosure shown when no value is entered.

### Modified Capabilities

_(none)_

## Impact

- `index.html`: input field and label in the general inputs section; `calcularIngresos` (use the override when provided, derive interest); UI text that marks the estimate when the override is blank.
- `DESIGN.md`: document the override, the 12% interest rule, and the estimate disclosure; update the "Known limitations" section.
- No changes to `config.js` expected. The 12% rate is a statutory constant and the cesantías factor already exists in `topes`.
