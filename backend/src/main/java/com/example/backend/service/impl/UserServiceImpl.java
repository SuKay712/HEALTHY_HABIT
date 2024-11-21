package com.example.backend.service.impl;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Random;

import org.bson.types.ObjectId;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.backend.dto.request.RegisterRequest;
import com.example.backend.dto.request.ResendOtpRequest;
import com.example.backend.dto.request.UpdateUserProfileRequest;
import com.example.backend.dto.response.BaseResponse;
import com.example.backend.dto.response.UserProfileResponse;
import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.EmailService;
import com.example.backend.service.UserService;
import com.example.backend.utils.CloudinaryUtils;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class UserServiceImpl implements UserService {
  private final UserRepository userRepository;
  private final CloudinaryUtils cloudinaryUtils;
  private final EmailService emailService;
  @Value("${application.avatar.default}")
  private String avatarDefault;

  @Value("${application.background.default}")
  private String backgroundDefault;

  @Override
  public BaseResponse<User> getUserById(String userId) {
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new RuntimeException("User not found"));

    return new BaseResponse<>(true, "User found successfully", user);
  }

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

      // Kiểm tra nếu avatar hiện tại không phải avatar mặc định
      if (!user.getAvatar().equals(avatarDefault)) {
        cloudinaryUtils.deleteImageByUrl(user.getAvatar());
      }

      String imageURL = cloudinaryUtils.uploadImage(image);
      user.setAvatar(imageURL);
      userRepository.save(user);

      return new BaseResponse<>(true, "Update avatar successful!", imageURL);
    } catch (Exception e) {
      return new BaseResponse<>(false, "Update avatar failed!", null);
    }
  }

  @Override
  public BaseResponse<String> updateBackgroundImage(MultipartFile backgroundImage, String userId) {
    try {
      User user = userRepository.findById(userId).orElseThrow();

      // Kiểm tra nếu background hiện tại không phải background mặc định
      if (!user.getBackgroundImage().equals(backgroundDefault)) {
        cloudinaryUtils.deleteImageByUrl(user.getBackgroundImage());
      }

      String imageURL = cloudinaryUtils.uploadImage(backgroundImage);
      user.setBackgroundImage(imageURL);
      userRepository.save(user);

      return new BaseResponse<>(true, "Update background image successful!", imageURL);
    } catch (Exception e) {
      return new BaseResponse<>(false, "Update background image failed!", null);
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

  @Override
  public BaseResponse<String> registerUser(RegisterRequest request) {
    Optional<User> existingUser = userRepository.findByEmail(request.getEmail());
    if (existingUser.isPresent()) {
      return new BaseResponse<>(false, "Email already exists", null);
    }

    Optional<User> existingUsername = userRepository.findByUsername(request.getUsername());
    if (existingUsername.isPresent()) {
      return new BaseResponse<>(false, "Username already exists", null);
    }

    String otp = String.format("%04d", new Random().nextInt(9999));
    LocalDateTime otpGenerateTime = LocalDateTime.now();
    List<ObjectId> savedPost = new ArrayList<>();

    User newUser = User.builder()
        .username(request.getUsername())
        .password(BCrypt.hashpw(request.getPassword(), BCrypt.gensalt())) // Hash mật khẩu
        .displayName(request.getDisplayName())
        .email(request.getEmail())
        .sex(request.isSex())
        .birthday(request.getBirthday())
        .otp(otp)
        .otpGenerateTime(otpGenerateTime)
        .isVerify(false)
        .backgroundImage("")
        .address("")
        .avatar("")
        .canResetPassword(false)
        .isAdmin(false)
        .groupNotify(true)
        .savedPost(savedPost)
        .isDeleted(false)
        .avatar(avatarDefault)
        .backgroundImage(backgroundDefault)
        .tel("")
        .build();

    userRepository.save(newUser);

    emailService.sendOtpEmail(request.getEmail(), otp);

    return new BaseResponse<>(true, "User registered successfully. OTP sent to email", null);
  }

  @Override
  public BaseResponse<String> resendOtp(ResendOtpRequest request) {
    Optional<User> userOptional = userRepository.findByEmail(request.getEmail());
    if (!userOptional.isPresent()) {
      return new BaseResponse<>(false, "Email không tồn tại.", null);
    }

    User user = userOptional.get();

    if (user.getOtpGenerateTime().plus(5, ChronoUnit.MINUTES).isBefore(LocalDateTime.now())) {
      String otp = String.format("%04d", new Random().nextInt(9999));
      LocalDateTime otpGenerateTime = LocalDateTime.now();

      user.setOtp(otp);
      user.setOtpGenerateTime(otpGenerateTime);

      userRepository.save(user);

      emailService.sendOtpEmail(user.getEmail(), otp);

      return new BaseResponse<>(true, "Mã OTP mới đã được gửi đến email của bạn.", null);
    }
    return new BaseResponse<>(false, "Mã OTP vẫn còn hiệu lực. Vui lòng kiểm tra lại email.", null);
  }

}
