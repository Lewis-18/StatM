# Sample files

[中文](README.md) · English

[Worked examples](../EXAMPLES.en.md) · [Overview](../README.en.md)

Table and figure files are actual StatM 1.2.0 exports. Word tables are editable; compile LaTeX documents with XeLaTeX. PDFs can be viewed directly. English PCA exports use the -en suffix.

| Example | Files |
| --- | --- |
| Advertising correlation | [Word](advertising-correlation.docx) · [LaTeX](advertising-correlation.tex) · [HTML](advertising-correlation.html) · [PDF](advertising-correlation.pdf) |
| Advertising regression | [Word](advertising-regression.docx) · [PDF](advertising-regression.pdf) · [Comparison CSV](advertising-comparison.csv) |
| Iris PCA | [Word](iris-pca.docx) · [LaTeX](iris-pca.tex) · [HTML](iris-pca.html) · [PDF](iris-pca.pdf) |
| English Iris PCA | [Word](iris-pca-en.docx) · [LaTeX](iris-pca-en.tex) · [HTML](iris-pca-en.html) · [PDF](iris-pca-en.pdf) |
| Residual plot | [SVG](regression-residuals.svg) · [PDF](regression-residuals.pdf) |
| Data quality | [Teaching CSV](iris-quality-demo.csv) · [Actual report](iris-quality-report.json) |
| Reproduction | [Actual numerical rerun check](advertising-reproduction-check.json) |

## Data and modifications

The quality tutorial modifies the app's bundled Iris copy and has 151 rows. In original row order, sepal_length in record 1 is cleared, species in record 5 is set to unknown, petal_length in record 26 is set to 20, and original record 150 is appended. These changes demonstrate checks and cleaning; do not use this file as the original Iris research data.

Iris: Fisher, R. (1936), [UCI Machine Learning Repository](https://archive.ics.uci.edu/dataset/53/iris), DOI 10.24432/C56C76, CC BY 4.0. The tutorial uses the field names and row order in StatM's bundled copy, with the modifications disclosed above.

Advertising is the ISL teaching dataset bundled with StatM. This directory provides calculated example outputs; load the data from the app homepage. These examples demonstrate operations and diagnostics rather than a causal effect of advertising on sales.

Dataset version identifiers and run times in exports identify actual saved analyses. The public rerun result reports numerical checks; handle your own complete-data bundles according to their sharing scope.



New [1.3.0 examples](../EXAMPLES.en.md) use 36 synthetic records: [Excel workbook](v1.3.0/methods-workbook.xlsx), [post-hoc tables](v1.3.0/posthoc.pdf), [estimation plot](v1.3.0/estimation.pdf), and [composition](v1.3.0/four-panel.pdf). These exported samples retain Chinese labels. Existing samples above were exported by 1.2.0.
