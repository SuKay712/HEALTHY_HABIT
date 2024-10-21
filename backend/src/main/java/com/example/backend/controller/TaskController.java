package com.example.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dto.request.UpdateTaskRequest;
import com.example.backend.dto.request.CreateTaskRequest;
import com.example.backend.dto.response.BaseResponse;
import com.example.backend.dto.response.TasksInDateResponse;
import com.example.backend.model.Task;
import com.example.backend.service.TaskService;

@RestController
@RequestMapping("api/user")
public class TaskController {
  @Autowired
  private TaskService taskService;

  @GetMapping("/task")
  public ResponseEntity<BaseResponse<List<Task>>> getMethodName(@RequestParam String param) {
    return ResponseEntity.ok(new BaseResponse<>(true, "userId", taskService.getAllTasksByUserId(param)));
  }

  @GetMapping("/task/{id}")
  public ResponseEntity<BaseResponse<Task>> getTaskById(@PathVariable String id) {
    Task task = taskService.getTaskById(id);
    if (task == null) {
      return ResponseEntity.notFound().build();
    }
    BaseResponse<Task> response = new BaseResponse<>(true, "Fetched task successfully", task);
    return ResponseEntity.ok(response);
  }

  @GetMapping("/task/date")
  public ResponseEntity<BaseResponse<TasksInDateResponse>> getTasksInDatetime(@RequestParam String userId,
      @RequestParam String time) {
    return ResponseEntity.ok(taskService.getTasksInDateTime(userId, time));
  }

  @PutMapping("/task/{id}")
  public ResponseEntity<BaseResponse<Task>> updateTask(@PathVariable String id,
      @RequestBody UpdateTaskRequest request) {
    return ResponseEntity.ok(taskService.updateTask(id, request.getTime(), request.getStatus()));
  }

  @PostMapping("/task")
  public ResponseEntity<BaseResponse<Task>> createTask(@RequestBody CreateTaskRequest req) {
    return ResponseEntity.ok(taskService.createTask(req));
  }

}
