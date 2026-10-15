var RobotvacMath = (function () {
  function num(x) { return typeof x === "number" && isFinite(x); }
  function pos(x) { return num(x) && x > 0; }
  function r1(x) { return Math.round(x * 10) / 10; }
  function jsnum(x) { if (typeof x === "number" && isFinite(x) && x === Math.trunc(x)) return String(Math.trunc(x)); return String(x); }
  var REVISIT_NORM = 0.7;
  function runPlan(volts, mah, watts, claimMin) {
    if (!pos(volts)) return { error: "the pack volts must be above zero" };
    if (!pos(mah)) return { error: "the milliamp-hours must be above zero" };
    if (!pos(watts)) return { error: "the suction watts must be above zero" };
    if (!pos(claimMin)) return { error: "the claimed minutes must be above zero" };
    var wh = volts * mah / 1000;
    var honestMin = wh / watts * 60;
    var ratio = honestMin / claimMin;
    var verdict = ratio < 0.7 ? "the brochure vacuums, not the robot"
      : ratio <= 1 ? "in reach on a good day"
      : "outruns the sticker";
    return { wh: r1(wh), honestMin: r1(honestMin), pct: r1(ratio * 100), verdict: verdict };
  }
  function renderRun(r, volts, mah, watts, claimMin) {
    var word = r.honestMin === 1 ? " minute" : " minutes";
    return "The " + jsnum(volts) + "-volt, " + jsnum(mah) + " milliamp-hour pack honestly holds " + jsnum(r.wh)
      + " watt-hours; at " + jsnum(watts) + " watts that is about " + jsnum(r.honestMin) + word
      + " against the " + jsnum(claimMin) + " on the box - " + jsnum(r.pct) + "% of the promise, " + r.verdict + ".";
  }
  function coveragePlan(honestMin, pace, claimSqft) {
    if (!pos(honestMin)) return { error: "the honest minutes must be above zero" };
    if (!pos(pace)) return { error: "the pace must be above zero" };
    if (!pos(claimSqft)) return { error: "the claimed square feet must be above zero" };
    var honestSqft = honestMin * pace * REVISIT_NORM;
    var ratio = honestSqft / claimSqft;
    var verdict = ratio < 0.6 ? "the box maps the brochure"
      : ratio <= 1 ? "covers it on a mapped run"
      : "finishes with charge to spare";
    return { honestSqft: r1(honestSqft), pct: r1(ratio * 100), verdict: verdict };
  }
  function renderCoverage(r, honestMin, pace, claimSqft) {
    return "At " + jsnum(pace) + " square feet a minute with the 0.7 revisit norm, the " + jsnum(honestMin)
      + " honest minutes cover about " + jsnum(r.honestSqft) + " square feet against the " + jsnum(claimSqft)
      + " claimed - " + jsnum(r.pct) + "% of the map: " + r.verdict + ".";
  }
  function binPlan(binL, sqft, debris) {
    if (!pos(binL)) return { error: "the bin liters must be above zero" };
    if (!pos(sqft)) return { error: "the house square feet must be above zero" };
    if (!pos(debris)) return { error: "the debris norm must be above zero" };
    var dailyMl = sqft / 1000 * debris;
    var days = binL * 1000 / dailyMl;
    var verdict = days < 2 ? "the bin nags daily"
      : days <= 5 ? "a working week of runs"
      : "forgotten under the bed";
    return { dailyMl: r1(dailyMl), days: r1(days), verdict: verdict };
  }
  function renderBin(r, binL, sqft, debris) {
    var word = r.days === 1 ? " day - " : " days - ";
    return "The " + jsnum(binL) + "-liter bin against the " + jsnum(r.dailyMl) + "-milliliter day (" + jsnum(sqft)
      + " square feet at the " + jsnum(debris) + "-milliliter norm) fills in about " + jsnum(r.days) + word + r.verdict + ".";
  }
  return { runPlan: runPlan, renderRun: renderRun, coveragePlan: coveragePlan, renderCoverage: renderCoverage, binPlan: binPlan, renderBin: renderBin };
})();
if (typeof module !== "undefined" && module.exports) module.exports = RobotvacMath;
