# Spec: Strategy Selection

## Purpose

Defines the behaviour of the strategy selector controls and the card display area. Users can view all strategies at once or focus on one or two strategies side by side for comparison.

## Requirements

### Requirement: Default view shows all strategies
On load, with no strategy selected, the app SHALL display all 7 strategy cards in the existing grid layout.

#### Scenario: Initial page load
- **WHEN** the page loads and no strategy has been selected
- **THEN** all 7 strategy cards are visible in the grid

---

### Requirement: Primary strategy selection focuses the view
The app SHALL provide a primary strategy selector. When the user picks a strategy, only that strategy's card is shown, centered, in a single-card layout.

#### Scenario: User selects a primary strategy
- **WHEN** the user selects a strategy from the primary selector
- **THEN** only that strategy's card is displayed, and the other 6 cards are hidden

#### Scenario: User clears the primary selection
- **WHEN** the user selects the "all strategies" option in the primary selector
- **THEN** all 7 cards are shown again and the secondary selector has no effect

---

### Requirement: Secondary strategy selection enables side-by-side comparison
The app SHALL provide a secondary strategy selector. When both a primary and a secondary strategy are selected, both cards are shown side by side in a two-column layout.

#### Scenario: User adds a comparison strategy
- **WHEN** the user has a primary strategy selected and picks a different strategy in the secondary selector
- **THEN** both the primary and secondary strategy cards are shown side by side

#### Scenario: User clears the secondary selection
- **WHEN** the user selects the "no comparison" option in the secondary selector
- **THEN** only the primary strategy card is shown (single-card layout)

#### Scenario: Secondary selector is inert when no primary is selected
- **WHEN** no primary strategy is selected
- **THEN** the secondary selector selection has no effect on the displayed cards (all 7 remain visible)

---

### Requirement: The same strategy cannot be selected as both primary and secondary
The app SHALL prevent the user from selecting the same strategy in both selectors simultaneously.

#### Scenario: User picks the same strategy in both selectors
- **WHEN** the user selects a strategy that is already selected in the other selector
- **THEN** the app SHALL either disable that option in the conflicting selector or automatically clear the conflicting selection
