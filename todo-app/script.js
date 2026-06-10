// ========== 状态 ==========
let todos = [];
let currentFilter = "all";
let nextId = 1;
let editingId = null;
let draggedId = null;
let currentCategory = "all";
let searchQuery = "";
const STORAGE_KEY = "todoApp";

// ========== DOM 引用 ==========
const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const emptyState = document.getElementById("empty-state");
const itemCount = document.getElementById("item-count");
const filterBtns = document.querySelectorAll(".filter-btn");
const clearCompletedBtn = document.getElementById("clear-completed");
const categorySelect = document.getElementById("category-select");
const themeToggle = document.getElementById("theme-toggle");
const searchInput = document.getElementById("search-input");
const exportBtn = document.getElementById("export-btn");
const importBtn = document.getElementById("import-btn");
const fileInput = document.getElementById("file-input");
const catFilterBtns = document.querySelectorAll(".cat-filter");

// ========== localStorage 持久化 ==========
function saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ todos, nextId }));
}

function loadFromStorage() {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (data && Array.isArray(data.todos)) {
        todos = data.todos;
        nextId = data.nextId || Math.max(0, ...todos.map((t) => t.id)) + 1;
    }
}

// ========== 核心操作 ==========
function addTodo(text) {
    const trimmed = text.trim();
    if (!trimmed) return;

    const category = categorySelect.value;

    todos.push({
        id: nextId++,
        text: trimmed,
        completed: false,
        category: category,
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
        if (todo) {
            todo.text = newText;
            saveToStorage();
        }
    }

    item.classList.remove("editing");
    editingId = null;
    render();
}

function cancelEdit() {
    if (editingId === null) return;
    const item = document.querySelector(`[data-id="${editingId}"]`);
    if (item) item.classList.remove("editing");
    editingId = null;
}

// ========== 筛选 ==========
function setFilter(filter) {
    currentFilter = filter;
    filterBtns.forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.filter === filter);
    });
    render();
}

function getFilteredTodos() {
    let filtered = [...todos];

    // 分类筛选
    if (currentCategory !== "all") {
        filtered = filtered.filter((t) => t.category === currentCategory);
    }

    // 搜索筛选
    if (searchQuery) {
        filtered = filtered.filter(
            (t) =>
                t.text.toLowerCase().includes(searchQuery) ||
                (t.category && t.category.toLowerCase().includes(searchQuery))
        );
    }

    // 状态筛选
    switch (currentFilter) {
        case "active":
            filtered = filtered.filter((t) => !t.completed);
            break;
        case "completed":
            filtered = filtered.filter((t) => t.completed);
            break;
    }

    return filtered;
}

// ========== 分类筛选 ==========
function setCategoryFilter(cat) {
    currentCategory = cat;
    catFilterBtns.forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.cat === cat);
    });
    render();
}

// ========== 搜索功能 ==========
function setSearch(query) {
    searchQuery = query.trim().toLowerCase();
    render();
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
    document.querySelectorAll(".todo-item").forEach((el) => el.classList.remove("drag-over"));
    draggedId = null;
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    const item = e.currentTarget.closest(".todo-item");
    if (item && Number(item.dataset.id) !== draggedId) {
        document.querySelectorAll(".todo-item").forEach((el) => el.classList.remove("drag-over"));
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
    const fromIndex = todos.findIndex((t) => t.id === draggedId);
    const toIndex = todos.findIndex((t) => t.id === targetId);
    if (fromIndex !== -1 && toIndex !== -1) {
        const [moved] = todos.splice(fromIndex, 1);
        todos.splice(toIndex, 0, moved);
        saveToStorage();
        render();
    }
}

// ========== 主题切换 ==========
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

// ========== 数据导入/导出 ==========
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

// ========== 工具函数 ==========
function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
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

// ========== 事件绑定 ==========
form.addEventListener("submit", (e) => {
    e.preventDefault();
    addTodo(input.value);
});

filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => setFilter(btn.dataset.filter));
});

clearCompletedBtn.addEventListener("click", clearCompleted);

// 主题切换
themeToggle.addEventListener("click", toggleTheme);

// 搜索
searchInput.addEventListener("input", (e) => {
    setSearch(e.target.value);
});

// 导出
exportBtn.addEventListener("click", exportData);

// 导入
importBtn.addEventListener("click", () => {
    fileInput.click();
});
fileInput.addEventListener("change", (e) => {
    if (e.target.files.length > 0) {
        importData(e.target.files[0]);
        fileInput.value = "";
    }
});

// 分类筛选
catFilterBtns.forEach((btn) => {
    btn.addEventListener("click", () => setCategoryFilter(btn.dataset.cat));
});

// 全局点击取消编辑
document.addEventListener("click", (e) => {
    if (editingId !== null && !e.target.closest(".todo-item.editing")) {
        cancelEdit();
    }
});

// ========== 键盘快捷键 ==========
document.addEventListener("keydown", (e) => {
    // Ctrl+Shift+A 新增任务
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "a") {
        e.preventDefault();
        input.focus();
    }
});

// ========== 初始渲染 ==========
loadFromStorage();
const theme = getPreferredTheme();
setTheme(theme);
render();
