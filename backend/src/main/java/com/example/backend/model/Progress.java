package com.example.backend.model;

import java.time.LocalDate;

import com.example.backend.model.enums.Status;
import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class Progress {
  @JsonFormat(pattern = "dd-MM-yyyy")
  private LocalDate date;
  private Status status;
}
