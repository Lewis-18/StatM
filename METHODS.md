# StatM 1.4.6 方法与验证

信度分析使用原始题分 Cronbach’s α、Feldt 区间、校正题总相关与删除题项后的 α。所有诊断使用同一批完整案例；反向题显式指定上下限，不自动反向或删题。数值与 [Pingouin 官方实现](https://pingouin-stats.org/generated/pingouin.cronbach_alpha.html) 对照，区间保留完整精度。

EFA 使用 [scikit-learn FactorAnalysis](https://scikit-learn.org/stable/modules/generated/sklearn.decomposition.FactorAnalysis.html) 的高斯最大似然公共因子模型与确定性 LAPACK 求解，支持不旋转和正交 Varimax。按样本标准差标准化，并将 ML 的总体分母尺度换回样本相关矩阵尺度。提供 KMO、Bartlett、共同度、独特方差及相关特征值的置换平行分析；因子数由用户指定，平行分析不自动选模型。平行分析使用 100 次逐列置换、95% 分位、seed 937，超过 5000 行时固定抽取 5000 行；模型拟合使用全部完整案例。相关矩阵奇异、模型欠识别或不收敛时停止。此实现不是 PCA、CFA 或多分相关分析。

批次对比逐字段记录两批有效样本量和缺失率。数值使用原单位的 [SciPy Wasserstein-1](https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.wasserstein_distance.html)，类别使用总变差距离，不计算独立样本检验 p 值，不对不同量纲的距离排名。字典中已知单位或编码冲突会阻止比较；未完整记录的单位由用户明确确认并在结果提示。数值图按两批合并范围共用分箱，纵轴为各自有效样本中的占比。

散点图与直方图的分面共用轴范围，直方图共用完整数据等宽分箱。散点图每组最多显示 2000 个固定种子抽样记录，避免少数组从全局抽样中消失。保存、组合、SVG、PNG、PDF 与复现包均保留分面数据。

自动化数值验证覆盖反向计分与缺失口径、Feldt 区间、两因子合成模型恢复、旋转前后公共协方差不变、奇异矩阵与欠识别拒绝、分箱计数及小组保留、距离与语义冲突、API 历史重跑和独立复现包重算。最终运行记录随本地交付包提供。

统计工作流参考：Kassis, T., Agarwal, V., He, Y., Patel, D., & Brueckner, A. M. (2026). *Scientific Agent Skills: A Library of Procedural Knowledge for Research Agents*. [arXiv:2609.00065](https://doi.org/10.48550/arXiv.2609.00065)。该参考用于工作流检查，不代替以上计算方法文档。


## 1.4.5 界面与导出验证

统计方法沿用 1.4.0。新增验证包括：默认白底导出不受应用主题影响、显式黑底的完整深色配色、90mm 长标题和 SVG 文字边界、300 DPI 元数据、PDF 物理宽度、关联页面最小留白及窄容器单栏、变量排序与取消确认，以及固定环境截图比较。所有示例使用独立合成数据；本机测试不等同于干净虚拟机安装验收。


## 1.4.6 排版与科研导出改进

验证：132 项后端测试、38 项桌面与图表专项检查、37 项离线引擎检查、21 项桌面回归通过；19 张实际桌面截图基准比较通过。四类复现包独立重跑数值差异为 0，安装包 1986 个文件与受测程序一致。已检查 SVG、PNG 和六份矢量 PDF，包括 90/180mm 物理宽度。验证基于当前 Windows 电脑，未运行全新虚拟机安装验收；R 参考代码未独立执行。
