package com.example.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dto.response.BaseResponse;
import com.example.backend.dto.response.TasksInDateResponse;
import com.example.backend.model.Task;
import com.example.backend.service.TaskService;


@RestController
@RequestMapping("api/task")
public class TaskController {
  @Autowired
  private TaskService taskService;

  @GetMapping("/getAllTask")
  public ResponseEntity<BaseResponse<List<Task>>> getMethodName(@RequestParam String param) {
    return ResponseEntity.ok(new BaseResponse<>(true, "userId", taskService.getAllTasksByUserId(param)));
  }

  @GetMapping("/{id}")
  public ResponseEntity<BaseResponse<Task>> getTaskById(@PathVariable String id) {
    Task task = taskService.getTaskById(id);
    if (task == null) {
      return ResponseEntity.notFound().build();
    }
    BaseResponse<Task> response = new BaseResponse<>(true, "Fetched task successfully", task);
    return ResponseEntity.ok(response);
  }

  @GetMapping("/getTasksInDate")
  public ResponseEntity<BaseResponse<TasksInDateResponse>> getTasksInDatetime(@RequestParam String userId, @RequestParam String time) {
    return ResponseEntity.ok(taskService.getTasksInDateTime(userId, time));
  }


}
