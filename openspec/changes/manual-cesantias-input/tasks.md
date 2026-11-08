## 1. Engine

- [x] 1.1 Add a constant for the 12% annual interest rate on cesantías next to the other tax constants in `index.html`
- [x] 1.2 Extend `calcularIngresos` to accept an optional manual cesantías value and use it in place of `salario × factor_cesantias` when provided
- [x] 1.3 Compute `intereses` as `cesantías × 0.12` only when a manual value is provided, and return it in the result object
- [x] 1.4 Confirm the blank path produces identical results for every strategy on the default example

## 2. UI

- [x] 2.1 Add the optional cesantías input (blank by default, non-negative numbers only) in the general inputs section
- [x] 2.2 Show the intereses de cesantías line only when a cesantías value is entered
- [x] 2.3 Show the estimate note when the input is blank, and hide it when a value is entered
- [x] 2.4 Show an invalid-input message and fall back to the estimate for negative or non-numeric entries

## 3. Documentation

- [x] 3.1 Update `DESIGN.md` with the optional override, the 12% interest rule, and the estimate disclosure
- [x] 3.2 Update the "Known limitations" section in `DESIGN.md` to remove the cesantías-year gap

## 4. Verification

- [x] 4.1 Test with the input blank: result matches the pre-change default example
- [x] 4.2 Test with a cesantías value entered: cesantías and interest match hand calculation
- [x] 4.3 Test invalid inputs and the estimate note in both states
