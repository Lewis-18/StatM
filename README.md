<p align="center"><img src="assets/statm-mark.svg" width="88" alt="StatM"></p>

# StatM

**让数据，抵达洞见。**

StatM 是面向学习与科研的 Windows 桌面统计分析与科学可视化应用。它将数据管理、统计计算、科研绘图和分析记录整合在同一个工作空间，帮助用户完成从原始数据到研究结果的分析过程。

**版本：1.0.0** · **平台：Windows x64** · **维护者：Jackson Lewis**

[下载安装包](https://github.com/Lewis-18/StatM/releases/download/v1.0.0/StatM-Setup-1.0.0-x64.exe) · [版本发布](https://github.com/Lewis-18/StatM/releases/latest) · [使用指南](USER-GUIDE.md) · [问题反馈](https://github.com/Lewis-18/StatM/issues)

![StatM 深色工作台](assets/home-dark.png)

## 主要功能

| 功能 | 内容 |
| --- | --- |
| 数据管理 | 导入 CSV、XLSX、XLS；数据预览、搜索、排序、字段筛选与类型检查；缺失值处理及去重，生成新的清洗数据版本。 |
| 描述统计 | 样本量、均值、标准差、分位数、偏度、峰度等指标；直方图、箱线图、密度图、ECDF 与正态 Q–Q 图。 |
| 相关分析 | Pearson、Spearman、Kendall 相关系数与显著性结果；相关热图和散点矩阵。 |
| 假设检验 | 单样本、独立样本及配对 t 检验；Wilcoxon、Mann–Whitney U、卡方、单因素 ANOVA 与 Kruskal–Wallis。 |
| 线性回归 | OLS 系数、置信区间与拟合指标；残差、Q–Q、Cook 距离等诊断图，提供 VIF 与模型假设检查。 |
| 主成分分析 | 中心化与标准化、解释方差、碎石图、样本得分图及载荷图。 |
| 科学可视化 | 三维散点、气泡、平行坐标、散点矩阵、分组箱线与类别频数图；独立图表背景和科研导出预设。 |
| 项目与历史 | 本地保存项目、数据集、参数草稿、分析结果和图表；支持恢复参数、复制记录和重新分析。 |
| 结果导出 | 统计表 CSV、结果 JSON、二维图表 PNG/SVG、三维当前视角 PNG，以及 Python/R 分析脚本。 |

## 本地运行，连续工作

核心计算与项目数据保留在用户电脑上。安装包内置运行环境，无需另行安装 Python 或 Node.js，断网时也可使用数据导入、统计分析与图表导出。版本检查通过 GitHub 获取发布信息。

工作台支持深色与浅色主题、可调整宽度的分析面板、变量搜索和快捷导航。首页提供数据导入、常用统计任务、最近项目与继续分析入口；参数草稿与分析历史可在重新启动后恢复。

![StatM 浅色工作台](assets/home-light.png)

*界面预览使用示例工作空间。*

## 下载与安装

1. 下载 [StatM 1.0.0 Windows x64 安装包](https://github.com/Lewis-18/StatM/releases/download/v1.0.0/StatM-Setup-1.0.0-x64.exe)。
2. 运行安装程序并选择安装目录。
3. 启动 StatM，创建项目后导入数据或打开内置示例。

安装与更新前请关闭正在运行的应用。发布页提供 SHA-256 校验文件；当前安装包未进行数字签名，Windows 可能显示发布者提示。

更多操作见 [使用指南](USER-GUIDE.md)，版本变化见 [更新记录](CHANGELOG.md)。

## 反馈与建议

欢迎通过 [Issues](https://github.com/Lewis-18/StatM/issues) 提交使用问题和功能建议。请提供版本、操作步骤与脱敏截图，以便定位问题。

© 2026 Jackson Lewis. StatM.
