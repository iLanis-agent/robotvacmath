import json, math

def num(x): return isinstance(x,(int,float)) and not isinstance(x,bool) and math.isfinite(x)
def pos(x): return num(x) and x>0
def jround(x): return math.floor(x+0.5)
def r1(x): return jround(x*10)/10
def jsnum(x):
    if isinstance(x,float) and x==int(x): return str(int(x))
    return str(x)

REVISIT_NORM=0.7

def run_plan(volts,mah,watts,claim_min):
    if not pos(volts): return {"error":"the pack volts must be above zero"}
    if not pos(mah): return {"error":"the milliamp-hours must be above zero"}
    if not pos(watts): return {"error":"the suction watts must be above zero"}
    if not pos(claim_min): return {"error":"the claimed minutes must be above zero"}
    wh=volts*mah/1000
    honest_min=wh/watts*60
    ratio=honest_min/claim_min
    if ratio<0.7: verdict="the brochure vacuums, not the robot"
    elif ratio<=1: verdict="in reach on a good day"
    else: verdict="outruns the sticker"
    return {"wh":r1(wh),"honestMin":r1(honest_min),"pct":r1(ratio*100),"verdict":verdict}

def render_run(r,volts,mah,watts,claim_min):
    word=" minute" if r["honestMin"]==1 else " minutes"
    return ("The "+jsnum(volts)+"-volt, "+jsnum(mah)+" milliamp-hour pack honestly holds "+jsnum(r["wh"])
            +" watt-hours; at "+jsnum(watts)+" watts that is about "+jsnum(r["honestMin"])+word
            +" against the "+jsnum(claim_min)+" on the box - "+jsnum(r["pct"])+"% of the promise, "+r["verdict"]+".")

def coverage_plan(honest_min,pace,claim_sqft):
    if not pos(honest_min): return {"error":"the honest minutes must be above zero"}
    if not pos(pace): return {"error":"the pace must be above zero"}
    if not pos(claim_sqft): return {"error":"the claimed square feet must be above zero"}
    honest_sqft=honest_min*pace*REVISIT_NORM
    ratio=honest_sqft/claim_sqft
    if ratio<0.6: verdict="the box maps the brochure"
    elif ratio<=1: verdict="covers it on a mapped run"
    else: verdict="finishes with charge to spare"
    return {"honestSqft":r1(honest_sqft),"pct":r1(ratio*100),"verdict":verdict}

def render_coverage(r,honest_min,pace,claim_sqft):
    return ("At "+jsnum(pace)+" square feet a minute with the 0.7 revisit norm, the "+jsnum(honest_min)
            +" honest minutes cover about "+jsnum(r["honestSqft"])+" square feet against the "+jsnum(claim_sqft)
            +" claimed - "+jsnum(r["pct"])+"% of the map: "+r["verdict"]+".")

def bin_plan(bin_l,sqft,debris):
    if not pos(bin_l): return {"error":"the bin liters must be above zero"}
    if not pos(sqft): return {"error":"the house square feet must be above zero"}
    if not pos(debris): return {"error":"the debris norm must be above zero"}
    daily_ml=sqft/1000*debris
    days=bin_l*1000/daily_ml
    if days<2: verdict="the bin nags daily"
    elif days<=5: verdict="a working week of runs"
    else: verdict="forgotten under the bed"
    return {"dailyMl":r1(daily_ml),"days":r1(days),"verdict":verdict}

def render_bin(r,bin_l,sqft,debris):
    word=" day - " if r["days"]==1 else " days - "
    return ("The "+jsnum(bin_l)+"-liter bin against the "+jsnum(r["dailyMl"])+"-milliliter day ("+jsnum(sqft)
            +" square feet at the "+jsnum(debris)+"-milliliter norm) fills in about "+jsnum(r["days"])+word+r["verdict"]+".")

cases=[]
def add(tool,args):
    if tool=="run": r=run_plan(*args); fn=render_run
    elif tool=="coverage": r=coverage_plan(*args); fn=render_coverage
    else: r=bin_plan(*args); fn=render_bin
    case={"tool":tool,"args":args,"result":r}
    if "error" not in r: case["render"]=fn(r,*args)
    cases.append(case)

for a in [(14.4,5200,25,180),(14.4,2600,30,120),(21.6,4000,15,200),(14.4,5200,45,150),(12,3000,20,90),(14.8,4000,25,150)]:
    add("run",a)
for a in [(180,10,1500),(180,14,1500),(90,10,900),(150,10,2000),(120,12,1200),(75,10,600)]:
    add("coverage",a)
for a in [(0.5,2000,70),(0.6,1500,40),(0.35,800,15),(0.4,2500,70),(0.7,1000,40),(0.2,2000,70)]:
    add("bin",a)
add("run",[0,5200,25,180]); add("run",[14.4,0,25,180]); add("run",[14.4,5200,0,180]); add("run",[14.4,5200,25,0])
add("coverage",[0,10,1500]); add("coverage",[180,0,1500]); add("coverage",[180,10,0])
add("bin",[0,2000,70]); add("bin",[0.5,0,70]); add("bin",[0.5,2000,0])

json.dump(cases,open("expected.json","w"),separators=(",",":"))
print(len(cases),"cases")
