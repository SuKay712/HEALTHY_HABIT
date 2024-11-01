package com.example.backend.service.impl;

import org.mindrot.jbcrypt.BCrypt;
import org.springframework.stereotype.Service;

import com.example.backend.dto.request.ChangePasswordRequest;
import com.example.backend.dto.request.LoginRequest;
import com.example.backend.dto.response.BaseResponse;
import com.example.backend.dto.response.LoginResponse;
import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.AuthService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

  private final UserRepository userRepository;

  @Override
  public LoginResponse login(LoginRequest loginRequest) {
    User user = userRepository.findByUsername(loginRequest.getUsername())
        .orElseThrow(() -> new RuntimeException("User not found"));

    if (!BCrypt.checkpw(loginRequest.getPassword(), user.getPassword())) {
      throw new RuntimeException("Invalid password");
    }

    // Trả về thông tin user
    return LoginResponse.builder()
        .userId(user.getId())
        .email(user.getEmail())
        .username(user.getUsername())
        .displayName(user.getDisplayName())
        .address(user.getAddress())
        .tel(user.getTel())
        .avatar(user.getAvatar())
        .backgroundImage(user.getBackgroundImage())
        .groupNotify(user.isGroupNotify())
        .isAdmin(user.isAdmin())
        .build();
  }

  @Override
  public BaseResponse<Void> changePassword(ChangePasswordRequest req) {
    try {
      // Retrieve the user by userId
      User user = userRepository.findById(req.getUserId())
          .orElseThrow(() -> new RuntimeException("User not found"));

      // Check if the old password matches
      if (!BCrypt.checkpw(req.getOldPassword(), user.getPassword())) {
        throw new RuntimeException("Invalid old password");
      }

      // Update the password
      user.setPassword(BCrypt.hashpw(req.getNewPassword(), BCrypt.gensalt()));
      userRepository.save(user);

      // Return success response
      return new BaseResponse<>(true, "Password changed successfully", null);
    } catch (Exception e) {
      // Handle exception and return error response
      return new BaseResponse<>(false, "Failed to change password: " + e.getMessage(), null);
    }
  }

}
