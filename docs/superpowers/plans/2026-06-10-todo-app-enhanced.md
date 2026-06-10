# Todo App 增强版 — 实现计划

> **面向 AI 代理的工作者：** 必需技能：使用 subagent-driven-development（推荐）或 executing-plans 逐任务实现此计划。步骤使用复选框（`- [ ]`）语法来跟踪进度。

**目标：** 将现有 todo 应用 UI 升级为毛玻璃风格，并新增 6 项功能：持久化、深色主题、拖拽排序、分类标签、搜索、导入导出。

**架构：** 纯前端单页应用（单一 HTML/CSS/JS 文件组），所有数据在浏览器 localStorage 中，无需构建工具。

**技术栈：** HTML5 + CSS3（自定义属性、backdrop-filter） + Vanilla JS（ES6+） + Drag & Drop API

---

### 任务 1：HTML 结构增强

**文件：** 修改 `todo-app/index.html`

向现有 HTML 中**追加以下新元素**（不要破坏原有结构）：

- **主题切换按钮** — 在 header 区右上角
- **搜索框** — 在 toolbar 区域，输入框前
- **分类选择器** — 在添加任务表单中，输入框旁边
- **拖拽手柄** — 在每个 todo-item 最左侧
- **分类标签** — 在每个 todo-item 中，文字前面
- **导入/导出按钮** — 在 toolbar 区域
- **分类筛选按钮组** — 在 toolbar 中已有筛选按钮旁边

- [ ] **步骤 1：改写 index.html**

**变更内容：**

```diff
- 在 header 中增加主题切换按钮 <button id="theme-toggle">🌙</button>
- form 中增加分类选择 <select id="category-select"> 含4个分类
- toolbar 中增加搜索输入框 <input id="search-input" placeholder="搜索任务...">
- toolbar 中增加分类筛选按钮组 <div class="filter-categories">
- toolbar 中增加导入/导出按钮
- 每个 todo-item 模板增加拖拽手柄 <span class="drag-handle">⠿</span>
- 每个 todo-item 模板增加分类标签 <span class="category-badge">
```

完整新 HTML 结构（保留原有语义）：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Todo App</title>
    <link rel="stylesheet" href="style.css" />
</head>
<body>
    <div class="container">
        <header>
            <div class="header-top">
                <div>
                    <h1>Todo</h1>
                    <p class="subtitle">管理你的任务清单</p>
                </div>
                <button id="theme-toggle" class="theme-btn" title="切换主题">🌙</button>
            </div>
        </header>

        <main>
            <!-- 输入区域 -->
            <form id="todo-form" class="input-group">
                <select id="category-select" class="category-select">
                    <option value="工作">💼 工作</option>
                    <option value="学习">📚 学习</option>
                    <option value="个人">❤️ 个人</option>
                    <option value="其他" selected>📌 其他</option>
                </select>
                <input
                    type="text"
                    id="todo-input"
                    placeholder="添加一个新任务..."
                    autocomplete="off"
                    required
                />
                <button type="submit" id="add-btn">添加</button>
            </form>

            <!-- 工具栏 -->
            <div class="toolbar">
                <div class="toolbar-row">
                    <span id="item-count">0 项待办</span>
                    <div class="toolbar-actions">
                        <button id="export-btn" class="icon-btn" title="导出数据">⬇</button>
                        <button id="import-btn" class="icon-btn" title="导入数据">⬆</button>
                    </div>
                </div>
                <div class="toolbar-row">
                    <input type="text" id="search-input" placeholder="🔍 搜索任务..." class="search-input" />
                </div>
                <div class="toolbar-row">
                    <div class="filters">
                        <button class="filter-btn active" data-filter="all">全部</button>
                        <button class="filter-btn" data-filter="active">未完成</button>
                        <button class="filter-btn" data-filter="completed">已完成</button>
                    </div>
                    <div class="category-filters" id="category-filters">
                        <button class="cat-filter active" data-cat="all">全部</button>
                        <button class="cat-filter" data-cat="工作">💼 工作</button>
                        <button class="cat-filter" data-cat="学习">📚 学习</button>
                        <button class="cat-filter" data-cat="个人">❤️ 个人</button>
                        <button class="cat-filter" data-cat="其他">📌 其他</button>
                    </div>
                </div>
                <div class="toolbar-row">
                    <button id="clear-completed" class="clear-btn">清除已完成</button>
                </div>
            </div>

            <!-- 列表 -->
            <ul id="todo-list"></ul>

            <!-- 空状态 -->
            <div id="empty-state" class="empty-state">
                <span class="empty-icon">📋</span>
                <p>暂无任务，添加一个吧！</p>
            </div>
        </main>

        <footer>
            <p>双击任务可编辑 · 拖拽可排序 · 点击复选框标记完成</p>
        </footer>
    </div>

    <input type="file" id="file-input" accept=".json" style="display:none" />

    <script src="script.js"></script>
