SHELL := /bin/bash
PDF := design-bible.pdf

.PHONY: all derive pdf check clean

all: pdf

derive:
	Rscript R/derive_tokens.R .

pdf: derive
	latexmk -xelatex -interaction=nonstopmode -halt-on-error design-bible.tex

check: pdf
	qpdf --check $(PDF)
	pdfinfo $(PDF)
	pdffonts $(PDF)

clean:
	latexmk -C design-bible.tex
	rm -f generated/tokens.tex generated/contrast-table.tex generated/build-receipt.tex
