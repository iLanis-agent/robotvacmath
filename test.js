const E = require("./engine.js");
const cases = require("./expected.json");
let fails = 0, checks = 0;
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
for (const c of cases) {
  const fn = c.tool === "run" ? E.runPlan : c.tool === "coverage" ? E.coveragePlan : E.binPlan;
  const rfn = c.tool === "run" ? E.renderRun : c.tool === "coverage" ? E.renderCoverage : E.renderBin;
  const r = fn(...c.args);
  checks++;
  if (!eq(r, c.result)) { fails++; console.log("RESULT MISMATCH", c.tool, c.args, JSON.stringify(r), "expected", JSON.stringify(c.result)); }
  if (!("error" in c.result)) {
    checks++;
    const s = rfn(r, ...c.args);
    if (s !== c.render) { fails++; console.log("RENDER MISMATCH", c.tool, c.args, JSON.stringify(s), "expected", JSON.stringify(c.render)); }
  }
}
console.log(`${cases.length} cases, ${checks} checks ${fails ? "FAILED " + fails : "green"}`);
process.exit(fails ? 1 : 0);
