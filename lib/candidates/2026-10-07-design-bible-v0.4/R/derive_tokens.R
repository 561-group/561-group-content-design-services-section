#!/usr/bin/env Rscript

# 561 Group Visual Design Bible — deterministic token derivation.
# Reads the DTCG JSON token source, validates required core colors, computes
# WCAG relative-luminance contrast, and writes LaTeX fragments consumed by
# the PDF build.  Only jsonlite is required beyond base R.

suppressPackageStartupMessages(library(jsonlite))

args <- commandArgs(trailingOnly = TRUE)
root <- if (length(args) >= 1) normalizePath(args[[1]], mustWork = TRUE) else normalizePath(".", mustWork = TRUE)
token_file <- file.path(root, "tokens", "561.tokens.json")
out_dir <- file.path(root, "generated")
dir.create(out_dir, showWarnings = FALSE, recursive = TRUE)

tokens <- fromJSON(token_file, simplifyVector = FALSE)
required <- c("ink", "bone", "witness", "alarm", "ink-soft", "rule", "dark-ground", "paper-white")
missing <- setdiff(required, names(tokens$color))
if (length(missing)) stop("Missing required color token(s): ", paste(missing, collapse = ", "))

hex_of <- function(name) {
  x <- tokens$color[[name]]$`$extensions`$`com.561.hex`
  if (is.null(x) || !grepl("^[0-9A-Fa-f]{6}$", x)) stop("Invalid com.561.hex for color token: ", name)
  toupper(x)
}

hex_rgb <- function(hex) {
  ints <- strtoi(substring(hex, c(1,3,5), c(2,4,6)), base = 16L)
  ints / 255
}

channel_linear <- function(c) ifelse(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055)^2.4)
luminance <- function(hex) {
  rgb <- channel_linear(hex_rgb(hex))
  0.2126 * rgb[[1]] + 0.7152 * rgb[[2]] + 0.0722 * rgb[[3]]
}
contrast <- function(a, b) {
  l <- sort(c(luminance(a), luminance(b)), decreasing = TRUE)
  (l[[1]] + 0.05) / (l[[2]] + 0.05)
}

# 1. Token macros / colors.
tex <- c(
  "% GENERATED FILE — do not hand edit. Source: tokens/561.tokens.json",
  paste0("\\definecolor{FSOInk}{HTML}{", hex_of("ink"), "}"),
  paste0("\\definecolor{FSOBone}{HTML}{", hex_of("bone"), "}"),
  paste0("\\definecolor{FSOWitness}{HTML}{", hex_of("witness"), "}"),
  paste0("\\definecolor{FSOAlarm}{HTML}{", hex_of("alarm"), "}"),
  paste0("\\definecolor{FSOInkSoft}{HTML}{", hex_of("ink-soft"), "}"),
  paste0("\\definecolor{FSORule}{HTML}{", hex_of("rule"), "}"),
  paste0("\\definecolor{FSODarkGround}{HTML}{", hex_of("dark-ground"), "}"),
  paste0("\\definecolor{FSOPaperWhite}{HTML}{", hex_of("paper-white"), "}"),
  paste0("\\newcommand{\\FSOSpecVersion}{", tokens$`$extensions`$`com.561.spec`$version, "}"),
  paste0("\\newcommand{\\FSOWebGutter}{", tokens$layout$web$gutter$`$value`$value, "px}"),
  paste0("\\newcommand{\\FSOWebMeasure}{", tokens$type$measure$reading$`$value`$value, "rem}"),
  paste0("\\newcommand{\\FSOPrintMeasure}{", tokens$type$measure$`print-body`$`$value`$value, "mm}")
)
writeLines(tex, file.path(out_dir, "tokens.tex"), useBytes = TRUE)

# 2. Contrast conformance table.
pairs <- list(
  c("ink", "bone"),
  c("witness", "bone"),
  c("alarm", "bone"),
  c("alarm", "ink"),
  c("ink", "paper-white"),
  c("bone", "dark-ground"),
  c("witness", "paper-white")
)
rows <- vapply(pairs, function(p) {
  ratio <- contrast(hex_of(p[[1]]), hex_of(p[[2]]))
  normal <- ifelse(ratio >= 4.5, "PASS", "FAIL")
  large <- ifelse(ratio >= 3.0, "PASS", "FAIL")
  sprintf("%s & %s & %.2f:1 & %s & %s \\\\", p[[1]], p[[2]], ratio, normal, large)
}, character(1))
writeLines(c(
  "% GENERATED FILE — WCAG contrast from core sRGB token values.",
  "\\begin{tabularx}{\\linewidth}{@{}l l r c c@{}}",
  "\\toprule",
  "Foreground & Background & Ratio & Normal text & Large/UI \\\\",
  "\\midrule",
  rows,
  "\\bottomrule",
  "\\end{tabularx}"
), file.path(out_dir, "contrast-table.tex"), useBytes = TRUE)

# 3. Build receipt fragment; intentionally excludes wall-clock time so repeated
# builds remain content-reproducible. Git commit metadata belongs in CI artifact
# metadata, not in the visual source.
writeLines(c(
  "% GENERATED FILE — deterministic validation receipt.",
  "\\newcommand{\\FSOTokenValidation}{PASS}",
  paste0("\\newcommand{\\FSOTokenCount}{", length(required), " core colors}")
), file.path(out_dir, "build-receipt.tex"), useBytes = TRUE)

cat("Validated", length(required), "core colors; wrote LaTeX fragments to", out_dir, "\n")
