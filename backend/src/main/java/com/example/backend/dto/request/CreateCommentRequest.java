package com.example.backend.dto.request;

import org.springframework.web.multipart.MultipartFile;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CreateCommentRequest {
  private String userId;
  private String postId;
  private String content;
  private MultipartFile image;
}
