package com.example.backend.service.impl;

import org.mindrot.jbcrypt.BCrypt;
import org.springframework.stereotype.Service;

import com.example.backend.dto.request.LoginRequest;
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
  public LoginResponse login(LoginRequest loginRequest){
    User user = userRepository.findByUsername(loginRequest.getUsername())
    .orElseThrow(() -> new RuntimeException("User not found"));
  
    if (!BCrypt.checkpw(loginRequest.getPassword(), user.getPassword())) {
      System.out.println("1234");
      throw new RuntimeException("Invalid password");
    }

    // Trả về thông tin user
    return LoginResponse.builder()
            .email(user.getEmail())
            .username(user.getUsername())
            .displayName(user.getDisplayName())
            .address(user.getAddress())
            .tel(user.getTel())
            .avatar(user.getAvatar())
            .groupNotify(user.isGroupNotify())
            .isAdmin(user.isAdmin())
            .build();
  }
}
