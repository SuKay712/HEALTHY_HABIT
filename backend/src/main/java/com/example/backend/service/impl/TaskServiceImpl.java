package com.example.backend.service.impl;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.dto.TaskDTO;
import com.example.backend.dto.response.BaseResponse;
import com.example.backend.dto.response.TasksInDateResponse;
import com.example.backend.model.Task;
import com.example.backend.repository.TaskRepository;
import com.example.backend.service.TaskService;
import com.example.backend.utils.DateTimeUtils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {
  @Autowired
  private TaskRepository taskRepository;

  @Override
  public List<Task> getAllTasksByUserId(String userId) {
    List<Task> listTask= taskRepository.findAll();
    return listTask;
  }

  @Override
  public Task getTaskById(String id) {
    return taskRepository.findById(id)
      .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));
  }

  @Override
  public BaseResponse<TasksInDateResponse> getTasksInDateTime(String userId, String dateTime) {
    BaseResponse<TasksInDateResponse> response;
    LocalDateTime inputDate = (dateTime == null || dateTime.isEmpty()) ?
      LocalDateTime.now() : LocalDateTime.parse(dateTime);
    LocalDateTime dayBefore = inputDate.minusDays(1);
    LocalDateTime dayAfter = inputDate.plusDays(1);
    // if(userId check){
    //   response = new BaseResponse<>(false, "No User was found", null);
    //   return response;
    // }
    List<Task> listTask = taskRepository.findByUserId(userId);

    List<TaskDTO> todayTasks = new ArrayList<>();
    List<TaskDTO> yesterdayTasks = new ArrayList<>();
    List<TaskDTO> tomorrowTasks = new ArrayList<>();

    for (Task task : listTask) {
      if (dayBefore.isAfter(task.getDateStart()) && dayBefore.isBefore(task.getDateEnd())) {
        String taskStatus = DateTimeUtils.findMatchingProgress(task.getTasksProgress(), dayBefore).getStatus();
        yesterdayTasks.add(new TaskDTO(task, taskStatus));
      }
      if (inputDate.isAfter(task.getDateStart()) && inputDate.isBefore(task.getDateEnd())) {
        String taskStatus = DateTimeUtils.findMatchingProgress(task.getTasksProgress(), inputDate).getStatus();
        todayTasks.add(new TaskDTO(task, taskStatus));
      }
      if (dayAfter.isAfter(task.getDateStart()) && dayAfter.isBefore(task.getDateEnd())) {
        String taskStatus = DateTimeUtils.findMatchingProgress(task.getTasksProgress(), dayAfter).getStatus();
        tomorrowTasks.add(new TaskDTO(task, taskStatus));
      }
    }
    TasksInDateResponse tasksInDateResponse = new TasksInDateResponse(todayTasks, yesterdayTasks, tomorrowTasks);
    if(todayTasks.isEmpty() && yesterdayTasks.isEmpty() && tomorrowTasks.isEmpty()){
      response = new BaseResponse<>(true, "No Task", tasksInDateResponse);
      return response;
    }
    response = new BaseResponse<>(true, "Fetched all tasks successfully", tasksInDateResponse);
    return response;
  }

}
