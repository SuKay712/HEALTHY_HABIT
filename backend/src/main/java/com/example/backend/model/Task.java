package com.example.backend.model;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.aggregation.DateOperators.DayOfWeek;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Builder;
import lombok.Data;

@Document(collection = "Tasks")
@Data
@Builder
public class Task {

  @Id
  private ObjectId id;

  private String userId;

  private String name;

  private String description;

  private String prize;

  private List<DayOfWeek> timer;

  private String priority;

  private LocalDateTime dateStart;

  private LocalDateTime dateEnd;

  private LocalTime timeExpired;

  private boolean isNotify;

  private boolean isDeleted;

  @CreatedDate
  private LocalDateTime createdAt;

  @LastModifiedDate
  private LocalDateTime updatedAt;
}
