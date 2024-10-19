package com.example.backend.dto.response;

import java.util.List;

import com.example.backend.dto.TaskDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class TasksInDateResponse {
  private List<TaskDTO> todayTasks;
  private List<TaskDTO> yesterdayTasks;
  private List<TaskDTO> tommorrowTasks;
}
