// The Group's one portable DTCG 2025.10 token source, independent of a renderer.
// This is a consumer adapter, not another authored palette or a generic JSON validator.
// House-specific source context: content/text/documents/articles/specifications/561-group-design-bible.md.
import tokens from "../data/records/design-tokens/561-group.tokens.json" with { type: "json" };

const own = (object, key) => Object.prototype.hasOwnProperty.call(object, key);
const hexColor = /^#[0-9A-Fa-f]{6}$/u;
const genericFonts = new Set(["serif","sans-serif","monospace","ui-monospace","ui-sans-serif","system-ui"]);
const fontName = /^[A-Za-z0-9 _-]+$/u;

function readTyped(document, dottedPath, expectedType) {
  let node = document;
  let inheritedType;
  for (const part of dottedPath.split(".")) {
    if (!node || typeof node !== "object" || Array.isArray(node) ||
        own(node, "$value") || !own(node, part)) {
      throw new TypeError("Missing brand design token " + dottedPath);
    }
    if (typeof node.$type === "string") inheritedType = node.$type;
    node = node[part];
  }
  if (!node || typeof node !== "object" || Array.isArray(node) ||
      !own(node, "$value")) {
    throw new TypeError("Brand design path is not a token: " + dottedPath);
  }
  const type = typeof node.$type === "string" ? node.$type : inheritedType;
  if (type !== expectedType)
    throw new TypeError("Brand token " + dottedPath + " must have $type " + expectedType);
  return node.$value;
}
function color(document, key) {
  const value = readTyped(document, "color." + key, "color");
  if (!value || value.colorSpace !== "srgb" ||
      !Array.isArray(value.components) || value.components.length !== 3 ||
      value.alpha !== 1 || !hexColor.test(value.hex || "")) {
    throw new TypeError("Brand color." + key + " must be opaque sRGB with a hex fallback");
  }
  const rgb = value.components.map(component => {
    if (typeof component !== "number" || !Number.isFinite(component) ||
        component < 0 || component > 1) {
      throw new TypeError("Invalid sRGB component in brand color." + key);
    }
    return Math.round(component * 255).toString(16).padStart(2, "0");
  });
  const computed = "#" + rgb.join("").toUpperCase();
  if (computed !== value.hex.toUpperCase())
    throw new TypeError("Contradictory sRGB and hex in brand color." + key);
  return computed;
}
function family(document, key) {
  const value = readTyped(document, "font.family." + key, "fontFamily");
  if (!Array.isArray(value) || value.length === 0 ||
      value.some(name => typeof name !== "string" || !fontName.test(name) ||
        name.trim() !== name || !name.length)) {
    throw new TypeError("Invalid ordered font fallback in font.family." + key);
  }
  return Object.freeze([...value]);
}
function dimension(document, path, {unit, nonzero} = {}) {
  const value = readTyped(document, path, "dimension");
  if (!value || typeof value.value !== "number" ||
      !Number.isFinite(value.value) || value.value < 0 ||
      (nonzero && value.value === 0) ||
      value.unit !== unit) {
    throw new TypeError("Invalid " + unit + " brand dimension at " + path);
  }
  return Object.freeze({value:value.value,unit:value.unit});
}
function contrast(foreground, background) {
  const luminance = hex => {
    const rgb = [1,3,5].map(i => parseInt(hex.slice(i,i+2),16)/255);
    const values = rgb.map(c => c <= 0.04045 ? c/12.92 : ((c+0.055)/1.055)**2.4);
    return 0.2126*values[0]+0.7152*values[1]+0.0722*values[2];
  };
  const a=luminance(foreground),b=luminance(background);
  return (Math.max(a,b)+0.05)/(Math.min(a,b)+0.05);
}
const cssFont = stack => stack.map(name =>
  genericFonts.has(name) ? name : '"' + name + '"').join(", ");
const cssDimension = dimensionValue =>
  String(dimensionValue.value) + dimensionValue.unit;

/**
 * A bounded 561 Group consumer profile of the original design-bible edition.
 * Invalid tokens, inconsistent color encodings, missing channels and illegible
 * structural text fail closed. Visual composition and bounded accent area
 * still need a rendered-asset/reader assay; these numbers do not prove them.
 */
export function derive561BrandProfile(document = tokens) {
  if (!document || document.$extensions?.["org.561.group"]?.edition !== "v0.3")
    throw new TypeError("Unknown 561 Group design-token source edition");
  const colors=Object.freeze({
    ink:color(document,"ink"),bone:color(document,"bone"),
    witness:color(document,"witness"),alarm:color(document,"alarm"),
    inkSoft:color(document,"ink-soft")
  });
  const fonts=Object.freeze({
    display:family(document,"sans"),reading:family(document,"slab"),
    evidence:family(document,"mono")
  });
  const layout=Object.freeze({
    gutter:dimension(document,"layout.web.gutter",{unit:"px",nonzero:true}),
    designBibleMax:dimension(document,"layout.web.design-bible-max",{unit:"px",nonzero:true}),
    semanticSiteMax:dimension(document,"layout.web.semantic-site-max",{unit:"px",nonzero:true}),
    measure:dimension(document,"layout.web.measure",{unit:"rem",nonzero:true})
  });
  if (contrast(colors.ink,colors.bone)<7 ||
      contrast(colors.inkSoft,colors.bone)<4.5 ||
      contrast(colors.witness,colors.bone)<4.5) {
    throw new TypeError("Brand body/evidence contrast violates the original reading contract");
  }
  if (layout.semanticSiteMax.value>layout.designBibleMax.value)
    throw new TypeError("Semantic site max exceeds the design-bible frame");
  return Object.freeze({
    edition:"v0.3",source:"data/records/design-tokens/561-group.tokens.json",
    colors,fonts,layout,
    contrast:Object.freeze({
      body:contrast(colors.ink,colors.bone),
      secondary:contrast(colors.inkSoft,colors.bone),
      evidence:contrast(colors.witness,colors.bone),
      alarmOnBone:contrast(colors.alarm,colors.bone)
    })
  });
}

/** A deterministic web projection of the SAME accepted tokens.
 * No HTTP request, renderer-specific stylesheet or fabricated logo is needed.
 */
export function houseCssVariables(profile = derive561BrandProfile()) {
  return [
    ":root{",
    "  --house-ink:" + profile.colors.ink + ";",
    "  --house-bone:" + profile.colors.bone + ";",
    "  --house-witness:" + profile.colors.witness + ";",
    "  --house-alarm:" + profile.colors.alarm + ";",
    "  --house-ink-soft:" + profile.colors.inkSoft + ";",
    "  --house-sans:" + cssFont(profile.fonts.display) + ";",
    "  --house-slab:" + cssFont(profile.fonts.reading) + ";",
    "  --house-mono:" + cssFont(profile.fonts.evidence) + ";",
    "  --house-gutter:" + cssDimension(profile.layout.gutter) + ";",
    "  --house-frame:" + cssDimension(profile.layout.designBibleMax) + ";",
    "  --house-reading-measure:" + cssDimension(profile.layout.measure) + ";",
    "  --house-radius:0;",
    "}"
  ].join("\n") + "\n";
}