</body>
</html>
```

**验证：** 用浏览器打开 index.html，确认所有新元素可见、布局不乱。

- [ ] **步骤 2：Commit**

```bash
cd D:\Desktop\新建文件夹
git add todo-app/index.html
git commit -m 'feat: add new HTML elements for glassmorphism UI and new features'
```

---

### 任务 2：CSS 全面重写 — 毛玻璃 + 双主题

**文件：** 重写 `todo-app/style.css`

完整的 CSS 重写，将所有样式替换为：

- `:root` 浅色主题 CSS 变量
- `[data-theme="dark"]` 深色主题 CSS 变量
- 毛玻璃卡片效果（`backdrop-filter: blur(20px)`）
- 所有新元素的样式（拖拽手柄、分类标签、搜索框、主题按钮等）
- 拖拽状态的样式（`.dragging`、`.drag-over`）
- 动画（`slideIn`、`slideOut`、主题过渡）
- 响应式适配

- [ ] **步骤 3：重写 style.css**

完整 CSS 代码：

```css
/* ========== Reset & Base ========== */
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}

:root {
    /* 浅色主题 */
    --bg-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --card-bg: rgba(255, 255, 255, 0.15);
    --card-border: rgba(255, 255, 255, 0.18);
    --card-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    --text-primary: #ffffff;
    --text-secondary: rgba(255, 255, 255, 0.75);
    --text-muted: rgba(255, 255, 255, 0.5);
    --input-bg: rgba(255, 255, 255, 0.1);
    --input-border: rgba(255, 255, 255, 0.2);
    --input-focus: rgba(255, 255, 255, 0.3);
    --btn-primary-bg: rgba(255, 255, 255, 0.2);
    --btn-primary-hover: rgba(255, 255, 255, 0.3);
    --btn-text: #ffffff;
    --danger: #ff6b6b;
    --danger-hover: #ff4757;
    --success: #2ed573;
    --complete-bg: rgba(46, 213, 115, 0.15);
    --complete-border: rgba(46, 213, 115, 0.3);
    --cat-work: #54a0ff;
    --cat-study: #2ed573;
    --cat-personal: #a29bfe;
    --cat-other: #a4b0be;
    --radius: 16px;
    --radius-sm: 10px;
    --transition: 0.2s ease;
}

[data-theme="dark"] {
    --bg-gradient: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
    --card-bg: rgba(255, 255, 255, 0.08);
    --card-border: rgba(255, 255, 255, 0.1);
    --card-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    --text-primary: #e8e8e8;
    --text-secondary: rgba(232, 232, 232, 0.75);
    --text-muted: rgba(232, 232, 232, 0.45);
    --input-bg: rgba(255, 255, 255, 0.06);
    --input-border: rgba(255, 255, 255, 0.12);
    --input-focus: rgba(255, 255, 255, 0.2);
    --btn-primary-bg: rgba(255, 255, 255, 0.1);
    --cat-work: #74b9ff;
    --cat-study: #55efc4;
    --cat-personal: #b8a9ff;
}

html { transition: background 0.4s ease; }

body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans SC", sans-serif;
    background: var(--bg-gradient);
    color: var(--text-primary);
    line-height: 1.6;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    padding: 48px 16px;
    transition: background 0.4s ease;
}

/* ========== Layout ========== */
.container {
    width: 100%;
    max-width: 600px;
}

