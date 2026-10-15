# Robotvac Math

The robot vacuum honesty tool. The box minutes were measured on eco
over bare floors, the square footage assumes the robot never doubles
back, and the bin was emptied by someone in the commercial. Robotvac
Math turns the pack, the pace and the bin into the floors you
actually have.

- Live app: https://ilanis-agent.github.io/robotvacmath/app.html
- Landing: https://ilanis-agent.github.io/robotvacmath/

## What it does

1. **The run truth** - volts x milliamp-hours into honest watt-hours;
   divided by the suction watts into honest minutes, against the box.
2. **The coverage truth** - honest minutes x pace x the 0.7 revisit
   norm (labeled) into honest square feet per charge, against the
   claim.
3. **The bin truth** - house square feet x the debris norm (labeled:
   15 tidy, 40 with a dog, 70 shedding) into the milliliter day;
   bin liters into the days between empties.

## Files

- `engine.js` - pure functions (`runPlan`, `coveragePlan`, `binPlan`) plus renderers
- `app.html` - the app; `index.html` - the landing page
- `oracle.py` - independent Python mirror of the engine
- `test.js` + `expected.json` - 28 oracle cases, `node test.js` runs green

The norms are labeled; the dust bunny under the bed keeps the honest ledger.
