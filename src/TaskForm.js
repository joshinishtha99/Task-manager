import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { TextField, Button } from '@mui/material';

function TaskForm({ form, setForm, onSubmit }) {
  return (
    <form onSubmit={onSubmit}>
      <TextField
        label="Title"
        value={form.title}
        onChange={e => setForm({ ...form, title: e.target.value })}
        required
        fullWidth
      />
      <TextField
        label="Description"
        value={form.description}
        onChange={e => setForm({ ...form, description: e.target.value })}
        required
        fullWidth
        multiline
      />
      <div style={{ display: 'flex', alignItems: 'center', marginTop: 16, marginBottom: 16, gap: 8 }}>
  <label>Due Date:</label>
  <DatePicker
    selected={form.dueDate ? new Date(form.dueDate) : null}
    onChange={date => setForm({ ...form, dueDate: date })}
    showTimeSelect
    timeFormat="HH:mm"
    timeIntervals={15}
    dateFormat="MMMM d, yyyy h:mm aa"
    placeholderText="Select due date and time"
    isClearable
    className="date-picker"
  />
</div>

      <Button type="submit" variant="contained" color="primary">
        {form.id ? 'Save Changes' : 'Add Task'}
      </Button>
    </form>
  );
}

export default TaskForm;
