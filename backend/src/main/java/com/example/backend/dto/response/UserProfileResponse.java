package com.example.backend.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserProfileResponse {
  private String id;
  private String email;
  private String username;
  private String displayName;
  private String address;
  private String tel;
  private String avatar;
  private String backgroundImage;
}
