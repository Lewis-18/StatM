# StatM 开放组件

我将 StatM 的变量选择和图表背景辅助组件开放在这里，供你在自己的项目中使用或改进。代码采用 [MIT 许可](LICENSE)，适用范围见 [组件与许可说明](../OPEN-SOURCE-SCOPE.md)。

## 内容

- `src/variable-picker.tsx` 与同目录 CSS：可搜索的变量多选弹窗、长名称、缺失数量、数量约束、选择顺序、取消与确认；Radix 提供焦点锁定、Esc 与关闭后的焦点恢复。
- `src/chart-background.ts`：每张图独立保存背景偏好，在多个组件间订阅主题和偏好变化。只负责背景选择，不包含完整图表渲染器。
- `examples/variable-picker.tsx`：带明确演示字段的最小 React 用例。

## 在 React / Next.js 中使用

在已有 React 19 项目安装 `@radix-ui/react-dialog` 和 `lucide-react`，复制 `src/` 与 `examples/`。项目需要支持 TypeScript 和 CSS 导入；Next.js App Router 可以直接使用。组件无 StatM API、数据库或统计引擎依赖。

```shell
npm install @radix-ui/react-dialog lucide-react
```

把示例组件导入自己的客户端页面即可运行。变量字段需要 `name`、`type`、`missing` 三项；`value` 保持选择顺序，`onChange` 只在确认时调用。`max` 限制选择数量，`roles` 可为 `['X', 'Y', 'Z']` 或 `['X', 'Y', '面积']`；`translate` 只翻译界面文案，不修改用户变量名。

CSS 使用 `--panel`、`--input`、`--text`、`--muted`、`--accent`、`--accent-ink`、`--border`、`--hover` 主题变量；未提供时有深色默认值。`--accent-ink` 是主按钮文字色，需与主题强调色配对。

欢迎通过 Pull Request 提交组件改进。提交前请检查搜索、取消、选择上限、排序、键盘操作，以及桌面和窄屏布局。具体步骤见 [贡献指南](../CONTRIBUTING.md)。
