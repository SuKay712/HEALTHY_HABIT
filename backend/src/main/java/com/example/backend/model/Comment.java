package com.example.backend.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

import lombok.Builder;
import lombok.Data;

@Document(collection = "Comments")
@Data
@Builder
public class Comment {

  @Id
  @JsonSerialize(using = ToStringSerializer.class)
  private ObjectId id;

  @JsonSerialize(using = ToStringSerializer.class)
  private ObjectId userId;

  @JsonSerialize(using = ToStringSerializer.class)
  private ObjectId postId;

  private String content;

  private String image;

  @CreatedDate
  @JsonFormat(pattern = "dd-MM-yyyy")
  private LocalDateTime createdAt;

  @LastModifiedDate
  @JsonFormat(pattern = "dd-MM-yyyy")
  private LocalDateTime updatedAt;

  private List<Comment> commentChild;
  @Builder.Default
  private List<String> likes = new ArrayList<>();
  private Boolean hasLikedComment;
  private User user;
}
