# StatM 1.4.6

[中文](RELEASE-NOTES.md) · English

This release improves figure layout, export controls and everyday data work.

- **Facet layout**: reserve space for complete titles and sample counts, keep plot areas equal within each row, offer full or compact axes, and wrap English titles at word boundaries.
- **Bilingual scientific export**: choose the figure language independently of the interface and select standard or larger text. Preserve user field and group names, with 90/180mm output, 300 DPI PNG, SVG and PDF.
- **Dataset joins**: follow selection, configuration, review and save steps. Renaming an output retains a valid match preview.
- **Data tables**: three density settings, keyboard column resizing, and double-click or Home reset, with wide-table pinned columns and horizontal scrolling verified.
- **Bulk variable selection**: report remaining capacity, fields added and fields skipped at the selection limit.
- **Labels and heatmaps**: preserve text identifiers such as 001, 1e6 and 1000000; choose black or white heatmap labels from the actual cell color.
- **Dense scatterplots**: adapt symbol size and opacity to observation count, concentration and plot area, retaining observations, coordinates and record identities.
- **Reproduction settings**: save export language, text size and facet view in analysis bundles. Existing statistical methods and opening and waiting animations are retained.

Download **StatM-Setup-1.4.6-x64.exe**, close StatM, and install to the existing location. Local workspaces are retained. The installer is unsigned; verify it using SHA256SUMS.txt.

Validation: 132 backend tests, 38 desktop and figure checks, 37 offline-engine checks and 21 desktop regression checks passed. Nineteen packaged-app screenshots matched their baselines. Four reproduction bundles reran with zero numerical differences; 1,986 installer files matched the tested application. SVG, PNG and six vector PDFs were checked, including 90/180mm widths. Testing used the current Windows computer and does not establish clean-VM installer acceptance. R reference code was not independently executed.

[User guide](USER-GUIDE.en.md) · [Examples](EXAMPLES.en.md) · [Methods and validation](METHODS.en.md) · [Changelog](CHANGELOG.en.md)
