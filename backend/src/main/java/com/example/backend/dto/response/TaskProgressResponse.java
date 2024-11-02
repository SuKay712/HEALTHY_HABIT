package com.example.backend.dto.response;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.example.backend.model.Task;
import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TaskProgressResponse {
  private final List<Task> incompletedTasks = new ArrayList<>();
  private int overduedTasksCount;
  private int completedTasksCount;
  @JsonFormat(pattern = "dd-MM-yyyy")
  private LocalDate localDate;

}
