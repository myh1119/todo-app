# Todo App 增强版 — 设计规格

## 概述

在现有纯前端 Todo App 基础上，升级 UI 为毛玻璃风格 + 简洁风，并新增 6 项功能增强。纯前端单页应用，打开即用，无构建依赖。

## 技术栈

- HTML5
- CSS3（自定义属性、Flexbox、`backdrop-filter`、动画）
- Vanilla JavaScript（ES6+）
- HTML5 Drag & Drop API

## UI 风格：毛玻璃 + 简洁

| 元素 | 规格 |
|------|------|
| 背景 | 紫蓝渐变（`linear-gradient(135deg, #667eea 0%, #764ba2 100%)`） |
| 卡片背景 | 半透明白色（`rgba(255,255,255,0.15)`） |
| 毛玻璃 | `backdrop-filter: blur(20px)` + `-webkit-backdrop-filter` |
| 边框 | `border: 1px solid rgba(255,255,255,0.18)` |
| 阴影 | 大阴影 `box-shadow: 0 8px 32px rgba(0,0,0,0.1)` |
| 圆角 | 大圆角 `border-radius: 16px` |
| 文字 | 白色为主，半透明次级文字 |
| 输入框 | 半透明背景，聚焦时加亮边框 |
| 按钮 | 半透明背景 + hover 加亮，主按钮用品牌色 |
| 复选框 | 自定义圆形样式，选中时填充绿 |
| 删除按钮 | hover 时变红背景 |
| 动画 | 列表项 `slideIn` / `slideOut`、主题切换过渡 `0.3s ease` |
| 字体 | 系统字体栈，中文回退 Noto Sans SC |

## 深色/浅色主题

- 所有颜色值通过 CSS 自定义属性（`--color-*`）定义
- 在 `:root` 中定义浅色主题，`[data-theme="dark"]` 中定义深色主题
- 切换时添加 `transition: background-color 0.3s, color 0.3s`
- 偏好存入 `localStorage.theme`
- 页面加载时检查 `localStorage.theme`，若无则跟随系统 `prefers-color-scheme`
- 切换按钮用 🌙/☀️ 图标

## 功能规格

### 1. localStorage 持久化

- 数据变更后自动调用 `saveToStorage()`，存储 key: `todoApp`
- 存储结构:
  ```json
  {
    "todos": [...],
    "nextId": 5,
    "categories": ["工作","学习","个人","其他"]
  }
  ```
- 页面加载时 `loadFromStorage()` 恢复数据，若无数据则使用默认空状态
- 深色主题偏好单独存于 `localStorage.theme`

### 2. 深色/浅色主题切换

- 页面右上角放置主题切换按钮
- 通过切换 `document.documentElement.dataset.theme` 实现
- CSS 自定义属性在 `:root` 和 `[data-theme="dark"]` 中各定义一套
- 深色主题配色：深色背景（`#1a1a2e`） + 半透明浅色卡片 + 白色文字

### 3. 拖拽排序

- 每个 `.todo-item` 左侧增加拖拽手柄 `⠿` 或 `≡`
- 使用 HTML5 Drag & Drop API:
  - `dragstart`: 添加 `.dragging` 类，记录拖拽源
  - `dragover`: `e.preventDefault()`，在目标位置插入占位指示线
  - `drop`: 交换位置，更新 `todos` 数组，重新渲染
  - `dragend`: 移除 `.dragging` 类
- 拖拽时源项半透明，目标位置显示虚线占位
- 拖拽完成后自动保存到 localStorage

### 4. 任务分类/标签

- 预设 4 个分类：`工作`（蓝）、`学习`（绿）、`个人`（紫）、`其他`（灰）
- 添加任务时增加分类选择器（下拉或按钮组）
- 每个任务项上以彩色圆点/标签显示分类
- 筛选栏扩展：增加分类筛选按钮组，可选择按分类过滤
- 支持"全部"重置筛选

### 5. 搜索功能

- 输入框区域增加搜索图标/切换按钮，点击展开搜索框
- 或者直接在工具栏增加搜索输入框
- 输入即搜索（`input` 事件），无防抖需求（数据量小）
- 匹配任务文本和分类名，不区分大小写

### 6. 数据导入/导出

- 工具栏增加导入/导出按钮（图标: ⬇/⬆）
- **导出**: 调用 `exportData()` → 生成 `todos.json` → 触发 `<a download>` 下载
- **导入**: 调用 `importData()` → `<input type="file" accept=".json">` → 读取 → 校验格式（必须有 `todos` 数组和 `nextId` 数字） → 覆盖当前数据 → 渲染
- 导入前弹出确认对话框，防止误覆盖

## 文件结构

```
todo-app/
├── index.html      (主页面，引入所有功能)
├── style.css       (全部样式，含双主题)
├── script.js       (全部逻辑)
├── README.md       (更新文档)
└── .gitignore
```

## 未变更的设计

- 原功能全部保留：添加、删除、标记完成、双击编辑、筛选按钮、键盘快捷键 `Ctrl+Shift+A`
- 响应式设计保留并增强（移动端适配毛玻璃效果）
- 无外部依赖，无需构建工具

## 限制

- 数据仅存于浏览器 localStorage，清除浏览器数据会导致丢失（导入导出可备份）
- 拖拽排序不支持触屏设备（可用双击编辑替代）