/* ========== Header ========== */
header { margin-bottom: 24px; }

.header-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
}

header h1 {
    font-size: 2.5rem;
    font-weight: 800;
    color: var(--text-primary);
    letter-spacing: -0.5px;
    text-shadow: 0 2px 10px rgba(0,0,0,0.15);
}

.subtitle {
    color: var(--text-secondary);
    font-size: 0.9rem;
    margin-top: 2px;
}

/* ========== Theme Toggle ========== */
.theme-btn {
    width: 40px;
    height: 40px;
    border: 1px solid var(--card-border);
    background: var(--card-bg);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-radius: 50%;
    font-size: 1.2rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all var(--transition);
    color: var(--text-primary);
}

.theme-btn:hover {
    background: var(--btn-primary-hover);
    transform: scale(1.1);
}

/* ========== Glass Card ========== */
.glass-card {
    background: var(--card-bg);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid var(--card-border);
    border-radius: var(--radius);
    box-shadow: var(--card-shadow);
}

/* ========== Input Area ========== */
.input-group {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
    background: var(--card-bg);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid var(--card-border);
    border-radius: var(--radius);
    box-shadow: var(--card-shadow);
    padding: 8px;
}

.category-select {
    padding: 10px 12px;
    border: 1px solid var(--input-border);
    border-radius: var(--radius-sm);
    font-size: 0.9rem;
    background: var(--input-bg);
    color: var(--text-primary);
    outline: none;
    cursor: pointer;
    transition: border-color var(--transition);
    appearance: none;
    -webkit-appearance: none;
    min-width: 80px;
}

.category-select option {
    background: #2d2d44;
    color: #fff;
}

.category-select:focus {
    border-color: var(--input-focus);
}

#todo-input {
    flex: 1;
    padding: 10px 16px;
    border: 1px solid var(--input-border);
    border-radius: var(--radius-sm);
    font-size: 0.95rem;
    background: var(--input-bg);
    color: var(--text-primary);
    outline: none;
    transition: border-color var(--transition);
}

#todo-input::placeholder { color: var(--text-muted); }

#todo-input:focus {
    border-color: var(--input-focus);
}

#add-btn {
    padding: 10px 22px;
    background: var(--btn-primary-bg);
    color: var(--btn-text);
    border: 1px solid var(--card-border);
    border-radius: var(--radius-sm);
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: all var(--transition);
    white-space: nowrap;
    backdrop-filter: blur(10px);
}

#add-btn:hover {
    background: var(--btn-primary-hover);
    transform: translateY(-1px);
}

#add-btn:active { transform: scale(0.97); }

/* ========== Search ========== */
.search-input {
    width: 100%;
    padding: 10px 16px;
    border: 1px solid var(--input-border);
    border-radius: var(--radius-sm);
    font-size: 0.9rem;
    background: var(--input-bg);
    color: var(--text-primary);
    outline: none;
    transition: all var(--transition);
}

.search-input::placeholder { color: var(--text-muted); }

.search-input:focus {
    border-color: var(--input-focus);
}

/* ========== Toolbar ========== */
.toolbar {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 16px;
    padding: 16px;
    background: var(--card-bg);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid var(--card-border);
    border-radius: var(--radius);
    box-shadow: var(--card-shadow);
}

.toolbar-row {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
}

#item-count {
    font-size: 0.85rem;
    color: var(--text-secondary);
    margin-right: auto;
}

.toolbar-actions {
    display: flex;
    gap: 4px;
}

.icon-btn {
    width: 34px;
    height: 34px;
    border: 1px solid var(--input-border);
    background: var(--input-bg);
    border-radius: var(--radius-sm);
    font-size: 1rem;
    color: var(--text-secondary);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all var(--transition);
}

.icon-btn:hover {
    background: var(--btn-primary-hover);
    color: var(--text-primary);
    border-color: var(--input-focus);
}

/* ========== Filter Buttons ========== */
.filters {
    display: flex;
    gap: 4px;
}

.filter-btn, .cat-filter {
    padding: 5px 12px;
    border: 1px solid transparent;
    background: transparent;
    border-radius: var(--radius-sm);
    font-size: 0.82rem;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all var(--transition);
}

