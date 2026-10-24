# 561 Group content design

<!-- 561-group-standards:badges:start -->
[![561 Group](https://img.shields.io/badge/561%20Group-561%20Group-1c282a)](https://github.com/561-group)
[![License: 561 Group 1.0](https://img.shields.io/badge/license-561%20Group%201.0-1c282a)](LICENSE)
[![Indigenous data: CARE](https://img.shields.io/badge/Indigenous%20data-CARE-4b6f44)](https://github.com/561-group/.github/blob/main/GOVERNANCE.md)
[![Tips welcome](https://img.shields.io/badge/tips-welcome-d4a017)](https://github.com/561-group/.github/blob/main/TIPS.md)
<!-- 561-group-standards:badges:end -->

This is the single working package for 561 Group's visual language: the
decisions that make an artifact recognizably 561, their portable token form,
and the renderable v0.3 design bible.

Start with [the design-bible specification](content/text/documents/articles/specifications/561-group-design-bible.md), then use:

- [design elements](content/text/documents/articles/specifications/elements/) for marks, palette entries, grids, type, imagery, and document furniture;
- [design procedures](content/text/documents/articles/specifications/procedures/) for the transformations and checks used while making an artifact;
- [derive and receive a branded artifact](content/text/documents/articles/specifications/procedures/derive-and-receive-brand-artifact.md) for the *candidate* research → original producer → rendered specimen → independent acceptance cycle, grounded in the 561.group regression;
- [design policies](content/text/documents/articles/specifications/policies/) for the two explicit refusals;
- [the glossary](content/text/glossary/terms/) for the vocabulary behind those rules; and
- [the DTCG token file](data/records/design-tokens/561-group.tokens.json) when a tool needs the palette, fonts, or web-layout values.

The readable v0.3 edition is [the rendered design bible](content/text/documents/articles/specifications/561-group-design-bible-v0.3.html). Its active stylesheet is [the v0.3 CSS](code/styles/561-group-design-bible-v0.3.css). The design prompt is a specification too, at [561-group-visual-design-prompt.md](content/text/documents/articles/specifications/561-group-visual-design-prompt.md), rather than a disconnected science note.

The old FARS register layout, prior HTML editions, and their renderer are retained only as [package-local legacy material](lib/legacy/design-bible/). They are evidence of prior editions, not active documentation routes.

## Executable source and conformance

The single portable `data/records/design-tokens/561-group.tokens.json` is the
owned v0.3 DTCG 2025.10 source. Consumers MUST import the **real** package
exports `./tokens` or `./brand-profile` (not a similarly named orphan path).
`src/theme.mjs` derives the existing Group theme from that same validated
profile; Red Cup's shared theme engine still owns palette derivation and CSS
components. There is no copied independent brand palette here.

```js
import { derive561BrandProfile, houseCssVariables } from "@561-group/561-group-content-design-services-section/brand-profile";
const profile = derive561BrandProfile();
const cssVariables = houseCssVariables(profile);
```

The profile validates DTCG types, explicit sRGB components against hex fallback,
font stacks, layout units, source edition and the critical reading-contrast
pairs. The CSS output deterministically emits the actual Group token values.
It neither renders an image nor certifies that a webpage actually *uses* the
variables, stays within the 6%/3% alarm/witness area limits, retains the giant
561 mark, or remains accessible at mobile widths. Those are separately received
rendering and visual-proof jobs.

Run `npm run verify` in `red-cup-engineering/561-group-content-design-services-section` (the engine holding this section's code; set `CONTENT_DESIGN_ROOT` to this checkout) in the **actual installed dependency closure**. The
dependency-free profile tests can run there with `node --test test/brand-profile.test.mjs`
before the theme supplier is mounted. Failing typed tokens must prevent
publication; a passing source test never substitutes for a screenshot and an
independent reader's comparison of what appeared.

**Original 561.group receiving defect (October 2026):** its previous homepage
kept a valid renderer and publication workflow while silently drifting from
the house visual language and inserting unwanted identity-first copy. The
standing remedy is to compare a changed producer's rendered page with the
current accepted 561 house specimen, desktop and mobile, not to reopen the
earlier dense content. Design source, TUFTE projection, browser observation,
reused customer asset and actual receiving are distinct obligations.

## Internal service contract

An owned design corpus is not by itself a delivered internal service. A design-service receipt should identify the customer, artifact or surface, requested transformation or assessment, applicable design edition, accountable provider, and customer acceptance evidence.

## Image-generation production labor

The [ChatGPT-Web Image Generation Services Section](services/561-group-chatgpt-web-image-generation-services-section/README.md) is the Group's demand-led hourly **execution/ingress** micro-enterprise. It uses this section's design bible and the existing Red Cup visual compiler, and it consumes the owning Causeway Public Media `MediaNeed`/readiness/allocation and acceptance contracts. It neither creates a second visual canon nor independently publishes a consumer's material. A confirmed October 12, 2026 interactive ImageGen → ChatGPT Files → Google Drive transfer is documented there; unattended scheduled transfer and consumer acceptance remain separately unverified.
