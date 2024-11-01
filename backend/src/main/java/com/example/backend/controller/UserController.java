package com.example.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.backend.dto.request.UpdateUserProfileRequest;
import com.example.backend.dto.response.BaseResponse;
import com.example.backend.dto.response.UserProfileResponse;
import com.example.backend.model.User;
import com.example.backend.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/user")
public class UserController {
  private final UserService userService;

  @GetMapping("/profile/{id}")
  public ResponseEntity<BaseResponse<UserProfileResponse>> getUserProfile(@PathVariable String id) {
    return userService.getUserProfile(id);
  }

  @GetMapping("/")
  public ResponseEntity<BaseResponse<List<User>>> getAllUser() {
    return userService.getAllUsers();
  }

  @PutMapping("/profile/avatar")
  public ResponseEntity<BaseResponse<Void>> updateAvatar(
      @RequestParam("image") MultipartFile image,
      String userId) {
    return ResponseEntity.ok(userService.updateAvatar(image, userId));
  }

  @PutMapping("/profile/bgimage")
  public ResponseEntity<BaseResponse<Void>> updateBackgroundImage(
      @RequestParam("bgImage") MultipartFile bgImage,
      String userId) {
    return ResponseEntity.ok(userService.updateBackgroundImage(bgImage, userId));
  }

  @PutMapping("/profile")
  public ResponseEntity<BaseResponse<UserProfileResponse>> updateProfile(@RequestBody UpdateUserProfileRequest req) {
    return ResponseEntity.ok(userService.updateUserProfile(req));
  }
}
