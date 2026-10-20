# StatM user guide

[中文](USER-GUIDE.md) · English

This guide covers StatM 1.3.0. [Download](https://github.com/Lewis-18/StatM/releases/latest) · [Worked examples](EXAMPLES.en.md) · [Overview](README.en.md)

## Contents

[Install](#download-and-install) · [Language](#language-and-theme) · [Import](#import-data) · [Quality](#check-data-quality) · [Dictionaries](#variable-dictionaries) · [Joins](#join-datasets) · [Post-hoc and estimation](#post-hoc-comparisons-and-estimation-plots) · [Multi-panel figures](#multi-panel-figures) · [Cleaning versions](#inspect-cleaning-records) · [Variables](#select-variables) · [Analysis](#run-an-analysis) · [History](#figures-and-history) · [Comparison](#compare-history-records) · [Linked records](#linked-scatter-records) · [Research tables](#export-research-tables) · [Figures](#export-pdf-figures) · [Reproduction](#export-and-rerun-an-analysis-bundle)

## Download and install

1. Download the Windows x64 installer from the [release page](https://github.com/Lewis-18/StatM/releases/latest).
2. Close any running copy of StatM, run the installer and choose an installation directory.
3. Start the desktop shortcut, create a project, or open a built-in example.

The installer includes the runtime; normal app use requires no separate Python or Node.js installation. It is currently unsigned, so Windows may show an unknown-publisher prompt. SHA256SUMS.txt provides a download-integrity checksum.

## Language and theme

In **Settings → Language**, choose Chinese or English. The preference is saved; switching does not change filenames, project names, variables, data or analysis parameters. The workbench also supports dark and light themes.

## Import data

CSV, TXT, XLSX and XLS are supported. A desktop upload is limited to **200 MB**, **1 million rows** and **500 columns**. For Excel, select a worksheet, preview its first 10 rows and confirm the import. Text identifiers retain their leading zeros; the source filename and worksheet are recorded. Uncompressed XLSX content is limited to 500 MB.

The first TXT line must contain column names. Comma, tab, semicolon, pipe and whitespace delimiters are supported, with UTF-8 / GB18030 encodings. Check headers, delimiters and encoding if import fails.

Inspect field types and missing values after import. Preview search, sorting and filtering change the displayed table; analyses use the selected dataset. Cleaning saves a new dataset version.

## Check data quality

Select a dataset in Data, open Quality and run the checks. The report summarizes missing values, completely duplicate rows and IQR outlier flags for the entire dataset. Optional rules include numeric type, required values, uniqueness, ranges and allowed categories.

Select an issue card to inspect original record numbers. Export the JSON report to retain rules, counts and location information. Counts cover the complete data; each issue type shows up to its first 100 records, paged in groups of 25. Original record numbers start at 1.

Duplicates and outlier flags require research judgment; checks do not automatically delete or impute values. No reported issues does not establish that the data or study design is fully valid. Range and category rules do not count missing values as violations; add a required-value rule if needed. Save rules to the local workspace library, load compatible sets, save copies or delete sets. Loading checks field names and types; run the checks after loading.

## Variable dictionaries

In Data → Variable dictionary, select a field and enter its label, unit, description and JSON code meanings, then save. Export dictionaries separately when needed. Cleaned versions inherit them; analyses retain the dictionary snapshot from execution, so later edits do not change old reproduction information.

## Join datasets

Import both datasets into one project. In Data → Join datasets, choose the left/right tables, one or more corresponding keys, left / inner / full join and expected relationship. Check matching, unmatched, null and duplicate keys and the predicted row count before saving a separate dataset.

The selected one-to-one, one-to-many, many-to-one or many-to-many relationship must fit the keys. Null keys do not match; text keys are not converted to numbers. Joins exceeding the row limit stop. Leading zeros already lost in a source cannot be recovered.

## Post-hoc comparisons and estimation plots

In Analysis → Hypothesis tests, select the outcome and grouping field. ANOVA uses Tukey–Kramer, Welch ANOVA uses Games–Howell, and Kruskal–Wallis uses tie-corrected Dunn–Holm; comparisons can also be disabled. Tables retain every pair and adjusted p value. Mean differences use A − B.

One-sample, independent Welch and paired t tests, and ANOVA with mean comparisons, supply estimation plots. These show observations and mean-difference intervals in the original units. One-sample plots use μ − μ₀; paired observations retain connecting lines. Standardized effect sizes stay separate in tables. Dunn–Holm compares ranks and is not a median-difference procedure. Plots show at most 400 observations per group with seed 937 and the first 10 pairs; inference uses all valid observations.

## Multi-panel figures

In Plot → Saved figures, select the project and expand the composition editor. Choose 2 or 4 saved 2D figures in order, select a horizontal pair or 2×2 layout, set background and palette, then generate a preview. Reorder panels, save the configuration or export SVG / 300 DPI PNG / PDF and configuration JSON.

Panels use a–d labels, a total width of 180 mm and a 90 mm scale per panel. Each retains its own axes and units. Use a 2D projection for a 3D chart. SVG and PDF retain vector content.

## Inspect cleaning records

Expand dataset lineage in Preview, Cleaning or Quality. Each cleaning operation creates an independent version and records its parent, operation, fields, actual imputation values, before/after row counts and affected counts.

Use **View this version** to inspect an existing version. Returning to it does not delete later versions or perform an inverse operation. Older records explicitly indicate when complete cleaning parameters were not retained.

## Select variables

Open **Select variables** from analysis or plotting settings.

1. Search field names and inspect types and missing counts.
2. Select fields, using the arrows on the right to reorder them. Plot variables follow X/Y/Z or bubble-area roles.
3. Confirm to apply. Cancel, close or press Esc to retain the previous selection.

The settings panel keeps its width. Analyses allow at most 30 selected variables; individual methods state their required counts and types.

## Run an analysis

1. Create a project and import data, or open a built-in dataset.
2. Inspect fields, missing values and distributions; clean when justified.
3. Select descriptive statistics, correlation, a hypothesis test, linear regression or PCA. Choose variables and run.
4. Inspect tables, figures, sample sizes and calculation notes, interpreting the result in the context of the study design.
5. Export tables, results, figures or Python/R scripts.

See [worked examples](EXAMPLES.en.md) for concrete settings and actual outputs.

## Analyze a subsequent dataset version

Saved results identify their original dataset version. When later cleaning versions exist, a reminder offers an action to restore parameters for the selected newer version. Check the fields and run the analysis.

The original result remains attached to its original data; it is not overwritten or automatically invalidated. The new run creates a separate record. Parameter-change indicators continue to apply.

## Figures and history

Plotting includes 3D scatter plots, bubbles, parallel coordinates, scatterplot matrices, grouped box plots and category counts. Each chart has an independent white/black background preference.

2D figures support PNG/SVG/PDF. Rotate and zoom 3D figures, then export the current view as PNG/PDF. Parameters, results and figures are saved locally. History supports inspection, parameter restoration and reruns; copying or deleting a record also handles its associated chart records.

## Compare history records

1. In History, add the baseline record to the comparison.
2. Add a second record with the same dataset version and method. Hypothesis tests must also use the same test type.
3. Inspect parameters and statistics side by side, optionally showing differences only. Export CSV when needed.
4. Remove a comparison record to replace it, or clear the comparison.

Differences describe changes; they are not a significance test.

## Linked scatter records

For newly created scatter plots that support linking, including 2D projections of 3D plots, use the rectangular selection tool on Charts or select the corresponding record checkboxes.

A plot shows at most 2,000 fixed-sample records. Selection applies to displayed points only. Original record numbers refer to dataset row positions and may be nonconsecutive after missing-value exclusion and sampling. Selections are saved and can be restored; they do not alter the result or automatically rerun a subset analysis. Rerun older plots to enable linking if record identity is missing.

## Export research tables

After descriptive statistics, correlation, a hypothesis test, regression or PCA, open **Tables → Research tables**. Select 2–6 decimal places and export editable Word, a complete LaTeX document, HTML or desktop PDF. A single table can also be exported to Word.

Raw results retain full precision. Small p-values use thresholds rather than zero; unavailable entries use a dash, and significance stars are not automatically added. Table notes retain assumptions, interval definitions and warnings. Wide tables scroll on screen and use A4 landscape exports. Compile exported LaTeX with XeLaTeX; app use itself does not require TeX.

Correlation includes a lower-triangular coefficient matrix and pairwise statistics with coefficients, p-values and pair-specific sample sizes. Pearson, Spearman and Kendall are supported; multiple-comparison correction is not automatic.

PCA tables include eigenvalues, variance explained and cumulative variance, retention status, loadings, and a correlation or covariance matrix. Notes define standardization and loadings. Wide matrices are divided into column blocks while preserving variable order.

## Export PDF figures

1. Choose a 90 / 180 mm single/double-column preset, background and palette below the charts.
2. Export PDF or PNG; 2D figures also support SVG.
3. Desktop 2D PDFs retain vector paths and text. 3D PDFs contain a high-resolution image of the current view. Web-mode PDFs use 300 DPI images.

## Export and rerun an analysis bundle

Export a ZIP from any saved result. It includes complete analysis data, typed JSON and CSV, parameters, raw results, chart values and persisted display settings, cleaning lineage, numerical Python source, R reference code, dependency versions and SHA-256 checks. Descriptive-statistics, hypothesis-test and regression bundles also include Word, LaTeX and HTML tables.

New analyses retain the numerical source snapshot and dependency versions from the time they were run; later upgrades do not substitute new numerical source for that snapshot.

Extract the ZIP, create an environment matching the Python version in environment.json, install requirements.txt, and run reproduce.py as directed by README.txt. The rerun does not require the StatM server or developer directory. Python and dependency installation require network access or offline wheels.

Inspect reproduction-check.json. PASS indicates that statistics and numerical chart data match within relative tolerance 1e-8 and absolute tolerance 1e-10. CSV is for convenient inspection; computation uses typed JSON to avoid reinterpreting category codes or dates.

The bundle contains complete analysis data: confirm its sharing scope before distributing it. R is an independent reference implementation. Temporary zoom and the current 3D viewpoint are not included; pixel-identical rendering is not promised. Older analyses without source-version identifiers explicitly cannot prove the original algorithm version. Integrity checks detect accidental corruption; they are not digital signatures.

## Updates and local data

Check for updates in Settings or the application menu, then download the new installer. Close StatM and install to the same directory to retain the existing workspace.

Projects and core computations remain local. Offline core functionality stays available; update checks access GitHub. Close the app before backing up a workspace, and retain its local data directory when updating or reinstalling.

## Common questions

- **Startup is still in progress**: wait for the workbench before operating.
- **Import failed**: check format, delimiters, encoding, headers, the selected worksheet and size limits.
- **Update check failed**: retry with network access or visit the [release page](https://github.com/Lewis-18/StatM/releases/latest). Local analysis can continue.
- **Results include warnings**: inspect missing-value handling, sample size, constant columns, collinearity and model assumptions.
- **Need support**: provide the version, steps and anonymized screenshots through [Issues](https://github.com/Lewis-18/StatM/issues).

© 2026 Jackson Lewis. StatM.



Before confirming analysis-bundle export, inspect the inventory of complete data, unselected fields, variable dictionary, provenance, cleaning history, results, chart configuration and reproduction source. The inventory does not automatically de-identify data.


## 1.4.0 Questionnaire research and batch comparisons

- **Questionnaire reliability**: raw-score Cronbach alpha, Feldt intervals, corrected item-total correlations and alpha if an item is deleted, with explicit reverse scoring and score limits.
- **Exploratory factor analysis**: maximum-likelihood common factors, no rotation or Varimax, KMO, Bartlett, loadings, communalities, uniquenesses and parallel analysis.
- **General facets**: grouped scatterplots and histograms share axis ranges and bin edges, with full and displayed sample counts.
- **Batch distributions**: map two datasets field by field, confirm units and codes, and compare valid counts, missingness, numeric distributions and categorical proportions.
- **Scales and study design**: nominal, ordinal and continuous dictionary metadata, plus explicit independent or paired test designs.
- **Startup fix**: both languages read the actual application version while retaining the existing opening and waiting animations.

Alpha does not establish unidimensionality or validity and does not automatically remove items. EFA does not compute polychoric correlations or CFA; the factor count is user-specified and parallel analysis is an aid. Batch comparisons are descriptive, without independent-sample p-values or rankings across units. Review missingness, units and coding in the study context.

[Walkthrough and synthetic examples](EXAMPLES.en.md)
