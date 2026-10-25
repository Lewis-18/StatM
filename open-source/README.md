# 组件与工具使用指南

中文 · [English](README.en.md)

提供变量选择、图表配置、文件读取和统计计算工具，各模块按功能组织。

## React 与图表

在支持 TypeScript 和 CSS 导入的 React 19 项目中安装依赖：

```shell
npm install react react-dom @radix-ui/react-dialog lucide-react echarts
```

复制 `src/` 和所需示例。`examples/variable-picker.tsx` 演示变量搜索、多选、排序与确认；`examples/chart.tsx` 演示 ECharts 图表和响应式尺寸。运行 `npm install` 与 `npm run check` 可以检查本目录的 TypeScript。

变量字段包含 `name`、`type`、`missing`。`onChange` 在确认后调用，取消或 Esc 保留原选择；`value` 保持选择顺序，`max` 限制数量，`roles` 可标记坐标轴。CSS 主题变量包括 `--panel`、`--input`、`--text`、`--muted`、`--accent`、`--accent-ink`、`--border`、`--hover`。

`makeChartOption` 根据 `ChartSpec` 生成直方图、箱线图、ECDF、Q–Q、相关热图和探索图配置。`chart-preferences.ts` 提供配色、点形和单栏/双栏导出预设；`figure-export.ts` 提供物理尺寸、SVG 尺寸及 PNG 分辨率设置；`chart-interaction.ts` 保留普通滚轮的页面滚动。图表标题按传入文字显示，翻译可在调用前完成。

## Python 文件读取与计算

在本目录中执行：

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

`read_table` 支持 CSV、TXT、XLSX、XLS，默认上限为 200 MiB、100 万行、500 列，可通过参数调整；Excel 读取第一个工作表。TXT 第一行为表头，支持逗号、制表符、分号、竖线或空白分隔，以及 UTF-8 / GB18030 编码。读取仅返回 DataFrame，不保存文件或数据到其他位置。

`descriptive` 计算样本均值、标准差、分位数等指标并生成分布图数据；`correlation` 支持 Pearson、Spearman、Kendall；`hypothesis` 支持单样本、Welch 独立样本和配对 t 检验、Wilcoxon、Mann–Whitney U、卡方、ANOVA 与 Kruskal–Wallis。结果包含表格、图表数据、警告与方法说明。`clean` 将数值结果转换为可序列化结构。

默认删除本次计算所需变量中的缺失行；相关分析逐对删除，样本量可能不同。标准差与方差使用 ddof=1，峰度为超额峰度。相关分析的 p 值未经多重比较校正，事后比较按所选方法调整。效应量与置信区间的具体定义见结果中的 `notes`。输入无效时，统计函数抛出带 `detail` 的 `fastapi.HTTPException`，文件读取函数抛出 `ValueError` 或解析异常。

`plugins.py` 提供独立脚本的计算接口与注册器，`examples/analysis_example.py` 演示注册和调用；该接口用于你自己的 Python 程序。统计假设、研究设计和结果解释仍需结合具体数据判断。

运行验证：

```shell
python -m pip install './python[test]'
python -m pytest python/tests
```


1.3.0 工具更新：`hypothesis` 新增 Welch ANOVA、Tukey–Kramer / Games–Howell / Dunn–Holm 及估计图数据；通过 `AnalysisParams(posthoc="auto")` 选择配套比较，`posthoc="none"` 关闭。需 SciPy 1.16 或更新版本。相关分析的 p 值仍未校正，事后比较表的 p 值为配套校正结果。`estimation-options.ts` 将估计图数据转为 ECharts 配置。Excel 选表、规则库、字典、关联与组合编辑器属于完整桌面应用；独立 `read_table` 仍读取首张工作表。


1.4.5 绘图工具：`chart-theme.ts` 统一导出主题；默认导出白底，与屏幕主题无关。需要黑底时，给 `makeChartOption` 的 `exportTheme` 参数传入 `"dark"`。`chart-layout.ts` 提供测量、完整标签换行和分类轴留白；`facet-options.ts` 包含共用坐标分面。变量选择组件支持 38px 排序按钮与 Alt + ↑ / ↓。


## 1.4.6

1.4.6 组件增加 `chart-readability.ts`，提供热图文字对比度和密集散点样式；分面按内容留白，`figure-preferences.ts` 管理字号与语言偏好。`makeChartOption` 最后的 `facetLayout` 参数可设为 `"full"` 或 `"compact"`。

独立 `i18n.ts` 适配层默认返回原文。宿主应用切换语言时调用 `setChartTranslator(yourTranslator)`，返回值为之前的翻译函数；`chartText` 保护原始字段名和分组名称。此包不包含桌面应用的翻译字典和原生接口。`figureCanvasWidth(preset, "readable")` 提供大字设置，`figureSize` 保持物理尺寸。
