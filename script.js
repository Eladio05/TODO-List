document.addEventListener('DOMContentLoaded', function() {
    fetch('http://localhost:3000/tasks').then(response => response.json())
    .then(tasks => {
            tasks.forEach(addTaskToTable);
        })
        .catch(error => console.error('Erreur:', error));
});


document.getElementById('add-task-btn').addEventListener('click', addTask);

function addTask() {
    const titleInput = document.getElementById('title-input').value.trim();
    const descriptionInput = document.getElementById('description-input').value.trim();
    const final_dateInput = document.getElementById('final_date-input').value.trim();

    if (!titleInput || !descriptionInput || !final_dateInput) {
        alert('Tous les champs doivent être remplis.');
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
    fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(task)
    }).then(response => response.json()).then(data => {
        addTaskToTable(data);
        clearInputFields();
    }).catch(error => console.error('Erreur:', error));
}

function deleteTask(taskId, buttonElement) {
    fetch(`http://localhost:3000/tasks/${taskId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            // Supprimer la ligne du tableau
            const row = buttonElement.closest('tr');
            row.remove();
        } else {
            alert('Erreur lors de la suppression de la tâche');
        }
    })
    .catch(error => console.error('Erreur:', error));
}


function addTaskToTable(task) {
    const tableBody = document.getElementById('task-table').querySelector('tbody');
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${task.id}</td>
        <td>${task.title}</td>
        <td>${task.final_date}</td>
    `;
    tableBody.appendChild(row);

    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '<img src="assets/trash_icon.png"></img>';
    deleteBtn.onclick = function() { deleteTask(task.id, deleteBtn); };
    row.appendChild(deleteBtn);
}



function clearInputFields() {
    document.getElementById('title-input').value = '';
    document.getElementById('description-input').value = '';
    document.getElementById('due-date-input').value = '';
}
