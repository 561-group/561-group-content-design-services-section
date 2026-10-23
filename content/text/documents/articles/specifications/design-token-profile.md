---
title: 561 Group Design Token Profile
standard: Design Tokens Community Group Format Module 2025.10
---

# 561 Group Design Token Profile

[`561-group.tokens.json`](../../../../../data/records/design-tokens/561-group.tokens.json)
is the canonical portable representation of the palette, font stacks, weights,
spacing, web dimensions, and core type styles. It uses the [Design Tokens
Community Group Format Module 2025.10](https://www.w3.org/community/reports/design-tokens/CG-FINAL-format-20251028/)
and color module: colors are sRGB components with an explicit hex
fallback, dimensions carry an explicit unit, and font-family tokens retain
their ordered fallbacks.

The document-level visual rules are deliberately not reduced to tokens. Color
budgets, clear space, permitted imagery, caption evidence, and refusals remain
human-readable specifications because they are constraints on use, not scalar
styling values. CSS-only relative tracking stays in the active stylesheet; DTCG
2025.10 dimensions permit `px` and `rem`, not CSS `em`.

`layout.web.design-bible-max` records the v0.3 bible's 1320 px container.
`layout.web.semantic-site-max` records the separate semantic-site projection's
1200 px container so the historical difference is explicit rather than silently
overwritten.
