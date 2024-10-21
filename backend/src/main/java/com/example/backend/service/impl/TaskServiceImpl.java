package com.example.backend.service.impl;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.backend.dto.TaskDTO;
import com.example.backend.dto.request.CreateTaskRequest;
import com.example.backend.dto.response.BaseResponse;
import com.example.backend.dto.response.TaskInProgressAndEnded;
import com.example.backend.dto.response.TasksInDateResponse;
import com.example.backend.model.Progress;
import com.example.backend.model.Task;
import com.example.backend.model.enums.DateOfWeek;
import com.example.backend.model.enums.Priority;
import com.example.backend.model.enums.Status;
import com.example.backend.repository.TaskRepository;
import com.example.backend.service.TaskService;
import com.example.backend.utils.DateTimeUtils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {
  private final TaskRepository taskRepository;

  @Override
  public List<Task> getAllTasksByUserId(String userId) {
    List<Task> listTask = taskRepository.findAll();
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
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
    LocalDate inputDate = (dateTime == null || dateTime.isEmpty()) ? LocalDate.now()
        : LocalDate.parse(dateTime, formatter);
    LocalDate dayBefore = inputDate.minusDays(1);
    LocalDate dayAfter = inputDate.plusDays(1);
    // if(userId check){
    // response = new BaseResponse<>(false, "No User was found", null);
    // return response;
    // }
    List<Task> listTask = taskRepository.findByUserId(userId);

    List<TaskDTO> todayTasks = new ArrayList<>();
    List<TaskDTO> yesterdayTasks = new ArrayList<>();
    List<TaskDTO> tomorrowTasks = new ArrayList<>();

    for (Task task : listTask) {
      if (dayBefore.isAfter(task.getDateStart()) && dayBefore.isBefore(task.getDateEnd())) {
        Progress progress = DateTimeUtils.findMatchingProgress(task.getTasksProgress(), dayBefore);
        if (progress != null) {
          yesterdayTasks.add(new TaskDTO(task, progress.getStatus()));
        }
      }
      if (inputDate.isAfter(task.getDateStart()) && inputDate.isBefore(task.getDateEnd())) {
        Progress progress = DateTimeUtils.findMatchingProgress(task.getTasksProgress(), inputDate);
        if (progress != null) {
          todayTasks.add(new TaskDTO(task, progress.getStatus()));
        }
      }
      if (dayAfter.isAfter(task.getDateStart()) && dayAfter.isBefore(task.getDateEnd())) {
        Progress progress = DateTimeUtils.findMatchingProgress(task.getTasksProgress(), dayAfter);
        if (progress != null) {
          tomorrowTasks.add(new TaskDTO(task, progress.getStatus()));
        }
      }
    }
    TasksInDateResponse tasksInDateResponse = new TasksInDateResponse(todayTasks, yesterdayTasks, tomorrowTasks);
    if (todayTasks.isEmpty() && yesterdayTasks.isEmpty() && tomorrowTasks.isEmpty()) {
      response = new BaseResponse<>(true, "No Task", tasksInDateResponse);
      return response;
    }
    response = new BaseResponse<>(true, "Fetched all tasks successfully", tasksInDateResponse);
    return response;
  }

  @Override
  public BaseResponse<Task> createTask(CreateTaskRequest req) {
    try {
      Task task = Task.builder().userId(req.getUserId())
          .name(req.getName())
          .description(req.getDescription())
          .prize(req.getPrize())
          .priority(Priority.MEDIUM)
          .dateStart(req.getDateStart())
          .timeExpired(req.getTimeExpired())
          .isNotify(true)
          .isDeleted(false)
          .build();
      if (req.getTimer() != null && req.getDateEnd() != null) {
        List<Progress> progressList = new ArrayList<>();
        LocalDate currentDate = req.getDateStart();
        if (req.getTimer().get(0) == DateOfWeek.ALL) {
          while (!currentDate.isAfter(req.getDateEnd())) {
            if (currentDate.isBefore(LocalDate.now())) {
              progressList.add(new Progress(currentDate, Status.OVERDUE));
            } else if (currentDate.equals(LocalDate.now())
                && LocalTime.parse(req.getTimeExpired()).isBefore(LocalTime.now())) {
              progressList.add(new Progress(currentDate, Status.OVERDUE));
            } else {
              progressList.add(new Progress(currentDate, Status.INCOMPLETE));
            }
            currentDate = currentDate.plusDays(1);
          }
        } else {
          while (!currentDate.isAfter(req.getDateEnd())) {
            DayOfWeek currentDayOfWeek = currentDate.getDayOfWeek();
            for (DateOfWeek day : req.getTimer()) {
              if (day.getValue() == currentDayOfWeek.getValue()) {
                progressList.add(new Progress(currentDate, Status.INCOMPLETE));
                break;
              }
            }
            currentDate = currentDate.plusDays(1);
          }
        }
        task.setTimer(req.getTimer());
        task.setTasksProgress(progressList);
        task.setDateEnd(req.getDateEnd());
      } else {
        List<Progress> progresses = new ArrayList<>();
        progresses.add(new Progress(req.getDateStart(), Status.INCOMPLETE));
        task.setTasksProgress(progresses);
      }
      Task resulTask = taskRepository.save(task);
      return new BaseResponse<Task>(true, "Create Task Success!!!", resulTask);
    } catch (Exception e) {
      return new BaseResponse<Task>(false, e.getMessage(), null);
    }

  }

  @Override
  public BaseResponse<Task> updateTask(String id, LocalDate time, Status status) {
    BaseResponse<Task> response;
    Optional<Task> optionalTask = taskRepository.findById(id);
    if (optionalTask.isPresent()) {
      Task task = optionalTask.get();
      Progress progress = DateTimeUtils.findMatchingProgress(task.getTasksProgress(), time);
      progress.setStatus(status);
      taskRepository.save(task);
      response = new BaseResponse<>(true, "Fetched all tasks successfully", task);
      return response;
    }
    return null;
  }

  @Override
  public BaseResponse<TaskInProgressAndEnded> getTaskByStatusNow(String userId) {
    try {
      List<Task> tempTask = taskRepository.findByUserId(userId);
      LocalDate now = LocalDate.now();
      List<Task> inProgressTasks = tempTask.stream()
          .filter(task -> {
            LocalDate dateStart = task.getDateStart();
            LocalDate dateEnd = task.getDateEnd();
            return (dateStart != null
                && ((dateStart.isBefore(now) && (dateEnd == null || dateEnd.isAfter(now))) // Đang trong tiến trình
                    || dateStart.isAfter(now))); // Chuẩn bị bắt đầu (trong tương lai)
          })
          .collect(Collectors.toList());

      List<Task> endedTasks = tempTask.stream()
          .filter(task -> {
            LocalDate dateEnd = task.getDateEnd();
            return dateEnd != null && dateEnd.isBefore(now); // Task đã quá hạn
          })
          .collect(Collectors.toList());

      return new BaseResponse<>(true, "Fetched tasks by status successfully!",
          new TaskInProgressAndEnded(inProgressTasks, endedTasks));
    } catch (Exception e) {
      return new BaseResponse<>(false, "Fetched tasks by status fail!", null);
    }

  }

}
