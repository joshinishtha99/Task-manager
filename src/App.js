import React, { useState, useEffect } from 'react';
import TaskForm from './TaskForm';
import TaskCard from './TaskCard';
import Dashboard from './Dashboard';




import {
  Container, Typography, TextField, Checkbox, FormControlLabel,
  Button, List, ListItem, ListItemText, IconButton, Stack
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import DatePicker from 'react-datepicker';


function App() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', completed: false });
  const [editTaskId, setEditTaskId] = useState(null);

  const backendUrl = 'http://localhost:8081/api/tasks';
  const authHeader = 'Basic ' + btoa('user:nishtha'); // Replace if needed

  const fetchTasks = () => {
    fetch(backendUrl, { headers: { Authorization: authHeader } })
      .then(res => res.json())
      .then(setTasks)
      .catch(console.error);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

const handleSubmit = (e) => {
  e.preventDefault();

  // Prepare payload with ISO string dueDate
  const payload = {
    ...form,
    dueDate: form.dueDate ? form.dueDate.toISOString() : null,
  };

  if (editTaskId) {
    fetch(`${backendUrl}/${editTaskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: authHeader },
      body: JSON.stringify(payload),  // Use payload here
    })
      .then(res => {
        if (!res.ok) throw new Error('Update failed');
        return res.json();
      })
      .then(() => {
        setForm({ title: '', description: '', completed: false, dueDate: null });
        setEditTaskId(null);
        fetchTasks();
      })
      .catch(console.error);
  } else {
    fetch(backendUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: authHeader },
      body: JSON.stringify(payload),  // Use payload here
    })
      .then(res => {
        if (!res.ok) throw new Error('Add failed');
        return res.json();
      })
      .then(() => {
        setForm({ title: '', description: '', completed: false, dueDate: null });
        fetchTasks();
      })
      .catch(console.error);
  }
};


  const handleDelete = (id) => {
    fetch(`${backendUrl}/${id}`, {
      method: 'DELETE',
      headers: { Authorization: authHeader }
    })
      .then(res => {
        if (!res.ok) throw new Error('Delete failed');
        fetchTasks();
      })
      .catch(console.error);
  };

  const startEdit = (task) => {
    setEditTaskId(task.id);
    setForm({ title: task.title, description: task.description, completed: task.completed });
  };

  const cancelEdit = () => {
    setEditTaskId(null);
    setForm({ title: '', description: '', completed: false });
  };

  

return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Task Manager</Typography>

      <TaskForm form={form} setForm={setForm} onSubmit={handleSubmit} />

    {tasks.length === 0 ? (
  <Typography>No tasks found.</Typography>
) : (
  tasks.map(task => (
    <TaskCard
      key={task.id}
      task={task}
      onEdit={startEdit}
      onDelete={handleDelete}
    />
  ))
)}
    </Container>
  );
}

export default App;
