# StatM 1.2.0

中文 · [English](RELEASE-NOTES.en.md)

在本地工作空间中检查数据质量、导出科研统计表格，并保留可复现的分析记录。

## 本版内容

- **数据质量检查**：完整数据的缺失、重复与 IQR 提示，可配置字段规则并定位问题记录。
- **科研统计表格**：覆盖描述统计、相关、检验、回归和 PCA，支持 2–6 位小数及可编辑 Word、LaTeX、HTML 和桌面 PDF。
- **清洗与版本记录**：查看父数据、操作与实际填补值；恢复参数后在后续版本上保存独立分析。
- **可复现分析包**：保存数据、参数、结果、数值源码快照、依赖版本和图表配置，提供 Python 重算与校验清单。

*界面截图为含语言显示修正的本地 1.2.0 预览；已发布安装包未更新。*

![数据质量检查与问题定位](https://raw.githubusercontent.com/Lewis-18/StatM/main/assets/v1.2.0/data-quality.png)

![Advertising 科研相关表格的实际 PDF 导出](https://raw.githubusercontent.com/Lewis-18/StatM/main/assets/v1.2.0/correlation-export.png)

![实际回归重算结果与分析包结构](https://raw.githubusercontent.com/Lewis-18/StatM/main/assets/v1.2.0/reproduction-check.svg)

## 下载与使用

下载 [StatM-Setup-1.2.0-x64.exe](https://github.com/Lewis-18/StatM/releases/download/v1.2.0/StatM-Setup-1.2.0-x64.exe)，关闭应用后安装到原目录。安装包内置运行环境，核心功能可离线使用；已有项目、数据和分析记录沿用。

正常使用无需安装 Python/Node.js；在应用外运行复现脚本需要包内列明的 Python 与依赖。质量提示不自动修改数据；复现比较统计和图表数值，不承诺逐像素一致。安装包未签名，发布页提供 SHA256SUMS.txt。

[使用指南](USER-GUIDE.md) · [图文示例与下载样例](EXAMPLES.md) · [问题反馈](https://github.com/Lewis-18/StatM/issues)

© 2026 Jackson Lewis. StatM.

