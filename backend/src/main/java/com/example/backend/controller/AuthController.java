package com.example.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dto.request.ChangePasswordRequest;
import com.example.backend.dto.request.LoginRequest;
import com.example.backend.dto.request.RegisterRequest;
import com.example.backend.dto.request.ResendOtpRequest;
import com.example.backend.dto.request.VerifyOtpRequest;
import com.example.backend.dto.response.BaseResponse;
import com.example.backend.dto.response.LoginResponse;
import com.example.backend.service.AuthService;
import com.example.backend.service.UserService;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final UserService userService;
    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<BaseResponse<LoginResponse>> login(@RequestBody LoginRequest loginRequest) {
        LoginResponse loginResponse = authService.login(loginRequest);
        BaseResponse<LoginResponse> response = new BaseResponse<>(
                true,
                "Login successful",
                loginResponse);
        return ResponseEntity.ok(response);
    }

    @PutMapping("changepwd")
    public ResponseEntity<BaseResponse<Void>> changePassword(@RequestBody ChangePasswordRequest req) {
        return ResponseEntity.ok(authService.changePassword(req));
    }

    @PostMapping("/register")
    public ResponseEntity<BaseResponse<String>> register(@RequestBody RegisterRequest request) {
        BaseResponse<String> response = userService.registerUser(request);
        if (!response.getIsSuccess()) {
            return ResponseEntity.badRequest().body(response);
        }
        return ResponseEntity.ok(response);
    }
    @PostMapping("/verify-otp")
    public ResponseEntity<BaseResponse<String>> verifyOtp(@RequestBody VerifyOtpRequest request) {
        BaseResponse<String> response = authService.verifyOtp(request);
        if (!response.getIsSuccess()) {
            return ResponseEntity.badRequest().body(response);
        }
        return ResponseEntity.ok(response);
    }
    @PostMapping("/resend-otp")
    public ResponseEntity<BaseResponse<String>> resendOtp(@RequestBody ResendOtpRequest request) {
        BaseResponse<String> response = userService.resendOtp(request);
        if (!response.getIsSuccess()) {
            return ResponseEntity.badRequest().body(response);
        }
        return ResponseEntity.ok(response);
    }
}
