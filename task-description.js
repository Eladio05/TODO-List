document.addEventListener("DOMContentLoaded", function() {
    const param = new URLSearchParams(window.location.search);
    const taskId = param.get("taskId");
    console.log(taskId);
    document.getElementById("task-title").textContent += " " + taskId;
    
    if (taskId) {
        reload(taskId);
    }
    else {
        document.getElementById("task-title").textContent = "Task not found";
    }
});

function edit(fieldId, btn) {
    const field = document.getElementById(fieldId);
    const current = field.textContent;
    let input;

    if (fieldId == "final-date") {
        input = document.createElement("input");
        input.type = "date";
        input.value = current; 
    } 
    else {
        input = document.createElement("input");
        input.type = "text";
        input.value = current;
    }

    btn.style.display = "none";

    field.innerHTML = "";
    field.appendChild(input);

    const saveButton = document.createElement("button");
    saveButton.textContent = "Valider";
    saveButton.onclick = function() { save(fieldId, btn); };
    field.appendChild(saveButton);
}


function save(fieldId, btn) {
    const field = document.getElementById(fieldId);
    const input = field.querySelector("input");
    const modif = input.value;
    const param = new URLSearchParams(window.location.search);
    const taskId = param.get("taskId");
    if (!modif) {
        alert("The field cannot be empty");
        return;
    }
    else {
        fetch(`http://localhost:3000/tasks/${taskId}`).then(response => response.json())
        .then(task => {

            if (fieldId == "task-name") {
                task.Title = modif;
            } 
            else if (fieldId == "task-description") {
                task.Description = modif;
            } 
            else if (fieldId == "final-date") {
                task.Final_Date = modif;
            }

            return fetch(`http://localhost:3000/tasks/${taskId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(task)
            });
        }).then(response => response.json())
        .then(() => {
            reload(taskId);
            btn.style.display = "";
        }).catch(error => console.error("Error:", error));
    }
}

function reload(taskId) {
    fetch(`http://localhost:3000/tasks/${taskId}`).then(response => response.json())
        .then(task => {
            console.log(task); 
            document.getElementById("task-name").textContent = task.Title;
            document.getElementById("task-description").textContent = task.Description;
            document.getElementById("final-date").textContent = task.Final_Date;
        }).catch(error => console.error("Error:", error));
    
}