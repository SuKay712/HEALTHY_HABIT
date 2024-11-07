package com.example.backend.model;

import java.time.LocalDateTime;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.example.backend.model.enums.NotificationType;
import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Builder;
import lombok.Data;

@Document(collection = "Notifications")
@Data
@Builder
public class Notification {

  @Id
  private ObjectId id;

  private NotificationType notiType;

  private String userId;

  private String content;

  private boolean isAdmin;

  @JsonFormat(pattern = "dd-MM-yyyy HH:mm:ss")
  private LocalDateTime createdAt;

  @JsonFormat(pattern = "dd-MM-yyyy HH:mm:ss")
  private LocalDateTime updatedAt;
}
