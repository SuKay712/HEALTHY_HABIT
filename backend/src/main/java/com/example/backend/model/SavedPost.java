package com.example.backend.model;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SavedPost {
  private String postId;
  private boolean isMarked;
  private LocalDateTime saveTime;
}
