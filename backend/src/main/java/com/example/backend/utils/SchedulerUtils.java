package com.example.backend.utils;

import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.example.backend.model.Task;
import com.example.backend.repository.TaskRepository;
import com.example.backend.service.TaskService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class SchedulerUtils {
  private final TaskRepository taskRepository;
  private final TaskService taskService;

  @Scheduled(cron = "0 */2 * * * ?")
  public void checkAndUpdateOverdueTasks() {
    List<Task> tasks = taskRepository.findAll();
    for (Task task : tasks) {
      taskService.updateTaskStatusIfOverdue(task);
    }
  }
}
