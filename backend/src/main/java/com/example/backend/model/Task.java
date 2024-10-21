package com.example.backend.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import com.example.backend.model.enums.DateOfWeek;
import com.example.backend.model.enums.Priority;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;

import lombok.Builder;
import lombok.Data;

@Document(collection = "Tasks")
@Data
@Builder
public class Task {

  @Id
  private String id;

  private String userId;

  private String name;

  private String description;

  private String prize;

  private List<DateOfWeek> timer;

  private Priority priority;
  @JsonFormat(pattern = "dd-MM-yyyy")
  private LocalDate dateStart;
  @JsonFormat(pattern = "dd-MM-yyyy")
  private LocalDate dateEnd;
  @JsonFormat(pattern = "HH:mm:ss")
  private String timeExpired;
  private boolean isNotify;
  private List<Progress> tasksProgress;
  private boolean isDeleted;
  @JsonFormat(pattern = "dd-MM-yyyy")
  @JsonDeserialize(using = LocalDateTimeDeserializer.class)
  @JsonSerialize(using = LocalDateTimeSerializer.class)
  @CreatedDate
  private LocalDateTime createdAt;
  @JsonFormat(pattern = "dd-MM-yyyy HH:mm:ss")
  @JsonDeserialize(using = LocalDateTimeDeserializer.class)
  @JsonSerialize(using = LocalDateTimeSerializer.class)
  @LastModifiedDate
  private LocalDateTime updatedAt;
}
