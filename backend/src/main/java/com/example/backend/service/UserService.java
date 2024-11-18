package com.example.backend.service;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import com.example.backend.dto.request.RegisterRequest;
import com.example.backend.dto.request.ResendOtpRequest;
import com.example.backend.dto.request.UpdateUserProfileRequest;
import com.example.backend.dto.response.BaseResponse;
import com.example.backend.dto.response.UserProfileResponse;
import com.example.backend.model.User;

public interface UserService {

  public ResponseEntity<BaseResponse<List<User>>> getAllUsers();

  public ResponseEntity<BaseResponse<UserProfileResponse>> getUserProfile(String username);

  public BaseResponse<String> updateAvatar(MultipartFile image, String userId);

  public BaseResponse<String> updateBackgroundImage(MultipartFile backgroundImage, String userId);

  public BaseResponse<UserProfileResponse> updateUserProfile(UpdateUserProfileRequest req);

  BaseResponse<String> registerUser(RegisterRequest req);
  
  BaseResponse<String> resendOtp(ResendOtpRequest req);
}
