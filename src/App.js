import React, { useState, useEffect } from 'react';
import TaskForm from './TaskForm';
import TaskCard from './TaskCard';
import Dashboard from './Dashboard';
import logo from './assests/logo.jpg';  // Adjust path accordingly
import bgImage from './assests/bgImage.jpg'





import {
  Container, Typography,Box, TextField, Checkbox, FormControlLabel,
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

  const handleMarkCompleted = (id) => {
  // Find the task, set completed to true, and update backend
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  fetch(`${backendUrl}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: authHeader },
    body: JSON.stringify({ ...task, completed: true }),
  })
    .then(res => {
      if (!res.ok) throw new Error('Update failed');
      return res.json();
    })
    .then(() => fetchTasks())
    .catch(console.error);
};

  

return (
  <div
    style={{
      backgroundImage: `url(${bgImage})`,  // Make sure your variable is bgImage (not background)
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      minHeight: '100vh',
      padding: '20px',
    }}
  >
    <Container maxWidth="sm" sx={{ bgcolor: 'rgba(255,255,255,0.8)', borderRadius: 2, p: 3 }}>
      
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          mb: 4 
        }}
      >
        <img src={logo} alt="Logo" style={{ height: 60, marginRight: 10 }} />
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Task Manager
        </Typography>
      </Box>

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
            onMarkCompleted={handleMarkCompleted}
          />
        ))
      )}

      <Dashboard tasks={tasks} />
    </Container>
  </div>
)}
export default App;

