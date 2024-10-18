package com.example.backend.model;

import java.time.LocalDateTime;
import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Builder;
import lombok.Data;

@Document(collection = "Posts")
@Data
@Builder
public class Post {

  @Id
  private ObjectId id;

  private String userId;

  private String content;

  private List<String> image;

  private boolean inTrashcan;

  private boolean isDeleted;

  private List<String> likes;

  @CreatedDate
  private LocalDateTime createdAt;

  @LastModifiedDate
  private LocalDateTime updatedAt;
}
