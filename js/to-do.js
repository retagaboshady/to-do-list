const inputBox = document.getElementById("input-box");
const addBtn = document.getElementById("add-btn");
const deleteBtn = document.querySelector(".delete-btn");
const listContainer = document.getElementById("list-container");

let isDeleteMode = false;

function addTask() {
    if (inputBox.value.trim() === "") {
        alert("You must write something!");
        return;
    }

    const li = document.createElement("li");
    const span = document.createElement("span");
    
    span.textContent = inputBox.value;
    li.appendChild(span);
    listContainer.appendChild(li);
    
    inputBox.value = "";
}

addBtn.addEventListener("click", addTask);

inputBox.addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
        addTask();
    }
});

deleteBtn.addEventListener("click", function() {
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

listContainer.addEventListener("click", function(e) {
    if (isDeleteMode) {
        const targetLi = e.target.closest("li");
        if (targetLi && listContainer.contains(targetLi)) {
            targetLi.remove();
        }
    }
});