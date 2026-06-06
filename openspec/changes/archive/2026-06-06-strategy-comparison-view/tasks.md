## 1. Add selector controls to the UI

- [x] 1.1 Add a primary strategy `<select>` to the input controls area in `index.html`, with "Todas las estrategias" as the first option (value `""`) followed by one `<option>` per entry in `ESTRATEGIAS`
- [x] 1.2 Add a secondary strategy `<select>` below the primary one, with "Sin comparación" as the first option (value `""`) followed by the same 7 options

## 2. Add CSS layout modes

- [x] 2.1 Add a `data-mode` attribute to the cards container and define CSS rules for `[data-mode="single"]` (one centered card, max-width ~480px), `[data-mode="compare"]` (two-column flex row), and `[data-mode="all"]` (existing grid, unchanged)

## 3. Wire selection state into recalcular

- [x] 3.1 In `recalcular`, read the primary and secondary selector values; build a `selected` array of the chosen strategy IDs (filtering out empty strings)
- [x] 3.2 Filter the strategies rendered: if `selected` is non-empty, only render cards whose `id` is in `selected`; otherwise render all 7
- [x] 3.3 Set `data-mode` on the cards container based on `selected.length`: `0` → `"all"`, `1` → `"single"`, `2` → `"compare"`
- [x] 3.4 Add `change` event listeners on both selectors that call `recalcular`

## 4. Prevent duplicate selection

- [x] 4.1 After each selector change, disable in the secondary `<select>` whichever option matches the current primary value (and re-enable the previously disabled one); do the same symmetrically for the primary selector
