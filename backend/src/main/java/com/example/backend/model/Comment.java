package com.example.backend.model;

import java.time.LocalDateTime;
import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Builder;
import lombok.Data;

@Document(collection = "Comments")
@Data
@Builder
public class Comment {

  @Id
  private ObjectId id;

  private String userId;

  private String postId;

  private String content;

  private List<String> image;

  @CreatedDate
  @JsonFormat(pattern = "dd-MM-yyyy")
  private LocalDateTime createdAt;

  @LastModifiedDate
  @JsonFormat(pattern = "dd-MM-yyyy")
  private LocalDateTime updatedAt;

  private List<Comment> commentChild;
  private User user;
}
