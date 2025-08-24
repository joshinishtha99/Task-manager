import React from 'react';
import { Card, CardContent, Typography, Chip, Stack, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function TaskCard({ task, onEdit, onDelete }) {
  const isOverdue = task.dueDate ? new Date(task.dueDate) < new Date() && !task.completed : false;

  return (
    <Card
      sx={{
        mb: 2,
        backgroundColor: task.completed
          ? 'success.light'
          : isOverdue
          ? 'error.light'
          : 'background.paper',
      }}
    >
      <CardContent>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <div>
            <Typography variant="h6">{task.title}</Typography>
            <Typography variant="body2" color="text.secondary">
              {task.description}
            </Typography>
            {task.dueDate && (
              <Typography variant="caption" color="text.secondary">
                Due: {new Date(task.dueDate).toLocaleString()}
              </Typography>
            )}
          </div>
          <Stack direction="column" alignItems="flex-end" spacing={1}>
            <div>
              <IconButton aria-label="edit" onClick={() => onEdit(task)}>
                <EditIcon />
              </IconButton>
              <IconButton aria-label="delete" onClick={() => onDelete(task.id)}>
                <DeleteIcon />
              </IconButton>
            </div>
            {task.completed && <Chip label="Completed" color="success" size="small" />}
            {isOverdue && <Chip label="Overdue" color="error" size="small" />}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default TaskCard;
