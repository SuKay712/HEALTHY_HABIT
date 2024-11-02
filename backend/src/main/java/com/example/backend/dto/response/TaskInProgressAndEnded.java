package com.example.backend.dto.response;

import java.util.List;

import com.example.backend.model.Task;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskInProgressAndEnded {
  private List<Task> inProgressTasks;
  private List<Task> endedTasks;
}
