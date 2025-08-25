package com.example.demo.controller;

import com.example.demo.entity.Task;
import com.example.demo.entity.Category;
import com.example.demo.repository.TaskRepository;
import com.example.demo.repository.CategoryRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

import java.time.LocalDateTime;


@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @GetMapping
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<Task> createTask(@RequestBody Task task) {
        if (task.getCategory() != null && task.getCategory().getId() != null) {
            Optional<Category> category = categoryRepository.findById(task.getCategory().getId());
            category.ifPresent(task::setCategory);
        }
        Task saved = taskRepository.save(task);
        return ResponseEntity.ok(saved);
    }

   @PutMapping("/{id}")
public ResponseEntity<Task> updateTask(@PathVariable Long id, @RequestBody Task updatedTask) {
    return taskRepository.findById(id)
        .map(task -> {
            task.setTitle(updatedTask.getTitle());
            task.setDescription(updatedTask.getDescription());
            task.setCompleted(updatedTask.isCompleted());
            task.setDueDate(updatedTask.getDueDate());  // Add this line
            if (updatedTask.getCategory() != null && updatedTask.getCategory().getId() != null) {
                categoryRepository.findById(updatedTask.getCategory().getId()).ifPresent(task::setCategory);
            }
            taskRepository.save(task);
            return ResponseEntity.ok(task);
        })
        .orElseGet(() -> ResponseEntity.notFound().build());
}


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        if (!taskRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        taskRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
