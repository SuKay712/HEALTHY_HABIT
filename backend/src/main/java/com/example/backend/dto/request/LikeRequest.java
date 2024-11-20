package com.example.backend.dto.request;


import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LikeRequest {
  private String itemId;
  private String userId;
}
