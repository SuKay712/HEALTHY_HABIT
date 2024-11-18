package com.example.backend.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Builder;
import lombok.Data;

@Document(collection = "Users")
@Data
@Builder
public class User {
  @Id
  private String id;

  private String email;

  @JsonIgnore
  private String password;

  private String username;

  private String displayName;

  @JsonFormat(pattern = "dd-MM-yyyy")
  private LocalDate birthday;

  private boolean sex;

  private String address;

  private String tel;

  private String avatar;

  private String backgroundImage;

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
  @JsonFormat(pattern = "dd-MM-yyyy")
  private LocalDateTime createdAt;

  @LastModifiedDate
  @JsonFormat(pattern = "dd-MM-yyyy")
  private LocalDateTime updatedAt;
}
