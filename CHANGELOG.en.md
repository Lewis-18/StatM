# Release history

[中文](CHANGELOG.md) · English

## 1.3.0

- **Excel worksheet selection**: preview the first 10 rows before importing a selected sheet; retain text identifiers and worksheet provenance.
- **Quality rule library**: save, load and manage rule sets, with field compatibility checks.
- **Post-hoc comparisons**: Tukey–Kramer for ANOVA, Games–Howell for Welch ANOVA, and Dunn–Holm for Kruskal–Wallis, including all pairs and adjusted p values.
- **Estimation plots**: show observations and mean differences with confidence intervals in the original units; retain paired connections.
- **Variable dictionaries**: maintain labels, units, descriptions and code meanings, inherited by cleaned versions and frozen when an analysis runs.
- **Dataset joins**: check multi-key left, inner and full joins within a project before saving a separate dataset.
- **Multi-panel figures**: combine saved 2D figures into two panels or a 2×2 layout, exporting SVG, 300 DPI PNG, PDF and configuration.
- **Analysis bundle inventory**: inspect the scope of complete data, dictionaries, provenance, cleaning history, results and reproduction source before export.

## 1.2.0

- Complete-dataset quality checks, configurable field rules, original-record inspection and JSON reports.
- Research tables for descriptive statistics, correlation, hypothesis tests, regression and PCA, with precision controls and Word/LaTeX/HTML/desktop PDF export.
- Dataset parents, cleaning operations, actual fill values and affected counts.
- Dataset-version information and parameter restoration for analysis of later cleaned versions.
- Reproducible analysis bundles with numerical source snapshots, dependency versions, integrity checks and Python reruns.

## 1.1.0

- Faster dataset previews, paging, repeated filtering and sorting.
- Compatible history comparison, difference filtering and CSV export.
- Linked scatter selections and record tables with saved selections.
- PDF export for 2D and current-view 3D figures.
- Improved startup animation.

## 1.0.8

- TXT imports with common delimiters and UTF-8 / GB18030.
- Desktop uploads up to 200 MB, one million rows and 500 columns.
- Dialog-based variable selection with search, multiple selection, complete names, missing counts and axis order.
- Improved startup animation.
- Fixed analysis-setting errors and clarified variable and parameter prompts.

## 1.0.5

- Updated welcome screen and version display.
- Faster startup and recent-workspace restoration.
- Instant Chinese/English switching with saved language preference.
- Improved history browsing, copy feedback, loading indications and keyboard operation.
- Improved update checks and network-error messages.
- Updated examples with white-background research figures.

## 1.0.0

The first public Windows x64 release: data import, preview, cleaning and project management; descriptive statistics, correlation, hypothesis tests, OLS and PCA; 2D/3D figures with PNG/SVG export; saved parameters, history, reruns and Python/R scripts; light/dark themes and release checks.

[All releases and downloads](https://github.com/Lewis-18/StatM/releases)

© 2026 Jackson Lewis. StatM.