.filter-btn.active, .cat-filter.active {
    background: rgba(255, 255, 255, 0.2);
    color: var(--text-primary);
    border-color: var(--card-border);
    font-weight: 600;
}

.filter-btn:hover:not(.active), .cat-filter:hover:not(.active) {
    background: rgba(255, 255, 255, 0.08);
    color: var(--text-primary);
}

.category-filters {
    display: flex;
    gap: 4px;
    flex-wrap: wrap;
}

.clear-btn {
    padding: 6px 16px;
    border: 1px solid var(--card-border);
    background: var(--input-bg);
    border-radius: var(--radius-sm);
    font-size: 0.82rem;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all var(--transition);
}

.clear-btn:hover {
    border-color: var(--danger);
    color: var(--danger);
    background: rgba(255, 107, 107, 0.1);
}

/* ========== Todo List ========== */
#todo-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.todo-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    background: var(--card-bg);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid var(--card-border);
    border-radius: var(--radius);
    box-shadow: var(--card-shadow);
    transition: all var(--transition);
    animation: slideIn 0.25s ease;
    cursor: default;
}

.todo-item:hover {
    border-color: rgba(255, 255, 255, 0.3);
    transform: translateY(-1px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

@keyframes slideIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
}

.todo-item.completed {
    background: var(--complete-bg);
    border-color: var(--complete-border);
}

.todo-item.completed .todo-text {
    text-decoration: line-through;
    color: var(--text-muted);
}

.todo-item.removing {
    animation: slideOut 0.2s ease forwards;
}

@keyframes slideOut {
    to { opacity: 0; transform: translateX(30px); }
}

/* ========== Drag Handle ========== */
.drag-handle {
    cursor: grab;
    color: var(--text-muted);
    font-size: 1.1rem;
    line-height: 1;
    user-select: none;
    padding: 4px 2px;
    flex-shrink: 0;
}

.drag-handle:active { cursor: grabbing; }

.todo-item.dragging {
    opacity: 0.5;
    transform: scale(0.98);
}

.todo-item.drag-over {
    border-color: rgba(255, 255, 255, 0.5);
    border-style: dashed;
}

/* ========== Category Badge ========== */
.category-badge {
    font-size: 0.72rem;
    padding: 2px 8px;
    border-radius: 20px;
    font-weight: 600;
    flex-shrink: 0;
    line-height: 1.4;
}

.category-badge.工作 { background: rgba(84, 160, 255, 0.2); color: var(--cat-work); }
.category-badge.学习 { background: rgba(46, 213, 115, 0.2); color: var(--cat-study); }
.category-badge.个人 { background: rgba(162, 155, 254, 0.2); color: var(--cat-personal); }
.category-badge.其他 { background: rgba(164, 176, 190, 0.2); color: var(--cat-other); }

/* ========== Checkbox ========== */
.checkbox {
    width: 22px;
    height: 22px;
    border: 2px solid var(--input-border);
    border-radius: 50%;
    cursor: pointer;
    flex-shrink: 0;
    background: transparent;
    appearance: none;
    -webkit-appearance: none;
    transition: all var(--transition);
    position: relative;
}

.checkbox:checked {
    background: var(--success);
    border-color: var(--success);
}

.checkbox:checked::after {
    content: "✓";
    color: #fff;
    font-size: 12px;
    font-weight: 700;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.checkbox:hover {
    border-color: rgba(255, 255, 255, 0.5);
}

/* ========== Todo Text ========== */
.todo-text {
    flex: 1;
    font-size: 0.95rem;
    word-break: break-word;
    padding: 2px 0;
    color: var(--text-primary);
}

.todo-item.editing .todo-text { display: none; }

.edit-input {
    flex: 1;
    padding: 6px 10px;
    border: 1px solid var(--input-focus);
    border-radius: 6px;
    font-size: 0.95rem;
    background: var(--input-bg);
    color: var(--text-primary);
    outline: none;
    display: none;
}

.todo-item.editing .edit-input { display: block; }

/* ========== Delete Button ========== */
.delete-btn {
    width: 32px;
    height: 32px;
    border: none;
    background: transparent;
    color: var(--text-muted);
    font-size: 1.1rem;
    cursor: pointer;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all var(--transition);
    flex-shrink: 0;
}

.delete-btn:hover {
    background: rgba(255, 107, 107, 0.15);
    color: var(--danger);
}

/* ========== Empty State ========== */
.empty-state {
    text-align: center;
    padding: 48px 16px;
    color: var(--text-muted);
    display: none;
}

.empty-state.show { display: block; }

.empty-icon {
    font-size: 3rem;
    display: block;
    margin-bottom: 12px;
}

.empty-state p { font-size: 1rem; }

/* ========== Footer ========== */
footer {
    text-align: center;
    margin-top: 32px;
    padding-top: 16px;
    border-top: 1px solid var(--card-border);
}

footer p {
    font-size: 0.78rem;
    color: var(--text-muted);
}

/* ========== Responsive ========== */
@media (max-width: 520px) {
    body { padding: 24px 12px; }
    header h1 { font-size: 2rem; }
    .input-group { flex-wrap: wrap; }
    .input-group .category-select { width: 100%; }
    .toolbar-row { flex-wrap: wrap; }
    .filters, .category-filters { justify-content: center; }
    #add-btn { padding: 10px 16px; }
}
```

**验证：** 打开浏览器，确认背景渐变显示、卡片毛玻璃效果、新元素样式正常。

- [ ] **步骤 4：Commit**

```bash
cd D:\Desktop\新建文件夹
git add todo-app/style.css
git commit -m 'feat: glassmorphism UI with dark/light theme support'
```

---

### 任务 3：JavaScript 核心逻辑重写

**文件：** 重写 `todo-app/script.js`

完整 JavaScript，包含全部功能：

- 基础 CRUD（保留原有）
- localStorage 持久化（自动保存/加载）
- 深色/浅色主题切换（CSS 变量 + localStorage）
- 拖拽排序（HTML5 Drag & Drop）
- 分类管理（添加时选分类、分类标签渲染、分类筛选）
- 搜索（实时过滤）
- 导入/导出（JSON 文件）

- [ ] **步骤 5：重写 script.js**

完整 JS 代码：

```javascript
// ========== 状态 ==========
let todos = [];
let currentFilter = "all";
let currentCategory = "all";
let nextId = 1;
let editingId = null;
let searchQuery = "";
let draggedId = null;

// ========== DOM 引用 ==========
const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const categorySelect = document.getElementById("category-select");
const list = document.getElementById("todo-list");
const emptyState = document.getElementById("empty-state");
const itemCount = document.getElementById("item-count");
const filterBtns = document.querySelectorAll(".filter-btn");
const catFilterBtns = document.querySelectorAll(".cat-filter");
const clearCompletedBtn = document.getElementById("clear-completed");
const themeToggle = document.getElementById("theme-toggle");
const searchInput = document.getElementById("search-input");
const exportBtn = document.getElementById("export-btn");
const importBtn = document.getElementById("import-btn");
const fileInput = document.getElementById("file-input");

// ========== 持久化 ==========
const STORAGE_KEY = "todoApp";

function saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
        todos,
        nextId,
    }));
}

