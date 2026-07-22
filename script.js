const count = document.getElementById("task-count");

const input = document.getElementById("task-input");
const button = document.getElementById("add-button");
const list = document.getElementById("task-list")



let tasks = [];

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

    if (tasks.length === 0) {
        const empty = document.createElement("li");
        empty.textContent = "No task yet...";
        empty.className = "empty";
        list.appendChild(empty);
        return;
    }

    tasks.forEach(function (task, index) {
        const newItem = document.createElement("li");

        const marker = document.createElement("button");
        marker.className = "marker";
        marker.textContent = task.done ? "[x]" : "[ ]";
        marker.setAttribute("arial-label", "Toggle " + task.text);
        newItem.appendChild(marker);
        
        const label = document.createElement("span");
        label.className = "label";
        label.textContent = task.text;
        newItem.appendChild(label);

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
        deleteButton.setAttribute("arial-label", "delete " + task.text);
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

loadTasks()
renderTasks()
