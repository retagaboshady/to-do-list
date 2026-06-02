const inputBox = document.getElementById("input-box");
const categorySelect = document.getElementById("category-select");
const addBtn = document.getElementById("add-btn");
const editBtn = document.querySelector(".edit-btn");
const deleteBtn = document.querySelector(".delete-btn");
const listContainer = document.getElementById("list-container");

let isDeleteMode = false;
let isEditMode = false;

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
    tag.textContent = selectedCategory;
    tag.classList.add("category-tag", `tag-${selectedCategory.toLowerCase()}`);
    
    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(tag);
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
        }
    } else if (isEditMode) {
        if (e.target.tagName === "SPAN" && !e.target.classList.contains("category-tag")) {
            const currentText = e.target.textContent;
            const newText = prompt("Edit your task:", currentText);
            if (newText !== null && newText.trim() !== "") {
                e.target.textContent = newText.trim();
            }
        }
    }
});

listContainer.addEventListener("change", function(e) {
    if (e.target.tagName === "INPUT" && e.target.type === "checkbox") {
        const li = e.target.parentElement;
        li.classList.toggle("checked");
    }
});