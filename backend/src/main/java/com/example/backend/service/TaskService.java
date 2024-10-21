package com.example.backend.service;

import java.time.LocalDate;
import java.util.List;

import com.example.backend.dto.request.CreateTaskRequest;
import com.example.backend.dto.response.BaseResponse;
import com.example.backend.dto.response.TasksInDateResponse;
import com.example.backend.model.Task;
import com.example.backend.model.enums.Status;

public interface TaskService {
  public List<Task> getAllTasksByUserId(String userId);

  public BaseResponse<TasksInDateResponse> getTasksInDateTime(String userId, String dateTime);

  public Task getTaskById(String id);

  public BaseResponse<Task> updateTask(String id, LocalDate time, Status status);

  public BaseResponse<Task> createTask(CreateTaskRequest req);
}
