<p align="center"><img src="assets/statm-mark.svg" width="88" alt="StatM"></p>

# StatM

**From data to evidence.**

[中文](README.md) · English

I built StatM as a Windows desktop application for statistical analysis and scientific visualization. You can import CSV, TXT or Excel data, explore distributions, test hypotheses, fit linear models, run principal component analysis, and export figures from one local workspace.

**Version: 1.0.8** · **Platform: Windows x64** · **Maintainer: Jackson Lewis**

[Download the installer](https://github.com/Lewis-18/StatM/releases/download/v1.0.8/StatM-Setup-1.0.8-x64.exe) · [Latest release](https://github.com/Lewis-18/StatM/releases/latest) · [Examples](EXAMPLES.md) · [Report an issue](https://github.com/Lewis-18/StatM/issues)

![StatM desktop workspace](assets/home-dark.png)

## New in 1.0.8

- Searchable variable-selection dialog with full names, missing counts and axis ordering; the settings panel keeps its width.
- TXT import using UTF-8 / GB18030 and common delimiters.
- Desktop uploads up to 200 MB, one million rows and 500 columns.
- Improved startup animation.
- Fixes for errors in analysis settings and clearer variable-selection guidance.

## Capabilities

| Task | Tools |
| --- | --- |
| Data preparation | CSV, TXT, XLSX and XLS import; searchable previews, field inspection, missing-value handling and duplicate removal. |
| Exploratory data analysis | Summary statistics, histograms, box plots, density plots, ECDF and normal Q–Q plots. |
| Correlation | Pearson, Spearman and Kendall coefficients, significance results, heatmaps and scatterplot matrices. |
| Hypothesis testing | One-sample, independent and paired t-tests; Wilcoxon, Mann–Whitney U, chi-square, one-way ANOVA and Kruskal–Wallis tests. |
| Linear regression | OLS estimates, confidence intervals, fit metrics, residual diagnostics, Cook's distance and VIF. |
| Principal component analysis | Centering and scaling, explained variance, scree plots, sample scores and loadings. |
| Scientific visualization | Interactive 3D scatter plots, bubble plots, parallel coordinates, scatterplot matrices and grouped plots. |
| Reproducible workflows | Local projects, saved parameters, analysis history, reruns and generated Python/R analysis scripts. |
| Export | Tables as CSV, results as JSON, 2D figures as PNG/SVG and the current 3D view as PNG. |

## Getting started

1. Download **StatM-Setup-1.0.8-x64.exe** from the [release page](https://github.com/Lewis-18/StatM/releases/tag/v1.0.8).
2. Close any running copy of StatM, run the installer and select an installation directory.
3. Launch the app and try a built-in dataset, or import a CSV/TXT/Excel file into a project.
4. Select an analysis, choose variables, run it, and export the results.

The installer includes the runtime and analysis engine. Core data import, statistics and chart export work offline; no separate Python or Node.js installation is required. Project data and calculations remain on your computer. Update checks retrieve release information from GitHub.

Switch between Chinese and English in Settings → Language. The preference is remembered across desktop launches. Dark/light themes, adjustable panels and saved history are available.

The release includes a SHA-256 checksum file. The current installer is unsigned, so Windows may display an unknown-publisher prompt. To update, close StatM and install the new version in the same directory. Your existing local workspace is retained.

## Examples and support

See [worked examples and exported figures](EXAMPLES.md), the [Chinese user guide](USER-GUIDE.md) and [release history](CHANGELOG.md). For support, include the app version, reproduction steps and anonymized screenshots in an [issue](https://github.com/Lewis-18/StatM/issues).

If StatM is useful to you, please star this repository to help other learners and researchers discover it.

© 2026 Jackson Lewis. StatM.
