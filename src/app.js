const express = require('express');
const path = require('path');
const db = require('./database');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

app.get('/api/tasks', (req, res) => {
  db.all('SELECT * FROM tasks ORDER BY id DESC', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json(rows);
  });
});

app.post('/api/tasks', (req, res) => {
  const { title } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({
      error: 'El título de la tarea es obligatorio'
    });
  }

  db.run(
    'INSERT INTO tasks (title) VALUES (?)',
    [title.trim()],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.status(201).json({
        id: this.lastID,
        title: title.trim(),
        completed: 0
      });
    }
  );
});

app.put('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;

  db.run(
    'UPDATE tasks SET completed = ? WHERE id = ?',
    [completed ? 1 : 0, id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (this.changes === 0) {
        return res.status(404).json({
          error: 'Tarea no encontrada'
        });
      }

      res.json({
        message: 'Tarea actualizada correctamente'
      });
    }
  );
});

app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;

  db.run(
    'DELETE FROM tasks WHERE id = ?',
    [id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (this.changes === 0) {
        return res.status(404).json({
          error: 'Tarea no encontrada'
        });
      }

      res.json({
        message: 'Tarea eliminada correctamente'
      });
    }
  );
});

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'Task Manager DevOps'
  });
});

module.exports = app;