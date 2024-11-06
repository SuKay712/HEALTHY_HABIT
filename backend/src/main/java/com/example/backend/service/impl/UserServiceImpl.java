package com.example.backend.service.impl;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.backend.dto.request.UpdateUserProfileRequest;
import com.example.backend.dto.response.BaseResponse;
import com.example.backend.dto.response.UserProfileResponse;
import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.UserService;
import com.example.backend.utils.CloudinaryUtils;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class UserServiceImpl implements UserService {
  private final UserRepository userRepository;
  private final CloudinaryUtils cloudinaryUtils;

  @Override
  public ResponseEntity<BaseResponse<List<User>>> getAllUsers() {
    List<User> users = userRepository.findAll();
    BaseResponse<List<User>> response = new BaseResponse<>(true, "Fetched all users successfully", users);
    return ResponseEntity.ok(response);
  }

  @Override
  public ResponseEntity<BaseResponse<UserProfileResponse>> getUserProfile(String id) {
    try {

      User user = userRepository.findById(id).orElse(null);
      if (user == null) {
        return ResponseEntity.status(404).body(new BaseResponse<>(false, "User not found", null));
      }

      UserProfileResponse userProfile = UserProfileResponse.builder()
          .id(user.getId())
          .email(user.getEmail())
          .username(user.getUsername())
          .displayName(user.getDisplayName())
          .address(user.getAddress())
          .tel(user.getTel())
          .avatar(user.getAvatar())
          .backgroundImage(user.getBackgroundImage())
          .build();

      BaseResponse<UserProfileResponse> response = new BaseResponse<>(true, "Get User's Profile successful!",
          userProfile);
      return ResponseEntity.ok(response);
    } catch (Exception e) {
      BaseResponse<UserProfileResponse> response = new BaseResponse<>(false, "Get User's Profile failed!",
          null);
      return ResponseEntity.ok(response);
    }
  }

  @Override
  public BaseResponse<String> updateAvatar(MultipartFile image, String userId) {
    try {
      User user = userRepository.findById(userId).orElseThrow();
      String imageURL = cloudinaryUtils.uploadImage(image);
      user.setAvatar(imageURL);
      userRepository.save(user);
      return new BaseResponse<>(true, "Update avatar successfull!", imageURL);
    } catch (Exception e) {
      return new BaseResponse<>(false, "Update avatar failed!", null);
    }
  }

  @Override
  public BaseResponse<String> updateBackgroundImage(MultipartFile backgroundImage, String userId) {
    try {
      User user = userRepository.findById(userId).orElseThrow();
      String imageURL = cloudinaryUtils.uploadImage(backgroundImage);
      user.setBackgroundImage(imageURL);
      userRepository.save(user);
      return new BaseResponse<>(true, "Update avatar successfull!", imageURL);
    } catch (Exception e) {
      return new BaseResponse<>(false, "Update avatar failed!", null);
    }
  }

  @Override
  public BaseResponse<UserProfileResponse> updateUserProfile(UpdateUserProfileRequest req) {
    try {
      User user = userRepository.findById(req.getUserId()).orElseThrow();
      user.setAddress(req.getAddress());
      user.setDisplayName(req.getDisplayName());
      user.setTel(req.getTel());
      user.setEmail(req.getEmail());
      userRepository.save(user);
      UserProfileResponse resultUser = UserProfileResponse.builder()
          .address(user.getAddress())
          .avatar(user.getAvatar())
          .backgroundImage(user.getBackgroundImage())
          .displayName(user.getDisplayName())
          .email(user.getEmail())
          .id(user.getId())
          .tel(user.getTel())
          .username(user.getUsername())
          .build();
      return new BaseResponse<UserProfileResponse>(true, "Update User's Profile Successfull", resultUser);
    } catch (Exception e) {
      return new BaseResponse<UserProfileResponse>(false, "Update User's Profile Failed", null);
    }
  }
}
