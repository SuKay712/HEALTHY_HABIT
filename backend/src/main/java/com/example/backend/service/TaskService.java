package com.example.backend.service;

import java.util.List;

import com.example.backend.dto.response.BaseResponse;
import com.example.backend.dto.response.TasksInDateResponse;
import com.example.backend.model.Task;

public interface TaskService {
  public List<Task> getAllTasksByUserId(String userId);
  public BaseResponse<TasksInDateResponse> getTasksInDateTime(String userId, String dateTime);
  public Task getTaskById(String id);
}
