# Components and tools

[中文](README.md) · English

Reusable variable selection, figure configuration, file input and statistical-computation tools are organized by function.

## React and figures

Install dependencies in a React 19 project supporting TypeScript and CSS imports:

```shell
npm install react react-dom @radix-ui/react-dialog lucide-react echarts
```

Copy `src/` and the examples you need. `examples/variable-picker.tsx` demonstrates search, multiple selection, ordering and confirmation; `examples/chart.tsx` demonstrates ECharts and responsive sizing. Run `npm install` and `npm run check` in this directory to check TypeScript.

Fields contain `name`, `type` and `missing`. `onChange` runs on confirmation; cancel or Esc preserves the old selection. `value` preserves order, `max` limits the count and `roles` labels axes. CSS theme variables include `--panel`, `--input`, `--text`, `--muted`, `--accent`, `--accent-ink`, `--border` and `--hover`.

`makeChartOption` converts `ChartSpec` into histogram, box-plot, ECDF, Q–Q, heatmap and exploration configurations. `chart-preferences.ts` supplies palettes, point symbols and column-width presets. `figure-export.ts` handles physical dimensions, SVG sizing and PNG resolution. `chart-interaction.ts` preserves ordinary wheel scrolling. Translate chart titles before passing them to the tools.

## Python input and computation

From this directory:

```shell
python -m pip install ./python
python examples/analysis_example.py
```

```python
from statm_tools.data_io import read_table, profile
from statm_tools import descriptive
from statm_tools.params import AnalysisParams

frame = read_table('data.txt')
fields = profile(frame)
result = descriptive.run(frame, AnalysisParams(columns=['value']))
```

`read_table` supports CSV, TXT, XLSX and XLS. Default limits are 200 MiB, one million rows and 500 columns and can be configured. Excel imports the first worksheet. TXT expects a header row and supports comma, tab, semicolon, pipe and whitespace delimiters, with UTF-8 / GB18030. Reading returns a DataFrame without saving the file or data elsewhere.

`descriptive` provides sample summaries and distribution data. `correlation` supports Pearson, Spearman and Kendall. `hypothesis` supports one-sample, Welch independent and paired t-tests, Wilcoxon, Mann–Whitney U, chi-square, ANOVA and Kruskal–Wallis. Results include tables, figure data, warnings and method notes. `clean` makes numerical outputs serializable.

Missing rows are excluded for variables required by a calculation; correlation excludes missing values pairwise, so sample sizes can differ. Sample variance and standard deviation use ddof=1; kurtosis is excess kurtosis. P-values are not adjusted for multiple comparisons. Effect-size and confidence-interval definitions appear in result notes. Invalid statistical inputs raise a `fastapi.HTTPException` with `detail`; input functions raise `ValueError` or parser errors.

`plugins.py` provides an interface and registry for independent scripts. `examples/analysis_example.py` demonstrates registration and use in your own program. Interpret assumptions, study design and results in context.

## Checks

```shell
python -m pip install './python[test]'
python -m pytest python/tests
```


1.3.0 tools add Welch ANOVA, Tukey–Kramer / Games–Howell / Dunn–Holm and estimation-plot data to `hypothesis`. Use `AnalysisParams(posthoc="auto")` for the corresponding procedure or `posthoc="none"` to disable it. SciPy 1.16 or later is required. Correlation p values remain unadjusted; post-hoc tables contain the corresponding adjusted p values. `estimation-options.ts` produces ECharts estimation options. Worksheet selection, rule libraries, dictionaries, joins and the composition editor belong to the complete desktop app; standalone `read_table` still reads the first sheet.