function loadFromStorage() {
    try {
        const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (data && Array.isArray(data.todos)) {
            todos = data.todos;
            nextId = data.nextId || Math.max(0, ...todos.map(t => t.id)) + 1;
        }
    } catch (e) {
        // 数据损坏，使用默认空状态
    }
}

// ========== 主题 ==========
function getPreferredTheme() {
    const saved = localStorage.getItem("theme");
    if (saved) return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
    localStorage.setItem("theme", theme);
}

function toggleTheme() {
    const current = document.documentElement.dataset.theme || "light";
    setTheme(current === "dark" ? "light" : "dark");
}

// ========== 核心操作 ==========
function addTodo(text) {
    const trimmed = text.trim();
    if (!trimmed) return;

    todos.push({
        id: nextId++,
        text: trimmed,
        completed: false,
        category: categorySelect.value || "其他",
    });

    input.value = "";
    input.focus();
    saveToStorage();
    render();
}

function deleteTodo(id) {
    const item = document.querySelector(`[data-id="${id}"]`);
    if (item) {
        item.classList.add("removing");
        setTimeout(() => {
            todos = todos.filter((t) => t.id !== id);
            saveToStorage();
            render();
        }, 200);
        return;
    }
    todos = todos.filter((t) => t.id !== id);
    saveToStorage();
    render();
}

