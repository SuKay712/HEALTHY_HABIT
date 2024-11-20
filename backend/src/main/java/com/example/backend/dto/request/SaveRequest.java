package com.example.backend.dto.request;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SaveRequest {
  private String postId;
  private String userId;
}
