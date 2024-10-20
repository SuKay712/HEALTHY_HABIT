package com.example.backend.dto.request;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class UpdateTaskRequest {
  private LocalDateTime time;
  private String status;

}
