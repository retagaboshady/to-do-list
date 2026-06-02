const inputBox = document.getElementById("input-box");
const categorySelect = document.getElementById("category-select");
const addBtn = document.getElementById("add-btn");
const editBtn = document.querySelector(".edit-btn");
const deleteBtn = document.querySelector(".delete-btn");
const listContainer = document.getElementById("list-container");
const chartStats = document.getElementById("chart-stats");

let isDeleteMode = false;
let isEditMode = false;
let myChart = null;

function initChart() {
    const ctx = document.getElementById('progressChart').getContext('2d');
    myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Work Finished', 'Study Finished', 'Personal Finished', 'Buying Finished', 'Other Finished'],
            datasets: [{
                data: [0, 0, 0, 0, 0],
                backgroundColor: ['#0d6efd', '#198754', '#6f42c1', '#fd7e14', '#6c757d']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}

function updateChart() {
    const items = listContainer.querySelectorAll("li");
    
    let counts = {
        work: { total: 0, done: 0 },
        study: { total: 0, done: 0 },
        personal: { total: 0, done: 0 },
        buying: { total: 0, done: 0 },
        other: { total: 0, done: 0 }
    };

    items.forEach(li => {
        const tag = li.querySelector(".category-tag");
        const isChecked = li.classList.contains("checked");
        if (!tag) return;

        const category = tag.textContent.toLowerCase().replace(" list", "");
        if (counts[category]) {
            counts[category].total++;
            if (isChecked) {
                counts[category].done++;
            }
        }
    });

    myChart.data.datasets[0].data = [
        counts.work.done, 
        counts.study.done, 
        counts.personal.done, 
        counts.buying.done, 
        counts.other.done
    ];
    myChart.update();

    chartStats.innerHTML = `
        <div class="stat-row" style="border-left: 5px solid #0d6efd"><span>Work Progress:</span> <span>${counts.work.done} / ${counts.work.total} finished</span></div>
        <div class="stat-row" style="border-left: 5px solid #198754"><span>Study Progress:</span> <span>${counts.study.done} / ${counts.study.total} finished</span></div>
        <div class="stat-row" style="border-left: 5px solid #6f42c1"><span>Personal Progress:</span> <span>${counts.personal.done} / ${counts.personal.total} finished</span></div>
        <div class="stat-row" style="border-left: 5px solid #fd7e14"><span>Buying Progress:</span> <span>${counts.buying.done} / ${counts.buying.total} finished</span></div>
        <div class="stat-row" style="border-left: 5px solid #6c757d"><span>Other Progress:</span> <span>${counts.other.done} / ${counts.other.total} finished</span></div>
    `;
    
    saveData();
}

function saveData() {
    localStorage.setItem("todoData", listContainer.innerHTML);
}

function loadData() {
    const savedData = localStorage.getItem("todoData");
    if (savedData) {
        listContainer.innerHTML = savedData;
        
        listContainer.querySelectorAll("li").forEach(li => {
            const checkbox = li.querySelector('input[type="checkbox"]');
            if (checkbox) {
                checkbox.checked = li.classList.contains("checked");
            }
        });
    }
}

function addTask() {
    if (inputBox.value.trim() === "") {
        alert("You must write something!");
        return;
    }

    const li = document.createElement("li");
    
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    
    const span = document.createElement("span");
    span.textContent = inputBox.value;

    const tag = document.createElement("span");
    const selectedCategory = categorySelect.value;
    tag.textContent = selectedCategory === "Buying" ? "Buying List" : selectedCategory;
    tag.classList.add("category-tag", `tag-${selectedCategory.toLowerCase()}`);
    
    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(tag);
    listContainer.appendChild(li);
    
    inputBox.value = "";
    updateChart();
}

addBtn.addEventListener("click", addTask);

inputBox.addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
        addTask();
    }
});

deleteBtn.addEventListener("click", function() {
    if (isEditMode) return;
    isDeleteMode = !isDeleteMode;
    
    if (isDeleteMode) {
        listContainer.classList.add("delete-mode");
        deleteBtn.style.background = "#555";
        deleteBtn.textContent = "Done";
    } else {
        listContainer.classList.remove("delete-mode");
        deleteBtn.style.background = "#dc3545";
        deleteBtn.textContent = "Delete";
    }
});

editBtn.addEventListener("click", function() {
    if (isDeleteMode) return;
    isEditMode = !isEditMode;
    
    if (isEditMode) {
        listContainer.classList.add("edit-mode");
        editBtn.style.background = "#555";
        editBtn.style.color = "#fff";
        editBtn.textContent = "Done";
    } else {
        listContainer.classList.remove("edit-mode");
        editBtn.style.background = "#ffc107";
        editBtn.style.color = "#212529";
        editBtn.textContent = "Edit";
    }
});

listContainer.addEventListener("click", function(e) {
    if (isDeleteMode) {
        const targetLi = e.target.closest("li");
        if (targetLi && listContainer.contains(targetLi)) {
            targetLi.remove();
            updateChart();
        }
    } else if (isEditMode) {
        if (e.target.tagName === "SPAN" && !e.target.classList.contains("category-tag")) {
            const currentText = e.target.textContent;
            const newText = prompt("Edit your task:", currentText);
            if (newText !== null && newText.trim() !== "") {
                e.target.textContent = newText.trim();
                updateChart();
            }
        }
    }
});

listContainer.addEventListener("change", function(e) {
    if (e.target.tagName === "INPUT" && e.target.type === "checkbox") {
        const li = e.target.parentElement;
        li.classList.toggle("checked");
        updateChart();
    }
});

initChart();
loadData();
updateChart();