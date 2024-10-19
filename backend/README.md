# Hướng dẫn sử dụng BaseResponse

## Cấu trúc của BaseResponse
```java
public class BaseResponse<T> {
  private final Boolean isSuccess;
  private final String message;
  @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
  @JsonDeserialize(using = LocalDateTimeDeserializer.class)
  @JsonSerialize(using = LocalDateTimeSerializer.class)
  private final LocalDateTime timeStamp;
  private final T data;

  public BaseResponse(Boolean isSuccess, String message, T data) {
    this.isSuccess = isSuccess;
    this.message = message;
    this.timeStamp = LocalDateTime.now();
    this.data = data;
  }
```

### Xem ví dụ trong userServiceImpl GetProfile
```java
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
```