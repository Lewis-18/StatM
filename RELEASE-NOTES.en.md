# StatM 1.2.0

[中文](RELEASE-NOTES.md) · English

Inspect data quality, export research tables, and retain reproducible analyses in a local workspace.

## In this release

- **Data quality**: complete-dataset missingness, duplicates and IQR flags, with configurable rules and record-level inspection.
- **Research tables**: descriptive statistics, correlation, hypothesis tests, regression and PCA; 2–6 decimal places; editable Word, LaTeX, HTML and desktop PDF.
- **Cleaning and versions**: inspect parents, operations and actual fill values; restore parameters to create independent analyses on subsequent versions.
- **Reproducible bundles**: retain data, parameters, results, numerical source snapshots, dependencies and figure settings, with Python reruns and integrity checks.

*Interface screenshot: local 1.2.0 preview with language-display corrections; the existing installer is unchanged.*

![English data-quality checks](https://raw.githubusercontent.com/Lewis-18/StatM/main/assets/v1.2.0/data-quality-en.png)

![Actual English Iris PCA PDF export](https://raw.githubusercontent.com/Lewis-18/StatM/main/assets/v1.2.0/pca-export-en.png)

![Actual Advertising rerun check and bundle structure](https://raw.githubusercontent.com/Lewis-18/StatM/main/assets/v1.2.0/reproduction-check-en.svg)

## Download and use

Download [StatM-Setup-1.2.0-x64.exe](https://github.com/Lewis-18/StatM/releases/download/v1.2.0/StatM-Setup-1.2.0-x64.exe), close the app and install to the same directory. The installer includes the runtime; core workflows work offline and retain existing local projects, data and history.

Routine app use needs no separate Python/Node.js setup. External reproduction scripts require the Python environment specified in their bundle. Quality flags do not modify data automatically. Rerun checks compare numerical statistics and chart data, not identical pixels. The installer is unsigned; SHA256SUMS.txt is included in the release.

[User guide](USER-GUIDE.en.md) · [Examples and sample exports](EXAMPLES.en.md) · [Report an issue](https://github.com/Lewis-18/StatM/issues)

© 2026 Jackson Lewis. StatM.

