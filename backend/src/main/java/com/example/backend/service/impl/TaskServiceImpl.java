package com.example.backend.service.impl;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.backend.dto.TaskDTO;
import com.example.backend.dto.request.CreateTaskRequest;
import com.example.backend.dto.request.UpdateBigTaskRequest;
import com.example.backend.dto.response.BaseResponse;
import com.example.backend.dto.response.TaskInProgressAndEnded;
import com.example.backend.dto.response.TaskProgressResponse;
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
  public BaseResponse<List<TaskProgressResponse>> getAllTasksByUserId(String userId, String dateTime) {
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
    LocalDate inputDate = (dateTime == null || dateTime.isEmpty()) ? LocalDate.now()
        : LocalDate.parse(dateTime, formatter);
    LocalDate dayAfter = inputDate.plusDays(1);
    List<Task> listTask = taskRepository.findByUserId(userId);
    TaskProgressResponse inputDateProgress = TaskProgressResponse.builder().localDate(inputDate).build();
    TaskProgressResponse dayAfterProgress = TaskProgressResponse.builder().localDate(dayAfter).build();
    int overduedTasksCount;
    int completedTasksCount;
    for (Task task : listTask) {
      List<Progress> tasksProgress = task.getTasksProgress(); // Assuming this gets the progress list
      for (Progress progress : tasksProgress) {
        if (progress.getDate().isEqual(inputDate)) {
          switch (progress.getStatus()) {
            case Status.OVERDUE:
              overduedTasksCount = inputDateProgress.getOverduedTasksCount() + 1;
              inputDateProgress.setOverduedTasksCount(overduedTasksCount);
              break;
            case Status.INCOMPLETE:
              inputDateProgress.getIncompletedTasks().add(task);
              break;
            case Status.COMPLETE:
              completedTasksCount = inputDateProgress.getCompletedTasksCount() + 1;
              inputDateProgress.setOverduedTasksCount(completedTasksCount);
              break;
            default:
              break;
          }
        } else if (progress.getDate().isEqual(inputDate)) {
          switch (progress.getStatus()) {
            case Status.OVERDUE:
              overduedTasksCount = dayAfterProgress.getOverduedTasksCount() + 1;
              inputDateProgress.setOverduedTasksCount(overduedTasksCount);
              break;
            case Status.INCOMPLETE:
              inputDateProgress.getIncompletedTasks().add(task);
              break;
            case Status.COMPLETE:
              completedTasksCount = dayAfterProgress.getCompletedTasksCount() + 1;
              inputDateProgress.setOverduedTasksCount(completedTasksCount);
              break;
            default:
              break;
          }
        }
      }
    }
    List<TaskProgressResponse> taskProgressResponses = new ArrayList<>();
    taskProgressResponses.add(inputDateProgress);
    taskProgressResponses.add(dayAfterProgress);
    return new BaseResponse<>(true, "Task progress", taskProgressResponses);
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

    List<Task> listTask = taskRepository.findByUserId(userId);

    List<TaskDTO> todayTasks = new ArrayList<>();
    List<TaskDTO> yesterdayTasks = new ArrayList<>();
    List<TaskDTO> tomorrowTasks = new ArrayList<>();

    for (Task task : listTask) {
      LocalDate taskStart = task.getDateStart();
      LocalDate taskEnd = task.getDateEnd();

      if (taskStart != null && taskEnd != null) {
        if (!dayBefore.isBefore(taskStart) && !dayBefore.isAfter(taskEnd)) {
          Progress progress = DateTimeUtils.findMatchingProgress(task.getTasksProgress(), dayBefore);
          if (progress != null) {
            yesterdayTasks.add(new TaskDTO(task, progress.getStatus()));
          }
        }
        if (!inputDate.isBefore(taskStart) && !inputDate.isAfter(taskEnd)) {
          Progress progress = DateTimeUtils.findMatchingProgress(task.getTasksProgress(), inputDate);
          if (progress != null) {
            todayTasks.add(new TaskDTO(task, progress.getStatus()));
          }
        }
        if (!dayAfter.isBefore(taskStart) && !dayAfter.isAfter(taskEnd)) {
          Progress progress = DateTimeUtils.findMatchingProgress(task.getTasksProgress(), dayAfter);
          if (progress != null) {
            tomorrowTasks.add(new TaskDTO(task, progress.getStatus()));
          }
        }
      }
    }

    TasksInDateResponse tasksInDateResponse = new TasksInDateResponse(todayTasks, yesterdayTasks, tomorrowTasks);
    if (todayTasks.isEmpty() && yesterdayTasks.isEmpty() && tomorrowTasks.isEmpty()) {
      response = new BaseResponse<>(true, "No Task", tasksInDateResponse);
    } else {
      response = new BaseResponse<>(true, "Fetched all tasks successfully", tasksInDateResponse);
    }
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
          .dateEnd(req.getDateStart())
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
  public BaseResponse<TaskInProgressAndEnded> getTaskInProgressAndEnded(String userId) {
    try {
      List<Task> tempTask = taskRepository.findByUserId(userId);
      LocalDate now = LocalDate.now();
      List<Task> inProgressTasks = tempTask.stream()
          .filter(task -> {
            LocalDate dateStart = task.getDateStart();
            LocalDate dateEnd = task.getDateEnd();
            return (dateStart != null
                && ((dateStart.isBefore(now) && (dateEnd == null || dateEnd.isAfter(now)))
                    || dateStart.isAfter(now)));
          })
          .collect(Collectors.toList());

      List<Task> endedTasks = tempTask.stream()
          .filter(task -> {
            LocalDate dateEnd = task.getDateEnd();
            return dateEnd != null && dateEnd.isBefore(now);
          })
          .collect(Collectors.toList());

      return new BaseResponse<>(true, "Fetched tasks by status successfully!",
          new TaskInProgressAndEnded(inProgressTasks, endedTasks));
    } catch (Exception e) {
      return new BaseResponse<>(false, "Fetched tasks by status fail!", null);
    }

  }

  @Override
  public Page<Task> getInProgressTasks(String userId, Pageable pageable) {
    LocalDate now = LocalDate.now();
    LocalTime currentTime = LocalTime.now();
    String nowTime = currentTime.format(DateTimeFormatter.ofPattern("HH:mm:ss"));
    Page<Task> tasksPage = taskRepository.findInProgressTasks(userId, now, nowTime, pageable);
    List<Task> filteredTasks = tasksPage.getContent().stream()
        .filter(task -> {
          if (task.getDateEnd() != null && task.getDateEnd().isEqual(now)) {
            LocalTime timeExpired = LocalTime.parse(task.getTimeExpired(), DateTimeFormatter.ofPattern("HH:mm:ss"));
            return timeExpired.isAfter(currentTime);
          }
          return true;
        })
        .collect(Collectors.toList());
    return new PageImpl<>(filteredTasks, pageable, tasksPage.getTotalElements());
  }

  @Override
  public Page<Task> getEndedTasks(String userId, Pageable pageable) {
    LocalDate now = LocalDate.now();
    LocalTime currentTime = LocalTime.now();
    String nowTime = currentTime.format(DateTimeFormatter.ofPattern("HH:mm:ss"));
    Page<Task> tasksPage = taskRepository.findEndedTasks(userId, now, nowTime, pageable);
    List<Task> filteredTasks = tasksPage.getContent().stream()
        .filter(task -> {
          if (task.getDateEnd() != null && task.getDateEnd().isEqual(now)) {
            LocalTime timeExpired = LocalTime.parse(task.getTimeExpired(), DateTimeFormatter.ofPattern("HH:mm:ss"));
            return timeExpired.isBefore(currentTime) || timeExpired.equals(currentTime);
          }
          return task.getDateEnd() != null && task.getDateEnd().isBefore(now);
        })
        .collect(Collectors.toList());

    return new PageImpl<>(filteredTasks, pageable, tasksPage.getTotalElements());
  }

  @Override
  public BaseResponse<Task> updateBigTask(UpdateBigTaskRequest req) {
    try {
      Task updatedTask = taskRepository.findById(req.getTaskId())
          .orElseThrow(() -> new RuntimeException("Task not found"));

      boolean isTimerChanged = req.getTimer() != null && !req.getTimer().isEmpty()
          && !req.getTimer().equals(updatedTask.getTimer());
      boolean isDateEndChanged = req.getDateEnd() != null && !req.getDateEnd().equals(updatedTask.getDateEnd());
      boolean isTimeExpiredChanged = req.getTimeExpired() != null && !req.getTimeExpired().isEmpty()
          && !req.getTimeExpired().equals(updatedTask.getTimeExpired());

      if (req.getName() != null && !req.getName().isEmpty()) {
        updatedTask.setName(req.getName());
      }
      if (req.getPriority() != null) {
        updatedTask.setPriority(req.getPriority());
      }
      if (req.getDescription() != null && !req.getDescription().isEmpty()) {
        updatedTask.setDescription(req.getDescription());
      }
      if (req.getPrize() != null && !req.getPrize().isEmpty()) {
        updatedTask.setPrize(req.getPrize());
      }
      if (isTimerChanged) {
        updatedTask.setTimer(req.getTimer());
      }
      if (isDateEndChanged) {
        updatedTask.setDateEnd(req.getDateEnd());
      }
      if (isTimeExpiredChanged) {
        updatedTask.setTimeExpired(req.getTimeExpired());
      }

      if (isTimerChanged || isDateEndChanged || isTimeExpiredChanged) {
        List<Progress> newProgressList = new ArrayList<>();
        LocalDate startDate = LocalDate.now().isAfter(updatedTask.getDateStart()) ? LocalDate.now()
            : updatedTask.getDateStart();

        // Retain previous progress entries before startDate
        for (Progress progress : updatedTask.getTasksProgress()) {
          if (progress.getDate().isBefore(startDate) ||
              (progress.getDate().equals(startDate) && progress.getStatus() == Status.OVERDUE)) {
            newProgressList.add(progress);
          }
        }

        // Create new progress entries from startDate to dateEnd
        while (!startDate.isAfter(updatedTask.getDateEnd())) {
          DayOfWeek currentDayOfWeek = startDate.getDayOfWeek();
          if (updatedTask.getTimer().contains(DateOfWeek.ALL) ||
              updatedTask.getTimer().stream().anyMatch(day -> day.getValue() == currentDayOfWeek.getValue())) {
            if (startDate.isBefore(LocalDate.now())) {
              newProgressList.add(new Progress(startDate, Status.OVERDUE));
            } else if (startDate.equals(LocalDate.now())) {
              if (LocalTime.now().isAfter(LocalTime.parse(updatedTask.getTimeExpired()))) {
                newProgressList.add(new Progress(startDate, Status.OVERDUE));
              } else {
                newProgressList.add(new Progress(startDate, Status.INCOMPLETE));
              }
            } else {
              newProgressList.add(new Progress(startDate, Status.INCOMPLETE));
            }
          }
          startDate = startDate.plusDays(1);
        }
        updatedTask.setTasksProgress(newProgressList);
      }

      Task resultTask = taskRepository.save(updatedTask);
      return new BaseResponse<Task>(true, "Update Task Success!!!", resultTask);
    } catch (Exception e) {
      System.out.println(e.getMessage());
      return new BaseResponse<Task>(false, "Update Task Failed!!!", null);
    }
  }

  @Override
  public BaseResponse<Void> deleteBigTask(String taskId) {
    try {
      Task deletedTask = taskRepository.findById(taskId)
          .orElseThrow(() -> new RuntimeException("Task not found"));
      taskRepository.delete(deletedTask);
      return new BaseResponse<Void>(true, "Delete Task Success!!!", null);
    } catch (Exception e) {
      return new BaseResponse<Void>(false, "Delete Task Failed!!!", null);
    }
  }

  @Override
  public void updateTaskStatusIfOverdue(Task task) {
    String timeExpiredString = task.getTimeExpired();
    LocalTime timeExpired = LocalTime.parse(timeExpiredString, DateTimeFormatter.ofPattern("HH:mm:ss"));

    List<Progress> tasksProgress = task.getTasksProgress();
    LocalDateTime currentDateTime = LocalDateTime.now();

    for (Progress progress : tasksProgress) {
      LocalDateTime expirationDateTime = LocalDateTime.of(progress.getDate(), timeExpired);
      if (currentDateTime.isAfter(expirationDateTime) && progress.getStatus().equals(Status.INCOMPLETE)) {
        progress.setStatus(Status.OVERDUE);
      }
    }
    taskRepository.save(task);
  }

}
