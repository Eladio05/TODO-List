document.addEventListener("DOMContentLoaded", function() {
    fetch("http://localhost:3000/tasks").then(response => response.json())
    .then(tasks => {
            tasks.forEach(updateTable);
        }).catch(error => console.error("Error:", error));
    setTimeout(reminder,1000);
});


document.getElementById("add-task-btn").addEventListener("click", addTask);

function addTask() {
    const titleInput = document.getElementById("title-input").value.trim();
    const descriptionInput = document.getElementById("description-input").value.trim();
    const final_dateInput = document.getElementById("final_date-input").value.trim();

    if (!titleInput || !descriptionInput || !final_dateInput) {
        alert("All fields must be completed.");
        return;
    }

    const task = {
        title: titleInput,
        description: descriptionInput,
        final_date: final_dateInput
    };
    
    createTask(task);
}

function createTask(task) {
    fetch("http://localhost:3000/tasks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(task)
    }).then(response => response.json()).then(data => {
        updateTable(data);
        clear();
    }).catch(error => console.error("Erreur:", error));
}

function deleteTask(taskId, buttonElement) {
    fetch(`http://localhost:3000/tasks/${taskId}`, {
        method: "DELETE"
    }).then(response => {
        if (response.ok) {
            const row = buttonElement.closest("tr");
            row.remove();
        } 
        else {
            alert("Error deleting task");
        }
    }).catch(error => console.error("Erreur:", error));
}


function updateTable(task) {
    fetch("http://localhost:3000/tasks").then(response => response.json())
    .then(tasks => {
        const tableBody = document.getElementById("task-table").querySelector("tbody");
        tableBody.innerHTML = ""; 
        tasks.forEach(task => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${task.ID}</td>
                <td>${task.Title}</td>
                <td>${task.Final_Date}</td>
            `;
            const deleteBtn = document.createElement("button");
            deleteBtn.innerHTML = "<img src='assets/trash_icon.png'></img>";
            deleteBtn.className = "delete-btn";
            deleteBtn.onclick = function() {deleteTask(task.ID, deleteBtn);};

            const consultBtn = document.createElement("button");
            consultBtn.textContent = " Consult";
            consultBtn.className = "consult-btn";
            consultBtn.onclick = function() {goDetails(task.ID);};
            row.appendChild(consultBtn);
            row.appendChild(deleteBtn);
            tableBody.appendChild(row);
        });
    }).catch(error => console.error("Erreur:", error));
}

function goDetails(taskId) {
    window.location.href = `task-description.html?taskId=${taskId}`;
}


function clear() {
    document.getElementById("title-input").value = "";
    document.getElementById("description-input").value = "";
    document.getElementById("final_date-input").value = "";
}


function reminder() {
    fetch("http://localhost:3000/tasks").then(response => response.json())
        .then(tasks => {
            tasks.forEach(task => {
                if (compareDate(task.Final_Date) == true) {
                    alert(`Reminder: Task "${task.Title}" is due today.`);
                }
            });
        }).catch(error => console.error("Error:", error));
}

function compareDate(date) {
    const today = new Date();
    const dueDate = new Date(date);
    if(dueDate.getDate() === today.getDate() && dueDate.getMonth() === today.getMonth() && dueDate.getFullYear() === today.getFullYear()) {
        return true
    }
    else {
        return false
    }
}