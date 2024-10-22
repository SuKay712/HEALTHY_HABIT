package com.example.backend.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.example.backend.dto.request.CreateTaskRequest;
import com.example.backend.dto.response.BaseResponse;
import com.example.backend.dto.response.TaskInProgressAndEnded;
import com.example.backend.dto.response.TasksInDateResponse;
import com.example.backend.model.Task;
import com.example.backend.model.enums.Status;

public interface TaskService {
  public List<Task> getAllTasksByUserId(String userId);

  public BaseResponse<TasksInDateResponse> getTasksInDateTime(String userId, String dateTime);

  public Task getTaskById(String id);

  public BaseResponse<Task> updateTask(String id, LocalDate time, Status status);

  public BaseResponse<Task> createTask(CreateTaskRequest req);

  public BaseResponse<TaskInProgressAndEnded> getTaskInProgressAndEnded(String userId);

  public Page<Task> getInProgressTasks(String userId, Pageable pageable);

  public Page<Task> getEndedTasks(String userId, Pageable pageable);

}
