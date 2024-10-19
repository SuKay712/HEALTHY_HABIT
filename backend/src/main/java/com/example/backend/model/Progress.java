package com.example.backend.model;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class Progress {
  @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
  private LocalDateTime date;
  private String status;
}
