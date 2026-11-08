## Context

`calcularIngresos` in `index.html` computes `cesantias = salarioMensual × topes.factor_cesantias` (1.12) and adds it to `ingresos.total` with the salary and prima. The result feeds the exemption (`calcularExencionCesantias`), so cesantías change both gross income and the renta exenta bucket.

The declaración de renta reports cesantías paid in the year. These are based on the previous year's service, so the same-year estimate can differ from the form. Interest on cesantías (12% per year, Ley 52 de 1975) is not modeled at all today.

## Goals / Non-Goals

**Goals:**
- Let the user enter the cesantías amount from the declaración de renta, and use it exactly.
- Derive interest on cesantías from the entered amount at 12% per year.
- When nothing is entered, keep the current estimate and say clearly that it is an estimate from this year's figures.

**Non-Goals:**
- Modeling interest from the salary when cesantías are blank.
- Changing the cesantías exemption table or tax brackets.
- Modeling non-salaried income or the previous year's salary.

## Decisions

- **Optional override field, blank by default.** Blank means the existing estimate, so results do not change for users who don't fill it in. Alternative considered: always requiring the value. Rejected because most users will not have the renta at hand.
- **Interest = entered cesantías × 0.12.** The statute sets interest at 12% per year on the cesantías balance, so for the amount paid in a year, interest is `cesantias × 0.12`. Rate lives as a constant beside the other tax constants, not in `config.js`, since it is a statutory rate that does not change by reform year. Alternative: put it in `topes` in `config.js`. Rejected to keep `config.js` unchanged.
- **Interest is shown separately and added to gross income.** It is taxable salary-type income, so it is included in `ingresos.total`. Shown as its own line in the income breakdown.
- **Estimate disclosure.** When the field is blank, a visible note under the cesantías row says the figure is estimated from this year's salary and may differ from the renta. Text is in Spanish to match the UI.
- **Input validation.** Accept only non-negative numbers. Empty string means blank. Use the same numeric formatting as the salary field.

## Risks / Trade-offs

- [Interest enters gross income but cesantías-based interest may be mis-modeled as taxed differently] → State the treatment in the UI and in `DESIGN.md`, and keep it as a separate line so the user can see it.
- [Users enter the renta value for the wrong year] → Label the field with the renta's year wording and mention that it is the amount paid in the year.
- [Changing `calcularIngresos` affects strategy results] → Keep the blank path identical and cover it with a before/after check on the default example.

## Migration Plan

No data migration. Ship in `index.html` and `DESIGN.md` only. Rollback is reverting the commit. Verify by comparing results for the default example before and after with the field blank.

## Open Questions

- Should the interest rate be a `config.js` value per year, in case of a future reform?
