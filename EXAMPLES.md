# StatM 功能实例 / Worked examples

[下载安装包 / Download](https://github.com/Lewis-18/StatM/releases/latest) · [中文介绍](README.md) · [English overview](README.en.md)

这里用内置 Advertising（200 条观测）与 Iris（150 条观测）数据展示 StatM 1.0.8 的分析和绘图操作。你可以按下面的步骤在应用中重现这些示例，并导出白色背景的图表。

Use the bundled Advertising (200 observations) and Iris (150 observations) datasets to try these analysis and plotting workflows in StatM 1.0.8. Follow the steps below to reproduce the examples and export figures with white backgrounds.

## 线性回归诊断 / Linear regression diagnostics

1. 在首页打开 Advertising 示例，进入“分析 → 线性回归”。
2. 选择 TV、radio、newspaper 为自变量，sales 为因变量，运行分析。
3. 查看系数表、置信区间、拟合指标、残差与正态 Q–Q 图。
4. 在图表工具栏导出 PNG 或 SVG；参数与结果可在历史中恢复。

Open Advertising, select TV/radio/newspaper as predictors and sales as the response, then run OLS. Review coefficients and diagnostics before interpreting the model. Use the residual and Q–Q plots to check model assumptions when interpreting the results.

![StatM 回归诊断图组 / Regression diagnostics](assets/regression-diagnostics.png)

## 三维数据探索 / Interactive 3D exploration

在“绘图”中选择三维散点图，以 sepal_length、sepal_width、petal_length 为三个坐标变量，按 species 分组。拖动旋转、滚轮缩放，比较变量关系；可切换图表背景并导出当前视角 PNG。

Use sepal_length, sepal_width and petal_length as the three axes, grouped by species. Rotate and zoom to inspect the observations, switch the chart background, and export the current view as PNG. Two-dimensional companion figures support SVG export.

![StatM 三维散点图 / StatM interactive 3D scatter plot](assets/exploration-3d.png)

## 从数据到结果 / From data to results

导入 CSV/TXT/Excel → 检查字段与缺失值 → 选择描述统计、相关、检验、回归或 PCA → 查看结果与诊断 → 导出图表和分析脚本 → 保存项目与历史。

Import CSV/TXT/Excel → inspect fields and missing values → select statistics, correlation, tests, regression or PCA → review results and diagnostics → export figures and analysis scripts → retain the project and history locally.

如果这些功能对你有帮助，欢迎为 [StatM](https://github.com/Lewis-18/StatM) 点 Star。问题与建议请通过 [Issues](https://github.com/Lewis-18/StatM/issues) 提交。

