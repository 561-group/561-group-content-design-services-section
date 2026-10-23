import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {derive561BrandProfile,houseCssVariables} from "../src/brand-profile.mjs";
import original from "../data/records/design-tokens/561-group.tokens.json" with {type:"json"};

const text = path => readFileSync(new URL("../"+path,import.meta.url),"utf8");
const fixture = () => structuredClone(original);
const setColor = (color,hex) => {
  color.$value.hex=hex;
  color.$value.components=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255);
};

test("one real DTCG 2025.10 source feeds the 561 brand without a stale path",()=>{
  const pkg=JSON.parse(text("package.json"));
  for(const key of ["./tokens","./brand-profile"]){
    assert.ok(pkg.exports[key],"missing public owner package export "+key);
    assert.ok(existsSync(new URL("../"+pkg.exports[key].replace(/^\.\//u,""),import.meta.url)),key+" points to an actual file");
  }
  assert.ok(pkg.exports["./tokens"].includes("/design-tokens/"));
  assert.ok(!text("src/theme.mjs").includes("design-token-records/"));
  assert.ok(text("src/theme.mjs").includes("./brand-profile.mjs"),"original theme must consume validated brand source");
});

test("the house consumer derives color, typography and layout from actual typed tokens",()=>{
  const result=derive561BrandProfile();
  assert.equal(result.source,"data/records/design-tokens/561-group.tokens.json");
  assert.equal(result.colors.ink,"#0A0A0A");
  assert.equal(result.colors.bone,"#F2EAD8");
  assert.equal(result.colors.witness,"#3D5588");
  assert.equal(result.colors.alarm,"#FF4530");
  assert.deepEqual(result.fonts.display,["Space Grotesk","Helvetica Neue","Arial","sans-serif"]);
  assert.deepEqual(result.fonts.reading.slice(0,1),["Roboto Slab"]);
  assert.equal(result.fonts.evidence[0],"JetBrains Mono");
  assert.equal(result.layout.designBibleMax.value,1320);
  assert.equal(result.layout.semanticSiteMax.value,1200);
  assert.ok(result.contrast.body>=7);
  assert.ok(result.contrast.evidence>=4.5);
  assert.ok(result.contrast.alarmOnBone<3,
    "Alarm on bone is not a readable body/controls pair; require ink text");
});

test("CSS projection is deterministic, typed and free of network/side effects",()=>{
  const a=houseCssVariables();
  assert.equal(a,houseCssVariables());
  assert.match(a,/--house-bone:#F2EAD8;/u);
  assert.match(a,/--house-mono:"JetBrains Mono", ui-monospace, "Courier New", monospace;/u);
  assert.match(a,/--house-frame:1320px;/u);
  assert.match(a,/--house-reading-measure:42rem;/u);
  assert.match(a,/--house-radius:0;/u);
  assert.doesNotMatch(a,/@import|https?:|url\(/u);
});

test("reject a missing/untyped/malformed token rather than guessing",()=>{
  const missing=fixture();
  delete missing.color.witness;
  assert.throws(()=>derive561BrandProfile(missing),/Missing brand design token/);
  const untyped=fixture();
  delete untyped.color.$type;
  assert.throws(()=>derive561BrandProfile(untyped),/must have \$type color/);
  const contradictory=fixture();
  contradictory.color.bone.$value.hex="#FFFFFF";
  assert.throws(()=>derive561BrandProfile(contradictory),/Contradictory sRGB and hex/);
  const alpha=fixture();
  alpha.color.alarm.$value.alpha=0.2;
  assert.throws(()=>derive561BrandProfile(alpha),/opaque sRGB/);
  const invalid=fixture();
  invalid.color.ink.$value.components[1]=Infinity;
  assert.throws(()=>derive561BrandProfile(invalid),/Invalid sRGB component/);
});

test("reject invalid font injection, nonsensical dimensions and a lost color contrast",()=>{
  const poisoned=fixture();
  poisoned.font.family.sans.$value[0]='Space Grotesk";background:red';
  assert.throws(()=>derive561BrandProfile(poisoned),/Invalid ordered font fallback/);
  const unit=fixture();
  unit.layout.web.gutter.$value.unit="bananas";
  assert.throws(()=>derive561BrandProfile(unit),/Invalid px brand dimension/);
  const contrast=fixture();
  setColor(contrast.color.ink,"#DDDDDD");
  assert.throws(()=>derive561BrandProfile(contrast),/contrast violates/);
  const swapped=fixture();
  swapped.layout.web["semantic-site-max"].$value.value=1550;
  assert.throws(()=>derive561BrandProfile(swapped),/exceeds the design-bible frame/);
});

test("the live package is explicit about its edition; absent or invented adoption is rejected",()=>{
  const fake=fixture();
  fake.$extensions["org.561.group"].edition="approved-v1";
  assert.throws(()=>derive561BrandProfile(fake),/Unknown 561 Group design-token source edition/);
});
