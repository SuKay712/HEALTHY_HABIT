package com.example.backend.model;

import java.time.LocalDateTime;
import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Builder;
import lombok.Data;

@Document(collection = "Users")
@Data
@Builder
public class User {
  @Id
  private ObjectId id;

  private String email;

  @JsonIgnore
  private String password;

  private String username;

  private String displayName;

  private String address;

  private String tel;

  private String avatar;

  private boolean groupNotify;

  private boolean isAdmin;

  private List<SavedPost> savedPost;

  @JsonIgnore
  private boolean isVerify;

  @JsonIgnore
  private boolean canResetPassword;

  @JsonIgnore
  private String otp;

  @JsonIgnore
  private LocalDateTime otpGenerateTime;

  private boolean isDeleted;

  @CreatedDate
  private LocalDateTime createdAt;

  @LastModifiedDate
  private LocalDateTime updatedAt;
}
