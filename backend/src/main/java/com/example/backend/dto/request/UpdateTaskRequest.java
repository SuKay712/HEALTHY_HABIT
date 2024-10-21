package com.example.backend.dto.request;

import java.time.LocalDate;

import com.example.backend.model.enums.Status;

import lombok.Data;

@Data
public class UpdateTaskRequest {
  private LocalDate time;
  private Status status;

}
