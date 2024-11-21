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
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "Posts")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Post {

  @Id
  @JsonSerialize(using = ToStringSerializer.class)
  private ObjectId id;

  @JsonSerialize(using = ToStringSerializer.class)
  private ObjectId userId;

  private String content;

  private String image;

  private boolean inTrashcan;

  private boolean isDeleted;

  @Builder.Default
  private List<Comment> comments = new ArrayList<>();
  @JsonFormat(pattern = "dd-MM-yyyy HH:mm:ss")
  @JsonDeserialize(using = LocalDateTimeDeserializer.class)
  @JsonSerialize(using = LocalDateTimeSerializer.class)
  @CreatedDate
  private LocalDateTime createdAt;

  @JsonFormat(pattern = "dd-MM-yyyy HH:mm:ss")
  @JsonDeserialize(using = LocalDateTimeDeserializer.class)
  @JsonSerialize(using = LocalDateTimeSerializer.class)
  @LastModifiedDate
  private LocalDateTime updatedAt;
  @Builder.Default
  private List<String> likes = new ArrayList<>();
  private Boolean hasLiked;
  private User postUser;

  @JsonIgnore
  private Boolean isPrivate;

  @Builder.Default
  private List<String> savePeoples = new ArrayList<>();
}
