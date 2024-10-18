package com.example.backend.service.impl;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.example.backend.dto.response.BaseResponse;
import com.example.backend.dto.response.UserProfileResponse;
import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.UserService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class UserServiceImpl implements UserService {
  private final UserRepository userRepository;

  @Override
  public ResponseEntity<BaseResponse<List<User>>> getAllUsers() {
    List<User> users = userRepository.findAll();
    BaseResponse<List<User>> response = new BaseResponse<>(true, "Fetched all users successfully", users);
    return ResponseEntity.ok(response);
  }

  @Override
  public ResponseEntity<BaseResponse<UserProfileResponse>> getUserProfile(String id) {
    User user = userRepository.findById(new ObjectId(id)).orElse(null);
    if (user == null) {
      return ResponseEntity.status(404).body(new BaseResponse<>(false, "User not found", null));
    }

    UserProfileResponse userProfile = UserProfileResponse.builder()
        .id(user.getId().toHexString())
        .email(user.getEmail())
        .username(user.getUsername())
        .displayName(user.getDisplayName())
        .address(user.getAddress())
        .tel(user.getTel())
        .avatar(user.getAvatar())
        .build();

    BaseResponse<UserProfileResponse> response = new BaseResponse<>(true, "Get User's Profile successful!",
        userProfile);
    return ResponseEntity.ok(response);
  }
}