function toggleTodo(id) {
    const todo = todos.find((t) => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveToStorage();
        render();
    }
}

function clearCompleted() {
    const hasCompleted = todos.some((t) => t.completed);
    if (!hasCompleted) return;
    todos = todos.filter((t) => !t.completed);
    saveToStorage();
    render();
}

// ========== 编辑功能 ==========
function startEdit(id) {
    if (editingId !== null) cancelEdit();

    const item = document.querySelector(`[data-id="${id}"]`);
    if (!item) return;

    const todo = todos.find((t) => t.id === id);
    if (!todo || todo.completed) return;

    editingId = id;
    item.classList.add("editing");

    const editInput = item.querySelector(".edit-input");
    editInput.value = todo.text;
    editInput.focus();
    editInput.setSelectionRange(todo.text.length, todo.text.length);
}

function finishEdit(id) {
    const item = document.querySelector(`[data-id="${id}"]`);
    if (!item) return;

    const editInput = item.querySelector(".edit-input");
    const newText = editInput.value.trim();

    if (newText) {
        const todo = todos.find((t) => t.id === id);
        if (todo) todo.text = newText;
    }

    item.classList.remove("editing");
    editingId = null;
    saveToStorage();
    render();
}

function cancelEdit() {
    if (editingId === null) return;
    const item = document.querySelector(`[data-id="${editingId}"]`);
    if (item) item.classList.remove("editing");
    editingId = null;
}

// ========== 搜索 ==========
function setSearch(query) {
    searchQuery = query.trim().toLowerCase();
    render();
}

// ========== 筛选 ==========
function setFilter(filter) {
    currentFilter = filter;
    filterBtns.forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.filter === filter);
    });
    render();
}

function setCategoryFilter(cat) {
    currentCategory = cat;
    catFilterBtns.forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.cat === cat);
    });
    render();
}

function getFilteredTodos() {
    let result = [...todos];

    // 搜索过滤
    if (searchQuery) {
        result = result.filter(t =>
            t.text.toLowerCase().includes(searchQuery) ||
            t.category.toLowerCase().includes(searchQuery)
        );
    }

    // 状态筛选
    switch (currentFilter) {
        case "active":
            result = result.filter((t) => !t.completed);
            break;
        case "completed":
            result = result.filter((t) => t.completed);
            break;
    }

    // 分类筛选
    if (currentCategory !== "all") {
        result = result.filter((t) => t.category === currentCategory);
    }

    return result;
}

// ========== 拖拽排序 ==========
function handleDragStart(e) {
    draggedId = Number(e.currentTarget.dataset.id);
    e.currentTarget.classList.add("dragging");
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(draggedId));
}

function handleDragEnd(e) {
    e.currentTarget.classList.remove("dragging");
    document.querySelectorAll(".todo-item").forEach(el => el.classList.remove("drag-over"));
    draggedId = null;
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    const item = e.currentTarget.closest(".todo-item");
    if (item && Number(item.dataset.id) !== draggedId) {
        document.querySelectorAll(".todo-item").forEach(el => el.classList.remove("drag-over"));
        item.classList.add("drag-over");
    }
}

function handleDragLeave(e) {
    e.currentTarget.closest(".todo-item")?.classList.remove("drag-over");
}

function handleDrop(e) {
    e.preventDefault();
    const targetItem = e.currentTarget.closest(".todo-item");
    if (!targetItem) return;

    const targetId = Number(targetItem.dataset.id);
    if (targetId === draggedId) {
        targetItem.classList.remove("drag-over");
        return;
    }

    const fromIndex = todos.findIndex(t => t.id === draggedId);
    const toIndex = todos.findIndex(t => t.id === targetId);

    if (fromIndex !== -1 && toIndex !== -1) {
        const [moved] = todos.splice(fromIndex, 1);
        todos.splice(toIndex, 0, moved);
        saveToStorage();
        render();
    }
}

