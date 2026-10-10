# StatM 功能实例 / Worked examples

[下载安装包 / Download](https://github.com/Lewis-18/StatM/releases/latest) · [中文介绍](README.md) · [English overview](README.en.md)

以下图表来自 StatM 1.0.5 对内置 Advertising（200 条观测）与 Iris（150 条观测）数据的实际运行，采用白色绘图背景。它们展示操作与导出能力，不构成特定研究问题的结论。

These figures were produced by StatM 1.0.5 using the bundled Advertising (200 observations) and Iris (150 observations) datasets, with white plotting backgrounds. They demonstrate analysis and export workflows, rather than establish a research conclusion.

## 线性回归诊断 / Linear regression diagnostics

1. 在首页打开 Advertising 示例，进入“分析 → 线性回归”。
2. 选择 TV、radio、newspaper 为自变量，sales 为因变量，运行分析。
3. 查看系数表、置信区间、拟合指标、残差与正态 Q–Q 图。
4. 在图表工具栏导出 PNG 或 SVG；参数与结果可在历史中恢复。

Open Advertising, select TV/radio/newspaper as predictors and sales as the response, then run OLS. Review coefficients and diagnostics before interpreting the model. The residual pattern below is a reason to examine model assumptions; it is not proof of a valid fit.

![StatM 回归诊断图组 / Regression diagnostics](assets/regression-diagnostics.png)

## 三维数据探索 / Interactive 3D exploration

在“绘图”中选择三维散点图，以 sepal_length、sepal_width、petal_length 为三个坐标变量，按 species 分组。拖动旋转、滚轮缩放，比较变量关系；可切换图表背景并导出当前视角 PNG。

Use sepal_length, sepal_width and petal_length as the three axes, grouped by species. Rotate and zoom to inspect the observations, switch the chart background, and export the current view as PNG. Two-dimensional companion figures support SVG export.

![StatM 三维散点图 / StatM interactive 3D scatter plot](assets/exploration-3d.png)

## 从数据到结果 / From data to results

导入 CSV/Excel → 检查字段与缺失值 → 选择描述统计、相关、检验、回归或 PCA → 查看结果与诊断 → 导出图表和分析脚本 → 保存项目与历史。

Import CSV/Excel → inspect fields and missing values → select statistics, correlation, tests, regression or PCA → review results and diagnostics → export figures and analysis scripts → retain the project and history locally.

如果这些功能对你有帮助，欢迎为 [StatM](https://github.com/Lewis-18/StatM) 点 Star。问题与建议请通过 [Issues](https://github.com/Lewis-18/StatM/issues) 提交。

