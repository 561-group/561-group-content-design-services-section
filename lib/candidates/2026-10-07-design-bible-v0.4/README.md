# 561 Group Visual Design Bible

Candidate executable specification for the 561 Group visual system.

This repository is deliberately more than a brand guide. Its source-of-truth model is:

1. **DTCG-compatible design tokens** (`tokens/561.tokens.json`)
2. **normative semantic rules** (`design-bible.tex`)
3. **renderer profile** (`561design.sty`)
4. **design computation** (`R/derive_tokens.R`)
5. **CI conformance/build** (`.github/workflows/build-pdf.yml`)

The resulting PDF is both the human-readable Bible and a specimen of the system it defines.

## Build

```bash
Rscript R/derive_tokens.R .
latexmk -xelatex -interaction=nonstopmode -halt-on-error design-bible.tex
```

The R step validates required tokens, computes critical WCAG contrast ratios, and emits LaTeX fragments under `generated/`. XeLaTeX then consumes those generated values.

## Design-source rule

Do not hand-edit `generated/*`. Do not introduce document-local brand colors or arbitrary typefaces when a semantic token or renderer macro already exists. Add or change the token source, then regenerate.

## Preferred fonts

The recovered current 561 web theme names:

- Space Grotesk — display/institutional channel
- Roboto Slab — reading channel
- JetBrains Mono — evidence/apparatus channel

Font files are **not** included here. `561design.sty` uses local fallbacks when preferred fonts are absent so builds remain deterministic and do not fetch CDN assets.

## Status

`0.4.0-candidate` — synthesis of current Group design directives and recovered implementation evidence. Existing web/theme repositories are treated as evidence, not automatic authority, consistent with the current 561 web-estate control-root policy.

## Next steps toward 1.0

- move web/TUFTE output to the same DTCG token source;
- add a US Letter document profile alongside A4;
- add PDF accessibility/archival validation before claiming PDF/UA or PDF/A conformance;
- add golden visual regression specimens;
- add habitat token files only after each habitat has real artifacts to test;
- add machine linting for forbidden color combinations and direct-style bypasses.

## GitHub Actions layouts

The checked-in `.github/workflows/build-pdf.yml` is ready for a standalone repository. It runs R token derivation, rejects generated-file drift and overfull TeX boxes, builds with XeLaTeX, checks the PDF and font embedding, renders a preview, uploads the PDF as an Actions artifact, and attaches it to a GitHub Release when a release is published.

For the existing `561-group/561-group` control root, put this directory at `design/visual-design-bible/` and copy `integration/visual-design-bible.monorepo.yml` to the control root as `.github/workflows/visual-design-bible.yml`. The monorepo variant scopes triggers and working-directory paths accordingly.

`generated/*.tex` is intentionally tracked as a deterministic bootstrap/golden output. CI reruns `R/derive_tokens.R` and fails if R would change those files, so generated state cannot silently drift from the token source.
