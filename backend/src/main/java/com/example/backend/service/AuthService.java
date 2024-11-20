package com.example.backend.service;

import org.springframework.http.ResponseEntity;

import com.example.backend.dto.request.ChangePasswordRequest;
import com.example.backend.dto.request.LoginRequest;
import com.example.backend.dto.request.VerifyOtpRequest;
import com.example.backend.dto.response.BaseResponse;
import com.example.backend.dto.response.LoginResponse;

public interface AuthService {
   LoginResponse login(LoginRequest loginRequest);

   BaseResponse<Void> changePassword(ChangePasswordRequest req);

   ResponseEntity<BaseResponse<String>> verifyAccount(String email, String otp);

   BaseResponse<String> verifyOtp(VerifyOtpRequest request);
}
