package com.example.backend.model;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SavedPost {
  private String postId;
  private boolean isMarked;
  @JsonFormat(pattern = "dd-MM-yyyy HH:mm:ss")
  private LocalDateTime saveTime;
}
