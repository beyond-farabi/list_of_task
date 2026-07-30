const count = document.getElementById("task-count");

const input = document.getElementById("task-input");
const button = document.getElementById("add-button");
const list = document.getElementById("task-list")

const clearButton = document.getElementById("clear-button");

const toast = document.getElementById("toast");

let toastTimer;

let tasks = [];

let currentFilter = "all";

const filterButtons = document.querySelectorAll(".filter");

clearButton.addEventListener("click", function() {

    // guard: kalau kosong, keluar
    if (tasks.length === 0) return;

    // kosongkan array tasks
    const confirmed = confirm("Delete all tasks?");

    if (!confirmed) {
        return;
    }

    // reset
    tasks = [];

    // simpan perubahan ke localStorage
    saveTasks();

    // gambar ulang layar
    renderTasks();

    // toast
    showToast("All tasks have been deleted");
    
});

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    const saved = localStorage.getItem("tasks");
    if (!saved) return;

    try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
            tasks = parsed;
        }
    } catch (e) {
        tasks = [];
    }
}

function renderTasks() {
    list.innerHTML = "";

    const doneCount = tasks.filter(function (task) {
        return task.done;
    }).length;

    count.textContent = doneCount + " / " + tasks.length + " done";

    let visibleTasks = tasks;

    if (currentFilter === "active") {
        visibleTasks = tasks.filter(function (task) {
            return !task.done;
        });
    }

    if (currentFilter === "done") {
        visibleTasks = tasks.filter(function (task) {
            return task.done;
        });
    }

    if (visibleTasks.length === 0) {
        const empty = document.createElement("li");
        empty.textContent = tasks.length === 0 ? "No task yet..." : "Nothing here";
        empty.className = "empty";
        list.appendChild(empty);
        return;
    }

    visibleTasks.forEach(function (task, index) {
        const newItem = document.createElement("li");

        const marker = document.createElement("button");
        marker.className = "marker";
        marker.textContent = task.done ? "[x]" : "[ ]";
        marker.setAttribute("aria-label", "Toggle " + task.text);
        newItem.appendChild(marker);
        
        const label = document.createElement("span");
        label.className = "label";
        label.textContent = task.text;
        newItem.appendChild(label);

        label.addEventListener("dblclick", function () {
            const editInput = document.createElement("input");
            editInput.type = "text";
            editInput.value = task.text;
            editInput.className = "edit-input";

            newItem.replaceChild(editInput, label);
            editInput.focus();
            editInput.select();

            function commit() {
                const newText = editInput.value.trim();
                if (newText !== "") {
                    tasks[index].text = newText;
                    saveTasks();
                }

                renderTasks();
            }

            editInput.addEventListener("blur", commit);

            editInput.addEventListener("keydown", function(e) {
                if (e.key === "Enter") {
                    editInput.blur();
                }
                if (e.key === "Escape") {
                    renderTasks();
                }
            });
        });

        if (task.done) {
            newItem.classList.add("done");
        }

        marker.addEventListener("click", function () {
            tasks[index].done = !tasks[index].done;
            saveTasks();
            renderTasks();
        })

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "X";
        deleteButton.setAttribute("aria-label", "delete " + task.text);
        deleteButton.className = "delete";

        deleteButton.addEventListener("click", function(e) {
            e.stopPropagation();
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();
        });

        newItem.appendChild(deleteButton);
        list.appendChild(newItem);
    });
}

function showToast(message) {

    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add("show");

    toastTimer = setTimeout(function () {
        toast.classList.remove("show");
    }, 3000);
}

button.addEventListener("click", function() {
    const text = input.value.trim();

    if (text === "") {
        return;
    }

    tasks.push({ text: text, done: false });
    input.value = "";
    saveTasks();
    renderTasks();
});

input.addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
        button.click()
    }
});

filterButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
        currentFilter = btn.dataset.filter;
        

        // bersihkan tanda dari semua tombol
        filterButtons.forEach(function (b) {
            b.classList.remove("active");
        });

        // tandai yang diklik
        btn.classList.add("active");

        renderTasks();
    })
})




loadTasks();
renderTasks();

