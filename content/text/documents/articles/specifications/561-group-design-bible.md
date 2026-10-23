---
title: 561 Group Design Bible
edition: v0.3
status: living
drafted: 2026-05-01
---

# 561 Group Design Bible

The design bible is the working visual language for 561 Group: color, type,
grid, mark, voice, imagery, templates, and the restraint that keeps them from
drifting. It is a field manual for designers and content-makers, not a finished
brand book. When the work contradicts the bible, the work wins; update the
bible with the evidence of that failure.

## Use the package

Read the [v0.3 rendered edition](561-group-design-bible-v0.3.html) for the
complete field manual. Use the small specifications while producing an artifact:

- [elements](elements/) define things that appear in an artifact: the mark,
  wordmark, palette, type stack, grids, imagery treatment, and document
  furniture;
- [procedures](procedures/) define constrained transformations such as color
  budgeting, grid fitting, caption setting, translation, and reproduction
  treatment;
- [policies](policies/) record the explicit refusals; and
- [the glossary](../../../glossary/terms/) names the disciplines that cross
  those specifications.

The starting artifact descriptions are in [the template catalog](template-catalog.md).
Questions that have not yet become a procedure or policy are in
[open-design-questions.md](open-design-questions.md).

## Portable styling data

[`561-group.tokens.json`](../../../../../data/records/design-tokens/561-group.tokens.json)
is the machine-readable source for the shared palette, font stacks, spacing,
and web-layout measurements. It follows the Design Tokens Community Group
Format Module 2025.10. The format is a stable W3C Community Group report, not
an IETF RFC or a W3C Recommendation; it is nevertheless the interoperable
standard specifically intended for exchanging this class of design decision.

The rendered CSS is a projection of these decisions. It intentionally avoids a
remote font import: the visual system forbids third-party web requests, so a
deployment must self-host the named fonts or use the recorded fallback stack.

## Editions and evidence

The current rendered edition is v0.3. Earlier v0.1 and v0.2 HTML renderings,
their source CSS, and the retired renderer are held under
[`lib/legacy/design-bible/`](../../../../../lib/legacy/design-bible/). The
legacy material preserves historical information without leaving a second
active documentation system in engineering.
