# StatM 1.3.0

[中文](RELEASE-NOTES.md) · English

StatM 1.3.0 extends data preparation, group comparisons and scientific figure composition. New results are retained in analysis history, research tables and reproducible analysis bundles.

- **Excel worksheet selection**: preview the first 10 rows before importing a selected sheet; retain text identifiers and worksheet provenance.
- **Quality rule library**: save, load and manage rule sets, with field compatibility checks.
- **Post-hoc comparisons**: Tukey–Kramer for ANOVA, Games–Howell for Welch ANOVA, and Dunn–Holm for Kruskal–Wallis, including all pairs and adjusted p values.
- **Estimation plots**: show observations and mean differences with confidence intervals in the original units; retain paired connections.
- **Variable dictionaries**: maintain labels, units, descriptions and code meanings, inherited by cleaned versions and frozen when an analysis runs.
- **Dataset joins**: check multi-key left, inner and full joins within a project before saving a separate dataset.
- **Multi-panel figures**: combine saved 2D figures into two panels or a 2×2 layout, exporting SVG, 300 DPI PNG, PDF and configuration.
- **Analysis bundle inventory**: inspect the scope of complete data, dictionaries, provenance, cleaning history, results and reproduction source before export.

Mean differences use A − B. Dunn–Holm compares pooled ranks, not median differences, and supplies no median-difference interval. Choose methods against the study design; a Levene warning does not change the selected method. Estimation plots show at most 400 observations per group and the first 10 pairs; inference uses all valid records and tables retain every pair.

Compositions retain each panel's axes and units; use 2D projections of 3D figures. Null join keys do not match and text keys are not converted to numbers. Bundle inventories do not perform automatic de-identification. Running reproduction scripts outside StatM requires Python and the listed dependencies; R code is an independent reference implementation.

Download **StatM-Setup-1.3.0-x64.exe**, close StatM and install into the existing directory. The runtime is included, core functions work offline, and existing local workspaces are retained. The installer is unsigned; **SHA256SUMS.txt** is supplied for download verification.

Validation on the current Windows host included 123 backend tests, 18 targeted tests after final fixes, 18 desktop unit tests, 37 frozen-engine checks, 21 desktop regression groups and 7 new-feature scenarios. Reproduction reported zero numerical differences; 1,981 extracted installer files matched the tested program. Independent synthetic-data workspaces were used; this is not clean-VM acceptance.

[User guide](USER-GUIDE.en.md) · [Worked examples](EXAMPLES.en.md) · [Changelog](CHANGELOG.en.md) · [Report an issue](https://github.com/Lewis-18/StatM/issues)

© 2026 Jackson Lewis. StatM.