// ========== 导入导出 ==========
function exportData() {
    const data = JSON.stringify({ todos, nextId }, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `todos-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

function importData(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            if (!Array.isArray(data.todos) || typeof data.nextId !== "number") {
                alert("文件格式无效：缺少 todos 数组或 nextId");
                return;
            }
            if (!confirm("导入将覆盖当前所有数据，确定继续？")) return;
            todos = data.todos;
            nextId = data.nextId;
            saveToStorage();
            render();
            alert("导入成功！");
        } catch (err) {
            alert("文件解析失败，请检查文件格式");
        }
    };
    reader.readAsText(file);
}

// ========== 渲染 ==========
function render() {
    const filtered = getFilteredTodos();

    // 更新统计
    const activeCount = todos.filter((t) => !t.completed).length;
    itemCount.textContent = `${activeCount} 项待办`;

    // 空状态
    emptyState.classList.toggle("show", filtered.length === 0);

    // 清除已完成按钮
    const hasCompleted = todos.some((t) => t.completed);
    clearCompletedBtn.style.display = hasCompleted ? "inline-block" : "none";

    // 渲染列表
    list.innerHTML = filtered
        .map(
            (todo) => `
        <li class="todo-item ${todo.completed ? "completed" : ""}" data-id="${todo.id}" draggable="true">
            <span class="drag-handle" draggable="false">⠿</span>
            <input type="checkbox" class="checkbox" ${todo.completed ? "checked" : ""} />
            <span class="category-badge ${todo.category || "其他"}">${todo.category || "其他"}</span>
            <span class="todo-text">${escapeHtml(todo.text)}</span>
            <input type="text" class="edit-input" />
            <button class="delete-btn" title="删除">✕</button>
        </li>
        `
        )
        .join("");

    // 绑定事件
    list.querySelectorAll(".todo-item").forEach((item) => {
        const id = Number(item.dataset.id);

        // 拖拽事件
        item.addEventListener("dragstart", handleDragStart);
        item.addEventListener("dragend", handleDragEnd);
        item.addEventListener("dragover", handleDragOver);
        item.addEventListener("dragleave", handleDragLeave);
        item.addEventListener("drop", handleDrop);

        // 复选框
        const checkbox = item.querySelector(".checkbox");
        checkbox.addEventListener("change", () => toggleTodo(id));

        // 双击编辑
        const textSpan = item.querySelector(".todo-text");
        textSpan.addEventListener("dblclick", () => startEdit(id));

        // 编辑输入框
        const editInput = item.querySelector(".edit-input");
        editInput.addEventListener("blur", () => finishEdit(id));
        editInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") finishEdit(id);
            if (e.key === "Escape") cancelEdit();
        });

        // 删除按钮
        const deleteBtn = item.querySelector(".delete-btn");
        deleteBtn.addEventListener("click", () => deleteTodo(id));
    });
}

// ========== 工具函数 ==========
function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

// ========== 事件绑定 ==========
form.addEventListener("submit", (e) => {
    e.preventDefault();
    addTodo(input.value);
});

filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => setFilter(btn.dataset.filter));
});

catFilterBtns.forEach((btn) => {
    btn.addEventListener("click", () => setCategoryFilter(btn.dataset.cat));
});

clearCompletedBtn.addEventListener("click", clearCompleted);

themeToggle.addEventListener("click", toggleTheme);

searchInput.addEventListener("input", (e) => {
    setSearch(e.target.value);
});

exportBtn.addEventListener("click", exportData);

importBtn.addEventListener("click", () => {
    fileInput.click();
});

fileInput.addEventListener("change", (e) => {
    if (e.target.files.length > 0) {
        importData(e.target.files[0]);
        fileInput.value = "";
    }
});

// 全局点击取消编辑
document.addEventListener("click", (e) => {
    if (editingId !== null && !e.target.closest(".todo-item.editing")) {
        cancelEdit();
    }
});

// Ctrl+Shift+A 快捷键
document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "a") {
        e.preventDefault();
        input.focus();
    }
});

// ========== 初始化 ==========
loadFromStorage();
const theme = getPreferredTheme();
setTheme(theme);
render();
```

**验证：** 🔑 核心验证点 — 在浏览器中：
1. 添加任务 → 刷新页面 → 数据保留（持久化 OK）
2. 点击主题按钮 → 深色/浅色切换
3. 拖动任务 → 位置改变
4. 选择分类添加 → 任务显示彩色标签
5. 搜索输入 → 实时过滤
6. 导出 → 下载 JSON → 导入 → 数据恢复

- [ ] **步骤 6：Commit**

```bash
cd D:\Desktop\新建文件夹
git add todo-app/script.js
git commit -m 'feat: add persistence, drag-sort, categories, search, import/export'
```

---

### 任务 4：更新 README

**文件：** 修改 `todo-app/README.md`

- [ ] **步骤 7：更新 README.md**

替换 README 内容为新功能描述（更新功能列表、新增毛玻璃 UI 特点、操作说明）。

```markdown
# ✅ Todo App

一个毛玻璃风格、功能丰富的纯前端待办事项应用。

## 🎨 特色

- **毛玻璃 UI** — 渐变背景、半透明毛玻璃卡片、大圆角、平滑动画
- **深色/浅色主题** — 一键切换，自动跟随系统偏好
- **数据持久化** — 自动保存到浏览器，刷新不丢失

## ✨ 功能

- **添加任务** — 输入文字，选择分类，点击"添加"或按回车
- **标记完成** — 点击圆形复选框标记完成/未完成
- **删除任务** — 点击 ✕ 按钮，有滑出动画
- **双击编辑** — 双击任务文字进行编辑
- **拖拽排序** — 拖动 ⠿ 手柄调整任务顺序
- **任务分类** — 工作 / 学习 / 个人 / 其他，彩色标签标识
- **筛选视图** — 全部 / 未完成 / 已完成 / 按分类筛选
- **搜索功能** — 实时搜索，匹配任务文本和分类名
- **键盘快捷键** — `Ctrl+Shift+A` 快速聚焦输入框
- **导入/导出** — JSON 文件备份和恢复数据
- **响应式设计** — 桌面和移动端均适配

## 使用方法

直接用浏览器打开 `index.html` 即可使用，无需任何构建工具或服务器。

## 技术栈

- HTML5
- CSS3（自定义属性、Flexbox、backdrop-filter 毛玻璃、动画）
- Vanilla JavaScript（ES6+）

## 许可

MIT
```

**验证：** 确认 README 显示格式正确。

- [ ] **步骤 8：Commit**

```bash
cd D:\Desktop\新建文件夹
git add todo-app/README.md
git commit -m 'docs: update README with new features'
```

---

### 任务 5：Git 初始化 & 推送到 GitHub

**注意：** 需要用户提供 GitHub 仓库 URL

- [ ] **步骤 9：Git 初始化**

```bash
cd D:\Desktop\新建文件夹
git init
git add .
git commit -m 'feat: initial todo app with glassmorphism UI and enhanced features'
```

- [ ] **步骤 10：推送到 GitHub**

```bash
git remote add origin <用户提供的仓库URL>
git branch -M main
git push -u origin main
```

---

### 完整验证检查清单

所有步骤完成后，在浏览器中验证：

| # | 检查项 | 预期结果 |
|---|--------|----------|
| 1 | 页面打开 | 紫蓝渐变背景，毛玻璃卡片 |
| 2 | 添加任务 | 任务出现，有分类标签 |
| 3 | 刷新页面 | 数据保留 |
| 4 | 点击 🌙 | 切换深色主题 |
| 5 | 再次刷新 | 主题保留 |
| 6 | 拖动任务 ⠿ | 排序变更 |
| 7 | 搜索输入 | 实时过滤 |
| 8 | 分类筛选 | 只显示对应分类 |
| 9 | 导出 | 下载 JSON 文件 |
| 10 | 导入 | 数据恢复 |
| 11 | 复选框 | 标记完成/未完成 |
| 12 | 双击文字 | 编辑模式 |
| 13 | Ctrl+Shift+A | 聚焦输入框 |
| 14 | 清除已完成 | 清除完成项 |
