# StatM 1.4.0

[中文](RELEASE-NOTES.md) · English

This release adds questionnaire research and batch exploration, with history, research tables and runnable reproduction bundles.

- **Questionnaire reliability**: raw-score Cronbach alpha, Feldt intervals, corrected item-total correlations and alpha if an item is deleted, with explicit reverse scoring and score limits.
- **Exploratory factor analysis**: maximum-likelihood common factors, no rotation or Varimax, KMO, Bartlett, loadings, communalities, uniquenesses and parallel analysis.
- **General facets**: grouped scatterplots and histograms share axis ranges and bin edges, with full and displayed sample counts.
- **Batch distributions**: map two datasets field by field, confirm units and codes, and compare valid counts, missingness, numeric distributions and categorical proportions.
- **Scales and study design**: nominal, ordinal and continuous dictionary metadata, plus explicit independent or paired test designs.
- **Startup fix**: both languages read the actual application version while retaining the existing opening and waiting animations.

Alpha does not establish unidimensionality or validity and does not automatically remove items. EFA does not compute polychoric correlations or CFA; the factor count is user-specified and parallel analysis is an aid. Batch comparisons are descriptive, without independent-sample p-values or rankings across units. Review missingness, units and coding in the study context.

Batch bundles contain both complete datasets and recorded metadata, with an explicit export inventory. Figures support SVG, 300 DPI PNG and PDF.

Download **StatM-Setup-1.4.0-x64.exe**, close StatM and install to the same directory. Core calculations work offline and reuse the existing local workspace. The installer is unsigned; SHA256SUMS.txt is provided.

[User guide](USER-GUIDE.en.md) · [Examples](EXAMPLES.en.md) · [Methods and validation](METHODS.en.md) · [Changelog](CHANGELOG.en.md)
