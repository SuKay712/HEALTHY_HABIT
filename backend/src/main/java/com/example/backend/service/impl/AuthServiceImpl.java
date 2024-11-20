package com.example.backend.service.impl;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Optional;

import org.mindrot.jbcrypt.BCrypt;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.example.backend.dto.request.ChangePasswordRequest;
import com.example.backend.dto.request.LoginRequest;
import com.example.backend.dto.request.VerifyOtpRequest;
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
  @Override
  public ResponseEntity<BaseResponse<String>> verifyAccount(String email, String otp) {
    BaseResponse<String> response;
    Optional<User> userOptional = userRepository.findByEmail(email);

    if (userOptional.isPresent()) {
        User user = userOptional.get();
        if (user.getOtp().equals(otp)
                && Duration.between(user.getOtpGenerateTime(), LocalDateTime.now()).getSeconds() < (1 * 60)) {

            user.setVerify(true);
            userRepository.save(user);

            response = new BaseResponse<>(true, "OTP đã được xác thực, hãy đăng nhập!!!", null);
            return ResponseEntity.ok(response);
        }

        response = new BaseResponse<>(false, "Vui lòng tạo OTP lại!!!", null);
        return ResponseEntity.ok(response);
    }

    response = new BaseResponse<>(false, "Không tìm thấy người dùng với mail này: " + email, null);
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
  }
  @Override
  public BaseResponse<String> verifyOtp(VerifyOtpRequest request) {
      Optional<User> userOptional = userRepository.findByEmail(request.getEmail());
      if (!userOptional.isPresent()) {
          return new BaseResponse<>(false, "Email không tồn tại", null);
      }

      User user = userOptional.get();
        
      if (user.isVerify()) {
          return new BaseResponse<>(false, "Tài khoản đã được kích hoạt", null);
      }

      if (!user.getOtp().equals(request.getOtp())) {
          return new BaseResponse<>(false, "Mã OTP không đúng", null);
      }

      if (user.getOtpGenerateTime().plusMinutes(5).isBefore(LocalDateTime.now())) {
          return new BaseResponse<>(false, "Mã OTP đã hết hạn", null);
      }

      user.setVerify(true);
      user.setOtp(null);  
      userRepository.save(user);

      return new BaseResponse<>(true, "Tài khoản đã được kích hoạt thành công", null);
    }
}
