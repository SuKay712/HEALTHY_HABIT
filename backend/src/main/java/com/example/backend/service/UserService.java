package com.example.backend.service;

import java.util.List;

import org.springframework.http.ResponseEntity;

import com.example.backend.dto.response.BaseResponse;
import com.example.backend.dto.response.UserProfileResponse;
import com.example.backend.model.User;

public interface UserService {

  public ResponseEntity<BaseResponse<List<User>>> getAllUsers();

  public ResponseEntity<BaseResponse<UserProfileResponse>> getUserProfile(String username);
}
