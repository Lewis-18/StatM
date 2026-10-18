# 示例文件

中文 · [English](README.en.md)

[图文操作步骤](../EXAMPLES.md) · [应用首页](../README.md)

新增 [1.3.0 示例](../EXAMPLES.md) 使用 36 行合成数据，提供 [Excel 工作簿](v1.3.0/methods-workbook.xlsx)、[事后比较表格](v1.3.0/posthoc.pdf)、[估计图](v1.3.0/estimation.pdf) 和 [组合图](v1.3.0/four-panel.pdf)。

以下既有表格和图表文件由 StatM 1.2.0 实际导出。Word 为可编辑表格，LaTeX 文件使用 XeLaTeX 编译；PDF 可直接查看。英文 PCA 样例文件名带 -en。

| 示例 | 文件 |
| --- | --- |
| Advertising 相关分析 | [Word](advertising-correlation.docx) · [LaTeX](advertising-correlation.tex) · [HTML](advertising-correlation.html) · [PDF](advertising-correlation.pdf) |
| Advertising 回归 | [Word](advertising-regression.docx) · [PDF](advertising-regression.pdf) · [对照 CSV](advertising-comparison.csv) |
| Iris PCA | [Word](iris-pca.docx) · [LaTeX](iris-pca.tex) · [HTML](iris-pca.html) · [PDF](iris-pca.pdf) |
| 英文 Iris PCA | [Word](iris-pca-en.docx) · [LaTeX](iris-pca-en.tex) · [HTML](iris-pca-en.html) · [PDF](iris-pca-en.pdf) |
| 残差图 | [SVG](regression-residuals.svg) · [PDF](regression-residuals.pdf) |
| 数据质量教程 | [演示 CSV](iris-quality-demo.csv) · [实际检查报告](iris-quality-report.json) |
| 回归复现 | [实际重算一致性结果](advertising-reproduction-check.json) |

## 数据与修改说明

质量教程使用应用内置 Iris 的副本，共 151 行。按原始顺序：清空第 1 行 sepal_length，将第 5 行 species 改为 unknown，将第 26 行 petal_length 改为 20，并追加原第 150 行。修改仅用于演示检查与清洗，不能作为原始 Iris 的研究数据。

Iris 来源：Fisher, R. (1936), [UCI Machine Learning Repository](https://archive.ics.uci.edu/dataset/53/iris)，DOI 10.24432/C56C76，CC BY 4.0。此处使用 StatM 内置副本的字段与行顺序，已明确列出教学修改。

Advertising 使用 StatM 内置的 ISL 教学数据。仅提供应用计算的示例成果，数据可在应用首页加载。示例用于说明操作与诊断，不代表广告投入与销量的因果关系。

导出文件中的数据版本标识和运行时间用于对应实际分析记录。公开重算结果只展示数值检查，个人分析包仍应按完整数据的共享范围保管。
