# StatM 1.1.0

这个版本改进了数据预览、分析结果对照、散点探索与图表导出。

- 优化数据预览，减少翻页、重复筛选与排序的等待。
- 新增历史结果对照，支持参数及统计结果差异筛选、CSV 导出。
- 新增散点框选与对应记录表联动，选择可保存和恢复。
- 二维及三维图新增 PDF 导出，保留现有 PNG / SVG 格式。
- 优化开机动画。

桌面版二维 PDF 保留矢量路径和文字；三维 PDF 导出当前视角的高分辨率位图。框选仅影响显示记录的选择，不改变原来的分析结果；图中最多显示 2000 条抽样记录。结果对照要求同一数据版本及同一分析方法，假设检验还须为同一检验类型；差值不构成显著性检验。

下载 **StatM-Setup-1.1.0-x64.exe**，关闭正在运行的 StatM 后安装到原目录。已有项目、数据与分析记录会沿用；安装包内置运行环境，核心功能可离线使用。

安装包未进行数字签名，Windows 可能显示发布者提示。发行页提供 **SHA256SUMS.txt** 用于校验下载完整性。

[使用指南](https://github.com/Lewis-18/StatM/blob/main/USER-GUIDE.md) · [功能实例](https://github.com/Lewis-18/StatM/blob/main/EXAMPLES.md) · [问题反馈](https://github.com/Lewis-18/StatM/issues)

© 2026 Jackson Lewis. StatM.
