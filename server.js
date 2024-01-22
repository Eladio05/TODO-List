const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const tasks = [];

app.listen(3000, () => {
    console.log('Serveur start on port 3000');
});

//test 
app.get('/', (req, res) => {
    res.send('Welcome on my TODO API');
});


// Obtenir toutes les tâches
app.get('/tasks', (req, res) => {
    res.json(tasks);
});



// Obtenir une tâche par son ID
app.get('/tasks/:id', (req, res) => {
    const task = tasks.find(t => t.id === parseInt(req.params.id));
    if (!task) {
        return console.log("Task not found")
    };
    res.json(task);
});


let cpt = 0;

app.post('/tasks', (req, res) => {
    const task = {
        id: ++cpt, 
        title: req.body.title,
        description: req.body.description,
        final_date: req.body.final_date
    };
    tasks.push(task);
    res.status(201).send(task);
    console.log(task);
    console.log("Task added successfully");
});



app.put('/tasks/:id', (req, res) => {
    const task = tasks.find(t => t.id === parseInt(req.params.id));
    if (!task) return res.status(404).send('Task not found');
    task.title = req.body.title;
    task.description = req.body.description;
    task.final_date = req.body.final_date;
    res.send(task);
    console.log(task);
});


app.delete('/tasks/:id', (req, res) => {
    const taskIndex = tasks.findIndex(t => t.id === parseInt(req.params.id));
    if (taskIndex === -1) {
        return res.status(404).send('Task not found ');
    }
    tasks.splice(taskIndex, 1);
    res.status(204).send();
    console.log("Task deleted");
});

