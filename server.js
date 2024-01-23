const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const app = express();

app.use(cors());
app.use(express.json());


const db = new sqlite3.Database("taskList.db", sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);
    console.log("Connected to the taskList.db SQLite database.");
});

app.listen(3000, () => {
    console.log("Serveur start on port 3000");
});

app.get("/tasks", (req, res) => {
    const sql = "SELECT * FROM Task";
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(500).send(err.message);
            return;
        }
        res.json(rows);
    });
});

app.get("/tasks/:id", (req, res) => {
    const sql = "SELECT * FROM Task WHERE ID = ?";
    db.get(sql, [req.params.id], (err, row) => {
        if (err) {
            res.status(500).send(err.message);
            return;
        }
        if (row) {
            res.json(row);
        } else {
            res.status(404).send('Task not found');
        }
    });
});

let cpt = 0;

app.post("/tasks", (req, res) => {
    const { title, description, final_date } = req.body;
    const sql = "INSERT INTO Task (Title, Description, Final_Date) VALUES (?, ?, ?)";
    db.run(sql, [title, description, final_date], function(err) {
        if (err) {
            res.status(500).send(err.message);
            return;
        }
        res.status(201).json({ id: this.lastID, title, description, final_date });
    });
});

app.put("/tasks/:id", (req, res) => {
    const { Title, Description, Final_Date } = req.body;
    const sql = "UPDATE Task SET Title = ?, Description = ?, Final_Date = ? WHERE ID = ?";

    db.run(sql, [Title, Description, Final_Date, req.params.id], function(err) {
        if (err) {
            console.error('Error during task update:', err.message);
            res.status(500).send(err.message);
            return;
        }
        res.json({ id: req.params.id, Title, Description, Final_Date });
    });
});


app.delete("/tasks/:id", (req, res) => {
    const sql = "DELETE FROM Task WHERE ID = ?";
    db.run(sql, [req.params.id], function(err) {
        if (err) {
            res.status(500).send(err.message);
            return;
        }
        res.status(204).send();
    });
});
