document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const taskId = urlParams.get('taskId');

    if (taskId) {
        fetch(`http://localhost:3000/tasks/${taskId}`)
            .then(response => response.json())
            .then(task => {
                document.getElementById('task-title').textContent += taskId;
                document.getElementById('task-name').textContent = task.title;
                document.getElementById('task-description').textContent = task.description;
                document.getElementById('final-date').textContent = task.final_date;
            })
            .catch(error => console.error('Erreur:', error));
    } else {
        document.getElementById('task-title').textContent = 'Tâche introuvable';
    }
});
