package com.example.backend.service.impl;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.dto.TaskDTO;
import com.example.backend.dto.response.BaseResponse;
import com.example.backend.dto.response.TasksInDateResponse;
import com.example.backend.model.Progress;
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
        Progress progress = DateTimeUtils.findMatchingProgress(task.getTasksProgress(), dayBefore);
        if (progress == null) continue;
        yesterdayTasks.add(new TaskDTO(task, progress.getStatus()));
      }
      if (inputDate.isAfter(task.getDateStart()) && inputDate.isBefore(task.getDateEnd())) {
        Progress progress = DateTimeUtils.findMatchingProgress(task.getTasksProgress(), inputDate);
        if (progress == null) continue;
        yesterdayTasks.add(new TaskDTO(task, progress.getStatus()));
      }
      if (dayAfter.isAfter(task.getDateStart()) && dayAfter.isBefore(task.getDateEnd())) {
        Progress progress = DateTimeUtils.findMatchingProgress(task.getTasksProgress(), dayAfter);
        if (progress == null) continue;
        yesterdayTasks.add(new TaskDTO(task, progress.getStatus()));
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

  @Override
  public BaseResponse<Task> updateTask(String id, LocalDateTime time, String status) {
    BaseResponse<Task> response;
    Optional<Task> optionalTask = taskRepository.findById(id);
    if (optionalTask.isPresent()){
      Task task = optionalTask.get();
      Progress progress = DateTimeUtils.findMatchingProgress(task.getTasksProgress(), time);
      progress.setStatus(status);
      taskRepository.save(task);
      response = new BaseResponse<>(true, "Fetched all tasks successfully", task);
      return response;
    }
    return null;
  }

}
